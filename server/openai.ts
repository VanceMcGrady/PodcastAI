import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "sk-dummy" });

// Transcribe audio to text
export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  try {
    const tempFilePath = `/tmp/recording-${Date.now()}.webm`;
    const fs = await import('fs');
    fs.writeFileSync(tempFilePath, audioBuffer);
    
    const audioReadStream = fs.createReadStream(tempFilePath);
    
    const transcription = await openai.audio.transcriptions.create({
      file: audioReadStream,
      model: "whisper-1",
    });

    // Clean up temp file
    fs.unlinkSync(tempFilePath);
    
    return transcription.text;
  } catch (error: unknown) {
    console.error("Error transcribing audio:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to transcribe audio: ${errorMessage}`);
  }
}

// Generate audiobook content based on topic
export async function generatePodcastContent(topic: string): Promise<{
  title: string;
  description: string;
  content: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            "You are an expert audiobook creator known for high-quality non-fiction audiobooks. " +
            "Focus on creating content that's eloquent, immersive, and educational with a warm narrative voice. " +
            "Write in a literary style suitable for an audiobook - clear, descriptive, and engaging with a professional narrator's voice. " +
            "Avoid podcast-specific elements like host introductions, interjections, or references to 'listeners' or 'episodes'. " +
            "The narrative should flow smoothly with proper transitions between sections. " +
            "Structure the content with a clear introduction, well-developed middle sections, and a satisfying conclusion. " +
            "Include thoughtful transitions between subtopics to maintain flow. " +
            "The length should be appropriate for about a 20-minute audiobook chapter (approximately 8000-9000 words)."
        },
        {
          role: "user",
          content: `Create an audiobook chapter about "${topic}". Provide a JSON response with the following structure: 
          {
            "title": "An elegant title for the audiobook",
            "description": "A brief 1-2 sentence description of what the audiobook chapter covers",
            "content": "The full audiobook chapter content"
          }`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      title: result.title || `Podcast about ${topic}`,
      description: result.description || `A podcast exploring ${topic}`,
      content: result.content || `Failed to generate content for ${topic}`
    };
  } catch (error: unknown) {
    console.error("Error generating podcast content:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to generate podcast content: ${errorMessage}`);
  }
}

// Convert text to speech using OpenAI TTS
export async function textToSpeech(text: string): Promise<Buffer> {
  try {
    // TTS-1 has a character limit of 4096, so we need to split long text
    const MAX_CHUNK_SIZE = 4000; // slightly less than 4096 to be safe
    
    // If text is short enough, process it directly
    if (text.length <= MAX_CHUNK_SIZE) {
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "nova", // Nova voice has a warm, professional narrative quality that's perfect for audiobooks
        input: text,
      });
      
      return Buffer.from(await mp3.arrayBuffer());
    }
    
    // For long text (like our 20-minute audiobooks), we need to chunk and process sequentially
    console.log(`Processing long text (${text.length} chars) in multiple chunks.`);
    
    // Import libraries for audio processing
    const fs = await import('fs');
    const { promisify } = await import('util');
    const { exec } = await import('child_process');
    const execPromise = promisify(exec);
    
    // Create a temporary directory for audio chunks
    const tempDir = `/tmp/audio-${Date.now()}`;
    fs.mkdirSync(tempDir, { recursive: true });
    
    // Smart text chunking - try to break at paragraphs, sentences or words
    const chunks: string[] = [];
    let currentChunk = "";
    
    // First try to split by paragraphs (double newlines)
    const paragraphs = text.split(/\n\s*\n/);
    
    for (const paragraph of paragraphs) {
      // If the paragraph alone is too big, split it by sentences
      if (paragraph.length > MAX_CHUNK_SIZE) {
        // Using regex to split by sentences (period, question mark, or exclamation followed by space)
        const sentences = paragraph.split(/(?<=[.!?])\s+/);
        
        for (const sentence of sentences) {
          // If even a sentence is too long (rare), split by words to fit
          if (sentence.length > MAX_CHUNK_SIZE) {
            let words = sentence.split(/\s+/);
            let wordChunk = "";
            
            for (const word of words) {
              if ((wordChunk + " " + word).length <= MAX_CHUNK_SIZE) {
                wordChunk += (wordChunk ? " " : "") + word;
              } else {
                chunks.push(wordChunk);
                wordChunk = word;
              }
            }
            
            if (wordChunk) {
              currentChunk += (currentChunk ? "\n\n" : "") + wordChunk;
            }
          } 
          // Add sentence if it fits in current chunk, otherwise create new chunk
          else if ((currentChunk + "\n\n" + sentence).length <= MAX_CHUNK_SIZE) {
            currentChunk += (currentChunk ? "\n\n" : "") + sentence;
          } else {
            if (currentChunk) chunks.push(currentChunk);
            currentChunk = sentence;
          }
        }
      } 
      // Add paragraph if it fits in current chunk, otherwise create new chunk
      else if ((currentChunk + "\n\n" + paragraph).length <= MAX_CHUNK_SIZE) {
        currentChunk += (currentChunk ? "\n\n" : "") + paragraph;
      } else {
        if (currentChunk) chunks.push(currentChunk);
        currentChunk = paragraph;
      }
    }
    
    // Don't forget the last chunk
    if (currentChunk) chunks.push(currentChunk);
    
    console.log(`Split content into ${chunks.length} chunks for processing`);
    
    // Process each chunk into speech
    const audioFiles: string[] = [];
    
    for (let i = 0; i < chunks.length; i++) {
      console.log(`Processing chunk ${i+1}/${chunks.length}`);
      
      try {
        const mp3 = await openai.audio.speech.create({
          model: "tts-1",
          voice: "nova", // Consistent voice for all audio generation
          input: chunks[i],
        });
        
        const chunkPath = `${tempDir}/chunk-${i.toString().padStart(3, '0')}.mp3`;
        const buffer = Buffer.from(await mp3.arrayBuffer());
        fs.writeFileSync(chunkPath, buffer);
        audioFiles.push(chunkPath);
        
        console.log(`Successfully generated audio for chunk ${i+1}`);
      } catch (error) {
        console.error(`Error processing chunk ${i+1}:`, error);
        // Continue with other chunks if one fails
      }
    }
    
    if (audioFiles.length === 0) {
      throw new Error("Failed to generate any audio chunks");
    }
    
    // Merge audio files using ffmpeg
    const outputFile = `${tempDir}/complete.mp3`;
    const fileList = `${tempDir}/files.txt`;
    
    // Create a file list for ffmpeg
    fs.writeFileSync(fileList, audioFiles.map(file => `file '${file}'`).join('\n'));
    
    try {
      // Execute ffmpeg to concatenate all the audio files
      await execPromise(`ffmpeg -f concat -safe 0 -i ${fileList} -c copy ${outputFile}`);
      const completeAudio = fs.readFileSync(outputFile);
      
      // Clean up temporary files
      try {
        for (const file of audioFiles) {
          fs.unlinkSync(file);
        }
        fs.unlinkSync(fileList);
        fs.unlinkSync(outputFile);
        fs.rmdirSync(tempDir);
      } catch (cleanupError) {
        console.error("Error cleaning up temp files:", cleanupError);
      }
      
      return completeAudio;
    } catch (ffmpegError) {
      console.error("Error merging audio with ffmpeg:", ffmpegError);
      
      // If ffmpeg fails, just return the first chunk as a fallback
      if (audioFiles.length > 0) {
        return fs.readFileSync(audioFiles[0]);
      }
      throw new Error("Failed to merge audio chunks");
    }
  } catch (error: unknown) {
    console.error("Error generating speech:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to generate speech: ${errorMessage}`);
  }
}

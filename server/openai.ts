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

// Generate podcast content based on topic
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
            "You are an expert podcast creator. You create engaging, informative podcast scripts on various topics. " +
            "Focus on creating content that's conversational, educational, and engaging - as if someone is explaining a topic to a friend. " +
            "The podcast should be structured with a clear introduction, main content sections, and a conclusion. " +
            "The length should be appropriate for about a 30-minute podcast (approximately 4500-5000 words)."
        },
        {
          role: "user",
          content: `Create a podcast about "${topic}". Provide a JSON response with the following structure: 
          {
            "title": "An engaging title for the podcast",
            "description": "A brief 1-2 sentence description of what the podcast covers",
            "content": "The full podcast script content"
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
        voice: "alloy",
        input: text,
      });
      
      return Buffer.from(await mp3.arrayBuffer());
    }
    
    // For long text, create a demo sample with introduction and first section
    console.log(`Text too long (${text.length} chars). Generating audio for introduction section.`);
    
    // Strategy: Get the introduction section which typically contains the podcast format and overview
    // First, split by major sections (usually indicated by multiple newlines or section markers)
    const sections = text.split(/\n\s*---\s*\n|\n\*\*Section/i);
    
    // Take the introduction (first section) and possibly a bit of the next section
    let sampleText = sections[0];
    
    // If the intro is very short, add the first part of the next section if available
    if (sampleText.length < 2000 && sections.length > 1) {
      const remainingSpace = MAX_CHUNK_SIZE - sampleText.length - 100; // Leave some buffer
      if (remainingSpace > 500 && sections[1].length > 0) {
        // Add as much of the next section as will fit
        sampleText += "\n\n---\n\n" + sections[1].substring(0, remainingSpace);
      }
    }
    
    // If still too long, trim to the max size
    if (sampleText.length > MAX_CHUNK_SIZE) {
      sampleText = sampleText.substring(0, MAX_CHUNK_SIZE - 100);
    }
    
    // Add a note about the shortened content
    sampleText += "\n\nThis is a shortened sample of the podcast. In a production version, the full content would be available.";
    
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: sampleText,
    });
    
    return Buffer.from(await mp3.arrayBuffer());
  } catch (error: unknown) {
    console.error("Error generating speech:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to generate speech: ${errorMessage}`);
  }
}

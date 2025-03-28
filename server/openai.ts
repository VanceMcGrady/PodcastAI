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
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw new Error(`Failed to transcribe audio: ${error.message}`);
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
  } catch (error) {
    console.error("Error generating podcast content:", error);
    throw new Error(`Failed to generate podcast content: ${error.message}`);
  }
}

// Convert text to speech using OpenAI TTS
export async function textToSpeech(text: string): Promise<Buffer> {
  try {
    const chunks: Buffer[] = [];
    
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    });
    
    const buffer = Buffer.from(await mp3.arrayBuffer());
    return buffer;
  } catch (error) {
    console.error("Error generating speech:", error);
    throw new Error(`Failed to generate speech: ${error.message}`);
  }
}

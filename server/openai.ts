import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "sk-dummy" });

// Transcribe audio to text
export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  try {
    const tempFilePath = `/tmp/recording-${Date.now()}.webm`;
    const fs = await import("node:fs");
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
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to transcribe audio: ${errorMessage}`);
  }
}

// Generate learncast content based on topic
export async function generateLearncastContent(topic: string): Promise<{
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
            "You are an expert creator of Learncasts - high-quality educational audio content that combines the knowledge depth of a lecture with the engaging narrative style of premium educational content. " +
            "Focus on creating content that's eloquent, immersive, and educational with a warm, authoritative teaching voice. " +
            "Write in a literary style suitable for educational audio - clear, descriptive, and engaging with a professional narrator's voice. " +
            "Avoid podcast-specific elements like host introductions, interjections, or references to 'listeners' or 'episodes'. " +
            "The narrative should flow smoothly with proper transitions between sections. " +
            "The length should be appropriate for about a 30-minute learncast (approximately 4500-5000 words).",
        },
        {
          role: "user",
          content: `Create a Learncast about "${topic}". Provide a JSON response with the following structure: 
          {
            "title": "An informative and engaging title for the Learncast",
            "description": "A brief 1-2 sentence description of what this Learncast covers",
            "content": "The full Learncast content"
          }`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      title: result.title || `Learncast about ${topic}`,
      description: result.description || `A learncast exploring ${topic}`,
      content:
        result.content || `Failed to generate learncast content for ${topic}`,
    };
  } catch (error: unknown) {
    console.error("Error generating learncast content:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to generate learncast content: ${errorMessage}`);
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
        voice: "nova", // Nova voice has a warm, professional narrative quality that's perfect for learncasts
        input: text,
      });

      return Buffer.from(await mp3.arrayBuffer());
    }

    // For long text, create a demo sample with introduction and first section
    console.log(
      `Text too long (${text.length} chars). Generating audio for introduction section.`
    );

    // Strategy: Get the introduction section which typically contains the learncast overview
    // First, split by major sections (usually indicated by multiple newlines or section markers)
    const sections = text.split(/\n\s*---\s*\n|\n\*\*Section/i);

    // Take the introduction (first section) and possibly a bit of the next section
    let sampleText = sections[0];

    // If the intro is very short, add the first part of the next section if available
    if (sampleText.length < 2000 && sections.length > 1) {
      const remainingSpace = MAX_CHUNK_SIZE - sampleText.length - 100; // Leave some buffer
      if (remainingSpace > 500 && sections[1].length > 0) {
        // Add as much of the next section as will fit
        sampleText += `\n\n---\n\n${sections[1].substring(0, remainingSpace)}`;
      }
    }

    // If still too long, trim to the max size
    if (sampleText.length > MAX_CHUNK_SIZE) {
      sampleText = sampleText.substring(0, MAX_CHUNK_SIZE - 100);
    }

    // Add a note about the shortened content
    sampleText +=
      "\n\nThis is a shortened sample of the learncast. In a production version, the full content would be available.";

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova", // Consistent voice for all audio generation
      input: sampleText,
    });

    return Buffer.from(await mp3.arrayBuffer());
  } catch (error: unknown) {
    console.error("Error generating speech:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to generate speech: ${errorMessage}`);
  }
}

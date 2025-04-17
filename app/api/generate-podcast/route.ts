import { type NextRequest, NextResponse } from "next/server";
import { generateLearncastContent, textToSpeech } from "../../../server/openai";
import { storage } from "../../../server/storage";
import { generateAudioFilename, saveAudioFile } from "../../lib/audioStorage";
import { insertPodcastSchema } from "../../../shared/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || !body.topic) {
      return NextResponse.json({ message: "Missing topic" }, { status: 400 });
    }

    // Generate content
    const { topic, transcript } = body;
    const streamContentToClient = !!body.streamContent;

    const learncastContent = await generateLearncastContent(topic);

    // Convert text to speech
    const audioBuffer = await textToSpeech(learncastContent.content);

    // Save the audio file with our helper function
    const filename = generateAudioFilename();
    const audioUrl = await saveAudioFile(audioBuffer, filename);

    // Create a podcast record in storage
    const podcast = await storage.createPodcast({
      title: learncastContent.title,
      description: learncastContent.description,
      content: learncastContent.content,
      audioUrl,
      topic,
      transcript: transcript || "",
      createdAt: new Date(),
    });

    return NextResponse.json(podcast);
  } catch (error) {
    console.error("Error generating podcast:", error);
    return NextResponse.json(
      { message: "Failed to generate learncast" },
      { status: 500 }
    );
  }
}

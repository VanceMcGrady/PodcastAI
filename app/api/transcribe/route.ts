import { type NextRequest, NextResponse } from "next/server";
import { transcribeAudio } from "../../../server/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || !body.audio) {
      return NextResponse.json(
        { message: "Missing audio data" },
        { status: 400 }
      );
    }

    // Convert base64 to buffer
    const audioBase64 = body.audio.replace(/^data:audio\/\w+;base64,/, "");
    const audioBuffer = Buffer.from(audioBase64, "base64");

    // Transcribe the audio
    const transcript = await transcribeAudio(audioBuffer);

    return NextResponse.json({ transcript });
  } catch (error) {
    console.error("Error transcribing audio:", error);
    return NextResponse.json(
      { message: "Failed to transcribe audio" },
      { status: 500 }
    );
  }
}

// Increase the body size limit for audio uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

import { type NextRequest, NextResponse } from "next/server";
import { getAudioFile } from "../../../lib/audioStorage";

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;

    // Get the audio buffer using our helper function
    const audioBuffer = await getAudioFile(filename);

    if (!audioBuffer) {
      return NextResponse.json(
        { message: "Audio file not found" },
        { status: 404 }
      );
    }

    // Determine content type based on file extension
    const contentType = filename.endsWith(".mp3")
      ? "audio/mpeg"
      : "application/octet-stream";

    // Return the audio file
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": audioBuffer.length.toString(),
        "Cache-Control": "public, max-age=31536000", // Cache for a year
      },
    });
  } catch (error) {
    console.error("Error serving audio file:", error);
    return NextResponse.json(
      { message: "Failed to serve audio file" },
      { status: 500 }
    );
  }
}

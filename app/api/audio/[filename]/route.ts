import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    const audioPath = path.join(process.cwd(), 'public', 'audio', filename);
    
    // Check if file exists
    if (!fs.existsSync(audioPath)) {
      return NextResponse.json(
        { message: "Audio file not found" },
        { status: 404 }
      );
    }
    
    // Read the file
    const audioBuffer = fs.readFileSync(audioPath);
    
    // Determine content type based on file extension
    const contentType = filename.endsWith('.mp3') 
      ? 'audio/mpeg' 
      : 'application/octet-stream';
    
    // Return the audio file
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': audioBuffer.length.toString(),
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
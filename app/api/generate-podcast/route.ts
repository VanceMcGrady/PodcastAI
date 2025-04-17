import { NextRequest, NextResponse } from 'next/server';
import { generateLearncastContent, textToSpeech } from '../../../server/openai';
import { storage } from '../../../server/storage';
import fs from 'fs';
import path from 'path';
import { insertPodcastSchema } from '../../../shared/schema';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body || !body.topic) {
      return NextResponse.json(
        { message: "Missing topic" },
        { status: 400 }
      );
    }
    
    // Generate content
    const { topic, transcript } = body;
    const streamContentToClient = !!body.streamContent;
    
    const learncastContent = await generateLearncastContent(topic);
    
    // Generate a unique filename
    const hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex');
    const filename = `learncast_${hash}.mp3`;
    const audioPath = path.join(process.cwd(), 'public', 'audio', filename);
    
    // Convert text to speech
    const audioBuffer = await textToSpeech(learncastContent.content);
    
    // Ensure the directory exists
    const dir = path.dirname(audioPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Save the audio file
    fs.writeFileSync(audioPath, audioBuffer);
    
    // Create a podcast record in storage
    const podcast = await storage.createPodcast({
      title: learncastContent.title,
      description: learncastContent.description,
      content: learncastContent.content,
      audioUrl: `/audio/${filename}`,
      topic,
      transcript: transcript || '',
      createdAt: new Date()
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
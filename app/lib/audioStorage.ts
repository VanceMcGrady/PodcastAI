import fs from 'fs';
import path from 'path';
import { mkdir, writeFile } from 'fs/promises';
import crypto from 'crypto';

// Define audio storage directory
const AUDIO_DIR = process.env.NODE_ENV === 'production' 
  ? '/tmp/audio' // Use /tmp in production (Vercel serverless functions)
  : path.join(process.cwd(), 'public/audio');

/**
 * Ensures the audio directory exists
 */
export async function ensureAudioDir(): Promise<void> {
  if (!fs.existsSync(AUDIO_DIR)) {
    await mkdir(AUDIO_DIR, { recursive: true });
  }
}

/**
 * Generates a unique filename for audio files
 */
export function generateAudioFilename(): string {
  const hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex');
  return `learncast_${hash}.mp3`;
}

/**
 * Saves an audio buffer to the filesystem
 */
export async function saveAudioFile(buffer: Buffer, filename: string): Promise<string> {
  await ensureAudioDir();
  const filePath = path.join(AUDIO_DIR, filename);
  await writeFile(filePath, buffer);
  
  // For Vercel, we need to use the API endpoint to serve files from /tmp
  const audioUrl = process.env.NODE_ENV === 'production'
    ? `/api/audio/${filename}`
    : `/audio/${filename}`;
    
  return audioUrl;
}

/**
 * Reads an audio file from the filesystem
 */
export async function getAudioFile(filename: string): Promise<Buffer | null> {
  const filePath = path.join(AUDIO_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  return fs.promises.readFile(filePath);
}
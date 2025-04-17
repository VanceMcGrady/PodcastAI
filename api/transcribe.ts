import type { VercelRequest, VercelResponse } from '@vercel/node';
import { transcribeAudio } from '../server/openai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    
    if (!req.body || !req.body.audio) {
      return res.status(400).json({ message: "Audio data is required" });
    }

    const audioBuffer = Buffer.from(req.body.audio, 'base64');
    const transcript = await transcribeAudio(audioBuffer);
    
    return res.status(200).json({ transcript });
  } catch (error) {
    console.error("Error transcribing audio:", error);
    return res.status(500).json({ message: "Failed to transcribe audio" });
  }
}
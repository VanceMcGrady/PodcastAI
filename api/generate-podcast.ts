import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateLearncastContent, textToSpeech } from '../server/openai';
import { storage } from '../server/storage';
import { insertPodcastSchema } from '../shared/schema';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// For local development, using a directory structure similar to the server
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const audioDir = path.join(__dirname, '../audio');

// Ensure audio directory exists
try {
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }
} catch (error) {
  console.warn('Warning: Could not create audio directory. Using temp directory instead.');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const { topic } = req.body;
    
    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    // Setup response headers for streaming
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    // Helper function to send progress updates
    const sendProgress = (progress: number, step: string) => {
      try {
        const update = JSON.stringify({ 
          status: "generating", 
          progress, 
          step 
        }) + "\n";
        res.write(update);
      } catch (err) {
        console.error("Failed to write progress update:", err);
      }
    };

    try {
      // Step 1: Generate content
      sendProgress(25, "Generating content...");
      const content = await generateLearncastContent(topic);
      
      // Send the generated text content to the client
      const textUpdate = JSON.stringify({
        status: "text_content",
        title: content.title,
        description: content.description,
        content: content.content
      }) + "\n";
      res.write(textUpdate);

      // Step 2: Convert to speech
      sendProgress(50, "Converting to speech...");
      const audioBuffer = await textToSpeech(content.content);

      // Step 3: Save audio file
      sendProgress(75, "Finalizing learncast...");
      
      // In Vercel's serverless environment, we need a different approach for storing files
      // For now, we'll generate a unique filename and handle through our audio API endpoint
      const fileName = `learncast-${Date.now()}.mp3`;
      let filePath;
      
      // Try to save locally (works in development)
      try {
        filePath = path.join(audioDir, fileName);
        fs.writeFileSync(filePath, audioBuffer);
      } catch (error) {
        console.warn('Could not save audio file locally. In production, use a storage service.');
        // In production, you would use a service like AWS S3, Cloudinary, etc.
      }

      // Calculate approximate duration (1 word ≈ 0.5 seconds)
      const wordCount = content.content.split(' ').length;
      const approximateDuration = Math.round(wordCount * 0.5);

      // Step 4: Create learncast entry
      const learncastData = {
        title: content.title,
        description: content.description,
        content: content.content,
        audioUrl: `/audio/${fileName}`,
        duration: approximateDuration
      };

      const validatedData = insertPodcastSchema.parse(learncastData);
      const learncast = await storage.createPodcast(validatedData);

      // Step 5: Return final learncast
      const completion = JSON.stringify({ 
        status: "completed", 
        progress: 100, 
        podcast: learncast 
      }) + "\n";
      res.write(completion);
      res.end();
    } catch (innerError) {
      console.error("Inner error generating learncast:", innerError);
      const errorMessage = innerError instanceof Error ? innerError.message : "Unknown error";
      const errorResponse = JSON.stringify({ 
        status: "error", 
        message: `Failed to generate learncast: ${errorMessage}` 
      }) + "\n";
      res.write(errorResponse);
      res.end();
    }
  } catch (error) {
    console.error("Outer error generating learncast:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    try {
      res.write(JSON.stringify({ 
        status: "error", 
        message: `Failed to generate learncast: ${errorMessage}` 
      }) + "\n");
      res.end();
    } catch (writeError) {
      console.error("Failed to send error response:", writeError);
      res.end();
    }
  }
}
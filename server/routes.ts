import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { transcribeAudio, generateLearncastContent, textToSpeech } from "./openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { insertPodcastSchema } from "@shared/schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create audio directory for storing generated audio files
const audioDir = path.join(__dirname, '../audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to get all learncasts
  app.get("/api/podcasts", async (req: Request, res: Response) => {
    try {
      const podcasts = await storage.getAllPodcasts();
      res.status(200).json(podcasts);
    } catch (error) {
      console.error("Error fetching learncasts:", error);
      res.status(500).json({ message: "Failed to fetch learncasts" });
    }
  });

  // API endpoint to get a specific learncast
  app.get("/api/podcasts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid learncast ID" });
      }

      const podcast = await storage.getPodcast(id);
      if (!podcast) {
        return res.status(404).json({ message: "Learncast not found" });
      }

      res.status(200).json(podcast);
    } catch (error) {
      console.error("Error fetching learncast:", error);
      res.status(500).json({ message: "Failed to fetch learncast" });
    }
  });

  // API endpoint for transcribing audio
  app.post("/api/transcribe", async (req: Request, res: Response) => {
    try {
      if (!req.body || !req.body.audio) {
        return res.status(400).json({ message: "Audio data is required" });
      }

      const audioBuffer = Buffer.from(req.body.audio, 'base64');
      const transcript = await transcribeAudio(audioBuffer);
      
      res.status(200).json({ transcript });
    } catch (error) {
      console.error("Error transcribing audio:", error);
      res.status(500).json({ message: "Failed to transcribe audio" });
    }
  });

  // API endpoint for generating learncast
  app.post("/api/generate-podcast", async (req: Request, res: Response) => {
    try {
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
  
        // Step 2: Convert to speech
        sendProgress(50, "Converting to speech...");
        const audioBuffer = await textToSpeech(content.content);
  
        // Step 3: Save audio file
        sendProgress(75, "Finalizing learncast...");
        const fileName = `learncast-${Date.now()}.mp3`;
        const filePath = path.join(audioDir, fileName);
        fs.writeFileSync(filePath, audioBuffer);
  
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
  });

  // Serve audio files
  app.get("/audio/:filename", (req: Request, res: Response) => {
    const filePath = path.join(audioDir, req.params.filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Audio file not found" });
    }
    
    res.sendFile(filePath);
  });

  const httpServer = createServer(app);
  return httpServer;
}

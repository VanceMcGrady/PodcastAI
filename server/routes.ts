import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { transcribeAudio, generatePodcastContent, textToSpeech } from "./openai";
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
  // API endpoint to get all podcasts
  app.get("/api/podcasts", async (req: Request, res: Response) => {
    try {
      const podcasts = await storage.getAllPodcasts();
      res.status(200).json(podcasts);
    } catch (error) {
      console.error("Error fetching podcasts:", error);
      res.status(500).json({ message: "Failed to fetch podcasts" });
    }
  });

  // API endpoint to get a specific podcast
  app.get("/api/podcasts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid podcast ID" });
      }

      const podcast = await storage.getPodcast(id);
      if (!podcast) {
        return res.status(404).json({ message: "Podcast not found" });
      }

      res.status(200).json(podcast);
    } catch (error) {
      console.error("Error fetching podcast:", error);
      res.status(500).json({ message: "Failed to fetch podcast" });
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

  // API endpoint for generating podcast
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
        // Step 1: Generate content for longer 20-minute audio
        sendProgress(15, "Crafting your Learncast content...");
        const content = await generatePodcastContent(topic);
        
        // Step 2: Begin text-to-speech conversion
        sendProgress(30, "Starting audio generation...");
        
        // Set up event emitter for progress updates during speech generation
        const eventEmitter = new (require('events').EventEmitter)();
        
        // Listen for speech generation progress events
        eventEmitter.on('speech-progress', (data: { chunkIndex: number, totalChunks: number }) => {
          const { chunkIndex, totalChunks } = data;
          const baseProgress = 30; // Start at 30%
          const progressPerChunk = 50 / totalChunks; // 50% of the process is speech generation
          const chunkProgress = Math.round(baseProgress + (chunkIndex * progressPerChunk));
          
          sendProgress(
            chunkProgress, 
            `Converting part ${chunkIndex + 1} of ${totalChunks} to speech...`
          );
        });
        
        // Pass the event emitter to the text-to-speech function
        const audioBuffer = await textToSpeech(content.content, eventEmitter);
  
        // Step 3: Save audio file
        sendProgress(85, "Finalizing your Learncast...");
        const fileName = `learncast-${Date.now()}.mp3`;
        const filePath = path.join(audioDir, fileName);
        fs.writeFileSync(filePath, audioBuffer);
  
        // Calculate approximate duration (1 word ≈ 0.5 seconds)
        const wordCount = content.content.split(' ').length;
        const approximateDuration = Math.round(wordCount * 0.5);
  
        // Step 4: Create podcast entry
        const podcastData = {
          title: content.title,
          description: content.description,
          content: content.content,
          audioUrl: `/audio/${fileName}`,
          duration: approximateDuration
        };
  
        const validatedData = insertPodcastSchema.parse(podcastData);
        const podcast = await storage.createPodcast(validatedData);
  
        // Step 5: Return final podcast
        const completion = JSON.stringify({ 
          status: "completed", 
          progress: 100, 
          podcast 
        }) + "\n";
        res.write(completion);
        res.end();
      } catch (innerError) {
        console.error("Inner error generating podcast:", innerError);
        const errorMessage = innerError instanceof Error ? innerError.message : "Unknown error";
        const errorResponse = JSON.stringify({ 
          status: "error", 
          message: `Failed to generate podcast: ${errorMessage}` 
        }) + "\n";
        res.write(errorResponse);
        res.end();
      }
    } catch (error) {
      console.error("Outer error generating podcast:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      try {
        res.write(JSON.stringify({ 
          status: "error", 
          message: `Failed to generate podcast: ${errorMessage}` 
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

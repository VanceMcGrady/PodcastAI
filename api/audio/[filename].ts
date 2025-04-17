import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

// In local development, use local file system
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const audioDir = path.join(__dirname, "../../audio");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Only allow GET requests
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { filename } = req.query;

    if (!filename || typeof filename !== "string") {
      return res.status(400).json({ message: "Filename is required" });
    }

    // For security, sanitize filename
    const sanitizedFilename = path.basename(filename);
    const filePath = path.join(audioDir, sanitizedFilename);

    // In production Vercel environment, you would use a storage service like S3
    // For development, we try to read from local file system
    if (fs.existsSync(filePath)) {
      // Set the appropriate content type for MP3
      res.setHeader("Content-Type", "audio/mpeg");

      // Read the file and send it
      const fileStream = fs.createReadStream(filePath);
      return fileStream.pipe(res);
    }
    // In production, you would look up the file in your storage service
    return res.status(404).json({ message: "Audio file not found" });
  } catch (error) {
    console.error("Error serving audio file:", error);
    return res.status(500).json({ message: "Failed to serve audio file" });
  }
}

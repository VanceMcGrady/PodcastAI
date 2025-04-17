import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // GET request to fetch a specific podcast
    if (req.method === 'GET') {
      const id = parseInt(req.query.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid learncast ID" });
      }

      const podcast = await storage.getPodcast(id);
      if (!podcast) {
        return res.status(404).json({ message: "Learncast not found" });
      }

      return res.status(200).json(podcast);
    }
    
    // Method not allowed
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error("Error fetching learncast:", error);
    return res.status(500).json({ message: "Failed to fetch learncast" });
  }
}
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // GET request to fetch all podcasts
    if (req.method === 'GET') {
      const podcasts = await storage.getAllPodcasts();
      return res.status(200).json(podcasts);
    }
    
    // Method not allowed
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error("Error fetching learncasts:", error);
    return res.status(500).json({ message: "Failed to fetch learncasts" });
  }
}
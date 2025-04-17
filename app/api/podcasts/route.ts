import { NextResponse } from 'next/server';
import { storage } from '../../../server/storage';

export async function GET() {
  try {
    const podcasts = await storage.getAllPodcasts();
    return NextResponse.json(podcasts);
  } catch (error) {
    console.error("Error fetching learncasts:", error);
    return NextResponse.json(
      { message: "Failed to fetch learncasts" },
      { status: 500 }
    );
  }
}
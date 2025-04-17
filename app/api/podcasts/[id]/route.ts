import { NextResponse } from "next/server";
import { storage } from "../../../../server/storage";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(params.id);

    if (Number.isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const podcast = await storage.getPodcast(id);

    if (!podcast) {
      return NextResponse.json(
        { message: "Learncast not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(podcast);
  } catch (error) {
    console.error("Error fetching learncast:", error);
    return NextResponse.json(
      { message: "Failed to fetch learncast" },
      { status: 500 }
    );
  }
}

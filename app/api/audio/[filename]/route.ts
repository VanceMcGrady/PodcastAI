// biome-ignore lint/style/useImportType: <explanation>
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Record<string, string> }
) {
  const { filename } = params;

  return NextResponse.json({ message: `Requested file: ${filename}` });
}

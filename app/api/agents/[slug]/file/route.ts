import { NextResponse } from "next/server";

import { readAgentFile } from "@/lib/catalog";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get("path");

  if (!filePath) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  const file = await readAgentFile(slug, filePath);

  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  return NextResponse.json(file);
}

import { NextRequest, NextResponse } from "next/server";
import { getB2SignedUrl } from "@/lib/b2";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  const filename = searchParams.get("filename") || undefined;

  if (!key) {
    return NextResponse.json({ error: "Missing key parameter" }, { status: 400 });
  }

  try {
    const url = await getB2SignedUrl(key, 3600, filename);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("B2 signed URL error:", error);
    return NextResponse.json({ error: "Failed to generate download URL" }, { status: 500 });
  }
}

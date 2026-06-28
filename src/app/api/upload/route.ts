import { NextRequest, NextResponse } from "next/server";
import { uploadB2File } from "@/lib/b2";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob | null;
    const key = formData.get("key") as string | null;

    if (!file || !key) {
      return NextResponse.json({ error: "Missing file or key" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type || "application/octet-stream";

    await uploadB2File(key, buffer, contentType);

    return NextResponse.json({ success: true, key });
  } catch (error: any) {
    console.error("Upload endpoint error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload" }, { status: 500 });
  }
}

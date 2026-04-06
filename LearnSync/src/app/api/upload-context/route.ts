import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart form payload" }, { status: 400 });
  }
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file received" }, { status: 400 });
  }

  const allowedTypes = new Set(["application/pdf", "text/plain", "text/markdown"]);
  if (file.type && !allowedTypes.has(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
  const timestamp = Date.now();
  const fileUri = `syllabus://${timestamp}/${safeName}`;

  return NextResponse.json({ fileUri }, { status: 200 });
}

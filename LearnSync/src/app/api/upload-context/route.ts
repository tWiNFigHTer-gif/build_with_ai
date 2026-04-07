import { NextResponse } from "next/server";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/x-pdf",
  "application/octet-stream",
  "text/plain",
  "text/markdown"
]);

function isAllowedUpload(file: File): boolean {
  const lowerName = file.name.toLowerCase();
  const extensionAllowed = lowerName.endsWith(".pdf") || lowerName.endsWith(".txt") || lowerName.endsWith(".md");
  const mimeAllowed = !file.type || ALLOWED_MIME_TYPES.has(file.type.toLowerCase());
  return extensionAllowed && mimeAllowed;
}

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

  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "File too large. Max allowed size is 10MB." }, { status: 400 });
  }

  if (!isAllowedUpload(file)) {
    return NextResponse.json(
      { error: "Unsupported file type. Upload PDF, TXT, or MD files only." },
      { status: 400 }
    );
  }

  const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
  const timestamp = Date.now();
  const fileUri = `syllabus://${timestamp}/${safeName}`;

  return NextResponse.json({ fileUri }, { status: 200 });
}

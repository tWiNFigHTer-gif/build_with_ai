import { NextResponse } from "next/server";
import { generateChecklistSuggestion } from "../../../lib/model/provider";

type ChecklistRequestBody = {
  syllabusUri?: string;
  prompt?: string;
};

export async function POST(request: Request) {
  let body: ChecklistRequestBody;
  try {
    body = (await request.json()) as ChecklistRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (!body.syllabusUri?.trim()) {
    return NextResponse.json({ error: "Syllabus URI is required" }, { status: 400 });
  }

  try {
    const suggestion = await generateChecklistSuggestion({
      syllabusUri: body.syllabusUri.trim(),
      prompt: body.prompt?.trim() || undefined
    });

    return NextResponse.json(suggestion, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Model provider error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

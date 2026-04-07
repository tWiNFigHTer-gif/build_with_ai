import { NextResponse } from "next/server";
import { generateChatReply } from "../../../lib/model/provider";

type ChatRequestBody = {
  message?: string;
  syllabusUri?: string;
};

export async function POST(request: Request) {
  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (!body.message?.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  try {
    const response = await generateChatReply({
      message: body.message.trim(),
      syllabusUri: body.syllabusUri.trim()
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Model provider error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

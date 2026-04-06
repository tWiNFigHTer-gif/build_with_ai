import { NextResponse } from "next/server";
import { getTopicFrequency } from "../../../lib/firebaseServer";

export async function GET() {
  try {
    const topTopics = await getTopicFrequency(10);
    return NextResponse.json(
      {
        status: "ok",
        topTopics
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analytics fetch failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

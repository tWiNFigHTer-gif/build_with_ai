import { NextResponse } from "next/server";
import { generateDoubtInsight } from "../../../lib/model/provider";
import { logDoubtToFirestore } from "../../../lib/firebaseServer";

type DoubtRequestBody = {
  image?: string;
  syllabusUri?: string;
  studentId?: string;
};

export async function POST(request: Request) {
  let body: DoubtRequestBody;
  try {
    body = (await request.json()) as DoubtRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const image = body.image?.trim();
  const syllabusUri = body.syllabusUri?.trim();
  const studentId = body.studentId?.trim() || "student-demo";

  if (!image) {
    return NextResponse.json({ error: "Image is required" }, { status: 400 });
  }

  if (!syllabusUri) {
    return NextResponse.json({ error: "Syllabus URI is required" }, { status: 400 });
  }

  try {
    const insight = await generateDoubtInsight({
      imageBase64: image,
      syllabusUri
    });

    await logDoubtToFirestore({
      studentId,
      topic: insight.topicTag || insight.topic,
      hint: insight.hint,
      syllabusUri,
      difficulty: insight.difficulty
    });

    return NextResponse.json(
      {
        ...insight,
        topicTag: insight.topicTag || insight.topic,
        source_syllabus_uri: syllabusUri
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Model provider error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

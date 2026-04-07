import { VertexAI } from '@google-cloud/vertexai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type {
  ChatReply,
  ChatReplyInput,
  ChecklistSuggestion,
  ChecklistSuggestionInput,
  DoubtInsight,
  DoubtInsightInput
} from "./types";
import { getGeminiApiKey, getModelProvider, getVertexConfig } from "../env";
import { buildChatPrompt, buildChecklistPrompt, buildDoubtPrompt } from "../gemini";

function getVertexModel(responseMimeType: "application/json" | "text/plain") {
  const vertexConfig = getVertexConfig();
  if (!vertexConfig.projectId) {
    throw new Error("Vertex provider selected but GCP_PROJECT_ID is missing");
  }

  const vertexAI = new VertexAI({
    project: vertexConfig.projectId,
    location: vertexConfig.location
  });

  return vertexAI.getGenerativeModel({
    model: vertexConfig.modelName,
    generationConfig: { responseMimeType }
  });
}

function extractInlineData(dataUriOrBase64: string): { mimeType: string; data: string } | null {
  if (!dataUriOrBase64) {
    return null;
  }

  const match = dataUriOrBase64.match(/^data:([^;]+);base64,(.+)$/);
  if (match) {
    return {
      mimeType: match[1],
      data: match[2]
    };
  }

  return {
    mimeType: "image/jpeg",
    data: dataUriOrBase64
  };
}

function parseJsonResponse(rawText: string): Record<string, unknown> {
  const trimmed = rawText.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const jsonText = fenced ? fenced[1].trim() : trimmed;
  try {
    return JSON.parse(jsonText) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function readTextFromVertex(result: { response?: { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> } }): string {
  return result.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

async function getVertexInsight(input: DoubtInsightInput): Promise<DoubtInsight> {
  const prompt = buildDoubtPrompt(input);

  const model = getVertexModel("application/json");
  const parts: any[] = [];

  if (input.syllabusUri && input.syllabusUri.startsWith('gs://')) {
    parts.push({ fileData: { mimeType: 'application/pdf', fileUri: input.syllabusUri } });
  }

  const inlineData = extractInlineData(input.imageBase64);
  if (inlineData) {
    parts.push({ inlineData });
  }

  parts.push({ text: prompt + "\nReturn strictly as JSON with keys: hint, topic, difficulty, recovery_task." });

  const result = await model.generateContent({ contents: [{ role: 'user', parts }] });
  const response = parseJsonResponse(readTextFromVertex(result));

  const topic = typeof response.topic === "string" && response.topic.trim() ? response.topic : "General Concept";
  const hint = typeof response.hint === "string" && response.hint.trim()
    ? response.hint
    : "Try breaking the problem into smaller steps.";
  const recoveryTask = typeof response.recovery_task === "string" && response.recovery_task.trim()
    ? response.recovery_task
    : "Review the related chapter in your syllabus.";
  const difficulty = typeof response.difficulty === "number" ? response.difficulty : 3;

  return {
    hint,
    topic,
    topicTag: topic,
    difficulty,
    recovery_task: recoveryTask
  };
}

async function getVertexChatReply(input: ChatReplyInput): Promise<ChatReply> {
  const prompt = buildChatPrompt(input);
  const model = getVertexModel("text/plain");
  const parts: any[] = [];

  if (input.syllabusUri && input.syllabusUri.startsWith('gs://')) {
    parts.push({ fileData: { mimeType: 'application/pdf', fileUri: input.syllabusUri } });
  }

  parts.push({ text: prompt });

  const result = await model.generateContent({ contents: [{ role: 'user', parts }] });
  return {
    reply: readTextFromVertex(result) || "I'm having trouble connecting right now."
  };
}

async function getGeminiChatReply(input: ChatReplyInput): Promise<ChatReply> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = buildChatPrompt(input);
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return { reply: text || "I'm having trouble connecting right now." };
}

async function getVertexChecklistSuggestion(input: ChecklistSuggestionInput): Promise<ChecklistSuggestion> {
  const prompt = buildChecklistPrompt(input);
  const model = getVertexModel("application/json");
  const parts: any[] = [];

  if (input.syllabusUri && input.syllabusUri.startsWith('gs://')) {
    parts.push({ fileData: { mimeType: 'application/pdf', fileUri: input.syllabusUri } });
  }

  parts.push({ text: prompt + "\nReturn strictly as JSON with keys: answer, dayChecklist (string array), weekChecklist (string array)." });

  const result = await model.generateContent({ contents: [{ role: 'user', parts }] });
  const response = parseJsonResponse(readTextFromVertex(result));

  const dayChecklist = Array.isArray(response.dayChecklist)
    ? response.dayChecklist.filter((item): item is string => typeof item === "string")
    : [];

  const weekChecklist = Array.isArray(response.weekChecklist)
    ? response.weekChecklist.filter((item): item is string => typeof item === "string")
    : [];

  return {
    answer: typeof response.answer === "string" ? response.answer : "Study plan generated.",
    dayChecklist,
    weekChecklist
  };
}

async function getMockInsight(input: DoubtInsightInput): Promise<DoubtInsight> {
  const prompt = buildDoubtPrompt(input);
  const contextualHint = input.syllabusUri
    ? "Try isolating the variable first, then reduce both sides step by step."
    : "Start by identifying known values and rewrite the equation cleanly.";

  return {
    hint: `${contextualHint} (context: ${prompt.slice(0, 80)}...)`,
    topic: "Algebra Simplification",
    topicTag: "Algebra Simplification",
    difficulty: 4,
    recovery_task: "Revisit linear equation balancing for 15 minutes tomorrow"
  };
}

async function getMockChatReply(input: ChatReplyInput): Promise<ChatReply> {
  const prompt = buildChatPrompt(input);
  return {
    reply: `Based on ${input.syllabusUri}, start with core concepts for this chapter, then solve two guided examples before timed practice. (${prompt.slice(0, 52)}...)`
  };
}

async function getMockChecklistSuggestion(input: ChecklistSuggestionInput): Promise<ChecklistSuggestion> {
  const prompt = buildChecklistPrompt(input);
  const answer = input.prompt?.trim()
    ? `Plan generated for: ${input.prompt.trim()} using context ${input.syllabusUri}.`
    : `Structured plan generated using context ${input.syllabusUri}.`;

  return {
    answer,
    dayChecklist: [
      "Revise one core concept for 25 minutes",
      "Solve 5 medium questions",
      "Log one doubt and review AI hint"
    ],
    weekChecklist: [
      "Complete 3 chapter recaps",
      "Attempt one timed mock section",
      `Review all flagged recovery tasks (${prompt.slice(0, 36)}...)`,
      "Conduct one teacher-led doubt clinic"
    ]
  };
}

export async function generateDoubtInsight(input: DoubtInsightInput): Promise<DoubtInsight> {
  const provider = getModelProvider();
  if (provider === "vertex") {
    return getVertexInsight(input);
  }
  return getMockInsight(input);
}

export async function generateChatReply(input: ChatReplyInput): Promise<ChatReply> {
  const provider = getModelProvider();
  if (provider === "gemini") {
    return getGeminiChatReply(input);
  }
  if (provider === "vertex") {
    try {
      return await getVertexChatReply(input);
    } catch (vertexError) {
      const errMsg = vertexError instanceof Error ? vertexError.message : String(vertexError);
      console.error("[chat] Vertex AI failed, falling back to mock:", errMsg);
      return getMockChatReply(input);
    }
  }
  return getMockChatReply(input);
}

export async function generateChecklistSuggestion(input: ChecklistSuggestionInput): Promise<ChecklistSuggestion> {
  const provider = getModelProvider();
  if (provider === "vertex") {
    return getVertexChecklistSuggestion(input);
  }
  return getMockChecklistSuggestion(input);
}
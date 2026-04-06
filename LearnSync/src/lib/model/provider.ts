import type {
  ChatReply,
  ChatReplyInput,
  ChecklistSuggestion,
  ChecklistSuggestionInput,
  DoubtInsight,
  DoubtInsightInput
} from "./types";
import { getModelProvider, getVertexConfig } from "../env";
import { buildChatPrompt, buildChecklistPrompt, buildDoubtPrompt } from "../gemini";

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

async function getVertexInsight(_input: DoubtInsightInput): Promise<DoubtInsight> {
  const vertex = getVertexConfig();
  if (!vertex.projectId) {
    throw new Error("Vertex provider selected but GCP_PROJECT_ID is missing");
  }

  // Placeholder: implement Vertex AI call in the next step after GCP setup.
  throw new Error("Vertex provider is selected but model call is not implemented yet");
}

async function getMockChatReply(input: ChatReplyInput): Promise<ChatReply> {
  const prompt = buildChatPrompt(input);
  return {
    reply: `Based on ${input.syllabusUri}, start with core concepts for this chapter, then solve two guided examples before timed practice. (${prompt.slice(0, 52)}...)`
  };
}

async function getVertexChatReply(_input: ChatReplyInput): Promise<ChatReply> {
  // Placeholder: implement Vertex AI chat call in the next step after GCP setup.
  throw new Error("Vertex provider is not configured yet");
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

async function getVertexChecklistSuggestion(_input: ChecklistSuggestionInput): Promise<ChecklistSuggestion> {
  // Placeholder: implement Vertex AI checklist generation in the next step after GCP setup.
  throw new Error("Vertex provider is not configured yet");
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
  if (provider === "vertex") {
    return getVertexChatReply(input);
  }
  return getMockChatReply(input);
}

export async function generateChecklistSuggestion(
  input: ChecklistSuggestionInput
): Promise<ChecklistSuggestion> {
  const provider = getModelProvider();
  if (provider === "vertex") {
    return getVertexChecklistSuggestion(input);
  }
  return getMockChecklistSuggestion(input);
}

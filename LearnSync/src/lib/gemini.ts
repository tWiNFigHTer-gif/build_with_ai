type DoubtPromptInput = {
	syllabusUri: string;
	imageBase64: string;
};

type ChatPromptInput = {
	syllabusUri: string;
	message: string;
};

type ChecklistPromptInput = {
	syllabusUri: string;
	prompt?: string;
};

export function buildDoubtPrompt(input: DoubtPromptInput): string {
	return [
		"You are the LearnSync Socratic tutor.",
		"Use syllabus context first and never provide final direct answers.",
		`Syllabus fileUri: ${input.syllabusUri}`,
		`Image payload prefix: ${input.imageBase64.slice(0, 42)}...`,
		"Respond with JSON fields: hint, topic, topicTag, difficulty, recovery_task."
	].join("\n");
}

export function buildChatPrompt(input: ChatPromptInput): string {
	return [
		"You are LearnSync chat assistant.",
		`Ground all responses on this syllabus fileUri: ${input.syllabusUri}`,
		`Student question: ${input.message}`,
		"Reply concise and actionable."
	].join("\n");
}

export function buildChecklistPrompt(input: ChecklistPromptInput): string {
	return [
		"You are LearnSync planning assistant.",
		`Use this syllabus fileUri as source: ${input.syllabusUri}`,
		`Optional teacher prompt: ${input.prompt ?? "(none)"}`,
		"Return dayChecklist and weekChecklist with practical revision tasks."
	].join("\n");
}

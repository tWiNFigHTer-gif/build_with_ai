export type DoubtInsightInput = {
  imageBase64: string;
  syllabusUri: string;
};

export type DoubtInsight = {
  hint: string;
  topic: string;
  topicTag: string;
  difficulty: number;
  recovery_task?: string;
};

export type ChatReplyInput = {
  message: string;
  syllabusUri: string;
};

export type ChatReply = {
  reply: string;
};

export type ChecklistSuggestionInput = {
  syllabusUri: string;
  prompt?: string;
};

export type ChecklistSuggestion = {
  answer: string;
  dayChecklist: string[];
  weekChecklist: string[];
};

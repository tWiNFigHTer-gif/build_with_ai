"use client";

import { useMemo, useState } from "react";
import { useLearnSyncContext } from "./LearnSyncProvider";

type ChecklistItem = {
  id: string;
  text: string;
  done: boolean;
};

type SuggestionResponse = {
  answer: string;
  dayChecklist: string[];
  weekChecklist: string[];
};

function buildItems(items: string[]): ChecklistItem[] {
  return items.map((text, index) => ({
    id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
    text,
    done: false
  }));
}

function completion(items: ChecklistItem[]): number {
  if (items.length === 0) {
    return 0;
  }

  const done = items.filter((item) => item.done).length;
  return Math.round((done / items.length) * 100);
}

export function StudentChecklistPlanner() {
  const { syllabusFileUri } = useLearnSyncContext();
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [dayItems, setDayItems] = useState<ChecklistItem[]>([]);
  const [weekItems, setWeekItems] = useState<ChecklistItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dayPercent = useMemo(() => completion(dayItems), [dayItems]);
  const weekPercent = useMemo(() => completion(weekItems), [weekItems]);

  const updateItem = (
    type: "day" | "week",
    id: string,
    updater: (item: ChecklistItem) => ChecklistItem
  ) => {
    const setter = type === "day" ? setDayItems : setWeekItems;
    setter((prev) => prev.map((item) => (item.id === id ? updater(item) : item)));
  };

  const removeItem = (type: "day" | "week", id: string) => {
    const setter = type === "day" ? setDayItems : setWeekItems;
    setter((prev) => prev.filter((item) => item.id !== id));
  };

  const addItem = (type: "day" | "week") => {
    const setter = type === "day" ? setDayItems : setWeekItems;
    setter((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        text: "New checklist item",
        done: false
      }
    ]);
  };

  const generateChecklist = async () => {
    if (!syllabusFileUri) {
      setError("Upload syllabus context before generating checklist.");
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/checklist-suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          syllabusUri: syllabusFileUri,
          prompt: prompt.trim() || undefined
        })
      });

      if (!response.ok) {
        throw new Error("Checklist suggestion failed");
      }

      const payload = (await response.json()) as SuggestionResponse;
      setAnswer(payload.answer);
      setDayItems(buildItems(payload.dayChecklist));
      setWeekItems(buildItems(payload.weekChecklist));
    } catch (suggestionError) {
      setError(suggestionError instanceof Error ? suggestionError.message : "Unexpected checklist error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section>
      <h2>AI Day + Week Checklist</h2>
      <p>Generate, edit, and complete your checklist. You can change any item manually.</p>
      <input
        type="text"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder="Optional: focus on tomorrow's calculus revision"
      />
      <button type="button" onClick={generateChecklist} disabled={isGenerating}>
        {isGenerating ? "Generating..." : "Suggest Day + Week Checklist"}
      </button>
      {answer ? <p>Model Answer: {answer}</p> : null}
      {error ? <p role="alert">{error}</p> : null}

      <h3>Day Checklist ({dayPercent}%)</h3>
      <button type="button" onClick={() => addItem("day")}>Add Day Item</button>
      {dayItems.map((item) => (
        <div key={item.id}>
          <input
            type="checkbox"
            checked={item.done}
            onChange={(event) => updateItem("day", item.id, (current) => ({ ...current, done: event.target.checked }))}
          />
          <input
            type="text"
            value={item.text}
            onChange={(event) => updateItem("day", item.id, (current) => ({ ...current, text: event.target.value }))}
          />
          <button type="button" onClick={() => removeItem("day", item.id)}>
            Remove
          </button>
        </div>
      ))}

      <h3>Week Checklist ({weekPercent}%)</h3>
      <button type="button" onClick={() => addItem("week")}>Add Week Item</button>
      {weekItems.map((item) => (
        <div key={item.id}>
          <input
            type="checkbox"
            checked={item.done}
            onChange={(event) => updateItem("week", item.id, (current) => ({ ...current, done: event.target.checked }))}
          />
          <input
            type="text"
            value={item.text}
            onChange={(event) => updateItem("week", item.id, (current) => ({ ...current, text: event.target.value }))}
          />
          <button type="button" onClick={() => removeItem("week", item.id)}>
            Remove
          </button>
        </div>
      ))}
    </section>
  );
}

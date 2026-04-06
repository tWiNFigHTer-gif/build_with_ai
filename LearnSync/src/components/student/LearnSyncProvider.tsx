"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type LearnSyncContextValue = {
  syllabusFileUri: string | null;
  setSyllabusFileUri: (fileUri: string | null) => void;
  todoItems: string[];
  injectRecoveryTask: (task: string) => void;
};

const LearnSyncContext = createContext<LearnSyncContextValue | undefined>(undefined);

export function LearnSyncProvider({ children }: { children: ReactNode }) {
  const [syllabusFileUri, setSyllabusFileUri] = useState<string | null>(null);
  const [todoItems, setTodoItems] = useState<string[]>([
    "Revise previous session notes",
    "Solve 5 practice questions"
  ]);

  const injectRecoveryTask = (task: string) => {
    const cleanTask = task.trim();
    if (!cleanTask) {
      return;
    }

    setTodoItems((prev) => {
      if (prev.includes(cleanTask)) {
        return prev;
      }
      return [cleanTask, ...prev];
    });
  };

  const value = useMemo(
    () => ({ syllabusFileUri, setSyllabusFileUri, todoItems, injectRecoveryTask }),
    [syllabusFileUri, todoItems]
  );

  return <LearnSyncContext.Provider value={value}>{children}</LearnSyncContext.Provider>;
}

export function useLearnSyncContext() {
  const context = useContext(LearnSyncContext);
  if (!context) {
    throw new Error("useLearnSyncContext must be used within LearnSyncProvider");
  }

  return context;
}

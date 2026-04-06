"use client";

import { KnowledgeBase } from "../../components/student/KnowledgeBase";
import { LearnSyncProvider } from "../../components/student/LearnSyncProvider";
import { StudentChecklistPlanner } from "../../components/student/StudentChecklistPlanner";
import { StudyHUD } from "../../components/student/StudyHUD";
import { TodoList } from "../../components/student/TodoList";

export default function StudentPage() {
  return (
    <LearnSyncProvider>
      <main>
        <h1>LearnSync Student Workspace</h1>
        <KnowledgeBase />
        <StudyHUD />
        <StudentChecklistPlanner />
        <TodoList />
      </main>
    </LearnSyncProvider>
  );
}

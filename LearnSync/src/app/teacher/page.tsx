"use client";

import { useState } from "react";
import { SyllabusChatBot } from "../../components/shared/SyllabusChatBot";
import { TeacherAnalyticsPanel } from "../../components/teacher/TeacherAnalyticsPanel";
import { TeacherKnowledgeBase } from "../../components/teacher/TeacherKnowledgeBase";
import { TeacherPlanner } from "../../components/teacher/TeacherPlanner";

export default function TeacherPage() {
  const [syllabusFileUri, setSyllabusFileUri] = useState<string | null>(null);
  const branchId = "syllabus-main";

  return (
    <main>
      <h1>LearnSync Teacher Workspace</h1>
      <TeacherKnowledgeBase syllabusFileUri={syllabusFileUri} onSyllabusFileUri={setSyllabusFileUri} />
      <SyllabusChatBot syllabusUri={syllabusFileUri} title="Teacher Syllabus Chat" />
      <TeacherPlanner syllabusUri={syllabusFileUri} branchId={branchId} />
      <TeacherAnalyticsPanel />
    </main>
  );
}

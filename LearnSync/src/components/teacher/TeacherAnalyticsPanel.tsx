"use client";

import { useEffect, useMemo, useState } from "react";

type TopicRow = {
  id: string;
  topic: string;
  priority: number;
};

type StudentRow = {
  id: string;
  name: string;
  maths: number;
  science: number;
  english: number;
};

type TopicFrequencyRow = {
  topic: string;
  count: number;
};

type AnalyticsResponse = {
  status: string;
  topTopics: TopicFrequencyRow[];
};

function toPercent(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function gradeFromPercent(percent: number): string {
  if (percent >= 90) return "A+";
  if (percent >= 80) return "A";
  if (percent >= 70) return "B";
  if (percent >= 60) return "C";
  if (percent >= 50) return "D";
  return "Needs Support";
}

export function TeacherAnalyticsPanel() {
  const [topics, setTopics] = useState<TopicRow[]>([
    { id: "t1", topic: "Algebra", priority: 85 },
    { id: "t2", topic: "Trigonometry", priority: 72 },
    { id: "t3", topic: "Calculus", priority: 91 }
  ]);

  const [students, setStudents] = useState<StudentRow[]>([
    { id: "s1", name: "Aarav", maths: 78, science: 82, english: 75 },
    { id: "s2", name: "Diya", maths: 89, science: 92, english: 84 },
    { id: "s3", name: "Rahul", maths: 58, science: 64, english: 61 }
  ]);

  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics");
        if (!response.ok) {
          throw new Error("Failed to load analytics");
        }

        const payload = (await response.json()) as AnalyticsResponse;
        if (!Array.isArray(payload.topTopics) || payload.topTopics.length === 0) {
          return;
        }

        setTopics(
          payload.topTopics.map((item, index) => ({
            id: `analytics-${index}-${item.topic}`,
            topic: item.topic,
            priority: Math.min(100, item.count * 10)
          }))
        );
      } catch (error) {
        setAnalyticsError(error instanceof Error ? error.message : "Analytics unavailable");
      }
    };

    void loadAnalytics();
  }, []);

  const updateTopic = (id: string, patch: Partial<TopicRow>) => {
    setTopics((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const addTopic = () => {
    setTopics((prev) => [
      ...prev,
      {
        id: `t-${Date.now()}`,
        topic: "New Topic",
        priority: 50
      }
    ]);
  };

  const removeTopic = (id: string) => {
    setTopics((prev) => prev.filter((row) => row.id !== id));
  };

  const updateStudent = (id: string, patch: Partial<StudentRow>) => {
    setStudents((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const addStudent = () => {
    setStudents((prev) => [
      ...prev,
      {
        id: `s-${Date.now()}`,
        name: "New Student",
        maths: 0,
        science: 0,
        english: 0
      }
    ]);
  };

  const removeStudent = (id: string) => {
    setStudents((prev) => prev.filter((row) => row.id !== id));
  };

  const reportRows = useMemo(() => {
    return students.map((student) => {
      const average = Math.round((student.maths + student.science + student.english) / 3);
      return {
        ...student,
        average,
        grade: gradeFromPercent(average)
      };
    });
  }, [students]);

  const generateReportCards = () => {
    setGeneratedAt(new Date().toLocaleString());
  };

  return (
    <section>
      <h2>Teacher Analytics and Report Generator</h2>

      <h3>Revision Important Topic Chart</h3>
      <p>Higher priority means a stronger need for revision focus.</p>
      {analyticsError ? <p role="alert">{analyticsError}</p> : null}
      <button type="button" onClick={addTopic}>Add Topic</button>
      {topics.map((topic) => (
        <div key={topic.id}>
          <input
            type="text"
            value={topic.topic}
            onChange={(event) => updateTopic(topic.id, { topic: event.target.value })}
          />
          <input
            type="number"
            min={0}
            max={100}
            value={topic.priority}
            onChange={(event) => updateTopic(topic.id, { priority: toPercent(Number(event.target.value)) })}
          />
          <button type="button" onClick={() => removeTopic(topic.id)}>Remove</button>
          <div style={{ background: "#e5e7eb", height: 10, width: "100%", maxWidth: 420 }}>
            <div
              style={{
                background: "#f97316",
                height: 10,
                width: `${toPercent(topic.priority)}%`
              }}
            />
          </div>
          <p>{toPercent(topic.priority)}% revision priority</p>
        </div>
      ))}

      <h3>Student Marks Entry</h3>
      <button type="button" onClick={addStudent}>Add Student</button>
      {students.map((student) => (
        <div key={student.id}>
          <input
            type="text"
            value={student.name}
            onChange={(event) => updateStudent(student.id, { name: event.target.value })}
          />
          <input
            type="number"
            min={0}
            max={100}
            value={student.maths}
            onChange={(event) => updateStudent(student.id, { maths: toPercent(Number(event.target.value)) })}
          />
          <input
            type="number"
            min={0}
            max={100}
            value={student.science}
            onChange={(event) => updateStudent(student.id, { science: toPercent(Number(event.target.value)) })}
          />
          <input
            type="number"
            min={0}
            max={100}
            value={student.english}
            onChange={(event) => updateStudent(student.id, { english: toPercent(Number(event.target.value)) })}
          />
          <button type="button" onClick={() => removeStudent(student.id)}>Remove</button>
        </div>
      ))}

      <button type="button" onClick={generateReportCards}>Generate Report Cards</button>
      {generatedAt ? <p>Last generated: {generatedAt}</p> : null}

      {generatedAt ? (
        <div>
          <h3>Generated Report Cards</h3>
          {reportRows.map((row) => (
            <article key={row.id}>
              <h4>{row.name}</h4>
              <p>Maths: {row.maths}</p>
              <p>Science: {row.science}</p>
              <p>English: {row.english}</p>
              <p>Average: {row.average}%</p>
              <p>Grade: {row.grade}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

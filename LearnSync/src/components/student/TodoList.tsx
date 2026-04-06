"use client";

import { useLearnSyncContext } from "./LearnSyncProvider";

export function TodoList() {
  const { todoItems } = useLearnSyncContext();

  return (
    <section>
      <h2>Dynamic To-Do</h2>
      <ul>
        {todoItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

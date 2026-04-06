"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

type ChatResponse = {
  reply: string;
};

type Props = {
  syllabusUri: string | null;
  title: string;
};

export function SyllabusChatBot({ syllabusUri, title }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    const question = input.trim();
    if (!question) {
      return;
    }

    if (!syllabusUri) {
      setError("Upload syllabus context before chatting.");
      return;
    }

    setError(null);
    setIsSending(true);
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: question }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: question, syllabusUri })
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const payload = (await response.json()) as ChatResponse;
      setMessages((prev) => [...prev, { role: "assistant", text: payload.reply }]);
    } catch (chatError) {
      setError(chatError instanceof Error ? chatError.message : "Unexpected chat error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section>
      <h2>{title}</h2>
      <p>Chat is grounded on uploaded syllabus context.</p>
      <div>
        {messages.length === 0 ? <p>No messages yet.</p> : null}
        {messages.map((message, index) => (
          <p key={`${message.role}-${index}`}>
            <strong>{message.role === "user" ? "You" : "Tutor"}:</strong> {message.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        placeholder="Ask a question about your syllabus"
        value={input}
        onChange={(event) => setInput(event.target.value)}
      />
      <button type="button" onClick={handleSend} disabled={isSending}>
        {isSending ? "Sending..." : "Send"}
      </button>
      {error ? <p role="alert">{error}</p> : null}
    </section>
  );
}

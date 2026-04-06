"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { useDoubts } from "../../hooks/useDoubts";
import { useTimer } from "../../hooks/useTimer";
import { useLearnSyncContext } from "./LearnSyncProvider";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

type ChatResponse = {
  reply: string;
};

async function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(new Error("Unable to read image"));
    reader.readAsDataURL(file);
  });
}

export function StudyHUD() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [doubtError, setDoubtError] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatError, setChatError] = useState<string | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const { syllabusFileUri, injectRecoveryTask } = useLearnSyncContext();
  const { submitDoubt, hint, topicTag, error, isLoading } = useDoubts();
  const { secondsLeft, isRunning, activeStudents, start, pause, reset } = useTimer(25 * 60, "syllabus-main");

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secondsLeft % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [secondsLeft]);

  const handleImagePick = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedImage(event.target.files?.[0] ?? null);
    setDoubtError(null);
  };

  const handleChatSend = async () => {
    const message = chatInput.trim();
    if (!message) {
      return;
    }

    if (!syllabusFileUri) {
      setChatError("Upload syllabus context in Knowledge Base first.");
      return;
    }

    setChatError(null);
    setIsChatLoading(true);
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", text: message }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message,
          syllabusUri: syllabusFileUri
        })
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const payload = (await response.json()) as ChatResponse;
      setChatMessages((prev) => [...prev, { role: "assistant", text: payload.reply }]);
    } catch (chatRequestError) {
      setChatError(chatRequestError instanceof Error ? chatRequestError.message : "Unexpected chat error");
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSnapDoubt = async () => {
    if (!selectedImage) {
      setDoubtError("Pick an image before using Snap Doubt.");
      return;
    }

    if (!syllabusFileUri) {
      setDoubtError("Upload syllabus context in Knowledge Base first.");
      return;
    }

    setDoubtError(null);
    const imageBase64 = await toBase64(selectedImage);
    const response = await submitDoubt({ imageBase64, syllabusUri: syllabusFileUri });

    if (response?.recovery_task) {
      injectRecoveryTask(response.recovery_task);
    }
  };

  return (
    <section>
      <h2>Study HUD</h2>
      <p>Focus Timer: {formattedTime}</p>
      <p>Peer Pulse: {activeStudents} active students</p>
      <div>
        {!isRunning ? (
          <button type="button" onClick={start}>
            Start
          </button>
        ) : (
          <button type="button" onClick={pause}>
            Pause
          </button>
        )}
        <button type="button" onClick={reset}>
          Reset
        </button>
      </div>

      <div>
        <label htmlFor="doubt-image">Doubt Snapshot</label>
        <input id="doubt-image" type="file" accept="image/*" capture="environment" onChange={handleImagePick} />
        <p>On mobile, this can open camera directly. On desktop, select an image file.</p>
        <button type="button" onClick={handleSnapDoubt} disabled={isLoading}>
          {isLoading ? "Thinking..." : "Snap Doubt"}
        </button>
      </div>

      {hint ? <p>AI Hint: {hint}</p> : null}
      {topicTag ? <p>Topic Tag: {topicTag}</p> : null}
      {error ? <p role="alert">{error}</p> : null}
      {doubtError ? <p role="alert">{doubtError}</p> : null}

      <div>
        <h3>Socratic Chatbot</h3>
        <p>Ask text doubts grounded to your uploaded syllabus.</p>
        {chatMessages.length === 0 ? <p>No chat messages yet.</p> : null}
        {chatMessages.map((message, index) => (
          <p key={`${message.role}-${index}`}>
            <strong>{message.role === "user" ? "You" : "Tutor"}:</strong> {message.text}
          </p>
        ))}
        <input
          type="text"
          value={chatInput}
          placeholder="Ask your doubt in text"
          onChange={(event) => setChatInput(event.target.value)}
        />
        <button type="button" onClick={handleChatSend} disabled={isChatLoading}>
          {isChatLoading ? "Sending..." : "Ask Chatbot"}
        </button>
        {chatError ? <p role="alert">{chatError}</p> : null}
      </div>
    </section>
  );
}

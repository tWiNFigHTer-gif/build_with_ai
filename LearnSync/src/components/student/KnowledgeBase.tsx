"use client";

import { useRef, useState } from "react";
import { useLearnSyncContext } from "./LearnSyncProvider";

type UploadContextResponse = {
  fileUri: string;
};

export function KnowledgeBase() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { syllabusFileUri, setSyllabusFileUri } = useLearnSyncContext();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-context", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Failed to upload syllabus context");
      }

      const payload = (await response.json()) as UploadContextResponse;
      setSyllabusFileUri(payload.fileUri ?? null);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unexpected upload error");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <section>
      <h2>Knowledge Base</h2>
      <p>Upload your latest syllabus so all AI actions stay aligned with your plan.</p>
      <button type="button" onClick={handleUploadClick} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload Syllabus"}
      </button>
      <input ref={fileInputRef} type="file" accept=".pdf,.txt,.md" hidden onChange={handleFileSelection} />
      {syllabusFileUri ? <p>Connected context: {syllabusFileUri}</p> : <p>No syllabus uploaded yet.</p>}
      {error ? <p role="alert">{error}</p> : null}
    </section>
  );
}

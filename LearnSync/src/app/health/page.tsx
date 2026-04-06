"use client";

import { useEffect, useState } from "react";

type HealthPayload = {
  status: "ready" | "degraded";
  checkedAt: string;
  modelProvider: "mock" | "vertex";
  services: {
    realtimeDb: {
      reachable: boolean;
      detail: string;
    };
    firestore: {
      reachable: boolean;
      detail: string;
    };
  };
};

export default function HealthPage() {
  const [payload, setPayload] = useState<HealthPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadHealth = async () => {
    setError(null);
    try {
      const response = await fetch("/api/health", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to load health status");
      }

      const data = (await response.json()) as HealthPayload;
      setPayload(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Health check failed");
    }
  };

  useEffect(() => {
    void loadHealth();
  }, []);

  return (
    <main>
      <h1>LearnSync Health Check</h1>
      <button type="button" onClick={loadHealth}>
        Refresh
      </button>

      {error ? <p role="alert">{error}</p> : null}

      {payload ? (
        <section>
          <p>Overall Status: {payload.status}</p>
          <p>Model Provider: {payload.modelProvider}</p>
          <p>Checked At: {payload.checkedAt}</p>

          <h2>Services</h2>
          <p>Realtime DB: {payload.services.realtimeDb.reachable ? "Reachable" : "Unavailable"}</p>
          <p>Realtime Detail: {payload.services.realtimeDb.detail}</p>
          <p>Firestore: {payload.services.firestore.reachable ? "Reachable" : "Unavailable"}</p>
          <p>Firestore Detail: {payload.services.firestore.detail}</p>
        </section>
      ) : null}
    </main>
  );
}

function readEnv(name: string): string | null {
  const value = process.env[name];
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function getModelProvider(): "mock" | "vertex" | "gemini" {
  const provider = readEnv("MODEL_PROVIDER")?.toLowerCase();
  if (provider === "vertex") return "vertex";
  if (readEnv("GEMINI_API_KEY")) return "gemini";
  return "mock";
}

export function getGeminiApiKey(): string | null {
  return readEnv("GEMINI_API_KEY");
}

export function getVertexConfig() {
  return {
    projectId: readEnv("GCP_PROJECT_ID"),
    location: readEnv("GCP_LOCATION") || "us-central1",
    modelName: readEnv("VERTEX_MODEL_NAME") || "gemini-1.5-flash"
  };
}

export function getFirebasePublicConfig() {
  return {
    apiKey: readEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
    authDomain: readEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    databaseURL: readEnv("NEXT_PUBLIC_FIREBASE_DATABASE_URL"),
    projectId: readEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    storageBucket: readEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: readEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
    appId: readEnv("NEXT_PUBLIC_FIREBASE_APP_ID")
  };
}

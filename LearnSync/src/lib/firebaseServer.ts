import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getDatabase, get as getRealtimeValue, ref as realtimeRef, type Database } from "firebase/database";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  type Firestore
} from "firebase/firestore";
import { getFirebasePublicConfig } from "./env";

type DoubtLogInput = {
  studentId: string;
  topic: string;
  hint: string;
  syllabusUri: string;
  difficulty: number;
};

type TopicFrequency = {
  topic: string;
  count: number;
};

export type BackendHealth = {
  reachable: boolean;
  detail: string;
};

const firebaseConfig = getFirebasePublicConfig();
const hasFirebaseConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

const app: FirebaseApp | null = hasFirebaseConfig
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

const firestore: Firestore | null = app ? getFirestore(app) : null;
const realtimeDb: Database | null = app && firebaseConfig.databaseURL ? getDatabase(app) : null;

export async function logDoubtToFirestore(input: DoubtLogInput): Promise<void> {
  if (!firestore) {
    return;
  }

  await addDoc(collection(firestore, "doubts"), {
    ...input,
    createdAt: serverTimestamp()
  });
}

export async function getTopicFrequency(topN = 8): Promise<TopicFrequency[]> {
  if (!firestore) {
    return [];
  }

  const snapshot = await getDocs(
    query(collection(firestore, "doubts"), orderBy("createdAt", "desc"), limit(250))
  );

  const counts = new Map<string, number>();
  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    const topic = typeof data.topic === "string" ? data.topic : "Unknown";
    counts.set(topic, (counts.get(topic) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

export async function checkRealtimeDbHealth(): Promise<BackendHealth> {
  if (!realtimeDb) {
    return {
      reachable: false,
      detail: "Realtime DB config missing"
    };
  }

  try {
    await getRealtimeValue(realtimeRef(realtimeDb, "pulse"));
    return {
      reachable: true,
      detail: "Realtime DB reachable"
    };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Realtime DB check failed";
    return {
      reachable: false,
      detail
    };
  }
}

export async function checkFirestoreHealth(): Promise<BackendHealth> {
  if (!firestore) {
    return {
      reachable: false,
      detail: "Firestore config missing"
    };
  }

  try {
    await getDocs(query(collection(firestore, "doubts"), limit(1)));
    return {
      reachable: true,
      detail: "Firestore reachable"
    };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Firestore check failed";
    return {
      reachable: false,
      detail
    };
  }
}

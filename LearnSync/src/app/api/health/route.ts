import { NextResponse } from "next/server";
import { getModelProvider } from "../../../lib/env";
import { checkFirestoreHealth, checkRealtimeDbHealth } from "../../../lib/firebaseServer";

export async function GET() {
  const [realtimeDb, firestore] = await Promise.all([checkRealtimeDbHealth(), checkFirestoreHealth()]);

  return NextResponse.json(
    {
      status: realtimeDb.reachable && firestore.reachable ? "ready" : "degraded",
      checkedAt: new Date().toISOString(),
      modelProvider: getModelProvider(),
      services: {
        realtimeDb,
        firestore
      }
    },
    { status: 200 }
  );
}

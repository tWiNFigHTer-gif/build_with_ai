import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
	getDatabase,
	ref,
	onValue,
	onDisconnect,
	runTransaction,
	set,
	update,
	get,
	type Database,
	type DatabaseReference
} from "firebase/database";

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const hasFirebaseConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.databaseURL);

const app: FirebaseApp | null = hasFirebaseConfig
	? getApps().length > 0
		? getApp()
		: initializeApp(firebaseConfig)
	: null;

const db: Database | null = app ? getDatabase(app) : null;

export type BranchLiveStats = {
	activeStudents: number;
	totalStudySeconds: number;
};

type SessionNode = {
	active?: boolean;
	studySeconds?: number;
};

export function getActiveStudentCountRef(branchId: string): DatabaseReference | null {
	if (!db) {
		return null;
	}

	return ref(db, `pulse/${branchId}/sessions`);
}

export function subscribeToActiveStudentCount(
	branchId: string,
	onCount: (count: number) => void
): (() => void) {
	const countRef = getActiveStudentCountRef(branchId);
	if (!countRef) {
		onCount(0);
		return () => undefined;
	}

	return onValue(countRef, (snapshot) => {
		const sessions = snapshot.val();
		if (!sessions || typeof sessions !== "object") {
			onCount(0);
			return;
		}

		const activeCount = Object.values(sessions as Record<string, SessionNode | boolean>).filter((session) => {
			if (typeof session === "boolean") {
				return session;
			}
			return Boolean(session?.active);
		}).length;

		onCount(activeCount);
	});
}

export async function joinActivePulse(branchId: string, sessionId: string): Promise<(() => Promise<void>) | null> {
	if (!db) {
		return null;
	}

	const connectionRef = ref(db, `pulse/${branchId}/sessions/${sessionId}`);
	await runTransaction(connectionRef, (currentValue) => {
		if (currentValue && typeof currentValue === "object") {
			return {
				...currentValue,
				active: true,
				lastUpdatedAt: Date.now()
			};
		}

		return {
			active: true,
			studySeconds: 0,
			lastUpdatedAt: Date.now()
		};
	});

	onDisconnect(connectionRef).update({
		active: false,
		lastUpdatedAt: Date.now()
	});

	return async () => {
		await update(connectionRef, {
			active: false,
			lastUpdatedAt: Date.now()
		});
	};
}

export async function updateSessionStudySeconds(
	branchId: string,
	sessionId: string,
	studySeconds: number
): Promise<void> {
	if (!db) {
		return;
	}

	const connectionRef = ref(db, `pulse/${branchId}/sessions/${sessionId}`);
	const snapshot = await get(connectionRef);
	if (!snapshot.exists()) {
		await set(connectionRef, {
			active: false,
			studySeconds,
			lastUpdatedAt: Date.now()
		});
		return;
	}

	await update(connectionRef, {
		studySeconds,
		lastUpdatedAt: Date.now()
	});
}

export function subscribeToBranchLiveStats(
	branchId: string,
	onStats: (stats: BranchLiveStats) => void
): (() => void) {
	const sessionRef = getActiveStudentCountRef(branchId);
	if (!sessionRef) {
		onStats({ activeStudents: 0, totalStudySeconds: 0 });
		return () => undefined;
	}

	return onValue(sessionRef, (snapshot) => {
		const sessions = snapshot.val() as Record<string, SessionNode | boolean> | null;
		if (!sessions || typeof sessions !== "object") {
			onStats({ activeStudents: 0, totalStudySeconds: 0 });
			return;
		}

		let activeStudents = 0;
		let totalStudySeconds = 0;

		Object.values(sessions).forEach((session) => {
			if (typeof session === "boolean") {
				if (session) {
					activeStudents += 1;
				}
				return;
			}

			if (session.active) {
				activeStudents += 1;
			}

			if (typeof session.studySeconds === "number") {
				totalStudySeconds += session.studySeconds;
			}
		});

		onStats({ activeStudents, totalStudySeconds });
	});
}

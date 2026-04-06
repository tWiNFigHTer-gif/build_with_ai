"use client";

import { useEffect, useRef, useState } from "react";
import { joinActivePulse, subscribeToActiveStudentCount, updateSessionStudySeconds } from "../lib/firebase";

function getOrCreateSessionId() {
	if (typeof window === "undefined") {
		return `server-${Math.random().toString(36).slice(2)}`;
	}

	const storageKey = "learnsync-session-id";
	const existing = window.sessionStorage.getItem(storageKey);
	if (existing) {
		return existing;
	}

	const generated = `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
	window.sessionStorage.setItem(storageKey, generated);
	return generated;
}

export function useTimer(initialSeconds = 1500, branchId = "default-branch") {
	const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
	const [isRunning, setIsRunning] = useState(false);
	const [activeStudents, setActiveStudents] = useState(0);
	const [studySeconds, setStudySeconds] = useState(0);
	const cleanupPulseRef = useRef<null | (() => Promise<void>)>(null);
	const sessionIdRef = useRef<string>(getOrCreateSessionId());

	useEffect(() => {
		const unsubscribe = subscribeToActiveStudentCount(branchId, setActiveStudents);
		return unsubscribe;
	}, [branchId]);

	useEffect(() => {
		if (!isRunning) {
			return;
		}

		const timerId = window.setInterval(() => {
			setSecondsLeft((previous) => {
				if (previous <= 1) {
					window.clearInterval(timerId);
					setIsRunning(false);
					return 0;
				}

				setStudySeconds((current) => current + 1);
				return previous - 1;
			});
		}, 1000);

		return () => window.clearInterval(timerId);
	}, [isRunning]);

	useEffect(() => {
		let cancelled = false;

		const attachPulse = async () => {
			if (!isRunning || cleanupPulseRef.current) {
				return;
			}

			const cleanup = await joinActivePulse(branchId, sessionIdRef.current);
			if (cancelled) {
				await cleanup?.();
				return;
			}

			cleanupPulseRef.current = cleanup;
		};

		const detachPulse = async () => {
			if (isRunning || !cleanupPulseRef.current) {
				return;
			}

			await cleanupPulseRef.current();
			cleanupPulseRef.current = null;
		};

		void attachPulse();
		void detachPulse();

		return () => {
			cancelled = true;
		};
	}, [isRunning, branchId]);

	useEffect(() => {
		void updateSessionStudySeconds(branchId, sessionIdRef.current, studySeconds);
	}, [branchId, studySeconds]);

	useEffect(() => {
		return () => {
			if (cleanupPulseRef.current) {
				void cleanupPulseRef.current();
				cleanupPulseRef.current = null;
			}
		};
	}, []);

	const start = () => setIsRunning(true);
	const pause = () => setIsRunning(false);
	const reset = () => {
		setIsRunning(false);
		setSecondsLeft(initialSeconds);
		setStudySeconds(0);
	};

	return {
		secondsLeft,
		isRunning,
		activeStudents,
		studySeconds,
		start,
		pause,
		reset
	};
}

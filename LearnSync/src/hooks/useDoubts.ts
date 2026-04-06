"use client";

import { useState } from "react";

type DoubtResponse = {
	hint: string;
	topic: string;
	topicTag?: string;
	difficulty: number;
	recovery_task?: string;
};

export function useDoubts() {
	const [isLoading, setIsLoading] = useState(false);
	const [hint, setHint] = useState<string | null>(null);
	const [topicTag, setTopicTag] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const submitDoubt = async ({ imageBase64, syllabusUri }: { imageBase64: string; syllabusUri: string }) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/doubt", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					image: imageBase64,
					syllabusUri
				})
			});

			if (!response.ok) {
				throw new Error("Doubt processing failed");
			}

			const payload = (await response.json()) as DoubtResponse;
			setHint(payload.hint ?? null);
			setTopicTag(payload.topicTag ?? payload.topic ?? null);

			return payload;
		} catch (submissionError) {
			setError(submissionError instanceof Error ? submissionError.message : "Failed to process doubt");
			return null;
		} finally {
			setIsLoading(false);
		}
	};

	return {
		submitDoubt,
		hint,
		topicTag,
		error,
		isLoading
	};
}

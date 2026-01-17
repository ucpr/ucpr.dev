/**
 * Chrome Summarizer API ユーティリティ
 * Chrome 138+ で利用可能な組み込みAI機能
 */

const MAX_INPUT_LENGTH = 4000;

export async function checkSummarizerAvailability(): Promise<boolean> {
	if (typeof window === "undefined") {
		return false;
	}

	if (!("Summarizer" in window)) {
		return false;
	}

	try {
		const availability = await Summarizer.availability({
			type: "tldr",
			format: "plain-text",
			length: "short",
			expectedInputLanguages: ["ja", "en"],
			outputLanguage: "ja",
		});
		return availability === "available" || availability === "downloadable";
	} catch {
		return false;
	}
}

export async function summarizeStreaming(
	text: string,
	onChunk: (text: string) => void,
	signal?: AbortSignal,
): Promise<void> {
	const truncatedText = text.slice(0, MAX_INPUT_LENGTH);

	const summarizer = await Summarizer.create({
		type: "tldr",
		format: "plain-text",
		length: "medium",
		expectedInputLanguages: ["ja", "en"],
		outputLanguage: "ja",
		sharedContext:
			"技術ブログ記事の要約です。以下の3点を含めてください：1. 記事が解決しようとしている課題、2. 課題に対するアプローチや手法、3. 得られた結果や学び",
	});

	try {
		const stream = summarizer.summarizeStreaming(truncatedText, { signal });
		const reader = stream.getReader();
		let accumulated = "";

		while (true) {
			if (signal?.aborted) {
				await reader.cancel();
				break;
			}

			const { done, value } = await reader.read();
			if (done) break;
			if (value) {
				accumulated += value;
				onChunk(accumulated);
			}
		}
	} finally {
		summarizer.destroy();
	}
}

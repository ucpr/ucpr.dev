"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";
import {
	checkSummarizerAvailability,
	summarizeStreaming,
} from "@/lib/summarizer";

interface ArticleSummaryProps {
	content: string;
}

const ArticleSummary: FC<ArticleSummaryProps> = ({ content }) => {
	const [isAvailable, setIsAvailable] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [summary, setSummary] = useState("");
	const [error, setError] = useState<string | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	useEffect(() => {
		checkSummarizerAvailability().then(setIsAvailable);
	}, []);

	const handleSummarize = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		setSummary("");

		abortControllerRef.current = new AbortController();

		try {
			await summarizeStreaming(
				content,
				(text) => {
					setSummary(text);
				},
				abortControllerRef.current.signal,
			);
		} catch (err) {
			if (err instanceof Error && err.name === "AbortError") {
				return;
			}
			setError("要約の生成に失敗しました");
			console.error("Summarization error:", err);
		} finally {
			setIsLoading(false);
			abortControllerRef.current = null;
		}
	}, [content]);

	const handleCancel = useCallback(() => {
		abortControllerRef.current?.abort();
		setIsLoading(false);
	}, []);

	if (!isAvailable) {
		return null;
	}

	return (
		<div className="article-summary mb-8 p-4 rounded-lg">
			{!summary && !isLoading && (
				<button
					type="button"
					onClick={handleSummarize}
					className="article-summary-button flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm border border-current/20"
				>
					<span>AI で要約する</span>
				</button>
			)}

			{isLoading && !summary && (
				<div className="flex items-center gap-2 opacity-70">
					<span className="animate-pulse">要約を生成中...</span>
					<button
						type="button"
						onClick={handleCancel}
						className="ml-auto px-3 py-1 text-sm rounded border border-current/30 transition-opacity hover:opacity-70"
					>
						キャンセル
					</button>
				</div>
			)}

			{summary && (
				<div>
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm opacity-70">AI による要約</span>
						{isLoading && (
							<button
								type="button"
								onClick={handleCancel}
								className="px-3 py-1 text-sm rounded border border-current/30 transition-opacity hover:opacity-70"
							>
								キャンセル
							</button>
						)}
					</div>
					<p className="leading-relaxed">{summary}</p>
				</div>
			)}

			{error && <p className="text-red-500 text-sm">{error}</p>}
		</div>
	);
};

export default ArticleSummary;

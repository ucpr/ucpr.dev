"use client";

import { FC, useCallback, useEffect, useState } from "react";
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
	const [isExpanded, setIsExpanded] = useState(false);
	const [summary, setSummary] = useState("");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		checkSummarizerAvailability().then(setIsAvailable);
	}, []);

	const handleSummarize = useCallback(async () => {
		setIsExpanded(true);
		setIsLoading(true);
		setError(null);
		setSummary("");

		try {
			await summarizeStreaming(content, (text) => {
				setSummary(text);
			});
		} catch (err) {
			setError("要約の生成に失敗しました");
			console.error("Summarization error:", err);
		} finally {
			setIsLoading(false);
		}
	}, [content]);

	if (!isAvailable) {
		return null;
	}

	return (
		<div className="mb-8">
			<div
				className={`article-summary inline-block rounded-lg transition-all duration-500 ease-out ${
					isExpanded ? "w-full p-4" : "p-0"
				}`}
			>
				{!isExpanded && (
					<button
						type="button"
						onClick={handleSummarize}
						className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm hover:bg-current/10"
					>
						<span>🤖</span>
						<span>AI で要約する</span>
						<span>✨</span>
					</button>
				)}

				{isExpanded && (
					<div
						className={`transition-opacity duration-300 ${
							summary || isLoading ? "opacity-100" : "opacity-0"
						}`}
					>
						{isLoading && !summary && (
							<div className="flex items-center gap-2 opacity-80">
								<span className="animate-pulse">🤖 要約を生成中... ✨</span>
							</div>
						)}

						{summary && (
							<div>
								<div className="mb-2">
									<span className="text-sm opacity-80">🤖 AI による要約 ✨</span>
								</div>
								<p className="leading-relaxed mb-0">{summary}</p>
							</div>
						)}

						{error && <p className="text-red-500 text-sm">{error}</p>}
					</div>
				)}
			</div>
		</div>
	);
};

export default ArticleSummary;

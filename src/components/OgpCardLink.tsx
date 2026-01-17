"use client";

import React, { FC, useEffect, useState } from "react";
import Link from "next/link";

interface OgpCardLinkProps {
	url: string;
	title?: string;
}

interface OgpData {
	title: string;
	description: string;
	image: string;
	favicon: string;
	siteName: string;
}

export const OgpCardLink: FC<OgpCardLinkProps> = ({ url, title }) => {
	const [ogpData, setOgpData] = useState<OgpData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// URLからドメイン名を取得
	const getDomain = (urlString: string): string => {
		try {
			return new URL(urlString).hostname;
		} catch {
			return urlString;
		}
	};

	useEffect(() => {
		const fetchOgpData = async () => {
			try {
				setIsLoading(true);
				const response = await fetch(
					`https://ogpinfo.ucpr.workers.dev/ogp?url=${encodeURIComponent(url)}`,
				);

				if (!response.ok) {
					throw new Error("OGPデータの取得に失敗しました");
				}

				const data = await response.json();
				setOgpData(data);
			} catch (err) {
				console.error("OGPデータの取得エラー:", err);
				setError(
					err instanceof Error ? err.message : "不明なエラーが発生しました",
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchOgpData();
	}, [url]);

	if (isLoading) {
		return (
			<div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 my-4 animate-pulse">
				<div className="flex justify-between items-start gap-4">
					<div className="flex-1 min-w-0">
						<div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
						<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
						<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-3"></div>
					</div>
					<div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0"></div>
				</div>
			</div>
		);
	}

	if (error || !ogpData) {
		return (
			<Link
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="block bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 my-4 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors no-underline"
			>
				<div className="font-bold text-gray-900 dark:text-gray-100 pb-2 mb-2 border-b border-gray-200 dark:border-gray-600">
					{title || url}
				</div>
				<div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
					<span>{getDomain(url)}</span>
				</div>
			</Link>
		);
	}

	return (
		<Link
			href={url}
			target="_blank"
			rel="noopener noreferrer"
			className="block bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 my-4 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors no-underline"
		>
			<div className="flex justify-between items-start gap-4">
				<div className="flex-1 min-w-0">
					<div className="font-bold text-gray-900 dark:text-gray-100 line-clamp-2 pb-2 mb-2 border-b border-gray-200 dark:border-gray-600">
						{ogpData.title || title || "タイトルなし"}
					</div>
					{ogpData.description && (
						<p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-2">
							{ogpData.description}
						</p>
					)}
					<div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
						{ogpData.favicon && (
							<img
								src={ogpData.favicon}
								alt=""
								width={16}
								height={16}
								className="mr-2 rounded-sm"
							/>
						)}
						<span>{getDomain(url)}</span>
					</div>
				</div>
				{ogpData.image && (
					<div className="flex-shrink-0">
						<img
							src={ogpData.image}
							alt=""
							className="w-24 h-24 object-cover rounded-lg"
						/>
					</div>
				)}
			</div>
		</Link>
	);
};

export default OgpCardLink;

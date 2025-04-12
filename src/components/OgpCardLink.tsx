"use client";

import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

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

	useEffect(() => {
		const fetchOgpData = async () => {
			try {
				setIsLoading(true);
				// OGPデータを取得するAPIを呼び出す
				// 実際の実装では、OGPデータを取得するためのAPIエンドポイントを用意する必要があります
				// この例では、フロントエンドでの表示のみを考慮しています
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
			<div className="bg-gray-100 p-4 rounded-md animate-pulse my-4">
				<div className="h-24 bg-gray-300 rounded-md mb-2"></div>
				<div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
				<div className="h-4 bg-gray-300 rounded w-1/2"></div>
			</div>
		);
	}

	if (error || !ogpData) {
		return (
			<Link
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="text-blue-500 hover:underline"
			>
				{title || url}
			</Link>
		);
	}

	return (
		<Link
			href={url}
			target="_blank"
			rel="noopener noreferrer"
			className="block border border-gray-200 rounded-md overflow-hidden my-4 hover:shadow-md transition-shadow duration-200"
		>
			<div className="flex flex-col md:flex-row">
				{ogpData.image && (
					<div className="md:w-1/3 h-48 md:h-auto relative">
						<Image
							src={ogpData.image}
							alt={ogpData.title || ""}
							fill
							style={{ objectFit: "cover" }}
							sizes="(max-width: 768px) 100vw, 33vw"
						/>
					</div>
				)}
				<div className="p-4 flex-1">
					<h3 className="text-lg font-bold mb-2 line-clamp-2">
						{ogpData.title || title || "タイトルなし"}
					</h3>
					{ogpData.description && (
						<p className="text-gray-600 mb-2 text-sm line-clamp-2">
							{ogpData.description}
						</p>
					)}
					<div className="flex items-center text-xs text-gray-500">
						{ogpData.favicon && (
							<Image
								src={ogpData.favicon}
								alt=""
								width={16}
								height={16}
								className="mr-2"
							/>
						)}
						<span>{ogpData.siteName || new URL(url).hostname}</span>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default OgpCardLink;

import { FC } from "react";
import Image from "next/image";

export interface CardLinkProps {
	title: string;
	url: string;
	description?: string;
	image?: string;
	favicon?: string;
	siteName?: string;
}

/**
 * カードリンクコンポーネント
 *
 * リンク先の情報をカード形式で表示します
 */
const CardLink: FC<CardLinkProps> = ({
	title,
	url,
	description,
	image,
	favicon,
	siteName,
}) => {
	// URLのドメイン部分を抽出
	const domain = new URL(url).hostname.replace("www.", "");

	return (
		<div className="card-link my-6 overflow-hidden border border-gray-700 rounded-lg hover:border-blue-500 transition-colors bg-gray-900/50">
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="flex flex-col md:flex-row"
			>
				{/* 画像エリア */}
				{image && (
					<div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
						<div className="w-full h-full relative">
							<Image
								src={image}
								alt={title}
								className="object-cover"
								fill
								sizes="(max-width: 768px) 100vw, 33vw"
							/>
						</div>
					</div>
				)}

				{/* コンテンツエリア */}
				<div
					className={`flex-1 p-4 flex flex-col justify-between ${!image ? "md:flex-row" : ""}`}
				>
					<div className="flex-1">
						{/* タイトル */}
						<h3 className="text-lg font-medium text-blue-500 dark:text-blue-400 mb-2 line-clamp-2">
							{title}
						</h3>

						{/* 説明文 */}
						{description && (
							<p className="text-sm text-gray-300 mb-3 line-clamp-2">
								{description}
							</p>
						)}

						{/* ドメイン表示 */}
						<div className="flex items-center text-xs text-gray-500 mt-auto">
							{favicon && (
								<div className="mr-2 w-4 h-4 relative overflow-hidden flex-shrink-0">
									<Image
										src={favicon}
										alt={siteName || domain}
										width={16}
										height={16}
										className="object-contain"
									/>
								</div>
							)}
							<span>{siteName || domain}</span>
						</div>
					</div>

					{/* 外部リンクアイコン */}
					{!image && (
						<div className="ml-4 text-gray-400 flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="currentColor"
								className="w-5 h-5"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
								/>
							</svg>
						</div>
					)}
				</div>
			</a>
		</div>
	);
};

export default CardLink;

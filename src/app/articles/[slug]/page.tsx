import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllArticles, getArticleBySlug } from "@/utils/article";
import { format } from "date-fns";
import Link from "next/link";
import "dayjs/locale/ja";
import ArticleContent from "@/components/ArticleContent";

import "highlight.js/styles/github-dark.css";
import { highlightCodeBlocks } from "@/utils/syntax-highlighter";

export async function generateStaticParams() {
	const articles = await getAllArticles();
	return articles.map((article) => ({
		slug: article.slug,
	}));
}

export async function generateMetadata({
	params,
}: {
	params: { slug: string };
}): Promise<Metadata> {
	const article = await getArticleBySlug(params.slug);
	if (!article) return {};
	return {
		title: `${article.title} | ucpr.dev`,
		description: article.description,
	};
}

/**
 * テキストコンテンツを整形する
 */
function formatContent(content: string): string {
	const lines = content.split("\n");
	let formattedContent = "";
	let inCodeBlock = false;
	let codeBlockContent = "";
	let codeBlockLang = "";
	let foundFirstHeading = false;
	let inList = false;
	let listType = ""; // "ul" または "ol"
	let listContent = "";
	let listIndentLevel = 0;

	// テキスト行の装飾を処理する関数
	const formatTextLine = (text: string): string => {
		return text
			.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // 太字
			.replace(/\*(.*?)\*/g, "<em>$1</em>") // 斜体
			.replace(
				/\[\[カードOGP:(.*?)\]\]\(([^)]+)\)/g,
				'<div data-ogp-card-link data-title="$1" data-url="$2"></div>',
			)
			.replace(
				/\[\[カード:(.*?)\]\]\(([^)]+)\)/g,
				'<div class="card-link my-4 p-4 border border-gray-700 rounded-lg hover:border-blue-500 transition-colors"><a href="$2" target="_blank" rel="noopener noreferrer" class="flex items-center"><div class="flex-1"><div class="text-blue-500 dark:text-blue-400 font-medium mb-1">$1</div><div class="text-sm text-gray-500 truncate">$2</div></div><div class="ml-4 text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg></div></a></div>',
			)
			.replace(
				/\[([^\]]+)\]\(([^)]+)\)/g,
				'<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 dark:text-blue-400 underline hover:text-blue-600 dark:hover:text-blue-300 transition-colors">$1</a>',
			); // リンク
	};

	// 見出しを処理する関数
	const processHeading = (line: string): { content: string; skip: boolean } => {
		if (line.startsWith("# ")) {
			// 最初の見出しはスキップ（タイトルとして別途表示するため）
			if (!foundFirstHeading) {
				foundFirstHeading = true;
				return { content: "", skip: true };
			}
			return { content: `<h1>${line.substring(2)}</h1>\n`, skip: false };
		}
		if (line.startsWith("## ")) {
			return { content: `<h2>${line.substring(3)}</h2>\n`, skip: false };
		}
		if (line.startsWith("### ")) {
			return { content: `<h3>${line.substring(4)}</h3>\n`, skip: false };
		}
		if (line.startsWith("#### ")) {
			return { content: `<h4>${line.substring(5)}</h4>\n`, skip: false };
		}
		return { content: "", skip: false };
	};

	// アラートブロックのスタイルを取得する関数
	const getAlertStyle = (alertType: string): { className: string } => {
		switch (alertType) {
			case "note":
				return { className: "bg-gray-50 border-blue-500" };
			case "tip":
				return { className: "bg-gray-50 border-purple-500" };
			case "important":
				return { className: "bg-gray-50 border-indigo-500" };
			case "warning":
				return { className: "bg-gray-50 border-yellow-500" };
			case "caution":
				return { className: "bg-gray-50 border-red-500" };
			default:
				return { className: "bg-gray-50 border-gray-500" };
		}
	};

	// アラートブロックを処理する関数
	const processAlertBlock = (
		line: string,
		currentIndex: number,
	): { content: string; newIndex: number } => {
		const match = line.match(/> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/);
		if (!match) return { content: "", newIndex: currentIndex };

		const alertType = match[1].toLowerCase();
		let alertContent = "";
		let i2 = currentIndex + 1;

		// アラートの内容を収集
		while (i2 < lines.length && lines[i2].trim().startsWith(">")) {
			// '> ' の後の内容を追加
			alertContent += lines[i2].replace(/^>\s?/, "") + "\n";
			i2++;
		}

		// アラートコンテンツを処理
		alertContent = formatTextLine(alertContent.trim());
		const { className } = getAlertStyle(alertType);

		// アラートHTML生成
		const alertHtml = `<div class="alert ${className} p-4 my-4 border-l-4 rounded-r">
			<div class="flex">
				<div>
					<div class="font-bold mb-1">${alertType.toUpperCase()}</div>
					<div>${alertContent}</div>
				</div>
			</div>
		</div>\n`;

		return { content: alertHtml, newIndex: i2 - 1 };
	};

	// リスト行を処理する関数
	const processListItem = (
		line: string,
	): {
		isListItem: boolean;
		type: string;
		content: string;
		indentLevel: number;
	} => {
		// 箇条書きリスト（Unordered List）
		const ulMatch = line.match(/^(\s*)[-*] (.+)$/);
		if (ulMatch) {
			const indentLevel = Math.floor(ulMatch[1].length / 2);
			return {
				isListItem: true,
				type: "ul",
				content: formatTextLine(ulMatch[2]),
				indentLevel,
			};
		}

		// 番号付きリスト（Ordered List）
		const olMatch = line.match(/^(\s*)(\d+)\. (.+)$/);
		if (olMatch) {
			const indentLevel = Math.floor(olMatch[1].length / 2);
			return {
				isListItem: true,
				type: "ol",
				content: formatTextLine(olMatch[3]),
				indentLevel,
			};
		}

		return { isListItem: false, type: "", content: "", indentLevel: 0 };
	};

	// リストを完了する関数
	const finalizeList = (): string => {
		if (!inList) return "";

		inList = false;
		// リストタイプに応じたスタイルを適用
		const listClasses =
			listType === "ul"
				? "list-disc pl-5 my-4 space-y-2"
				: "list-decimal pl-5 my-4 space-y-2";
		const result = `<${listType} class="${listClasses}">${listContent}</${listType}>\n`;
		listContent = "";
		listType = "";
		listIndentLevel = 0;
		return result;
	};

	// 各行を処理
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		// コードブロックの開始を処理
		if (line.trim().startsWith("```") && !inCodeBlock) {
			// リストの途中でコードブロックが始まった場合、リストを閉じる
			if (inList) {
				formattedContent += finalizeList();
			}

			inCodeBlock = true;
			codeBlockLang = line.trim().substring(3).trim();
			codeBlockContent = "";
			continue;
		}

		// コードブロックの終了を処理
		if (line.trim() === "```" && inCodeBlock) {
			inCodeBlock = false;
			// codeBlockContentはhighlightCodeBlocks関数で処理されるので、特殊な形式でマークしておく
			formattedContent += `<pre data-lang="${codeBlockLang}" class="code-block">${codeBlockContent}</pre>\n`;
			continue;
		}

		// コードブロック内の行を処理
		if (inCodeBlock) {
			codeBlockContent += line + "\n";
			continue;
		}

		// リスト項目の処理
		const listItemResult = processListItem(line);
		if (listItemResult.isListItem) {
			// リスト項目を検出

			// まだリスト内でない、または異なるタイプのリストが始まる場合
			if (!inList || listType !== listItemResult.type) {
				// 以前のリストがあれば閉じる
				if (inList) {
					formattedContent += finalizeList();
				}

				// 新しいリストを開始
				inList = true;
				listType = listItemResult.type;
				listIndentLevel = listItemResult.indentLevel;
				listContent = `<li>${listItemResult.content}</li>`;
			} else {
				// 既存のリストに項目を追加
				listContent += `<li>${listItemResult.content}</li>`;
			}
			continue;
		}

		// 非リスト行に到達した場合、リストを終了
		if (inList && line.trim() !== "") {
			formattedContent += finalizeList();
		}

		// 見出しの処理
		const headingResult = processHeading(line);
		if (headingResult.content || headingResult.skip) {
			if (headingResult.content) formattedContent += headingResult.content;
			continue;
		}

		// アラートブロックの処理
		if (
			line.trim().startsWith("> [!NOTE]") ||
			line.trim().startsWith("> [!TIP]") ||
			line.trim().startsWith("> [!IMPORTANT]") ||
			line.trim().startsWith("> [!WARNING]") ||
			line.trim().startsWith("> [!CAUTION]")
		) {
			const alertResult = processAlertBlock(line, i);
			if (alertResult.content) {
				formattedContent += alertResult.content;
				i = alertResult.newIndex;
				continue;
			}
		}

		// 空行の処理
		if (line.trim() === "") {
			// リスト内の空行は無視（リストを終了しない）
			if (!inList) {
				formattedContent += "<p></p>\n";
			}
			continue;
		}

		// 通常のテキスト行を処理
		formattedContent += `<p>${formatTextLine(line)}</p>\n`;
	}

	// 文書の最後にリストが閉じられていない場合は閉じる
	if (inList) {
		formattedContent += finalizeList();
	}

	return formattedContent;
}

export default async function ArticlePage({
	params,
}: {
	params: { slug: string };
}) {
	const article = await getArticleBySlug(params.slug);
	if (!article) notFound();

	// コンテンツの整形
	const formattedContent = formatContent(article.content);

	// シンタックスハイライトの適用
	const highlightedContent = await highlightCodeBlocks(formattedContent);

	return (
		<main className="container mx-auto px-4 py-8 max-w-3xl">
			<article className="prose prose-invert max-w-none">
				<h1 className="text-3xl font-bold mb-4">{article.title}</h1>
				<div className="text-gray-400 mb-4">
					{format(new Date(article.publishedAt), "yyyy年MM月dd日")}
				</div>
				<div className="flex space-x-2 mb-8">
					{article.tags.map((tag: string) => (
						<Link
							key={tag}
							href={`/tags/${tag}`}
							className="rounded-lg py-1 text-s transition-colors border border-gray-700 hover:bg-gray-200 hover:border-gray-600 px-2 text-sm"
						>
							{tag}
						</Link>
					))}
				</div>

				<ArticleContent content={highlightedContent} />
			</article>
		</main>
	);
}

import * as shiki from "shiki";
import type { Highlighter } from "shiki";

// ハイライターのインスタンスをキャッシュ
let highlighter: Highlighter | null = null;

/**
 * Shikiハイライターを初期化して返す
 */
export async function getShikiHighlighter(): Promise<Highlighter> {
	if (!highlighter) {
		highlighter = await shiki.createHighlighter({
			themes: ["github-dark"],
			langs: [
				"typescript",
				"javascript",
				"jsx",
				"tsx",
				"bash",
				"css",
				"html",
				"json",
				"markdown",
				"yaml",
			],
		});
	}
	return highlighter;
}

/**
 * HTMLの特殊文字をエスケープする
 */
function escapeHtml(html: string): string {
	return html
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

/**
 * コードをシンタックスハイライトする
 */
export async function highlightCode(
	code: string,
	lang: string = "typescript",
): Promise<string> {
	try {
		const highlighter = await getShikiHighlighter();
		return highlighter.codeToHtml(code, {
			lang,
			theme: "github-dark",
		});
	} catch (error) {
		console.error("Failed to highlight code:", error);
		// エラー時は元のコードをエスケープして返す
		return `<pre class="shiki-error"><code>${escapeHtml(code)}</code></pre>`;
	}
}

/**
 * マークダウン内のコードブロックにシンタックスハイライトを適用
 */
export async function highlightCodeBlocks(content: string): Promise<string> {
	// formatContent関数で追加されたpre要素を検出する正規表現
	const codeBlockRegex =
		/<pre data-lang="([^"]*)" class="code-block">([\s\S]*?)<\/pre>/g;

	let result = content;
	let match;
	const promises: Promise<void>[] = [];
	const replacements: [string, string][] = [];

	// すべてのコードブロックを見つけてハイライト処理
	while ((match = codeBlockRegex.exec(content)) !== null) {
		const [fullMatch, lang, code] = match;

		// ハイライト処理を非同期で行い、結果を保存
		const promise = (async () => {
			const highlighted = await highlightCode(code, lang || "text");
			replacements.push([fullMatch, highlighted]);
		})();

		promises.push(promise);
	}

	// すべてのハイライト処理が完了するのを待つ
	await Promise.all(promises);

	// 置換を実行
	for (const [original, highlighted] of replacements) {
		result = result.replace(original, highlighted);
	}

	return result;
}

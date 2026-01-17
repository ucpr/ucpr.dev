import * as shiki from "shiki";
import type { Highlighter } from "shiki";

// シングルトンインスタンスをキャッシュ
let highlighter: Highlighter | null = null;

/**
 * Shikiハイライターのシングルトンインスタンスを取得する
 * シングルトンパターンを使用してインスタンスを一度だけ作成する
 */
export async function getSingletonHighlighter(): Promise<Highlighter> {
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
				"go",
				"rust",
				"python",
				"java",
				"js",
				"cpp",
				"c",
				"php",
				"ruby",
				"swift",
				"kotlin",
				"dart",
				"sql",
				"shell",
				"powershell",
				"xml",
				"toml",
				"tf",
				"hcl",
				"lua",
			],
		});
	}
	return highlighter;
}

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";

// カスタム remark プラグイン
import { remarkSkipFirstH1 } from "./plugins/remark/remarkSkipFirstH1";
import { remarkGithubAlerts } from "./plugins/remark/remarkGithubAlerts";
import { remarkCardLinks } from "./plugins/remark/remarkCardLinks";
import { remarkImageCaption } from "./plugins/remark/remarkImageCaption";

// カスタム rehype プラグイン
import { rehypeShiki } from "./plugins/rehype/rehypeShiki";
import { rehypeTailwindClasses } from "./plugins/rehype/rehypeTailwindClasses";
import { rehypeFootnoteStyles } from "./plugins/rehype/rehypeFootnoteStyles";
import { rehypeTableWrapper } from "./plugins/rehype/rehypeTableWrapper";

/**
 * Markdown を HTML に変換する
 *
 * 処理パイプライン:
 * 1. remark-parse: Markdown を mdast (Markdown AST) にパース
 * 2. remark-gfm: GFM 拡張（テーブル、取り消し線、オートリンク、タスクリスト、脚注）
 * 3. カスタム remark プラグイン:
 *    - remarkSkipFirstH1: 最初の h1 をスキップ
 *    - remarkGithubAlerts: GitHub スタイルのアラート
 *    - remarkCardLinks: カードリンク記法
 *    - remarkImageCaption: 画像キャプション
 * 4. remark-rehype: mdast を hast (HTML AST) に変換
 * 5. rehype-raw: 生の HTML を許可
 * 6. カスタム rehype プラグイン:
 *    - rehypeShiki: Shiki でシンタックスハイライト
 *    - rehypeTailwindClasses: Tailwind クラスを付与
 *    - rehypeFootnoteStyles: 脚注にスタイルを適用
 *    - rehypeTableWrapper: テーブルをラッパーで囲む
 * 7. rehype-stringify: hast を HTML 文字列に変換
 */
export async function processMarkdown(content: string): Promise<string> {
	const result = await unified()
		// Markdown をパース
		.use(remarkParse)
		// GFM サポート
		.use(remarkGfm)
		// カスタム remark プラグイン（順序重要）
		.use(remarkSkipFirstH1)
		.use(remarkGithubAlerts)
		.use(remarkCardLinks)
		.use(remarkImageCaption)
		// mdast を hast に変換
		.use(remarkRehype, { allowDangerousHtml: true })
		// 生の HTML を許可
		.use(rehypeRaw)
		// カスタム rehype プラグイン
		.use(rehypeShiki)
		.use(rehypeTailwindClasses)
		.use(rehypeFootnoteStyles)
		.use(rehypeTableWrapper)
		// HTML 文字列に変換
		.use(rehypeStringify, { allowDangerousHtml: true })
		.process(content);

	return String(result);
}

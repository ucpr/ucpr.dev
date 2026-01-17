import { visit } from "unist-util-visit";
import type { Root, Paragraph, Link, Html, Text } from "mdast";

/**
 * 段落内に単独のリンクがある場合、OGPカードとして表示するプラグイン
 * 標準GFMリンク [title](url) が段落内に単独で存在する場合に適用
 */
export function remarkCardLinks() {
	return (tree: Root) => {
		visit(tree, "paragraph", (node: Paragraph, index, parent) => {
			if (!parent || index === undefined) return;

			// リスト内（listItem）の場合はスキップ
			if (parent.type === "listItem") return;

			// 段落が単一のリンクのみを含む場合をチェック
			// リンクの前後に空白テキストがある場合も許容
			const children = node.children.filter((child) => {
				if (child.type === "text") {
					return (child as Text).value.trim() !== "";
				}
				return true;
			});

			if (children.length === 1 && children[0].type === "link") {
				const link = children[0] as Link;
				const url = link.url;

				// 内部リンク（#で始まる）やローカルリンク（/で始まる）はスキップ
				if (url.startsWith("#") || url.startsWith("/")) {
					return;
				}

				// リンクテキストを取得
				const title = extractLinkText(link);

				// OGPカードとして表示
				const htmlNode: Html = {
					type: "html",
					value: `<div data-ogp-card-link data-title="${escapeHtml(title)}" data-url="${escapeHtml(url)}"></div>`,
				};
				parent.children[index] = htmlNode;
			}
		});
	};
}

function extractLinkText(link: Link): string {
	return link.children
		.map((child) => {
			if (child.type === "text") {
				return (child as Text).value;
			}
			return "";
		})
		.join("");
}

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

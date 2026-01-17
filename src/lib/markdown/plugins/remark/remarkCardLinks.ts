import { visit } from "unist-util-visit";
import type { Root, Paragraph, Text, Html } from "mdast";

/**
 * カードリンク記法を処理するプラグイン
 * - [[カードOGP:title]](url) → OGP カードリンク
 * - [[カード:title]](url) → シンプルカードリンク
 */
export function remarkCardLinks() {
	return (tree: Root) => {
		visit(tree, "paragraph", (node: Paragraph, index, parent) => {
			if (!parent || index === undefined) return;

			// 段落が1つのテキストノードのみを持つ場合
			if (node.children.length === 1 && node.children[0].type === "text") {
				const text = (node.children[0] as Text).value.trim();

				// OGP カードパターン
				const ogpMatch = text.match(/^\[\[カードOGP:(.*?)\]\]\(([^)]+)\)$/);
				if (ogpMatch) {
					const [, title, url] = ogpMatch;
					const htmlNode: Html = {
						type: "html",
						value: `<div data-ogp-card-link data-title="${escapeHtml(title)}" data-url="${escapeHtml(url)}"></div>`,
					};
					parent.children[index] = htmlNode;
					return;
				}

				// シンプルカードパターン
				const cardMatch = text.match(/^\[\[カード:(.*?)\]\]\(([^)]+)\)$/);
				if (cardMatch) {
					const [, title, url] = cardMatch;
					const htmlNode: Html = {
						type: "html",
						value: generateSimpleCardHtml(title, url),
					};
					parent.children[index] = htmlNode;
					return;
				}
			}

			// 段落内にカードリンクが含まれている場合も処理
			for (let i = 0; i < node.children.length; i++) {
				const child = node.children[i];
				if (child.type !== "text") continue;

				const text = (child as Text).value;

				// OGP カードをインラインで検出
				const ogpInlineMatch = text.match(
					/\[\[カードOGP:(.*?)\]\]\(([^)]+)\)/,
				);
				if (ogpInlineMatch) {
					const [fullMatch, title, url] = ogpInlineMatch;
					const before = text.slice(0, ogpInlineMatch.index);
					const after = text.slice(
						(ogpInlineMatch.index || 0) + fullMatch.length,
					);

					const newChildren: any[] = [];
					if (before) newChildren.push({ type: "text", value: before });
					newChildren.push({
						type: "html",
						value: `<div data-ogp-card-link data-title="${escapeHtml(title)}" data-url="${escapeHtml(url)}"></div>`,
					});
					if (after) newChildren.push({ type: "text", value: after });

					node.children.splice(i, 1, ...newChildren);
					return;
				}

				// シンプルカードをインラインで検出
				const cardInlineMatch = text.match(/\[\[カード:(.*?)\]\]\(([^)]+)\)/);
				if (cardInlineMatch) {
					const [fullMatch, title, url] = cardInlineMatch;
					const before = text.slice(0, cardInlineMatch.index);
					const after = text.slice(
						(cardInlineMatch.index || 0) + fullMatch.length,
					);

					const newChildren: any[] = [];
					if (before) newChildren.push({ type: "text", value: before });
					newChildren.push({
						type: "html",
						value: generateSimpleCardHtml(title, url),
					});
					if (after) newChildren.push({ type: "text", value: after });

					node.children.splice(i, 1, ...newChildren);
					return;
				}
			}
		});
	};
}

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

function generateSimpleCardHtml(title: string, url: string): string {
	return `<div class="card-link my-4 p-4 border border-gray-700 rounded-lg hover:border-blue-500 transition-colors">
	<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="flex items-center">
		<div class="flex-1">
			<div class="text-blue-500 dark:text-blue-400 font-medium mb-1">${escapeHtml(title)}</div>
			<div class="text-sm text-gray-500 truncate">${escapeHtml(url)}</div>
		</div>
		<div class="ml-4 text-gray-400">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
			</svg>
		</div>
	</a>
</div>`;
}

import { visit } from "unist-util-visit";
import type { Root, Image, Html } from "mdast";

/**
 * 画像キャプションを処理するプラグイン
 * ![alt](src "caption") → <figure><img/><figcaption></figure>
 */
export function remarkImageCaption() {
	return (tree: Root) => {
		visit(tree, "image", (node: Image, index, parent) => {
			if (!parent || index === undefined) return;

			// title がある場合はキャプションとして扱う
			if (node.title) {
				const caption = processCaption(node.title);
				const htmlNode: Html = {
					type: "html",
					value: `<figure class="my-6">
	<img src="${escapeHtml(node.url)}" alt="${escapeHtml(node.alt || "")}" class="max-w-full h-auto rounded-lg shadow-md mx-auto" loading="lazy" />
	<figcaption class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">${caption}</figcaption>
</figure>`,
				};
				parent.children[index] = htmlNode;
			} else {
				// キャプションがない場合は通常の画像として処理（クラス付き）
				const htmlNode: Html = {
					type: "html",
					value: `<img src="${escapeHtml(node.url)}" alt="${escapeHtml(node.alt || "")}" class="my-6 max-w-full h-auto rounded-lg shadow-md mx-auto" loading="lazy" />`,
				};
				parent.children[index] = htmlNode;
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

function processCaption(caption: string): string {
	// キャプション内のリンク記法を処理
	return caption.replace(
		/\[([^\]]+)\]\(([^)]+)\)/g,
		'<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 dark:text-blue-400 underline hover:text-blue-600 dark:hover:text-blue-300 transition-colors">$1</a>',
	);
}

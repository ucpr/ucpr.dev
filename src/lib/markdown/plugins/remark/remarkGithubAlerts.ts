import { visit } from "unist-util-visit";
import type { Root, Blockquote, Paragraph, Text, Html } from "mdast";

const ALERT_STYLES: Record<string, string> = {
	NOTE: "bg-gray-50 dark:bg-gray-800 border-blue-500",
	TIP: "bg-gray-50 dark:bg-gray-800 border-purple-500",
	IMPORTANT: "bg-gray-50 dark:bg-gray-800 border-indigo-500",
	WARNING: "bg-gray-50 dark:bg-gray-800 border-yellow-500",
	CAUTION: "bg-gray-50 dark:bg-gray-800 border-red-500",
};

/**
 * GitHub スタイルのアラートブロックを処理するプラグイン
 * > [!NOTE], > [!TIP], > [!IMPORTANT], > [!WARNING], > [!CAUTION]
 */
export function remarkGithubAlerts() {
	return (tree: Root) => {
		visit(tree, "blockquote", (node: Blockquote, index, parent) => {
			if (!parent || index === undefined) return;

			const firstChild = node.children[0];
			if (firstChild?.type !== "paragraph") return;

			const paragraph = firstChild as Paragraph;
			const firstText = paragraph.children[0];
			if (firstText?.type !== "text") return;

			const text = firstText as Text;
			const match = text.value.match(
				/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\n?/,
			);
			if (!match) return;

			const alertType = match[1];
			const className = ALERT_STYLES[alertType];

			// アラートマーカーを削除
			text.value = text.value.replace(match[0], "");

			// 空になった場合は段落から削除
			if (text.value === "" && paragraph.children.length > 1) {
				paragraph.children.shift();
			}

			// blockquote の内容を HTML に変換
			const contentParts: string[] = [];
			for (const child of node.children) {
				if (child.type === "paragraph") {
					const para = child as Paragraph;
					const textParts = para.children
						.map((c) => {
							if (c.type === "text") return escapeHtml((c as Text).value);
							if (c.type === "strong")
								return `<strong>${escapeHtml(extractText(c))}</strong>`;
							if (c.type === "emphasis")
								return `<em>${escapeHtml(extractText(c))}</em>`;
							if (c.type === "inlineCode")
								return `<code class="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded font-mono text-sm">${escapeHtml((c as any).value)}</code>`;
							if (c.type === "link")
								return `<a href="${(c as any).url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 dark:text-blue-300 underline hover:text-blue-600 dark:hover:text-blue-300 transition-colors">${escapeHtml(extractText(c))}</a>`;
							return "";
						})
						.join("");
					contentParts.push(textParts);
				}
			}

			const alertHtml: Html = {
				type: "html",
				value: `<div class="alert ${className} rounded p-4 my-4 border-l-4">
	<div class="flex">
		<div>
			<div class="font-bold mb-1">${alertType}</div>
			<div>${contentParts.join("<br>")}</div>
		</div>
	</div>
</div>`,
			};

			parent.children[index] = alertHtml;
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

function extractText(node: any): string {
	if (node.type === "text") return node.value;
	if (node.children) {
		return node.children.map(extractText).join("");
	}
	return "";
}

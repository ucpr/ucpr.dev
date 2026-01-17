import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import type { Root, Element } from "hast";
import { getSingletonHighlighter } from "@/utils/syntax-highlighter";

/**
 * Shiki を使ったシンタックスハイライトプラグイン
 * ```lang:filename 形式でファイル名を指定可能
 */
export function rehypeShiki() {
	return async (tree: Root) => {
		const highlighter = await getSingletonHighlighter();
		const nodesToReplace: Array<{
			index: number;
			parent: Element | Root;
			html: string;
		}> = [];

		visit(tree, "element", (node: Element, index, parent) => {
			if (
				node.tagName !== "pre" ||
				index === undefined ||
				!parent ||
				(parent.type !== "element" && parent.type !== "root")
			) {
				return;
			}

			const codeNode = node.children.find(
				(child): child is Element =>
					child.type === "element" && child.tagName === "code",
			);

			if (!codeNode) return;

			const className = codeNode.properties?.className as string[] | undefined;
			const langClass =
				className?.find(
					(c) => typeof c === "string" && c.startsWith("language-"),
				) || "";
			const langWithFilename = langClass.replace("language-", "") || "text";

			// lang:filename 形式を解析
			const [lang, filename] = langWithFilename.includes(":")
				? langWithFilename.split(":")
				: [langWithFilename, null];

			const code = toString(codeNode).trimEnd();

			try {
				const highlighted = highlighter.codeToHtml(code, {
					lang: lang || "text",
					theme: "github-dark",
				});

				// ファイル名がある場合はタイトルバーを追加
				let html = highlighted;
				if (filename) {
					html = `<div class="code-block-wrapper">
	<div class="code-block-title">${escapeHtml(filename)}</div>
	${highlighted}
</div>`;
				}

				nodesToReplace.push({
					index,
					parent: parent as Element | Root,
					html,
				});
			} catch (error) {
				console.error(`Failed to highlight code with lang: ${lang}`, error);
			}
		});

		// ノードを置換（後ろから処理してインデックスのずれを防ぐ）
		for (const { index, parent, html } of nodesToReplace.reverse()) {
			const rawNode: any = {
				type: "raw",
				value: html,
			};
			parent.children[index] = rawNode;
		}
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

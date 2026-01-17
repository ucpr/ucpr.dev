import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import type { Root, Element } from "hast";
import { getSingletonHighlighter } from "@/utils/syntax-highlighter";

/**
 * Shiki を使ったシンタックスハイライトプラグイン
 * 既存の syntax-highlighter.ts を再利用
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
			const lang =
				className
					?.find((c) => typeof c === "string" && c.startsWith("language-"))
					?.replace("language-", "") || "text";
			const code = toString(codeNode).trimEnd();

			try {
				const highlighted = highlighter.codeToHtml(code, {
					lang,
					theme: "github-dark",
				});

				nodesToReplace.push({
					index,
					parent: parent as Element | Root,
					html: highlighted,
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

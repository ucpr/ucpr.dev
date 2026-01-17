import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";

/**
 * remark-gfm が生成する脚注にスタイルを適用するプラグイン
 */
export function rehypeFootnoteStyles() {
	return (tree: Root) => {
		visit(tree, "element", (node: Element) => {
			// 脚注参照 (sup 内の a タグ)
			if (
				node.tagName === "sup" &&
				node.properties?.dataFootnoteRef !== undefined
			) {
				const existing = (node.properties.className as string[]) || [];
				node.properties.className = [...existing, "text-xs"];

				// 内部の a タグにスタイルを適用
				visit(node, "element", (child: Element) => {
					if (child.tagName === "a") {
						const childExisting = (child.properties?.className as string[]) || [];
						child.properties = child.properties || {};
						child.properties.className = [
							...childExisting,
							"text-blue-500",
							"dark:text-blue-400",
							"hover:underline",
						];
					}
				});
			}

			// 脚注セクション
			if (
				node.tagName === "section" &&
				node.properties?.dataFootnotes !== undefined
			) {
				const existing = (node.properties.className as string[]) || [];
				node.properties.className = [
					...existing,
					"footnotes",
					"text-sm",
					"text-gray-600",
					"dark:text-gray-400",
					"mt-8",
					"pt-8",
					"border-t",
					"border-gray-300",
					"dark:border-gray-600",
				];
			}

			// 脚注リスト
			if (node.tagName === "ol" && node.properties?.dataFootnoteBackref) {
				const existing = (node.properties.className as string[]) || [];
				node.properties.className = [...existing, "list-none", "pl-0"];
			}

			// 脚注リストアイテム
			if (node.tagName === "li" && node.properties?.id?.toString().startsWith("user-content-fn-")) {
				const existing = (node.properties.className as string[]) || [];
				node.properties.className = [...existing, "my-2"];
			}

			// 戻るリンク
			if (
				node.tagName === "a" &&
				node.properties?.dataFootnoteBackref !== undefined
			) {
				const existing = (node.properties.className as string[]) || [];
				node.properties.className = [
					...existing,
					"text-blue-500",
					"dark:text-blue-400",
					"hover:underline",
					"ml-1",
				];
			}
		});
	};
}

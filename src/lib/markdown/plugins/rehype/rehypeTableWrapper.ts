import { visit, SKIP } from "unist-util-visit";
import type { Root, Element } from "hast";

/**
 * テーブルをレスポンシブラッパーで囲むプラグイン
 */
export function rehypeTableWrapper() {
	return (tree: Root) => {
		visit(tree, "element", (node: Element, index, parent) => {
			if (
				node.tagName !== "table" ||
				index === undefined ||
				!parent ||
				(parent.type !== "element" && parent.type !== "root")
			) {
				return;
			}

			// 既にラッパーで囲まれている場合はスキップ
			if (
				parent.type === "element" &&
				(parent as Element).properties?.className?.toString().includes("overflow-x-auto")
			) {
				return;
			}

			// ラッパー div を作成
			const wrapper: Element = {
				type: "element",
				tagName: "div",
				properties: {
					className: ["overflow-x-auto", "my-4"],
				},
				children: [node],
			};

			// テーブルをラッパーで置換
			(parent as Element | Root).children[index] = wrapper;

			// 子要素を再度走査しない
			return SKIP;
		});
	};
}

import { visit, SKIP } from "unist-util-visit";
import type { Root, Heading } from "mdast";

/**
 * 最初の h1 見出しをスキップするプラグイン
 * 記事タイトルは別途表示されるため、本文中の最初の h1 は削除する
 */
export function remarkSkipFirstH1() {
	let foundFirst = false;

	return (tree: Root) => {
		foundFirst = false;
		visit(tree, "heading", (node: Heading, index, parent) => {
			if (node.depth === 1 && !foundFirst && parent && index !== undefined) {
				foundFirst = true;
				parent.children.splice(index, 1);
				return [SKIP, index];
			}
		});
	};
}

import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";

const CLASS_MAP: Record<string, string[]> = {
	a: [
		"text-blue-500",
		"dark:text-blue-400",
		"underline",
		"hover:text-blue-600",
		"dark:hover:text-blue-300",
		"transition-colors",
	],
	ul: ["list-disc", "pl-5", "my-4", "space-y-2"],
	ol: ["list-decimal", "pl-5", "my-4", "space-y-2"],
	blockquote: [
		"border-l-4",
		"border-gray-500",
		"rounded",
		"bg-gray-50",
		"dark:bg-gray-800",
		"pl-4",
		"py-2",
		"my-4",
		"italic",
		"text-gray-700",
		"dark:text-gray-300",
	],
	hr: ["my-8", "border-t", "border-gray-700"],
	table: ["min-w-full", "border-collapse", "table-auto"],
	th: [
		"border",
		"border-gray-300",
		"dark:border-gray-600",
		"px-4",
		"py-2",
		"bg-gray-100",
		"dark:bg-gray-800",
	],
	td: [
		"border",
		"border-gray-300",
		"dark:border-gray-600",
		"px-4",
		"py-2",
		"dark:bg-gray-900",
	],
	del: ["line-through"],
};

/**
 * 各 HTML 要素に Tailwind クラスを付与するプラグイン
 */
export function rehypeTailwindClasses() {
	return (tree: Root) => {
		visit(tree, "element", (node: Element, index, parent) => {
			const tagName = node.tagName;

			// a タグの target と rel 属性を設定
			if (tagName === "a") {
				const href = node.properties?.href as string | undefined;
				// 外部リンクの場合のみ target="_blank" を設定
				if (href && !href.startsWith("/") && !href.startsWith("#")) {
					node.properties = node.properties || {};
					node.properties.target = "_blank";
					node.properties.rel = "noopener noreferrer";
				}
			}

			// code タグは pre 内かどうかで分岐
			if (tagName === "code") {
				// 親が pre の場合はスキップ（Shiki でスタイリング済み）
				if (
					parent &&
					parent.type === "element" &&
					(parent as Element).tagName === "pre"
				) {
					return;
				}
				// インラインコードの場合
				const existing = (node.properties?.className as string[]) || [];
				node.properties = node.properties || {};
				node.properties.className = [
					...existing,
					"bg-gray-200",
					"dark:bg-gray-700",
					"px-1.5",
					"py-0.5",
					"rounded",
					"font-mono",
					"text-sm",
				];
				return;
			}

			// その他の要素
			const classes = CLASS_MAP[tagName];
			if (classes) {
				const existing = (node.properties?.className as string[]) || [];
				node.properties = node.properties || {};
				node.properties.className = [...existing, ...classes];
			}
		});
	};
}

import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import type { Root, Element } from "hast";
import { getSingletonHighlighter } from "@/utils/syntax-highlighter";

/**
 * 言語名から devicon クラス名へのマッピング
 */
const LANG_ICON_MAP: Record<string, string> = {
	typescript: "devicon-typescript-plain colored",
	ts: "devicon-typescript-plain colored",
	javascript: "devicon-javascript-plain colored",
	js: "devicon-javascript-plain colored",
	jsx: "devicon-react-original colored",
	tsx: "devicon-react-original colored",
	bash: "devicon-bash-plain",
	shell: "devicon-bash-plain",
	css: "devicon-css3-plain colored",
	html: "devicon-html5-plain colored",
	json: "devicon-json-plain colored",
	markdown: "devicon-markdown-original",
	md: "devicon-markdown-original",
	yaml: "devicon-yaml-plain colored",
	yml: "devicon-yaml-plain colored",
	go: "devicon-go-original-wordmark colored",
	rust: "devicon-rust-original",
	python: "devicon-python-plain colored",
	py: "devicon-python-plain colored",
	java: "devicon-java-plain colored",
	cpp: "devicon-cplusplus-plain colored",
	"c++": "devicon-cplusplus-plain colored",
	c: "devicon-c-plain colored",
	php: "devicon-php-plain colored",
	ruby: "devicon-ruby-plain colored",
	rb: "devicon-ruby-plain colored",
	swift: "devicon-swift-plain colored",
	kotlin: "devicon-kotlin-plain colored",
	kt: "devicon-kotlin-plain colored",
	dart: "devicon-dart-plain colored",
	sql: "devicon-azuresqldatabase-plain colored",
	powershell: "devicon-powershell-plain colored",
	xml: "devicon-xml-plain colored",
	tf: "devicon-terraform-plain colored",
	hcl: "devicon-terraform-plain colored",
	terraform: "devicon-terraform-plain colored",
	lua: "devicon-lua-plain colored",
	docker: "devicon-docker-plain colored",
	dockerfile: "devicon-docker-plain colored",
	graphql: "devicon-graphql-plain colored",
	vue: "devicon-vuejs-plain colored",
	svelte: "devicon-svelte-plain colored",
	nginx: "devicon-nginx-original colored",
	redis: "devicon-redis-plain colored",
	postgresql: "devicon-postgresql-plain colored",
	mysql: "devicon-mysql-plain colored",
};

/**
 * 言語名から devicon アイコンの HTML を取得
 */
function getLanguageIcon(lang: string): string {
	const iconClass = LANG_ICON_MAP[lang.toLowerCase()];
	if (iconClass) {
		return `<i class="${iconClass}"></i>`;
	}
	return "";
}

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
					const icon = getLanguageIcon(lang || "");
					const iconHtml = icon ? `${icon} ` : "";
					html = `<div class="code-block-wrapper">
	<div class="code-block-title">${iconHtml}${escapeHtml(filename)}</div>
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

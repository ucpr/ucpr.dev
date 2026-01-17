import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import type { Root, Element } from "hast";
import { getSingletonHighlighter } from "@/utils/syntax-highlighter";
import * as simpleIcons from "simple-icons";

type SimpleIcon = {
	title: string;
	slug: string;
	svg: string;
	path: string;
	hex: string;
};

/**
 * 言語名から simple-icons のアイコンキーへのマッピング
 */
const LANG_ICON_MAP: Record<string, string> = {
	typescript: "siTypescript",
	ts: "siTypescript",
	javascript: "siJavascript",
	js: "siJavascript",
	jsx: "siReact",
	tsx: "siReact",
	bash: "siGnubash",
	shell: "siGnubash",
	css: "siCss3",
	html: "siHtml5",
	json: "siJson",
	markdown: "siMarkdown",
	md: "siMarkdown",
	yaml: "siYaml",
	yml: "siYaml",
	go: "siGo",
	rust: "siRust",
	python: "siPython",
	py: "siPython",
	java: "siOpenjdk",
	cpp: "siCplusplus",
	"c++": "siCplusplus",
	c: "siC",
	php: "siPhp",
	ruby: "siRuby",
	rb: "siRuby",
	swift: "siSwift",
	kotlin: "siKotlin",
	kt: "siKotlin",
	dart: "siDart",
	sql: "siMysql",
	powershell: "siPowershell",
	xml: "siXml",
	tf: "siTerraform",
	hcl: "siTerraform",
	terraform: "siTerraform",
	lua: "siLua",
	docker: "siDocker",
	dockerfile: "siDocker",
	graphql: "siGraphql",
	vue: "siVuedotjs",
	svelte: "siSvelte",
	nginx: "siNginx",
	redis: "siRedis",
	postgresql: "siPostgresql",
	mysql: "siMysql",
	toml: "siToml",
};

/**
 * 言語名から SVG アイコンの HTML を取得
 */
function getLanguageIcon(lang: string): string {
	const iconKey = LANG_ICON_MAP[lang.toLowerCase()];
	if (!iconKey) {
		return "";
	}

	const icon = (simpleIcons as Record<string, SimpleIcon>)[iconKey];
	if (!icon) {
		return "";
	}

	// SVGをインラインで埋め込み（サイズとカラーを調整）
	return `<svg role="img" viewBox="0 0 24 24" width="16" height="16" fill="#${icon.hex}" style="vertical-align: middle;"><path d="${icon.path}"/></svg>`;
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

				// ヘッダーを追加（ファイル名がある場合はファイル名、なければ言語名を表示）
				const icon = getLanguageIcon(lang || "");
				const iconHtml = icon ? `${icon} ` : "";
				const titleText = filename
					? escapeHtml(filename)
					: lang && lang !== "text"
						? lang
						: "";
				const encodedCode = escapeHtml(code);

				const html = `<div class="code-block-wrapper">
	<div class="code-block-header">
		<div class="code-block-title">${iconHtml}${titleText}</div>
		<button class="code-copy-button" data-code="${encodedCode}" aria-label="Copy code">
			<svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
			<svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
		</button>
	</div>
	${highlighted}
</div>`;

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

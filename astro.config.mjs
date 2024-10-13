import { defineConfig } from "astro/config";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import remarkToc from "remark-toc";
import mdx from "@astrojs/mdx";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import {
	transformerNotationDiff,
	transformerNotationFocus,
	transformerMetaHighlight,
} from "@shikijs/transformers";
import cloudflare from "@astrojs/cloudflare";

import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
	integrations: [
		solidJs(),
		tailwind(),
		mdx(),
		partytown({
			config: {
				forward: ["dataLayer.push"],
			},
		}),
	],
	site: "https://ucpr.dev",
	output: "server",
	trailingSlash: "never",
	build: {
		format: "file",
	},
	markdown: {
		remarkPlugins: [
			[
				remarkToc,
				{
					heading: "contents",
				},
			],
		],
		rehypePlugins: [rehypeHeadingIds],
		shikiConfig: {
			// https://github.com/shikijs/shiki/blob/main/docs/themes.md
			theme: "one-dark-pro",
			// https://github.com/shikijs/shiki/blob/main/docs/languages.md
			langs: [],
			wrap: false,
			transformers: [
				transformerNotationDiff,
				transformerNotationFocus,
				transformerMetaHighlight,
			],
		},
	},
	adapter: cloudflare(),
	devOptions: {
		tailwindConfig: "./tailwind.config.js",
	},
});

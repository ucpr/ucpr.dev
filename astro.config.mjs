import { defineConfig } from "astro/config";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

import remarkToc from "remark-toc";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
	integrations: [solidJs(), tailwind()],
	output: "server",
	markdown: {
		remarkPlugins: [[remarkToc, { heading: "contents" }]],
		rehypePlugins: [rehypeHeadingIds],
		shikiConfig: {
			// https://github.com/shikijs/shiki/blob/main/docs/themes.md
			theme: "one-dark-pro",
			// https://github.com/shikijs/shiki/blob/main/docs/languages.md
			langs: [],
			wrap: true,
		},
	},
	adapter: cloudflare(),
});

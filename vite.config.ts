import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";

export default defineConfig({
	plugins: [
		solid(),
	],
	build: {
		target: "esnext",
	},
});
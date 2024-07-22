import * as fs from "fs";
import * as path from "path";
import { formatISO } from "date-fns";

function createMarkdownFile(
	directory: string,
	fileName: string,
	template: string,
) {
	const filePath = path.join(directory, fileName);

	if (!fs.existsSync(directory)) {
		console.error(`Directory not found: ${directory}`);
		return 1;
	}
  if (fs.existsSync(filePath)) {
    console.error(`File already exists at ${filePath}`);
    process.exit(1);
  }

	fs.writeFileSync(filePath, template, "utf8");
	console.log(`File created at ${filePath}`);
}

const template = `---
isDraft: true
slug: "example"
title: "Test Article"
description: "Test Description"
date: "${formatISO(new Date())}"
tags: ["test"]
---

## はじめに

This is a new markdown file created with a template.

## 前提

## おわりに

## 参考
`;

function main() {
	const args = process.argv.slice(2);
	if (args.length === 0) {
		console.error("Please provide a file name as a command-line argument.");
		process.exit(1);
	}

	const fileName = args[0];
	if (!(fileName.endsWith(".md") || fileName.endsWith(".mdx"))) {
		console.error("File name must end with .md or .mdx. actual: ", fileName);
		process.exit(1);
	}
	const directory = "./src/content/articles/";

	createMarkdownFile(directory, fileName, template);
}

main();

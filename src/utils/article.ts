import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type Article = {
	slug: string;
	title: string;
	description: string;
	content: string;
	publishedAt: string;
	date: string; // 表示用の日付
	tags: string[]; // タグのリスト
};

const articlesDirectory = path.join(process.cwd(), "content", "articles");

/**
 * すべての記事を取得
 */
export async function getAllArticles(): Promise<Article[]> {
	try {
		// ディレクトリが存在しない場合は空の配列を返す
		if (!fs.existsSync(articlesDirectory)) {
			console.warn("記事ディレクトリが存在しません:", articlesDirectory);
			return [];
		}

		const fileNames = fs.readdirSync(articlesDirectory);

		const allArticlesData = fileNames
			.filter((fileName) => fileName.endsWith(".md"))
			.map((fileName) => {
				// ファイル名からスラッグを取得
				const slug = fileName.replace(/\.md$/, "");

				// マークダウンファイルを文字列として読み取る
				const fullPath = path.join(articlesDirectory, fileName);
				const fileContents = fs.readFileSync(fullPath, "utf8");

				// gray-matterを使用してフロントマターの解析
				const matterResult = matter(fileContents);

				return {
					slug,
					title: matterResult.data.title || "",
					description: matterResult.data.description || "",
					content: matterResult.content,
					publishedAt:
						matterResult.data.publishedAt || new Date().toISOString(),
					date: matterResult.data.date || new Date().toISOString(),
					tags: matterResult.data.tags || [],
				};
			})
			.sort(
				(a, b) =>
					new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
			);

		return allArticlesData;
	} catch (error) {
		console.error("記事の取得中にエラーが発生しました:", error);
		return [];
	}
}

/**
 * スラッグから特定の記事を取得
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
	try {
		const fullPath = path.join(articlesDirectory, `${slug}.md`);

		// ファイルが存在しない場合はnullを返す
		if (!fs.existsSync(fullPath)) {
			return null;
		}

		const fileContents = fs.readFileSync(fullPath, "utf8");
		const matterResult = matter(fileContents);

		return {
			slug,
			title: matterResult.data.title || "",
			description: matterResult.data.description || "",
			content: matterResult.content,
			publishedAt: matterResult.data.publishedAt || new Date().toISOString(),
			date: matterResult.data.date || new Date().toISOString(),
			tags: matterResult.data.tags || [],
		};
	} catch (error) {
		console.error(`記事 ${slug} の取得中にエラーが発生しました:`, error);
		return null;
	}
}

/**
 * 特定のタグを持つすべての記事を取得
 */
export async function getArticlesByTag(tag: string): Promise<Article[]> {
	const allArticles = await getAllArticles();
	return allArticles.filter((article) =>
		article.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
	);
}

/**
 * すべてのタグを取得
 */
export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
	const articles = await getAllArticles();

	// すべての記事からタグを収集
	const tagMap = new Map<string, number>();

	articles.forEach((article) => {
		article.tags.forEach((tag) => {
			const normalizedTag = tag.toLowerCase();
			tagMap.set(normalizedTag, (tagMap.get(normalizedTag) || 0) + 1);
		});
	});

	// タグと記事数の配列に変換
	return Array.from(tagMap.entries())
		.map(([tag, count]) => ({ tag, count }))
		.sort((a, b) => b.count - a.count); // 記事数が多い順にソート
}

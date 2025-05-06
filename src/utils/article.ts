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
	isExternal?: boolean; // 外部プラットフォームの記事かどうか
	url?: string; // 外部プラットフォームの記事の場合のURL
	platform?: string; // 外部プラットフォーム名（zenn, qiitaなど）
	noindex?: boolean; // インデックスしないかどうか
};

const articlesDirectory = path.join(process.cwd(), "content", "articles");
const externalArticlesPath = path.join(
	process.cwd(),
	"content",
	"external-articles.json",
);

/**
 * すべての記事を取得
 */
export async function getAllArticles(): Promise<Article[]> {
	try {
		// ローカルの記事を取得
		let localArticles: Article[] = [];

		// ディレクトリが存在しない場合は空の配列を返す
		if (fs.existsSync(articlesDirectory)) {
			const fileNames = fs.readdirSync(articlesDirectory);

			localArticles = fileNames
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
						isExternal: false,
						noindex: matterResult.data.noindex || false,
					};
				});
		}

		// 外部記事を取得
		let externalArticles: Article[] = [];

		if (fs.existsSync(externalArticlesPath)) {
			const externalArticlesContent = fs.readFileSync(
				externalArticlesPath,
				"utf8",
			);
			const externalArticlesData = JSON.parse(externalArticlesContent);

			externalArticles = externalArticlesData.articles.map((article: any) => {
				// 外部記事のスラッグをURLから生成
				const slug = `external-${article.platform}-${Buffer.from(article.url).toString("base64").slice(0, 8)}`;

				return {
					slug,
					title: article.title,
					description: article.description || "",
					content: "", // 外部記事の場合はcontentは空
					publishedAt: article.publishedAt,
					date: new Date(article.publishedAt).toISOString(),
					tags: article.tags || [],
					isExternal: true,
					url: article.url,
					platform: article.platform,
					noindex: article.noindex || false,
				};
			});
		}

		// ローカル記事と外部記事を結合し、日付でソート
		const allArticles = [...localArticles, ...externalArticles].sort(
			(a, b) =>
				new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
		);

		return allArticles;
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
		// 外部記事かどうかを判断
		if (slug.startsWith("external-")) {
			// 外部記事の情報を取得
			if (fs.existsSync(externalArticlesPath)) {
				const externalArticlesContent = fs.readFileSync(
					externalArticlesPath,
					"utf8",
				);
				const externalArticlesData = JSON.parse(externalArticlesContent);

				// 全ての外部記事からマッチするものを検索
				for (const article of externalArticlesData.articles) {
					const articleSlug = `external-${article.platform}-${Buffer.from(article.url).toString("base64").slice(0, 8)}`;

					if (articleSlug === slug) {
						return {
							slug,
							title: article.title,
							description: article.description || "",
							content: "", // 外部記事の場合はcontentは空
							publishedAt: article.publishedAt,
							date: new Date(article.publishedAt).toISOString(),
							tags: article.tags || [],
							isExternal: true,
							url: article.url,
							platform: article.platform,
							noindex: article.noindex || false,
						};
					}
				}
			}

			return null;
		}

		// ローカル記事の処理（既存のコード）
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
			isExternal: false,
			noindex: matterResult.data.noindex || false,
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
	const tagMap = new Map<string, { originalTag: string; count: number }>();

	articles.forEach((article) => {
		if (!article.tags) return;

		article.tags.forEach((tag) => {
			if (!tag) return;

			const normalizedTag = tag.toLowerCase();
			const existing = tagMap.get(normalizedTag);

			if (existing) {
				tagMap.set(normalizedTag, {
					originalTag: existing.originalTag,
					count: existing.count + 1,
				});
			} else {
				tagMap.set(normalizedTag, {
					originalTag: tag, // オリジナルの表記を保持
					count: 1,
				});
			}
		});
	});

	// タグと記事数の配列に変換
	return Array.from(tagMap.entries())
		.map(([_, { originalTag, count }]) => ({ tag: originalTag, count }))
		.sort((a, b) => b.count - a.count); // 記事数が多い順にソート
}

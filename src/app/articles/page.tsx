import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/utils/article";
import { format } from "date-fns";

export const metadata: Metadata = {
	title: "Articles | ucpr.dev",
	description: "ucprのブログ記事一覧",
};

export default async function ArticlesPage() {
	// 記事データをファイルから動的に取得
	const articles = await getAllArticles();

	return (
		<div>
			<h1 className="text-3xl font-bold mb-8">Articles</h1>

			<div className="space-y-4">
				{articles.map((article) => (
					<article key={article.slug} className="border-b pb-4">
						<div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
							{format(new Date(article.publishedAt), "yyyy-MM-dd")}
						</div>
						<Link href={`/articles/${article.slug}`}>
							<h2 className="font-medium hover:underline">{article.title}</h2>
						</Link>
						<p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
							{article.description}
						</p>
					</article>
				))}
			</div>
		</div>
	);
}

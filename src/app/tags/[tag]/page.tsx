import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/utils/article";
import PlatformBadge from "@/components/PlatformBadge";

export const dynamicParams = false;

export async function generateStaticParams() {
	const articles = await getAllArticles();
	const tags = new Set<string>();

	for (const article of articles) {
		if (article.tags) {
			for (const tag of article.tags) {
				tags.add(tag);
			}
		}
	}

	return Array.from(tags).map((tag) => ({
		tag: tag,
	}));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ tag: string }>;
}): Promise<Metadata> {
	const { tag } = await params;
	const decodedTag = decodeURIComponent(tag);

	return {
		title: `${decodedTag} | ucpr.dev`,
		description: `${decodedTag} タグが付いた記事一覧`,
		robots: {
			index: false,
			follow: true,
		},
	};
}

export default async function TagPage({
	params,
}: {
	params: Promise<{ tag: string }>;
}) {
	const { tag } = await params;
	const decodedTag = decodeURIComponent(tag);

	const allArticles = await getAllArticles();
	const filteredArticles = allArticles.filter((article) =>
		article.tags?.includes(decodedTag),
	);

	return (
		<main className="container mx-auto px-4 py-8 max-w-3xl">
			<h1 className="text-2xl font-bold mb-8">
				<span className="text-gray-500">#</span> {decodedTag}
			</h1>

			<div className="space-y-4">
				{filteredArticles.map((article) => (
					<article key={article.slug} className="border-b pb-4">
						<div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
							{new Date(article.publishedAt)
								.toLocaleDateString("ja-JP", {
									year: "numeric",
									month: "2-digit",
									day: "2-digit",
								})
								.replace(/\//g, "/")}
							{article.isExternal && article.platform && (
								<PlatformBadge platform={article.platform} className="ml-2" />
							)}
						</div>
						{article.isExternal && article.url ? (
							<a href={article.url} target="_blank" rel="noopener noreferrer">
								<h2 className="font-medium hover:underline">{article.title}</h2>
							</a>
						) : (
							<Link href={`/articles/${article.slug}`}>
								<h2 className="font-medium hover:underline">{article.title}</h2>
							</Link>
						)}
						<p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
							{article.description}
						</p>
					</article>
				))}
			</div>

			{filteredArticles.length === 0 && (
				<p className="text-gray-500">このタグが付いた記事はありません。</p>
			)}

			<div className="mt-8">
				<Link
					href="/articles"
					className="text-blue-600 dark:text-blue-400 hover:underline"
					style={{ color: "#3B6BF6" }}
				>
					All Articles
				</Link>
			</div>
		</main>
	);
}

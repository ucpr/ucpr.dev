import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllArticles, getArticleBySlug } from "@/utils/article";
import { format } from "date-fns";
import Link from "next/link";
import "dayjs/locale/ja";
import ArticleContent from "@/components/ArticleContent";
import Giscus from "@/components/Giscus";

import "highlight.js/styles/github-dark.css";
import { processMarkdown } from "@/lib/markdown";

export async function generateStaticParams() {
	const articles = await getAllArticles();
	return articles.map((article) => ({
		slug: article.slug,
	}));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const article = await getArticleBySlug(slug);
	if (!article) return {};
	return {
		title: `${article.title} | ucpr.dev`,
		description: article.description,
		robots: {
			index: !article.noindex,
			follow: true,
		},
		openGraph: {
			title: `${article.title} | ucpr.dev`,
			description: article.description,
			type: "article",
			publishedTime: article.publishedAt,
			url: `https://ucpr.dev/articles/${slug}`,
			siteName: "ucpr.dev",
			locale: "ja_JP",
			authors: ["ucpr"],
			images: [
				{
					url: `https://ogpgen.ucpr.dev/?text=${article.title}&author=@ucpr&title=ucpr.dev`,
					width: 1200,
					height: 630,
					alt: article.title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: article.title,
			description: article.description,
			images: [
				`https://ogpgen.ucpr.dev/?text=${article.title}&author=@ucpr&title=%23+ucpr.dev`,
			],
		},
	};
}

export default async function ArticlePage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const article = await getArticleBySlug(slug);
	if (!article) notFound();

	// Markdown を HTML に変換
	const htmlContent = await processMarkdown(article.content);

	return (
		<main className="container mx-auto px-4 py-8 max-w-3xl">
			<article className="prose prose-invert max-w-none">
				<h1 className="text-3xl font-bold mb-4">{article.title}</h1>
				<div className="text-gray-400 mb-4">
					{format(new Date(article.publishedAt), "yyyy年MM月dd日")}
				</div>
				<div className="flex space-x-2 mb-8">
					{article.tags.map((tag: string) => (
						<Link
							key={tag}
							href={`/tags/${tag}`}
							className="rounded-lg py-1 text-s transition-colors border border-gray-700 hover:bg-gray-200 hover:border-gray-600 px-2 text-sm"
						>
							{tag}
						</Link>
					))}
				</div>

				<ArticleContent content={htmlContent} />
			</article>

			<div className="mt-16 pt-8 border-t border-gray-700">
				<Giscus />
			</div>
		</main>
	);
}

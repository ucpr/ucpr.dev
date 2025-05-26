import Link from "next/link";
import Image from "next/image";
import { getArticles } from "@/lib/api";
import PlatformBadge from "@/components/PlatformBadge";

async function getLatestArticles() {
	const allArticles = await getArticles();
	return allArticles
		.sort(
			(a, b) =>
				new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
		)
		.slice(0, 3);
}

export default async function Home() {
	const latestArticles = await getLatestArticles();

	return (
		<main className="container mx-auto px-4 py-8 max-w-3xl">
			<div className="flex flex-col items-center mb-8">
				<Image
					src="https://avatars.githubusercontent.com/u/17886370"
					alt="icon"
					width={120}
					height={120}
					className="rounded-full mb-4"
				/>
				<p className="text-lg">Hello World</p>
			</div>

			<section>
				<h2 className="text-2xl font-bold mb-4">Recent Articles</h2>
				<div className="space-y-4">
					{latestArticles.map((article) => (
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
									<h3 className="font-medium hover:underline">
										{article.title}
									</h3>
								</a>
							) : (
								<Link href={`/articles/${article.slug}`}>
									<h3 className="font-medium hover:underline">
										{article.title}
									</h3>
								</Link>
							)}
							<p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
								{article.description}
							</p>
						</article>
					))}
				</div>

				<div className="mt-6 text-right">
					<Link
						href="/articles"
						className="text-blue-600 dark:text-blue-400 hover:underline"
						style={{ color: "#3B6BF6" }}
					>
						More Articles
					</Link>
				</div>
			</section>

			<div>
				<h2 className="text-2xl font-bold mb-4">Playlist</h2>
				<iframe
					title="spotify playlist"
					className="rounded-lg"
					src={`https://open.spotify.com/embed/playlist/0irS3jb6iHhwCCIoEVYjeV?utm_source=generator`}
					width="100%"
					height="160"
					allowFullScreen={false}
					allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
					loading="lazy"
				/>
			</div>
		</main>
	);
}

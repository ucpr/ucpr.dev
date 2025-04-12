import Link from "next/link";
import Image from "next/image";

// 最新の記事データ
const latestArticles = [
	{
		id: "1",
		title: "tracetest で Trace-based Testing に触れてみる",
		date: "2024-12-18",
		excerpt:
			"分散システムのテストを Trace ベースで行う新しいテスト手法について解説します。",
		slug: "tracetest-trace-based-testing",
	},
	{
		id: "2",
		title: "Cloud Trace のデータを BigQuery にエクスポートする",
		date: "2024-12-02",
		excerpt:
			"Google Cloud の Trace データを BigQuery に連携し分析する方法を紹介します。",
		slug: "cloud-trace-bigquery-export",
	},
	{
		id: "3",
		title: "telemetrygenで行うOpenTelemetry Collectorの負荷試験",
		date: "2024-08-25",
		excerpt:
			"OpenTelemetry Collector の性能評価と負荷テストのアプローチについて解説します。",
		slug: "telemetrygen-otel-collector-load-testing",
	},
];

export default function Home() {
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
						<article key={article.id} className="border-b pb-4">
							<div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
								{article.date}
							</div>
							<Link href={`/articles/${article.slug}`}>
								<h3 className="font-medium hover:underline">{article.title}</h3>
							</Link>
							<p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
								{article.excerpt}
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
				<h2 className="text-2xl font-bold mb-4">Recent Articles</h2>
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

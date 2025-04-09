import Link from "next/link";

// 最新の記事データ
const latestArticles = [
  {
    id: "1",
    title: "tracetest で Trace-based Testing に触れてみる",
    date: "2024-12-18",
    excerpt: "分散システムのテストを Trace ベースで行う新しいテスト手法について解説します。",
    slug: "tracetest-trace-based-testing",
  },
  {
    id: "2",
    title: "Cloud Trace のデータを BigQuery にエクスポートする",
    date: "2024-12-02", 
    excerpt: "Google Cloud の Trace データを BigQuery に連携し分析する方法を紹介します。",
    slug: "cloud-trace-bigquery-export",
  },
  {
    id: "3",
    title: "telemetrygenで行うOpenTelemetry Collectorの負荷試験",
    date: "2024-08-25",
    excerpt: "OpenTelemetry Collector の性能評価と負荷テストのアプローチについて解説します。",
    slug: "telemetrygen-otel-collector-load-testing",
  },
  {
    id: "4",
    title: "Astro+SolidJS+Tailwindでブログを作り直した",
    date: "2024-07-22",
    excerpt: "ブログサイトをAstroとSolidJSを使って再構築した経験を共有します。",
    slug: "rebuild-blog-with-astro-solidjs-tailwind",
  },
  {
    id: "5",
    title: "Neovimのプラグイン管理をdpp.vimに移行した",
    date: "2024-05-09",
    excerpt: "Neovimのプラグイン管理システムをdpp.vimに切り替えた理由と方法について解説します。",
    slug: "neovim-plugin-manager-dpp-vim",
  },
];

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Hello World</h1>
      
      <section>
        <h2 className="text-2xl font-bold mb-4">Recent Articles</h2>
        <div className="space-y-4">
          {latestArticles.map(article => (
            <article key={article.id} className="border-b pb-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{article.date}</div>
              <Link href={`/articles/${article.slug}`}>
                <h3 className="font-medium hover:underline">{article.title}</h3>
              </Link>
              <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">{article.excerpt}</p>
            </article>
          ))}
        </div>
        
        <div className="mt-6">
          <Link href="/articles" className="text-blue-600 dark:text-blue-400 hover:underline">
            More Articles
          </Link>
        </div>
      </section>
    </div>
  );
}

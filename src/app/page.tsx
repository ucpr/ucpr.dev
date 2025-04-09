import Link from "next/link";

// 最新の記事データ
const latestArticles = [
  {
    id: "1",
    title: "Next.js 15の新機能について",
    date: "2023-04-09",
    excerpt: "Next.js 15がリリースされました。このバージョンでの主な変更点と新機能について解説します。",
    slug: "nextjs-15-features",
  },
  {
    id: "2",
    title: "Tailwind CSSを使ったレスポンシブデザイン",
    date: "2023-03-25",
    excerpt: "Tailwind CSSを使って効率的にレスポンシブWebデザインを実装する方法を紹介します。",
    slug: "responsive-design-with-tailwindcss",
  },
];

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">ようこそ</h1>
      <section className="mb-10">
        <p className="mb-4">
          こちらは ucpr の個人ウェブサイトです。
          プロフィールやブログ記事などを公開しています。
        </p>
        <p>
          このサイトは Next.js と Tailwind CSS で構築されています。
        </p>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">最新の記事</h2>
        <div className="grid gap-4">
          {latestArticles.map(article => (
            <div key={article.id} className="border p-4 rounded-lg hover:shadow-md transition-shadow">
              <Link href={`/articles/${article.slug}`}>
                <h3 className="font-medium mb-2 hover:underline">{article.title}</h3>
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400">{article.date}</p>
              <p className="mt-2">{article.excerpt}</p>
              <Link href={`/articles/${article.slug}`} className="inline-block mt-2 text-blue-600 dark:text-blue-400 hover:underline">
                続きを読む
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

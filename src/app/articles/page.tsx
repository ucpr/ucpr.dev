import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ブログ記事 | ucpr.dev",
  description: "ucprのブログ記事一覧",
};

// サンプル記事データ
// 実際のアプリでは、データベースやファイルシステムからデータを取得します
const articles = [
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
  {
    id: "3",
    title: "TypeScriptの型システム入門",
    date: "2023-03-10",
    excerpt: "TypeScriptの型システムの基本から応用までを解説します。型安全なコードの書き方を学びましょう。",
    slug: "typescript-type-system-introduction",
  },
];

export default function ArticlesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">ブログ記事</h1>
      
      <div className="grid gap-6">
        {articles.map((article) => (
          <article key={article.id} className="border p-6 rounded-lg hover:shadow-md transition-shadow">
            <Link href={`/articles/${article.slug}`}>
              <h2 className="text-xl font-bold mb-2 hover:underline">{article.title}</h2>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{article.date}</p>
            <p>{article.excerpt}</p>
            <Link href={`/articles/${article.slug}`} className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline">
              続きを読む
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
} 
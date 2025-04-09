import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// 記事データの型定義
type Article = {
  id: string;
  title: string;
  date: string;
  content: string;
};

type ArticlesData = {
  [key: string]: Article;
};

// サンプル記事データ
// 実際のアプリでは、データベースやファイルシステムからデータを取得します
const articlesData: ArticlesData = {
  "nextjs-15-features": {
    id: "1",
    title: "Next.js 15の新機能について",
    date: "2023-04-09",
    content: `
# Next.js 15の新機能について

Next.js 15がリリースされ、パフォーマンスの向上や新機能が追加されました。
このバージョンでの主な変更点と新機能について解説します。

## パフォーマンスの向上

Next.js 15では、ビルド時間が大幅に短縮されました。
また、ページの読み込み時間も改善され、ユーザー体験が向上しています。

## Turbopackの改善

TurbopackはRustベースのWebpackの代替として開発されており、大幅に高速化されています。
Next.js 15ではTurbopackがさらに改善され、より多くのケースで使用できるようになりました。

## その他の新機能

- 改善されたCSS処理
- サーバーコンポーネントの強化
- 新しいキャッシュメカニズム

詳細は[公式ドキュメント](https://nextjs.org/docs)を参照してください。
    `,
  },
  "responsive-design-with-tailwindcss": {
    id: "2",
    title: "Tailwind CSSを使ったレスポンシブデザイン",
    date: "2023-03-25",
    content: `
# Tailwind CSSを使ったレスポンシブデザイン

Tailwind CSSを使って効率的にレスポンシブWebデザインを実装する方法を紹介します。

## Tailwind CSSのブレイクポイント

Tailwind CSSでは、以下のようなブレイクポイントが定義されています：

- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

これらを使って、様々な画面サイズに対応したデザインを簡単に実装できます。

## レスポンシブクラスの使い方

\`\`\`jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* コンテンツ */}
</div>
\`\`\`

上記の例では、モバイルでは1列、タブレットでは2列、デスクトップでは3列のグリッドが表示されます。

## モバイルファーストアプローチ

Tailwind CSSはモバイルファーストのアプローチを取っています。
ブレイクポイントのプレフィックスがない場合は、すべての画面サイズに適用されます。
    `,
  },
  "typescript-type-system-introduction": {
    id: "3",
    title: "TypeScriptの型システム入門",
    date: "2023-03-10",
    content: `
# TypeScriptの型システム入門

TypeScriptの型システムの基本から応用までを解説します。
型安全なコードの書き方を学びましょう。

## 基本的な型

TypeScriptには以下のような基本的な型があります：

- number
- string
- boolean
- array
- object
- null
- undefined

## 型アノテーション

変数に型を指定するには、以下のように型アノテーションを使用します：

\`\`\`typescript
let name: string = "ucpr";
let age: number = 30;
let isActive: boolean = true;
\`\`\`

## インターフェースと型エイリアス

複雑な型を定義するには、インターフェースや型エイリアスを使用します：

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type Point = {
  x: number;
  y: number;
};
\`\`\`

これらを使用することで、コードの安全性と可読性が向上します。
    `,
  },
};

// 動的メタデータの生成
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const article = articlesData[params.slug];
  
  if (!article) {
    return {
      title: "記事が見つかりません | ucpr.dev",
    };
  }
  
  return {
    title: `${article.title} | ucpr.dev`,
    description: article.content.substring(0, 160),
  };
}

export default function ArticlePage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const article = articlesData[params.slug];
  
  if (!article) {
    notFound();
  }
  
  // マークダウン風のコンテンツを簡易的にHTMLに変換する関数
  const formatContent = (content: string) => {
    return content
      .split("\n")
      .map((line, i) => {
        if (line.startsWith("# ")) {
          return <h1 key={i} className="text-3xl font-bold my-4">{line.replace("# ", "")}</h1>;
        } else if (line.startsWith("## ")) {
          return <h2 key={i} className="text-2xl font-bold my-3">{line.replace("## ", "")}</h2>;
        } else if (line.startsWith("- ")) {
          return <li key={i} className="ml-6 list-disc">{line.replace("- ", "")}</li>;
        } else if (line.trim() === "```jsx" || line.trim() === "```typescript" || line.trim() === "```") {
          return null; // コードブロックのマーカーは表示しない
        } else if (line.trim().length === 0) {
          return <br key={i} />;
        } else {
          return <p key={i} className="my-2">{line}</p>;
        }
      });
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/articles" className="text-blue-600 dark:text-blue-400 hover:underline">
          ← 記事一覧に戻る
        </Link>
      </div>
      
      <article className="prose dark:prose-invert lg:prose-lg max-w-none">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-3">{article.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">{article.date}</p>
        </header>
        
        <div className="article-content">
          {formatContent(article.content)}
        </div>
      </article>
    </div>
  );
} 
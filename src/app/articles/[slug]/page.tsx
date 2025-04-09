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
  "tracetest-trace-based-testing": {
    id: "1",
    title: "tracetest で Trace-based Testing に触れてみる",
    date: "2024-12-18",
    content: `
# tracetest で Trace-based Testing に触れてみる

分散システムのテストを Trace ベースで行う新しいテスト手法について解説します。
トレースを活用したテストアプローチにより、複雑なシステムの挙動を効率的に検証できます。

## Trace-based Testing とは

Trace-based Testing は、分散システムから収集されたトレースデータを活用してテストを行うアプローチです。
従来のエンドポイントベースのテストと異なり、システム内部の実行パスやコンポーネント間の関係性を可視化し、
より詳細なテストカバレッジを実現します。

## tracetest の特徴

tracetest は Trace-based Testing を実現するためのオープンソースツールです。
以下のような特徴があります：

- OpenTelemetry との統合
- トレースデータに基づいたアサーション
- テストケースの視覚化
- CI/CD パイプラインとの連携

## 基本的な使い方

\`\`\`typescript
// トレースベーステストの例
const test = new TraceTest({
  name: "API呼び出しテスト",
  endpoint: "http://api.example.com/users",
});

test.addAssertion({
  spanQuery: "http.method = 'GET'",
  attribute: "http.status_code",
  comparator: "=",
  expectedValue: "200",
});

await test.run();
\`\`\`

この例では、APIエンドポイントへのリクエストを送信し、生成されたトレースに対してアサーションを実行しています。
    `,
  },
  "cloud-trace-bigquery-export": {
    id: "2",
    title: "Cloud Trace のデータを BigQuery にエクスポートする",
    date: "2024-12-02",
    content: `
# Cloud Trace のデータを BigQuery にエクスポートする

Google Cloud の Trace データを BigQuery に連携し分析する方法を紹介します。
これにより、分散トレースデータを長期保存し、詳細な分析が可能になります。

## Cloud Trace と BigQuery の連携

Cloud Trace は Google Cloud のトレーシングサービスであり、アプリケーションのパフォーマンスや
障害の調査に役立ちます。しかし、デフォルトでは保存期間が限られているため、長期的な分析や
トレンド把握には BigQuery へのエクスポートが効果的です。

## エクスポートの設定方法

BigQuery へのエクスポートは以下の手順で設定できます：

- Cloud Trace API の有効化
- エクスポート先の BigQuery データセット作成
- Cloud Scheduler によるエクスポートジョブの定期実行設定

## データ分析例

BigQuery に格納されたトレースデータは、以下のような分析に活用できます：

- サービスごとのレイテンシトレンド分析
- エラー発生パターンの特定
- ボトルネックとなるコンポーネントの検出

\`\`\`sql
-- 各サービスの平均レスポンス時間を分析するクエリ例
SELECT
  service.name,
  AVG(duration_ms) as avg_duration,
  COUNT(*) as request_count
FROM
  \`project.dataset.traces\`
WHERE
  timestamp > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
GROUP BY
  service.name
ORDER BY
  avg_duration DESC
LIMIT 10
\`\`\`

このような分析により、システムの性能問題を事前に検知し、改善に役立てることができます。
    `,
  },
  "telemetrygen-otel-collector-load-testing": {
    id: "3",
    title: "telemetrygenで行うOpenTelemetry Collectorの負荷試験",
    date: "2024-08-25",
    content: `
# telemetrygenで行うOpenTelemetry Collectorの負荷試験

OpenTelemetry Collector の性能評価と負荷テストのアプローチについて解説します。
適切なリソース計画と構成最適化に役立ちます。

## OpenTelemetry Collector の負荷テスト

OpenTelemetry Collector は、テレメトリデータ（メトリクス、トレース、ログ）を収集・処理・
エクスポートするためのコンポーネントです。本番環境で使用する前に、期待される負荷に
耐えられるかを評価することが重要です。

## telemetrygen ツールの紹介

telemetrygen は OpenTelemetry プロジェクトの一部であり、テレメトリデータを生成して
Collector に送信するためのツールです。主な特徴：

- 異なるタイプのテレメトリデータの生成（メトリクス、トレース、ログ）
- データ量やレートの調整
- 様々なプロトコルでの送信（OTLP/gRPC, OTLP/HTTP）

## 負荷テストのステップ

1. テスト環境の構築
2. テストシナリオの設計
3. telemetrygen の実行
4. パフォーマンス指標の測定
5. 結果分析と Collector 構成の最適化

\`\`\`bash
# 1秒あたり1000スパンを生成してCollectorに送信する例
telemetrygen traces --rate 1000 --duration 5m --otlp-endpoint localhost:4317
\`\`\`

## 性能最適化のポイント

テスト結果に基づいて以下のような最適化が可能です：

- メモリバッファサイズの調整
- バッチ処理パラメータの最適化
- プロセッサパイプラインの効率化
- 水平スケーリングの計画

適切な負荷テストにより、本番環境での問題を未然に防ぎ、効率的なテレメトリ収集基盤を構築できます。
    `,
  },
  "rebuild-blog-with-astro-solidjs-tailwind": {
    id: "4",
    title: "Astro+SolidJS+Tailwindでブログを作り直した",
    date: "2024-07-22",
    content: `
# Astro+SolidJS+Tailwindでブログを作り直した

ブログサイトをAstroとSolidJSを使って再構築した経験を共有します。
以前のサイトからの移行理由や新しい技術スタックの利点について説明します。

## Astro を選んだ理由

Astro は高速なサイト構築に最適化されたフレームワークで、特に以下の点が魅力でした：

- コンテンツ中心のウェブサイトに最適化
- デフォルトでゼロJavaScript（必要な場所だけクライアントサイドコード）
- 様々なUIフレームワークとの互換性
- ビルド時のパフォーマンス最適化

## SolidJS について

ReactライクなAPIを持ちながらも異なるアプローチでリアクティビティを実現しているSolidJSを採用しました：

- 仮想DOMを使用せず高速
- きめ細かいリアクティビティ
- バンドルサイズが小さい
- シンプルなメンタルモデル

## Tailwind CSS の活用

デザインシステムの構築と一貫性のあるUIを実現するためにTailwind CSSを採用しました：

- ユーティリティファーストの柔軟性
- コンポーネント間での一貫性の維持
- 開発者エクスペリエンスの向上
- カスタマイズの容易さ

## 移行作業と学んだこと

\`\`\`javascript
// Astroコンポーネントの例
---
import { createSignal } from "solid-js";
---

<div class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
  <h1 class="text-2xl font-bold mb-4">Astro + SolidJS</h1>
  <div class="counter" client:load>
    <button class="px-4 py-2 bg-blue-500 text-white rounded">カウント</button>
    <p class="mt-2">クリック回数: <span id="count">0</span></p>
  </div>
</div>

<script>
  import { createSignal } from "solid-js";
  
  const Counter = () => {
    const [count, setCount] = createSignal(0);
    return (
      <button onClick={() => setCount(count() + 1)}>
        カウント: {count()}
      </button>
    );
  };
  
  document.querySelector('.counter').innerHTML = Counter();
</script>
\`\`\`

移行を通じて、静的サイト生成とクライアントサイドインタラクションのバランスについて多くを学びました。
次回は、より効率的なコンテンツ管理と国際化対応について検討したいと思います。
    `,
  },
  "neovim-plugin-manager-dpp-vim": {
    id: "5",
    title: "Neovimのプラグイン管理をdpp.vimに移行した",
    date: "2024-05-09",
    content: `
# Neovimのプラグイン管理をdpp.vimに移行した

Neovimのプラグイン管理システムをdpp.vimに切り替えた理由と方法について解説します。
より高速で柔軟なプラグイン管理を実現した経験を共有します。

## dpp.vim とは

dpp.vim は Shougo 氏によって開発された Neovim のパッケージマネージャです。
名前の由来は "dark powered package manager" で、以下のような特徴があります：

- Denops.vim（Deno で書かれた Vim/Neovim プラグイン）ベース
- 非同期プラグインインストール・更新
- 複数のパッケージソースをサポート
- 柔軟な設定システム

## 移行の理由

以前は vim-plug を使用していましたが、以下の理由で dpp.vim に移行しました：

- より高速なプラグイン読み込み
- 条件付きプラグイン読み込みの柔軟性
- 遅延読み込みの改善
- TypeScript での設定が可能

## 基本的な設定例

\`\`\`typescript
// dpp.vimの基本設定例
export async function main(args: string[]): Promise<void> {
  const plugins: Plugin[] = [
    {
      name: "vim-airline/vim-airline",
      source: "github",
    },
    {
      name: "neovim/nvim-lspconfig",
      source: "github",
      lazy: true,
      on_event: ["BufRead"],
    },
    {
      name: "hrsh7th/nvim-cmp",
      source: "github",
      depends: ["nvim-lspconfig"],
    },
  ];

  await Dpp.make({
    plugins,
    profiles: {
      default: {
        enableLazy: true,
      },
    },
  });
}
\`\`\`

## 移行後のパフォーマンス改善

dpp.vim に移行後、Neovim の起動時間が約200ms速くなりました。
プラグインの遅延読み込みも最適化され、必要なときだけプラグインが読み込まれるようになり、
全体的な操作感が向上しました。

今後も設定の最適化を続け、より高速で効率的な開発環境を目指します。
    `,
  },
  "nextjs-15-features": {
    id: "6",
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
    id: "7",
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
    id: "8",
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
export function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Metadata {
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

// 静的生成のためのパラメータを生成
export function generateStaticParams() {
  return Object.keys(articlesData).map((slug) => ({
    slug,
  }));
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
          return <h1 key={i} className="text-2xl font-bold my-4">{line.replace("# ", "")}</h1>;
        } else if (line.startsWith("## ")) {
          return <h2 key={i} className="text-xl font-bold my-3">{line.replace("## ", "")}</h2>;
        } else if (line.startsWith("- ")) {
          return <li key={i} className="ml-6 list-disc my-1">{line.replace("- ", "")}</li>;
        } else if (line.trim() === "```jsx" || line.trim() === "```typescript" || line.trim() === "```") {
          return null; // コードブロックのマーカーは表示しない
        } else if (line.trim().length === 0) {
          return <br key={i} />;
        } else {
          return <p key={i} className="my-2 leading-relaxed">{line}</p>;
        }
      });
  };
  
  return (
    <div>
      <div className="mb-8">
        <Link href="/articles" className="text-blue-600 dark:text-blue-400 hover:underline">
          ← Articles
        </Link>
      </div>
      
      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-3">{article.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">{article.date}</p>
        </header>
        
        <div className="prose dark:prose-invert max-w-none leading-relaxed">
          {formatContent(article.content)}
        </div>
      </article>
    </div>
  );
} 
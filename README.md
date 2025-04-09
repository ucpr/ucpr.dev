# ucpr.dev

個人用ホームページ [ucpr.dev](https://ucpr.dev) のソースコードです。

## 機能

- ホームページ
- プロフィールページ
- ブログ記事

## 技術スタック

- Next.js (App Router)
- TypeScript
- TailwindCSS

## 開発方法

開発サーバーを起動する:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

[http://localhost:3000](http://localhost:3000) をブラウザで開くと結果が表示されます。

## 静的サイト生成 (SSG)

このプロジェクトはNext.jsの静的サイト生成 (SSG) 機能を使用して、静的HTMLファイルを生成します。

### 静的ビルドの実行

以下のコマンドを実行すると、静的ファイルが生成されます:

```bash
npm run export
# or
yarn export
# or
pnpm export
# or
bun export
```

ビルドが完了すると、`out` ディレクトリに静的ファイルが生成されます。
これらのファイルは任意のウェブサーバーでホストできます。

### 静的サイトの特徴

- サーバーサイドの処理が不要
- CDNによる高速配信が可能
- セキュリティが向上
- ホスティングコストが削減
- SEOに優れている

### 注意点

- APIルートは使用できません
- サーバーサイドコードは実行できません
- 動的ルーティングには `generateStaticParams` の実装が必要です

## デプロイ

静的ファイルは以下のサービスにデプロイできます:

- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting
- Amazon S3
- その他の静的ホスティングサービス

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

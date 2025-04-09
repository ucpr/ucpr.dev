import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // trailingSlashはオプション。URLの末尾にスラッシュを追加するかどうか
  trailingSlash: true,
  // 画像最適化を無効化（静的エクスポートでは必要）
  images: {
    unoptimized: true,
  },
  // TypeScriptエラーを無視してビルドを続行
  typescript: {
    // ビルド時の型チェックを無効化（開発時には有効のまま）
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

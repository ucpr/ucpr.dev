/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// ビルド出力を標準モードに設定
	// output: 'export',
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
		],
		// 'export' output時はunoptimizedをtrueにする必要があります
		unoptimized: true,
	},
	// 静的エクスポートが必要な場合はtrueに設定
	trailingSlash: true,
	// TypeScriptエラーを無視してビルドを続行
	typescript: {
		// ビルド時の型チェックを無効化（開発時には有効のまま）
		ignoreBuildErrors: true,
	},
};

export default nextConfig;

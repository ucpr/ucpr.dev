import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
			<h1 className="text-4xl font-bold mb-4">404</h1>
			<h2 className="text-2xl font-semibold mb-6">
				ページが見つかりませんでした
			</h2>
			<p className="text-gray-600 dark:text-gray-400 mb-8">
				アクセスしようとしたページは存在しないか、移動または削除された可能性があります。
			</p>
			<Link
				href="/"
				className="px-4 py-2 rounded-lg transition-colors border border-gray-700 hover:bg-gray-200 hover:border-gray-600"
			>
				ホームに戻る
			</Link>
		</div>
	);
}

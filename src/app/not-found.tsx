import Link from "next/link";

export default function NotFound() {
	return (
		<div className="container mx-auto px-4 py-16 max-w-3xl">
			<div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
				<h1 
					className="text-8xl font-bold mb-8 text-transparent"
					style={{
						WebkitTextStroke: "2px currentColor",
						WebkitTextStrokeColor: "rgb(75 85 99)",
					}}
				>
					404
				</h1>
				<h2 className="text-2xl font-semibold mb-4">
					ページが見つかりませんでした
				</h2>
				<p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
					お探しのページは消えてしまったようです。
					URLをご確認いただくか、ホームページからお探しください。
				</p>
				<div className="flex flex-col sm:flex-row gap-4">
					<Link
						href="/"
						className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
					>
						ホームに戻る
					</Link>
					<Link
						href="/articles"
						className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
					>
						記事一覧を見る
					</Link>
				</div>
			</div>
		</div>
	);
}

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
	title: "Profile | ucpr.dev",
	description: "ucprのプロフィールページ",
};

export default function ProfilePage() {
	return (
		<main className="container mx-auto px-4 py-8 max-w-3xl">
			{/* アイコン画像とJust do it!メッセージをここに追加 */}
			<div className="flex flex-col items-center mb-8">
				<Image
					src="https://avatars.githubusercontent.com/u/17886370"
					alt="icon"
					width={120}
					height={120}
					className="rounded-full mb-4"
				/>
				<p className="text-lg">Just do it!</p>
			</div>

			<h1 className="text-3xl font-bold mb-8">Profile</h1>

			<div className="space-y-8">
				<section>
					<h2 className="text-xl font-semibold mb-4">About</h2>
					<ul className="list-disc list-inside space-y-2">
						<li>name: Taichi Uchihara</li>
						<li>age: 24</li>
						<li>timezone: Asia/Tokyo +9</li>
					</ul>
				</section>

				<section>
					<h2 className="text-xl font-semibold mb-4">Work Experiences</h2>

					<div className="mb-6">
						<h3 className="text-lg font-medium">AbemaTV, Inc.</h3>

						<div className="mt-4 mb-6">
							<h4 className="font-medium">Developer Productivity Engineer</h4>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								2024/04 ~ now
							</p>
							<p className="my-2">
								developer productivity engineer
								として、開発者生産性向上に取り組む
							</p>
							<div className="flex flex-wrap gap-2 mt-2">
								<Link
									href="/tags/Go"
									className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
								>
									Go
								</Link>
								<Link
									href="/tags/Google Cloud"
									className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
								>
									Google Cloud
								</Link>
								<Link
									href="/tags/Kubernetes"
									className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
								>
									Kubernetes
								</Link>
								<Link
									href="/tags/Observability"
									className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
								>
									Observability
								</Link>
								<Link
									href="/tags/Monitoring"
									className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
								>
									Monitoring
								</Link>
							</div>
						</div>

						<div>
							<h4 className="font-medium">Product Backend Engineer</h4>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								2021/04 ~ 2024/03
							</p>
							<p className="my-2">
								Backend Engineer として、サービスの開発・運用に従事
							</p>
							<div className="flex flex-wrap gap-2 mt-2">
								<Link
									href="/tags/Go"
									className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
								>
									Go
								</Link>
								<Link
									href="/tags/Google Cloud"
									className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
								>
									Google Cloud
								</Link>
								<Link
									href="/tags/Kubernetes"
									className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
								>
									Kubernetes
								</Link>
								<Link
									href="/tags/MongoDB"
									className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
								>
									MongoDB
								</Link>
							</div>
						</div>
					</div>
				</section>

				<section>
					<h2 className="text-xl font-semibold mb-4">Certifications</h2>
					<ul className="space-y-4">
						<li>
							<a
								href="https://www.credential.net/f5b24217-bd7d-46fb-a21f-d1de65976a03"
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-600 dark:text-blue-400 hover:underline"
							>
								Google Cloud Certified Professional Data Engineer
							</a>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								2023/12
							</p>
						</li>
						<li>
							<a
								href="https://www.credential.net/a595b0d9-5297-4d2e-8045-907be4a21939"
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-600 dark:text-blue-400 hover:underline"
							>
								Google Cloud Certified Professional Cloud Security Engineer
							</a>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								2023/03
							</p>
						</li>
						<li>
							<a
								href="https://www.credential.net/e5ad5f41-bf18-44a9-ade1-0005ab293c6e"
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-600 dark:text-blue-400 hover:underline"
							>
								Google Cloud Certified Professional Cloud Developer
							</a>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								2022/10
							</p>
						</li>
						<li>
							<a
								href="https://www.credential.net/1fe360ea-22e9-4dac-bc95-081f6108e9a5"
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-600 dark:text-blue-400 hover:underline"
							>
								Google Cloud Certified Professional Cloud Architect
							</a>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								2022/02
							</p>
						</li>
					</ul>
				</section>
			</div>
		</main>
	);
}

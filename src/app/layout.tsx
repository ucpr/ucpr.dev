import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "ucpr.dev",
	description: "ucprの個人ウェブサイト",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<GoogleAnalytics />
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200`}
			>
				<div className="max-w-5xl mx-auto px-4 py-8 ">
					<header className="mb-10 border-b pb-6 px-4">
						<nav className="flex justify-between items-center">
							<Link href="/" className="text-xl font-bold">
								# ucpr.dev
							</Link>
							<ul className="flex space-x-5">
								<li>
									<Link href="/" className="hover:underline font-bold">
										Home
									</Link>
								</li>
								<li>
									<Link href="/profile" className="hover:underline font-bold">
										Profile
									</Link>
								</li>
								<li>
									<Link href="/articles" className="hover:underline font-bold">
										Articles
									</Link>
								</li>
							</ul>
						</nav>
					</header>
					<main className="mb-16">{children}</main>
					<footer className="border-t pt-6 text-sm text-gray-600 dark:text-gray-400 text-center">
						<div className="flex flex-wrap gap-4 mb-4 flex-row justify-center">
							<a
								href="https://github.com/ucpr"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:underline"
							>
								GitHub
							</a>
							<a
								href="https://twitter.com/ucpr_"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:underline"
							>
								X
							</a>
							<a
								href="https://bsky.app/profile/ucpr.dev"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:underline"
							>
								Bluesky
							</a>
							<a
								href="/rss.xml"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:underline"
							>
								RSS
							</a>
						</div>
						<p className="mb-2">
							© {new Date().getFullYear()} @ucpr. All rights reserved.
						</p>
						<p className="text-xs">
							このサイトでは Google Analytics を使用しています。
						</p>
					</footer>
				</div>
			</body>
		</html>
	);
}

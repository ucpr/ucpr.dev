import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="p-4 border-b">
          <nav className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">ucpr.dev</Link>
            <ul className="flex space-x-6">
              <li><Link href="/" className="hover:underline">ホーム</Link></li>
              <li><Link href="/profile" className="hover:underline">プロフィール</Link></li>
              <li><Link href="/articles" className="hover:underline">ブログ</Link></li>
            </ul>
          </nav>
        </header>
        <main className="container mx-auto py-8 px-4">
          {children}
        </main>
        <footer className="p-4 border-t mt-auto">
          <div className="container mx-auto text-center">
            <p>© {new Date().getFullYear()} ucpr.dev</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

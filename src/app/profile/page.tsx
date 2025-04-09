import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プロフィール | ucpr.dev",
  description: "ucprのプロフィールページ",
};

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">プロフィール</h1>
      
      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        <div className="text-center md:text-left">
          <div className="w-40 h-40 mx-auto md:mx-0 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
            {/* プロフィール画像を追加する場合はこちら */}
            <span className="text-gray-500">写真</span>
          </div>
          <h2 className="text-xl font-bold">ucpr</h2>
          <p className="text-gray-600 dark:text-gray-400">ソフトウェアエンジニア</p>
        </div>
        
        <div>
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-3">自己紹介</h3>
            <p className="mb-4">
              ソフトウェアエンジニアとして働いています。
              Webバックエンド開発を中心に、フロントエンド開発やインフラ構築なども行っています。
            </p>
            <p>
              趣味は読書と散歩です。技術書から小説まで幅広く読んでいます。
            </p>
          </section>
          
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-3">スキル</h3>
            <ul className="list-disc list-inside">
              <li>プログラミング言語: Go, TypeScript, Python</li>
              <li>フレームワーク: React, Next.js, Echo</li>
              <li>その他: Docker, Kubernetes, AWS</li>
            </ul>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold mb-3">リンク</h3>
            <ul className="flex flex-wrap gap-4">
              <li>
                <a href="https://github.com/ucpr" target="_blank" rel="noopener noreferrer" 
                   className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://twitter.com/ucpr_" target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  Twitter
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
} 
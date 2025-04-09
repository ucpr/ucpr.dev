import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Profile | ucpr.dev",
  description: "ucprのプロフィールページ",
};

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <p className="mb-4">
            ソフトウェアエンジニアとして働いています。
            Webバックエンド開発を中心に、フロントエンド開発やインフラ構築なども行っています。
          </p>
          <p>
            趣味は読書と散歩です。技術書から小説まで幅広く読んでいます。
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4">Skills</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Programming: Go, TypeScript, Python</li>
            <li>Cloud: AWS, GCP</li>
            <li>Infrastructure: Docker, Kubernetes</li>
            <li>Observability: OpenTelemetry, Prometheus</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4">Links</h2>
          <ul className="space-y-2">
            <li>
              <a 
                href="https://github.com/ucpr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                GitHub
              </a>
            </li>
            <li>
              <a 
                href="https://twitter.com/ucpr_" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                X (Twitter)
              </a>
            </li>
            <li>
              <a 
                href="https://bsky.app/profile/ucpr.dev" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Bluesky
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
} 
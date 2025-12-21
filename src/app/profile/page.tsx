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
      <div className="flex flex-col items-center mb-8">
        <Image
          src="https://avatars.githubusercontent.com/u/17886370"
          alt="icon"
          width={120}
          height={120}
          className="rounded-full mb-4"
        />
        <h1 className="text-2xl font-bold mb-2">Taichi Uchihara</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">SRE @ AbemaTV</p>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Just do it!</p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">About</h2>
          <div className="space-y-2 text-gray-600 dark:text-gray-400">
            <p><span className="font-medium">Name:</span> Taichi Uchihara</p>
            <p><span className="font-medium">Age:</span> 25</p>
            <p><span className="font-medium">Timezone:</span> Asia/Tokyo +9</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Work Experiences</h2>

          <div className="space-y-8">
            <div className="border-l-2 border-gray-300 dark:border-gray-700 pl-4">
              <div className="mb-4">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-lg font-bold">AbemaTV, Inc.</h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    2021/04 - Present
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                  <div className="mb-2">
                    <h4 className="font-bold">SRE</h4>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400 mt-1">
                      <span>2025/10 - Present</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Link
                        href="/tags/Go"
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800"
                      >
                        Go
                      </Link>
                      <Link
                        href="/tags/Google Cloud"
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800"
                      >
                        Google Cloud
                      </Link>
                      <Link
                        href="/tags/Kubernetes"
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800"
                      >
                        Kubernetes
                      </Link>
                      <Link
                        href="/tags/Observability"
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800"
                      >
                        Observability
                      </Link>
                      <Link
                        href="/tags/Monitoring"
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800"
                      >
                        Monitoring
                      </Link>
                    </div>
                  </div>

                  <p className="text-sm">
                    SRE として、システムの信頼性向上に従事
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                  <div className="mb-2">
                    <h4 className="font-bold">Developer Productivity Engineer</h4>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400 mt-1">
                      <span>2024/04 - 2025/09</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Link
                        href="/tags/Go"
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800"
                      >
                        Go
                      </Link>
                      <Link
                        href="/tags/Google Cloud"
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800"
                      >
                        Google Cloud
                      </Link>
                      <Link
                        href="/tags/Kubernetes"
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800"
                      >
                        Kubernetes
                      </Link>
                      <Link
                        href="/tags/Observability"
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800"
                      >
                        Observability
                      </Link>
                      <Link
                        href="/tags/Monitoring"
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800"
                      >
                        Monitoring
                      </Link>
                    </div>
                  </div>

                  <p className="text-sm">
                    developer productivity engineer として、開発者生産性向上に従事
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                  <div className="mb-2">
                    <h4 className="font-bold">Product Backend Engineer</h4>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400 mt-1">
                      <span>2021/04 - 2024/03</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Link
                        href="/tags/Go"
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800"
                      >
                        Go
                      </Link>
                      <Link
                        href="/tags/Google Cloud"
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800"
                      >
                        Google Cloud
                      </Link>
                      <Link
                        href="/tags/Kubernetes"
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800"
                      >
                        Kubernetes
                      </Link>
                      <Link
                        href="/tags/MongoDB"
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800"
                      >
                        MongoDB
                      </Link>
                    </div>
                  </div>

                  <p className="text-sm">
                    Backend Engineer として、サービスの開発・運用に従事
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Certifications</h2>
          <div className="space-y-4">
            <article className="pb-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                2023/12
              </div>
              <a
                href="https://www.credential.net/f5b24217-bd7d-46fb-a21f-d1de65976a03"
                target="_blank"
                rel="noopener noreferrer"
              >
                <h3 className="font-medium hover:underline">Professional Data Engineer</h3>
              </a>
              <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
                Google Cloud Certified
              </p>
            </article>
            <article className="pb-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                2023/03
              </div>
              <a
                href="https://www.credential.net/a595b0d9-5297-4d2e-8045-907be4a21939"
                target="_blank"
                rel="noopener noreferrer"
              >
                <h3 className="font-medium hover:underline">Professional Cloud Security Engineer</h3>
              </a>
              <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
                Google Cloud Certified
              </p>
            </article>
            <article className="pb-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                2022/10
              </div>
              <a
                href="https://www.credential.net/e5ad5f41-bf18-44a9-ade1-0005ab293c6e"
                target="_blank"
                rel="noopener noreferrer"
              >
                <h3 className="font-medium hover:underline">Professional Cloud Developer</h3>
              </a>
              <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
                Google Cloud Certified
              </p>
            </article>
            <article className="pb-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                2022/02
              </div>
              <a
                href="https://www.credential.net/1fe360ea-22e9-4dac-bc95-081f6108e9a5"
                target="_blank"
                rel="noopener noreferrer"
              >
                <h3 className="font-medium hover:underline">Professional Cloud Architect</h3>
              </a>
              <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
                Google Cloud Certified
              </p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}

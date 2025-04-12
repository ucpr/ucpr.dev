import { Feed } from 'feed';
import { getAllArticles, Article } from './article';
import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://ucpr.dev';

export async function generateRssFeed(): Promise<Feed> {
  const articles = await getAllArticles();

  const feed = new Feed({
    title: 'ucpr.dev',
    description: 'ucpr\'s personal website',
    id: SITE_URL,
    link: SITE_URL,
    language: 'ja',
    favicon: `${SITE_URL}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ucpr`,
    author: {
      name: 'ucpr',
      link: SITE_URL,
    }
  });

  articles.forEach((article: Article) => {
    feed.addItem({
      title: article.title,
      id: `${SITE_URL}/articles/${article.slug}`,
      link: `${SITE_URL}/articles/${article.slug}`,
      description: article.description,
      date: new Date(article.publishedAt),
      content: article.description,
    });
  });

  return feed;
}

/**
 * RSSフィードを生成して静的ファイルとして出力する
 * ビルド時に実行される関数
 */
export async function generateRssFile(): Promise<void> {
  const feed = await generateRssFeed();
  const publicDirectory = path.join(process.cwd(), 'public');
  
  // publicディレクトリが存在しない場合は作成
  if (!fs.existsSync(publicDirectory)) {
    fs.mkdirSync(publicDirectory, { recursive: true });
  }
  
  // RSSフィードをXMLとして出力
  fs.writeFileSync(path.join(publicDirectory, 'rss.xml'), feed.rss2());
  
  // Atomフォーマットでも出力
  fs.writeFileSync(path.join(publicDirectory, 'atom.xml'), feed.atom1());
  
  // JSONフォーマットでも出力
  fs.writeFileSync(path.join(publicDirectory, 'feed.json'), feed.json1());
  
  console.log('RSS files generated successfully');
}

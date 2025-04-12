import { MetadataRoute } from 'next';
import { generateRssFile } from '@/utils/rss';

// ビルド時にRSSファイルを生成
export async function generateStaticParams() {
  await generateRssFile();
  return [];
}

// 空のサイトマップを返す（実際のサイトマップは別途定義する必要があります）
export default function Sitemap(): MetadataRoute.Sitemap {
  return [];
}

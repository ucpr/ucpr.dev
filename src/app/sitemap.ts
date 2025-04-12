import { MetadataRoute } from 'next';

// 静的生成のための設定
export const dynamic = 'force-static';

// 空のサイトマップを返す（実際のサイトマップは別途定義する必要があります）
export default function Sitemap(): MetadataRoute.Sitemap {
  return [];
}

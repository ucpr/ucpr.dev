import { getAllArticles, getArticleBySlug } from '@/utils/article';

/**
 * すべての記事を取得する
 */
export async function getArticles() {
  return await getAllArticles();
}

/**
 * 特定のスラッグを持つ記事を取得する
 */
export async function getArticle(slug: string) {
  return await getArticleBySlug(slug);
} 
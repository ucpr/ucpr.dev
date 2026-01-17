import { getAllArticles } from "@/utils/article";

/**
 * すべての記事を取得する
 */
export async function getArticles() {
	return await getAllArticles();
}

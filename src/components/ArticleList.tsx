import { getCollection, getEntry } from "astro:content";

const ArticleList = async () => {
	const allArticles = await getCollection("articles");
	console.log(allArticles);

	return <></>;
};

export default ArticleList;

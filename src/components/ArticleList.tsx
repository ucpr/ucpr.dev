import { getCollection } from "astro:content";

const ArticleList = async () => {
	const allArticles = await getCollection("articles");

	return (
		<>
			<ul>
				{allArticles.map((article) => (
					<li key={article.slug}>
						<a href={`/articles/${article.slug}`}>{article.title}</a>
					</li>
				))}
			</ul>
		</>
	);
};

export default ArticleList;

import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
	const articles = await getCollection("articles");

	return rss({
		title: "ucpr.dev",
		description: "ucpr's articles rss feed",
		site: context.site,
		items: articles.map((article) => ({
			title: article.data.title,
			pubDate: article.data.date,
			description: article.data.description,
			// customData: post.data.customData,
			link: `/articles/${article.slug}`,
		})),
	});
}

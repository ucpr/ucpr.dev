import { Hono } from "hono";
import { cors } from "hono/cors";
import { fetchOgpData } from "./utils/ogp";

const app = new Hono();

app.use(
	cors({
		origin: ["https://ucpr.dev", "http://localhost:3000"],
		allowMethods: ["GET"],
		maxAge: 86400,
	}),
);

app.get("/", (c) => {
	return c.text("OGP Info API");
});

app.get("/ogp", async (c) => {
	const url = c.req.query("url");

	if (!url) {
		return c.json({ error: "URL parameter is required" }, { status: 400 });
	}

	try {
		const ogpData = await fetchOgpData(url);

		return c.json(ogpData);
	} catch (error) {
		console.error("Error fetching OGP data:", error);

		return c.json(
			{
				error: "Failed to fetch OGP data",
				url: url,
				title: url,
				description: "リンク先の情報を取得できませんでした",
			},
			{ status: 500 },
		);
	}
});

export default app;

import { Hono } from "hono";
import { cors } from "hono/cors";
import { fetchOgpData } from "./utils/ogp";

// Cache durations in seconds
const POSITIVE_CACHE_TTL = 604800; // 1 week
const NEGATIVE_CACHE_TTL = 10800; // 3 hours

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

	// Create cache key based on the URL
	const cacheKey = new Request(`${url}`);
	const cache = caches.default;

	// Try to get the cached response
	let response = await cache.match(cacheKey);
	if (response) {
		return response;
	}

	try {
		const ogpData = await fetchOgpData(url);

		// Create a new response with the OGP data
		response = Response.json(ogpData);

		// Set cache control headers for successful responses
		response.headers.set(
			"Cache-Control",
			`public, max-age=${POSITIVE_CACHE_TTL}`,
		);

		// Store the response in the cache
		c.executionCtx.waitUntil(cache.put(cacheKey, response.clone()));

		return response;
	} catch (error) {
		console.error("Error fetching OGP data:", error);

		const errorData = {
			error: "Failed to fetch OGP data",
			url: url,
			title: url,
			description: "リンク先の情報を取得できませんでした",
		};

		// Create a new response with the error data
		response = Response.json(errorData, { status: 500 });

		// Set cache control headers for error responses (negative caching)
		response.headers.set(
			"Cache-Control",
			`public, max-age=${NEGATIVE_CACHE_TTL}`,
		);

		// Store the error response in the cache
		c.executionCtx.waitUntil(cache.put(cacheKey, response.clone()));

		return response;
	}
});

export default app;

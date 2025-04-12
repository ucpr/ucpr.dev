import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

// Define environment interface for type safety
interface Env {
	IMAGES_BUCKET: R2Bucket;
}

const app = new Hono<{ Bindings: Env }>();

// Image proxy endpoint
app.get("/images/:imagePath{.*}", async (c) => {
	try {
		const imagePath = c.req.param("imagePath");

		if (!imagePath) {
			throw new HTTPException(400, { message: "Image path is required" });
		}

		// Get the image from R2
		const object = await c.env.IMAGES_BUCKET.get(imagePath);

		if (!object) {
			throw new HTTPException(404, { message: "Image not found" });
		}

		// Get content type or default to application/octet-stream
		const contentType =
			object.httpMetadata?.contentType || "application/octet-stream";

		// Create response with appropriate headers
		const headers = new Headers();
		headers.set("Content-Type", contentType);
		headers.set("Cache-Control", "public, max-age=31536000"); // Cache for 1 year
		headers.set("ETag", object.httpEtag);

		// Return the image
		return new Response(object.body, {
			headers,
		});
	} catch (error) {
		if (error instanceof HTTPException) {
			throw error;
		}
		console.error("Error fetching image:", error);
		return c.json({ error: "Internal server error" }, 500);
	}
});

export default app;

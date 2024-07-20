import { z, defineCollection } from "astro:content";

const articles = defineCollection({
  type: "content",
  schema: z.object({
    isDraft: z.boolean(),
    title: z.string(),
    description: z.string(),
    date: z.string(),
    tags: z.array(z.string()),
  }),
});

export const collections = {
  articles,
};

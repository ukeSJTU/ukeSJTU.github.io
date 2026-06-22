import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

function removeDupsAndLowerCase(array: string[]) {
	return [...new Set(array.map((str) => str.toLowerCase()))];
}

const titleSchema = z.string().max(60);

const baseSchema = z.object({
	title: titleSchema,
});

const postDateSchema = z
	.string()
	.or(z.date())
	.transform((val) => new Date(val));

const optionalDateSchema = z
	.string()
	.or(z.date())
	.optional()
	.transform((val) => (val ? new Date(val) : undefined));

const post = defineCollection({
	loader: glob({ base: "./src/content/post", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) =>
		baseSchema.extend({
			description: z.string(),
			coverImage: z
				.object({
					alt: z.string(),
					src: image(),
				})
				.optional(),
			draft: z.boolean().default(false),
			ogImage: z.string().optional(),
			series: reference("series"),
			tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
			publishDate: postDateSchema,
			updatedDate: optionalDateSchema,
			pinned: z.boolean().default(false),
		}),
});

const note = defineCollection({
	loader: glob({ base: "./src/content/note", pattern: "**/*.{md,mdx}" }),
	schema: baseSchema.extend({
		description: z.string().optional(),
		publishDate: z.iso
			.datetime({ offset: true }) // Ensures ISO 8601 format with offsets allowed (e.g. "2024-01-01T00:00:00Z" and "2024-01-01T00:00:00+02:00")
			.transform((val) => new Date(val)),
	}),
});

const tag = defineCollection({
	loader: glob({ base: "./src/content/tag", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: titleSchema.optional(),
		description: z.string().optional(),
	}),
});

const series = defineCollection({
	loader: glob({ base: "./src/content/series", pattern: "**/*.{md,mdx}" }),
	schema: baseSchema.extend({
		description: z.string().optional(),
	}),
});

const project = defineCollection({
	loader: glob({ base: "./src/content/project", pattern: "**/*.{md,mdx}" }),
	schema: baseSchema.extend({
		description: z.string(),
		publishDate: postDateSchema,
		updatedDate: optionalDateSchema,
		status: z.enum(["active", "completed", "archived"]),
		techStack: z.array(z.string()).default([]),
		repoUrl: z.url().optional(),
		demoUrl: z.url().optional(),
		featured: z.boolean().default(false),
	}),
});

export const collections = { post, note, tag, series, project };

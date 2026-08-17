import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Topics: the topical silo.
 * Level 1: platform  (facebook-marketing, instagram-marketing)
 * Level 2: discipline (organisch, adverteren, funnels, copywriting)
 * Level 3: niche      (cleaning, supplementen, beauty-cosmetica, food-beverage)
 * File id convention: "facebook/adverteren" or "facebook/adverteren/supplementen".
 * Only entries with live: true are built, linked and listed in the sitemap.
 */
const topics = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/topics' }),
  schema: z
    .object({
      title: z.string(),
      description: z.string().max(170),
      level: z.enum(['platform', 'discipline', 'niche']),
      platform: z.enum(['facebook', 'instagram']),
      discipline: z.enum(['organisch', 'adverteren', 'funnels', 'copywriting']).optional(),
      niche: z.enum(['cleaning', 'supplementen', 'beauty-cosmetica', 'food-beverage']).optional(),
      live: z.boolean().default(false),
      summary: z.string(),
      seoTitle: z.string().optional(),
      updatedAt: z.coerce.date(),
    })
    .refine((t) => t.level === 'platform' || t.discipline !== undefined, {
      message: 'discipline is required for discipline- and niche-level topics',
    })
    .refine((t) => t.level !== 'niche' || t.niche !== undefined, {
      message: 'niche is required for niche-level topics',
    }),
});

const authors = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    sameAs: z.array(z.string().url()).default([]),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z
    .object({
      title: z.string().max(80),
      description: z.string().max(170),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      author: reference('authors'),
      topic: reference('topics'),
      tags: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      heroImage: z.string().optional(),
      heroImageAlt: z.string().optional(),
      seoTitle: z.string().optional(),
      canonical: z.string().url().optional(),
      summary: z.string(),
      sources: z.array(z.object({ title: z.string(), url: z.string().url() })).default([]),
      relatedSlugs: z.array(z.string()).default([]),
      cta: z.boolean().default(true),
    })
    .refine((a) => !a.heroImage || (a.heroImageAlt !== undefined && a.heroImageAlt.length > 0), {
      message: 'heroImageAlt is required when heroImage is set',
    }),
});

/**
 * Cases: prepared for the future, intentionally empty at launch.
 * No navigation or section renders while the collection is empty.
 */
const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(170),
    client: z.string().optional(),
    sector: z.string(),
    problem: z.string(),
    approach: z.string(),
    testimonial: z.object({ quote: z.string(), name: z.string(), role: z.string() }).optional(),
    publishedAt: z.coerce.date(),
    draft: z.boolean().default(true),
  }),
});

export const collections = { topics, authors, articles, cases };

import { getCollection, type CollectionEntry } from 'astro:content';

export const SITE = {
  name: 'Agency Architect',
  url: 'https://www.agencyarchitect.nl',
  description:
    'Growth consultancy voor creative Meta advertising. Agency Architect helpt founders van gezonde e-commerce merken een merk-eigen en schaalbare creative strategy opbouwen.',
  cta: 'Ontdek of je Meta-strategie schaalbaar is',
} as const;

export type Topic = CollectionEntry<'topics'>;

const PLATFORM_SLUGS: Record<string, string> = {
  facebook: 'facebook-marketing',
  instagram: 'instagram-marketing',
};

/** Path segments for a topic, e.g. ["facebook-marketing", "adverteren", "supplementen"]. */
export function topicSegments(topic: Topic): string[] {
  const segments = [PLATFORM_SLUGS[topic.data.platform]];
  if (topic.data.discipline) segments.push(topic.data.discipline);
  if (topic.data.niche) segments.push(topic.data.niche);
  return segments;
}

/** Site-relative URL for a topic, with trailing slash. */
export function topicUrl(topic: Topic): string {
  return `/${topicSegments(topic).join('/')}/`;
}

/** All topics that are live (built, linked, listed). */
export async function getLiveTopics(): Promise<Topic[]> {
  const topics = await getCollection('topics');
  return topics.filter((t) => t.data.live);
}

/** Live children of a topic (platform → disciplines, discipline → niches). */
export function childrenOf(topic: Topic, all: Topic[]): Topic[] {
  if (topic.data.level === 'platform') {
    return all.filter((t) => t.data.level === 'discipline' && t.data.platform === topic.data.platform);
  }
  if (topic.data.level === 'discipline') {
    return all.filter(
      (t) =>
        t.data.level === 'niche' &&
        t.data.platform === topic.data.platform &&
        t.data.discipline === topic.data.discipline,
    );
  }
  return [];
}

/** Live siblings of a topic within the same branch (excluding itself). */
export function siblingsOf(topic: Topic, all: Topic[]): Topic[] {
  if (topic.data.level === 'platform') {
    return all.filter((t) => t.data.level === 'platform' && t.id !== topic.id);
  }
  if (topic.data.level === 'discipline') {
    return all.filter(
      (t) => t.data.level === 'discipline' && t.data.platform === topic.data.platform && t.id !== topic.id,
    );
  }
  return all.filter(
    (t) =>
      t.data.level === 'niche' &&
      t.data.platform === topic.data.platform &&
      t.data.discipline === topic.data.discipline &&
      t.id !== topic.id,
  );
}

/** Live parent of a topic, if any. */
export function parentOf(topic: Topic, all: Topic[]): Topic | undefined {
  if (topic.data.level === 'niche') {
    return all.find(
      (t) =>
        t.data.level === 'discipline' &&
        t.data.platform === topic.data.platform &&
        t.data.discipline === topic.data.discipline,
    );
  }
  if (topic.data.level === 'discipline') {
    return all.find((t) => t.data.level === 'platform' && t.data.platform === topic.data.platform);
  }
  return undefined;
}

/** Breadcrumb trail from home to (and including) the topic. */
export function breadcrumbTrail(topic: Topic, all: Topic[]): { name: string; url: string }[] {
  const trail: { name: string; url: string }[] = [{ name: 'Home', url: '/' }];
  const parent = parentOf(topic, all);
  if (parent) {
    const grandparent = parentOf(parent, all);
    if (grandparent) trail.push({ name: grandparent.data.title, url: topicUrl(grandparent) });
    trail.push({ name: parent.data.title, url: topicUrl(parent) });
  }
  trail.push({ name: topic.data.title, url: topicUrl(topic) });
  return trail;
}

/** Published (non-draft) articles, newest first. */
export async function getPublishedArticles() {
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  return articles.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

/** Reading time in whole minutes from markdown body. */
export function readingMinutes(body: string | undefined): number {
  if (!body) return 1;
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

import { cache } from "react";
import { toHTML } from "@portabletext/to-html";
import { allPosts, type Post } from "@/lib/content";
import { sanityClient } from "@/lib/sanity";

export const NEWS_PER_PAGE = 9;

type SanityNews = {
  title: string;
  slug: string;
  date: string;
  _updatedAt: string;
  excerpt?: string;
  image?: string;
  categories?: { slug?: string; name?: string }[];
  body?: unknown[];
};

const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

export function youtubeEmbed(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

function bodyToHtml(body: unknown[] | undefined): string {
  if (!body?.length) return "";
  return toHTML(body as never, {
    onMissingComponent: false,
    components: {
      types: {
        image: ({ value }: { value: { url?: string; alt?: string } }) =>
          value.url ? `<img src="${esc(value.url)}?w=1600&auto=format" alt="${esc(value.alt ?? "")}" loading="lazy">` : "",
        youtube: ({ value }: { value: { url?: string } }) => {
          const src = value.url ? youtubeEmbed(value.url) : null;
          return src ? `<iframe src="${src}" title="YouTube snimak" loading="lazy" allowfullscreen></iframe>` : "";
        },
      },
    },
  });
}

/** Datum po beogradskom vremenu: godina, mesec, dan. */
function dateParts(iso: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Belgrade",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { year: get("year"), month: get("month"), day: get("day") };
}

function toPost(n: SanityNews): Post {
  const html = bodyToHtml(n.body);
  const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const excerpt = n.excerpt?.trim() || (plain.length > 220 ? `${plain.slice(0, 220).trimEnd()}…` : plain);
  const image = n.image ? `${n.image}?w=1600&auto=format` : null;
  return {
    slug: n.slug,
    ...dateParts(n.date),
    date: n.date,
    modified: n._updatedAt,
    title: n.title,
    excerpt,
    image,
    html,
    meta: {
      title: null,
      description: excerpt,
      canonical: null,
      ogImage: image,
      ogType: "article",
      published: n.date,
      modified: n._updatedAt,
    },
    categories: (n.categories ?? [])
      .filter((c): c is { slug: string; name: string } => !!c?.slug && !!c?.name)
      .map((c) => ({ slug: c.slug, name: c.name })),
  };
}

async function fetchSanityPosts(): Promise<Post[]> {
  if (!sanityClient) return [];
  try {
    const rows = await sanityClient.fetch<SanityNews[]>(
      `*[_type == "news" && defined(slug.current) && defined(date) && date <= now()] | order(date desc){
        title, "slug": slug.current, date, _updatedAt, excerpt,
        "image": image.asset->url,
        "categories": categories[]->{ "slug": slug.current, "name": title },
        body[]{ ..., _type == "image" => { ..., "url": asset->url } }
      }`,
      {},
      { next: { revalidate: 60 } },
    );
    return (rows ?? []).map(toPost);
  } catch {
    return [];
  }
}

/** Sve vesti: nove iz Sanity-ja + postojeće iz content/posts.json, najnovije prvo. */
export const getAllPosts = cache(async (): Promise<Post[]> => {
  const sanity = await fetchSanityPosts();
  const key = (p: Post) => `${p.year}/${p.month}/${p.day}/${p.slug}`;
  const seen = new Set(sanity.map(key));
  const merged = [...sanity, ...allPosts.filter((p) => !seen.has(key(p)))];
  return merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

export const getNewsPages = async () => Math.max(1, Math.ceil((await getAllPosts()).length / NEWS_PER_PAGE));

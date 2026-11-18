import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { allPages, postPath } from "@/lib/content";
import { getAllPosts, getNewsPages } from "@/lib/news";
import { newsPath } from "@/components/home/NewsList";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPosts = await getAllPosts();
  const NEWS_PAGES = await getNewsPages();
  const pages = allPages
    .filter((p) => p.slug !== "klub-malog-fudbala-21")
    .map((p) => ({
      url: `${SITE_URL}/${p.slug}/`,
      lastModified: new Date(p.modified),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  const posts = allPosts.map((p) => ({
    url: `${SITE_URL}${postPath(p)}`,
    lastModified: new Date(p.modified),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));
  const newsPages = Array.from({ length: Math.max(0, NEWS_PAGES - 1) }, (_, i) => ({
    url: `${SITE_URL}${newsPath(i + 2)}`,
    changeFrequency: "weekly" as const,
    priority: 0.4,
  }));
  return [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/en/`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    ...pages,
    ...newsPages,
    ...posts,
  ];
}

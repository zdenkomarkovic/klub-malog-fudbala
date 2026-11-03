import posts from "@/content/posts.json";
import pages from "@/content/pages.json";
import { SITE_URL } from "./constants";

export interface Meta {
  title: string | null;
  description: string | null;
  canonical: string | null;
  ogImage: string | null;
  ogType: string | null;
  published: string | null;
  modified: string | null;
}
export interface Post {
  slug: string; year: string; month: string; day: string;
  date: string; modified: string; title: string; excerpt: string;
  image: string | null; html: string; meta: Meta;
  categories: { slug: string; name: string }[];
}
export interface PageContent {
  slug: string; title: string; modified: string; html: string; meta: Meta;
}

export const allPosts = posts as Post[];
export const allPages = pages as PageContent[];

export const postPath = (p: Post) => `/${p.year}/${p.month}/${p.day}/${p.slug}/`;
export const getPost = (y: string, m: string, d: string, slug: string) =>
  allPosts.find((p) => p.year === y && p.month === m && p.day === d && p.slug === slug);
export const getPage = (slug: string) => allPages.find((p) => p.slug === slug);
export const absolute = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path}`);
/** Naslov bez sufiksa " - Klub malog fudbala 21" koji dodaje Yoast. */
export const bareTitle = (t: string | null, fallback: string) =>
  (t ?? fallback).replace(/\s+-\s+Klub malog fudbala 21$/, "");

/** URL slike sa starog sajta -> lokalna putanja (slike su kopirane u /public/wp-content). */
export const toLocal = (u: string | null | undefined) =>
  u ? u.replace(/^https?:\/\/(?:www\.)?kmf21\.rs/, "") : null;

/**
 * Uklanja prazne linkove (#) oko slika preostale iz WordPress galerija, a uzastopne
 * slike slaže u mrežu (do 4 u jednom redu).
 */
export const tidyHtml = (html: string) =>
  html
    .replace(/<a href="#">\s*(<img[^>]*>)\s*<\/a>/g, "$1")
    .replace(/<iframe[^>]*><\/iframe>/g, (f) => `<div class="video">${f}</div>`)
    // uzastopni YouTube snimci -> mreža (2 u redu)
    .replace(/<div class="video"><iframe[^>]*><\/iframe><\/div>(?:\s*<div class="video"><iframe[^>]*><\/iframe><\/div>)+/g, (run) => `<div class="video-row">${run}</div>`)
    // uzastopni mp4 snimci -> mreža
    .replace(/<video[^>]*><\/video>(?:\s*<video[^>]*><\/video>)+/g, (run) => `<div class="video-row">${run}</div>`)
    .replace(/<img[^>]*>(?:\s*<img[^>]*>)+/g, (run) => {
      const imgs = run.match(/<img[^>]*>/g) ?? [];
      // 5, 9, ... slika: prva je velika (cela širina), ostale idu po 4 u red
      const hero = imgs.length >= 5 && imgs.length % 4 === 1 ? imgs.shift() : null;
      const row = `<div class="img-row img-row-${Math.min(imgs.length, 4)}">${imgs.join("")}</div>`;
      return hero ? `<div class="img-hero">${hero}</div>${row}` : row;
    });

export const trimDesc = (s: string | null) => (s ? s.replace(/\s*\[…\]\s*$/, "…") : undefined);

// ─── Arhive i kategorije (sidebar na stranici Vesti) ───────────────────────────

const MONTHS = ["januar", "februar", "mart", "april", "maj", "jun", "jul", "avgust", "septembar", "oktobar", "novembar", "decembar"];
export const monthLabel = (year: string, month: string) => `${MONTHS[Number(month) - 1]} ${year}`;
export const archivePath = (year: string, month: string) => `/${year}/${month}/`;
export const categoryPath = (slug: string) => `/category/${slug}/`;

export function getArchives() {
  const map = new Map<string, { year: string; month: string; count: number }>();
  for (const p of allPosts) {
    const k = `${p.year}-${p.month}`;
    const e = map.get(k);
    if (e) e.count++;
    else map.set(k, { year: p.year, month: p.month, count: 1 });
  }
  return [...map.values()]; // allPosts je već sortiran od najnovijeg
}

export function getCategories() {
  const map = new Map<string, { slug: string; name: string; count: number }>();
  for (const p of allPosts)
    for (const c of p.categories) {
      const e = map.get(c.slug);
      if (e) e.count++;
      else map.set(c.slug, { ...c, count: 1 });
    }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { allPosts, categoryPath, getCategories } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { NewsList } from "@/components/home/NewsList";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategories().find((c) => c.slug === slug);
  if (!cat) return {};
  return buildMetadata({
    title: `${cat.name} - Klub malog fudbala 21`,
    description: `Vesti iz kategorije ${cat.name} – Klub malog fudbala 21, Kragujevac.`,
    path: categoryPath(slug),
  });
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = getCategories().find((c) => c.slug === slug);
  if (!cat) notFound();
  const list = allPosts.filter((p) => p.categories.some((c) => c.slug === slug));
  return <NewsList title={cat.name} eyebrow="Kategorija" list={list} />;
}

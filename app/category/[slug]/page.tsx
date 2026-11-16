import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { categoryPath, getCategories } from "@/lib/content";
import { getAllPosts } from "@/lib/news";
import { buildMetadata } from "@/lib/metadata";
import { NewsList } from "@/components/home/NewsList";

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  return getCategories(await getAllPosts()).map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategories(await getAllPosts()).find((c) => c.slug === slug);
  if (!cat) return {};
  return buildMetadata({
    title: `${cat.name} - Klub malog fudbala 21`,
    description: `Vesti iz kategorije ${cat.name} – Klub malog fudbala 21, Kragujevac.`,
    path: categoryPath(slug),
  });
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = getCategories(await getAllPosts()).find((c) => c.slug === slug);
  if (!cat) notFound();
  const list = (await getAllPosts()).filter((p) => p.categories.some((c) => c.slug === slug));
  return <NewsList title={cat.name} eyebrow="Kategorija" list={list} />;
}

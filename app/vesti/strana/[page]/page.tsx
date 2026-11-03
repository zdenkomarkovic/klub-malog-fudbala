import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { NEWS_PAGES, NewsList, newsPath } from "@/components/home/NewsList";

export const dynamicParams = false;

// strana 1 je /vesti/, pa ovde idu samo strane od 2 pa nadalje
export function generateStaticParams() {
  return Array.from({ length: Math.max(0, NEWS_PAGES - 1) }, (_, i) => ({ page: String(i + 2) }));
}

type Props = { params: Promise<{ page: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  const n = Number(page);
  return buildMetadata({
    title: `Vesti – strana ${n} - Klub malog fudbala 21`,
    description: "Najnovije vesti iz Kluba malog fudbala 21 iz Kragujevca.",
    path: newsPath(n),
  });
}

export default async function NewsPageN({ params }: Props) {
  const n = Number((await params).page);
  if (!Number.isInteger(n) || n < 2 || n > NEWS_PAGES) notFound();
  return <NewsList page={n} />;
}

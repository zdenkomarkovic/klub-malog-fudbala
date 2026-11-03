import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { allPosts, archivePath, getArchives, monthLabel } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { NewsList } from "@/components/home/NewsList";

export const dynamicParams = false;

export function generateStaticParams() {
  return getArchives().map(({ year, month }) => ({ year, month }));
}

type Props = { params: Promise<{ year: string; month: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year, month } = await params;
  if (!getArchives().some((a) => a.year === year && a.month === month)) return {};
  return buildMetadata({
    title: `${monthLabel(year, month)} - Klub malog fudbala 21`,
    description: `Vesti iz arhive: ${monthLabel(year, month)} – Klub malog fudbala 21, Kragujevac.`,
    path: archivePath(year, month),
  });
}

export default async function ArchivePage({ params }: Props) {
  const { year, month } = await params;
  const list = allPosts.filter((p) => p.year === year && p.month === month);
  if (list.length === 0) notFound();
  return <NewsList title={monthLabel(year, month)} eyebrow="Arhiva" list={list} />;
}

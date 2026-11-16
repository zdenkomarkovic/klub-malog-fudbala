import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ARCHIVE_PAGES, archivePagePath } from "@/lib/archive";
import { ArchiveList } from "@/components/archive/ArchiveList";

export const dynamicParams = false;

// strana 1 je /arhiva/, pa ovde idu samo strane od 2 pa nadalje
export function generateStaticParams() {
  return Array.from({ length: Math.max(0, ARCHIVE_PAGES - 1) }, (_, i) => ({ page: String(i + 2) }));
}

type Props = { params: Promise<{ page: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = Number((await params).page);
  return buildMetadata({
    title: `Arhiva – strana ${n} - Klub malog fudbala 21`,
    description: "Hronološki pregled dešavanja KMF „21.oktobar“ Kragujevac – sezone 2010–2013.",
    path: archivePagePath(n),
  });
}

export default async function ArchivePageN({ params }: Props) {
  const n = Number((await params).page);
  if (!Number.isInteger(n) || n < 2 || n > ARCHIVE_PAGES) notFound();
  return <ArchiveList page={n} />;
}

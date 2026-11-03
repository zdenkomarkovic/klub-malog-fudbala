import { getPage, toLocal, trimDesc } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { NewsList } from "@/components/home/NewsList";

const page = getPage("vesti");

export const metadata = buildMetadata({
  title: page?.meta.title ?? "Vesti - Klub malog fudbala 21",
  description: trimDesc(page?.meta.description ?? null) ?? "Najnovije vesti iz Kluba malog fudbala 21 iz Kragujevca.",
  path: "/vesti/",
  image: toLocal(page?.meta.ogImage),
});

export default function NewsPage() {
  return <NewsList page={1} />;
}

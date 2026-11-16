import { getPage, toLocal, trimDesc } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { TeamPage } from "@/components/team/TeamPage";

const page = getPage("strucni-tim");

export const metadata = buildMetadata({
  title: page?.meta.title ?? "Stručni tim - Klub malog fudbala 21",
  description: trimDesc(page?.meta.description ?? null),
  path: "/strucni-tim/",
  image: toLocal(page?.meta.ogImage),
  type: "article",
  modifiedTime: page?.meta.modified,
});

export default function Page() {
  return <TeamPage lang="sr" />;
}

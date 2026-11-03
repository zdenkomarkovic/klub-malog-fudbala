import { buildMetadata } from "@/lib/metadata";
import { getPage } from "@/lib/content";
import { LOGO_PATH, SITE_NAME } from "@/lib/constants";
import { HomeContent } from "@/components/home/HomeContent";

const home = getPage("klub-malog-fudbala-21");

export const metadata = buildMetadata({
  title: home?.meta.title ?? `${SITE_NAME} - ${SITE_NAME}`,
  description: home?.meta.description ?? undefined,
  path: "/",
  image: LOGO_PATH,
});

export default function HomePage() {
  return <HomeContent lang="sr" />;
}

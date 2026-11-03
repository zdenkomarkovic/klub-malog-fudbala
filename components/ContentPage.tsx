import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { bareTitle, getPage, tidyHtml, toLocal, trimDesc } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/ui/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { PAGE_PAIRS, T } from "@/lib/i18n";

/** Engleska stranica -> srpski slug (dele iste hero slike). */
const EN_TO_SR: Record<string, string> = Object.fromEntries(
  PAGE_PAIRS.filter((p) => p.en !== "/en/").map((p) => [p.en.replace(/\//g, ""), p.sr.replace(/\//g, "")]),
);

/** Hero slike sa originalnog sajta (Elementor pozadine sekcija). */
const U = "/wp-content/uploads";
const HERO_POSITION: Record<string, string> = { takmicanje: "center 12%", inkluzija: "center top" };

// Pozicija mobilne slike (podiže sliku da se vidi više donjeg dela)
const HERO_MOBILE_POSITION: Record<string, string> = { inkluzija: "center 64%" };

const HERO_IMAGES: Record<string, { desktop: string; mobile?: string }> = {
  "o-klubu": { desktop: `${U}/2020/11/pozadina5a.jpg`, mobile: `${U}/2020/11/pozadina5mobile.jpg` },
  "o-malom-fudbalu": { desktop: `${U}/2020/12/pozadina9.jpg`, mobile: `${U}/2020/12/pozadina9mobile.jpg` },
  // Fotografija sa utakmice (teren sa igračima) umesto originalne mutne pozadine
  takmicanje: { desktop: `${U}/2025/07/1000040779-scaled.jpg` },
  inkluzija: { desktop: `${U}/2020/11/pozadina4.jpg`, mobile: `${U}/2020/11/pozadina4a.jpg` },
  "letnji-kamp-kopaonik": { desktop: `${U}/2020/11/pozadina7.jpg`, mobile: `${U}/2020/11/pozadina7amobile.jpg` },
};

/** Metadata stranice preuzeta sa starog sajta (Yoast) – naslov, opis, og slika, datum izmene. */
export function contentMetadata(slug: string): Metadata {
  const page = getPage(slug);
  if (!page) return {};
  return buildMetadata({
    title: page.meta.title ?? `${page.title} - Klub malog fudbala 21`,
    description: trimDesc(page.meta.description),
    path: `/${page.slug}/`,
    lang: slug in EN_TO_SR ? "en" : "sr",
    image: toLocal(page.meta.ogImage),
    type: "article",
    modifiedTime: page.meta.modified,
  });
}

export function ContentPage({ slug }: { slug: string }) {
  const page = getPage(slug);
  if (!page) notFound();
  const isEn = slug in EN_TO_SR;
  const key = EN_TO_SR[slug] ?? slug;
  const t = T[isEn ? "en" : "sr"];
  const animated =
    key === "strucni-tim"
      ? {
          desktop: "/wp-content/uploads/2020/11/futsal-court-animated.gif",
          mobile: "/wp-content/uploads/2020/11/taktika.gif",
        }
      : undefined;

  return (
    <main>
      <PageHero
        title={bareTitle(page.title, page.title)}
        eyebrow={t.common.clubName}
        image={HERO_IMAGES[key]?.desktop ?? toLocal(page.meta.ogImage)}
        mobileImage={HERO_IMAGES[key]?.mobile}
        imagePosition={HERO_POSITION[key]}
        mobileImagePosition={HERO_MOBILE_POSITION[key]}
        bright={key in HERO_IMAGES}
        animated={animated}
      />
      <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
        <div className="prose-kmf" dangerouslySetInnerHTML={{ __html: tidyHtml(page.html) }} />
        <div className="mt-12 flex flex-wrap gap-4 border-t border-brand-50 pt-8">
          <ButtonLink href={t.enrollHref}>{t.common.enrollBtn}</ButtonLink>
          {!isEn && (
            <ButtonLink href="/vesti/" variant="outline">
              {t.common.news}
            </ButtonLink>
          )}
        </div>
      </div>
    </main>
  );
}

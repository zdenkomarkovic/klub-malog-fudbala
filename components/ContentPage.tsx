import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { bareTitle, getPage, tidyHtml, toLocal, trimDesc } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/ui/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { PAGE_PAIRS, T } from "@/lib/i18n";
import { getCampMedia, getCompetitions, getInclusionGallery } from "@/lib/sanity";
import { youtubeEmbed } from "@/lib/news";

/** Engleska stranica -> srpski slug (dele iste hero slike). */
const EN_TO_SR: Record<string, string> = Object.fromEntries(
  PAGE_PAIRS.filter((p) => p.en !== "/en/").map((p) => [p.en.replace(/\//g, ""), p.sr.replace(/\//g, "")]),
);

/** Hero slike sa originalnog sajta (Elementor pozadine sekcija). */
const U = "/wp-content/uploads";
const HERO_POSITION: Record<string, string> = { takmicanje: "center 12%", inkluzija: "center 35%" };
const HERO_DESKTOP_POSITION: Record<string, string> = { inkluzija: "center 55%" };

// Pozicija mobilne slike (podiže sliku da se vidi više donjeg dela)
const HERO_MOBILE_POSITION: Record<string, string> = {};

const HERO_IMAGES: Record<string, { desktop: string; mobile?: string }> = {
  "o-klubu": { desktop: `${U}/2020/11/pozadina5a.jpg`, mobile: `${U}/2020/11/pozadina5mobile.jpg` },
  "o-malom-fudbalu": { desktop: `${U}/2020/12/pozadina9.jpg`, mobile: `${U}/2020/12/pozadina9mobile.jpg` },
  // Fotografija sa utakmice (teren sa igračima) umesto originalne mutne pozadine
  takmicanje: { desktop: `${U}/2025/07/1000040779-scaled.jpg` },
  inkluzija: { desktop: "/1000043524.jpg" },
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

export async function ContentPage({ slug }: { slug: string }) {
  const page = getPage(slug);
  if (!page) notFound();
  const isEn = slug in EN_TO_SR;
  const key = EN_TO_SR[slug] ?? slug;
  const t = T[isEn ? "en" : "sr"];

  // Inkluzija: fotografije se dodaju preko Sanity-ja; ako ih nema, ostaju slike iz sadržaja.
  let html = page.html;
  if (key === "inkluzija") {
    const gallery = await getInclusionGallery();
    if (gallery) {
      const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
      const tag = (g: { url: string; alt: string }) => `<img src="${esc(g.url)}" alt="${esc(g.alt)}" loading="lazy">`;
      // Zadržava raspored originala: 1. slika posle uvodnog teksta, ostale u mreži posle drugog dela teksta.
      let n = 0;
      html = html.replace(/<img[^>]*>/g, () => {
        n++;
        if (n === 1) return tag(gallery[0]!);
        if (n === 2) return gallery.slice(1).map(tag).join("");
        return "";
      });
    }
  }
  // Letnji kamp: fotografije i YouTube snimci se dodaju preko Sanity-ja; ako ih nema, ostaju oni iz sadržaja.
  if (key === "letnji-kamp-kopaonik") {
    const media = await getCampMedia();
    if (media) {
      const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
      const img = (g: { url: string; alt: string }) => `<img src="${esc(g.url)}" alt="${esc(g.alt)}" loading="lazy">`;
      const video = (v: { url: string; title: string }) => {
        const src = youtubeEmbed(v.url);
        return src
          ? `<iframe src="${src.replace("youtube.com", "youtube-nocookie.com")}" loading="lazy" allowfullscreen title="${esc(v.title || "Video")}"></iframe>`
          : "";
      };
      // 1. slika na svom mestu, ostale u mreži; snimci na mestu starih snimaka
      let n = 0;
      html = html.replace(/<img[^>]*>/g, () => {
        n++;
        if (n === 1) return media.photos[0] ? img(media.photos[0]) : "";
        if (n === 2) return media.photos.slice(1).map(img).join("");
        return "";
      });
      let v = 0;
      html = html.replace(/<iframe[^>]*><\/iframe>/g, () => {
        v++;
        return v === 1 ? media.videos.map(video).join("") : "";
      });
    }
  }
  // Takmičenja: hronologija se vodi preko Sanity-ja (najnovija sezona prva); ako je nema, ostaje sadržaj stranice.
  if (key === "takmicanje") {
    const seasons = await getCompetitions(isEn ? "en" : "sr");
    if (seasons) {
      const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      html =
        `<h2>${isEn ? "Chronology" : "Hronologija takmičenja"}</h2>` +
        seasons
          .map(
            (s) =>
              (s.intro ? `<p>${esc(s.intro)}</p>` : "") +
              (s.items.length ? `<ul>${s.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` : ""),
          )
          .join("");
    }
  }
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
        desktopImagePosition={HERO_DESKTOP_POSITION[key]}
        mobileImagePosition={HERO_MOBILE_POSITION[key]}
        bright={key in HERO_IMAGES}
        animated={animated}
        tall={key === "inkluzija"}
      />
      <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
        <div className="prose-kmf" dangerouslySetInnerHTML={{ __html: tidyHtml(html) }} />
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

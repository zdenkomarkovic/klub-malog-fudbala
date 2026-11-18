import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { bareTitle, getPage, tidyHtml, toLocal, trimDesc } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/ui/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { PAGE_PAIRS, T } from "@/lib/i18n";
import { getCampMedia, getCompetitions, getInclusionGallery } from "@/lib/sanity";
import { youtubeEmbed } from "@/lib/news";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

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
              `<section class="season-block"><h3>${isEn ? "Season" : "Sezona"} ${esc(s.season)}</h3>` +
              (s.intro ? `<p>${esc(s.intro)}</p>` : "") +
              (s.items.length ? `<ul>${s.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` : "") +
              `</section>`,
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

  const pageUrl = `${SITE_URL}/${page.slug}/`;
  const homeUrl = `${SITE_URL}${isEn ? "/en/" : "/"}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: bareTitle(page.title, page.title),
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
        inLanguage: isEn ? "en" : "sr-RS",
        ...(page.meta.modified && { dateModified: page.meta.modified }),
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: homeUrl },
          { "@type": "ListItem", position: 2, name: bareTitle(page.title, page.title), item: pageUrl },
        ],
      },
    ],
  };

  return (
    <main>
      <JsonLd data={schema} />
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
        {key === "o-klubu" && (
          <aside className="mb-10 flex flex-col items-center gap-4 rounded-3xl bg-navy-900 p-6 text-center text-white shadow-lg sm:flex-row sm:gap-8 sm:p-8 sm:text-left">
            <div className="shrink-0 font-display text-5xl font-extrabold text-gold-400 sm:text-6xl">2009</div>
            <div>
              <h2 className="text-xl font-extrabold sm:text-2xl">
                {isEn ? "18th season of continuous work" : "18. sezona kontinuiranog rada"}
              </h2>
              <p className="mt-2 text-white/85">
                {isEn
                  ? "The club was founded in 2009. Everything we do today builds on nearly two decades of work with children, coaches and parents."
                  : "Klub je osnovan 2009. godine. Sve što radimo danas nadovezuje se na skoro dve decenije rada sa decom, trenerima i roditeljima."}
              </p>
            </div>
          </aside>
        )}
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

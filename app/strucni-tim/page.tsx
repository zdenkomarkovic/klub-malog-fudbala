import Image from "next/image";
import { getPage, toLocal, trimDesc } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { TEAM } from "@/lib/team";
import { PageHero } from "@/components/ui/PageHero";

const page = getPage("strucni-tim");

export const metadata = buildMetadata({
  title: page?.meta.title ?? "Stručni tim - Klub malog fudbala 21",
  description: trimDesc(page?.meta.description ?? null),
  path: "/strucni-tim/",
  image: toLocal(page?.meta.ogImage),
  type: "article",
  modifiedTime: page?.meta.modified,
});

export default function TeamPage() {
  return (
    <main>
      <PageHero
        title="Stručni tim"
        eyebrow="Naš tim"
        animated={{
          desktop: "/wp-content/uploads/2020/11/futsal-court-animated.gif",
          mobile: "/wp-content/uploads/2020/11/taktika.gif",
        }}
      >
        Naš rad zasniva se na entuzijazmu trenera i dečaka koji vole sport i fudbal na malom prostoru. Dakle, mali fudbal
        kroz zabavu i druženje.
      </PageHero>

      <div className="mx-auto max-w-7xl space-y-10 px-5 py-12 sm:py-16">
        {TEAM.map((m, i) => (
          <article
            key={m.name}
            id={m.name.toLowerCase().replace(/[^a-z]+/g, "-")}
            className="grid gap-6 rounded-3xl bg-white p-5 shadow-md ring-1 ring-brand-50 sm:grid-cols-[220px_1fr] sm:p-6"
          >
            <div data-lightbox className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-50">
              <Image
                src={m.photo}
                alt={m.name}
                fill
                priority={i < 2}
                sizes="(min-width: 640px) 220px, 100vw"
                className="object-cover object-top"
              />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-navy-900">{m.name}</h2>
              <p className="mt-1 font-semibold text-brand-700">{m.role}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {m.tags.map((t) => (
                  <li key={t} className="rounded-full bg-gold-500/15 px-3 py-1 text-xs font-bold text-gold-700">
                    {t}
                  </li>
                ))}
              </ul>
              <h3 className="mt-5 text-sm font-extrabold uppercase tracking-wider text-navy-900">
                Biografija i sportska karijera
              </h3>
              <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted">
                {m.bio.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </article>
        ))}
        <p className="rounded-2xl bg-brand-50 p-6 text-center font-semibold text-navy-900">
          Naš primarni cilj je da razvijemo kod dečaka ljubav prema ovom sportu i odnegujemo čitav niz fizičkih,
          psiholoških i socioloških kvaliteta ličnosti, na koje se bavljenje sportom poziva.
        </p>
      </div>
    </main>
  );
}

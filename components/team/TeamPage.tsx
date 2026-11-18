import Image from "next/image";
import { getTeam } from "@/lib/sanity";
import { PageHero } from "@/components/ui/PageHero";

const COPY = {
  sr: {
    title: "Stručni tim",
    eyebrow: "Naš tim",
    intro:
      "Naš rad zasniva se na entuzijazmu trenera i dečaka koji vole sport i fudbal na malom prostoru. Dakle, mali fudbal kroz zabavu i druženje.",
    bioHeading: "Biografija i sportska karijera",
    goal: "Naš primarni cilj je da razvijemo kod dečaka ljubav prema ovom sportu i odnegujemo čitav niz fizičkih, psiholoških i socioloških kvaliteta ličnosti, na koje se bavljenje sportom poziva.",
  },
  en: {
    title: "Expert team",
    eyebrow: "Our team",
    intro:
      "Our work is based on the enthusiasm of coaches and boys who love sport and football in a small space. In other words, futsal through fun and friendship.",
    bioHeading: "Biography and sports career",
    goal: "Our primary goal is to develop in boys a love for this sport and to nurture a whole range of physical, psychological and sociological personal qualities that sport calls for.",
  },
} as const;

/** Pretvara [tekst](url) u spoljne linkove. */
function withLinks(text: string) {
  return text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!m) return part;
    return (
      <a
        key={i}
        href={m[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-600"
      >
        {m[1]}
      </a>
    );
  });
}

export async function TeamPage({ lang }: { lang: "sr" | "en" }) {
  const team = await getTeam(lang);
  const t = COPY[lang];
  return (
    <main>
      <PageHero
        title={t.title}
        eyebrow={t.eyebrow}
        animated={{
          desktop: "/wp-content/uploads/2020/11/futsal-court-animated.gif",
          mobile: "/wp-content/uploads/2020/11/taktika.gif",
        }}
      >
        {t.intro}
      </PageHero>

      <div className="mx-auto max-w-7xl space-y-10 px-5 py-12 sm:py-16">
        {team.map((m, i) => (
          <article
            key={m.name}
            id={m.name.toLowerCase().replace(/[^a-z]+/g, "-")}
            className="grid gap-6 rounded-3xl bg-white p-5 shadow-md ring-1 ring-brand-50 sm:grid-cols-[220px_1fr] sm:p-6"
          >
            <div
              data-lightbox
              className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-50"
            >
              <Image
                src={m.photo}
                alt={m.name}
                fill
                priority={i < 2}
                sizes="(min-width: 640px) 220px, 100vw"
                className={m.name.includes("Branislav") ? "object-contain object-center" : "object-cover object-top"}
              />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-navy-900">{m.name}</h2>
              <p className="mt-1 font-semibold text-brand-700">{m.role}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {m.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full bg-gold-500/15 px-3 py-1 text-xs font-bold text-gold-700"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              <h3 className="mt-5 text-sm font-extrabold uppercase tracking-wider text-navy-900">
                {t.bioHeading}
              </h3>
              <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted">
                {m.bio.map((p) => (
                  <p key={p}>{withLinks(p)}</p>
                ))}
              </div>
            </div>
          </article>
        ))}
        <p className="rounded-2xl bg-brand-50 p-6 text-center font-semibold text-navy-900">
          {t.goal}
        </p>
      </div>
    </main>
  );
}

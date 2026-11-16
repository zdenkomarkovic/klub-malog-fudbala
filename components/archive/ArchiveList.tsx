import Link from "next/link";
import { ARCHIVE, ARCHIVE_PAGES, ARCHIVE_PER_PAGE, archivePagePath } from "@/lib/archive";
import { tidyHtml } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { cn } from "@/lib/utils";

const base =
  "inline-flex h-11 min-w-11 items-center justify-center rounded-full px-4 text-sm font-bold transition-colors";

export function ArchiveList({ page = 1 }: { page?: number }) {
  const sections = ARCHIVE.slice((page - 1) * ARCHIVE_PER_PAGE, page * ARCHIVE_PER_PAGE);
  const pages = Array.from({ length: ARCHIVE_PAGES }, (_, i) => i + 1);

  return (
    <main>
      <PageHero title="Arhiva" eyebrow="Hronološki pregled dešavanja" tall>
        Hronološki pregled dešavanja KMF „21.oktobar“ Kragujevac – sezone 2010–2013.
      </PageHero>
      <div className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
        <div className="space-y-12">
          {sections.map((s) => (
            <section key={s.id} aria-labelledby={s.id} className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-brand-50 sm:p-8">
              <h2 id={s.id} className="border-l-4 border-gold-500 pl-4 text-xl font-extrabold uppercase tracking-wide text-navy-900 sm:text-2xl">
                {s.title}
              </h2>
              <div className="prose-kmf mt-6" dangerouslySetInnerHTML={{ __html: tidyHtml(s.html) }} />
            </section>
          ))}
        </div>

        {ARCHIVE_PAGES > 1 && (
          <nav aria-label="Paginacija arhive" className="mt-12 flex flex-wrap items-center justify-center gap-2">
            {page > 1 && (
              <Link href={archivePagePath(page - 1)} rel="prev" className={cn(base, "bg-brand-50 text-navy-900 hover:bg-brand-600 hover:text-white")}>
                ← Prethodna
              </Link>
            )}
            {pages.map((n) => (
              <Link
                key={n}
                href={archivePagePath(n)}
                aria-label={`Strana ${n}`}
                aria-current={n === page ? "page" : undefined}
                className={cn(base, n === page ? "bg-navy-900 text-white" : "bg-brand-50 text-navy-900 hover:bg-brand-600 hover:text-white")}
              >
                {n}
              </Link>
            ))}
            {page < ARCHIVE_PAGES && (
              <Link href={archivePagePath(page + 1)} rel="next" className={cn(base, "bg-brand-50 text-navy-900 hover:bg-brand-600 hover:text-white")}>
                Sledeća →
              </Link>
            )}
          </nav>
        )}
      </div>
    </main>
  );
}

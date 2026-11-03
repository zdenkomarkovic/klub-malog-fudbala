import Link from "next/link";
import { allPosts, type Post } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { PostCard } from "@/components/home/PostCard";
import { NewsSidebar } from "@/components/home/NewsSidebar";
import { cn } from "@/lib/utils";

export const NEWS_PER_PAGE = 9;
export const NEWS_PAGES = Math.max(1, Math.ceil(allPosts.length / NEWS_PER_PAGE));
export const newsPath = (page: number) => (page <= 1 ? "/vesti/" : `/vesti/strana/${page}/`);

export function NewsList({
  page = 1,
  title = "Vesti",
  eyebrow = "Aktuelno",
  list,
}: {
  page?: number;
  title?: string;
  eyebrow?: string;
  /** Ako je zadato (kategorija / arhiva), prikazuje se cela lista bez paginacije. */
  list?: Post[];
}) {
  const posts = list ?? allPosts.slice((page - 1) * NEWS_PER_PAGE, page * NEWS_PER_PAGE);
  const paginate = !list;
  const pages = Array.from({ length: NEWS_PAGES }, (_, i) => i + 1);
  const base = "inline-flex h-11 min-w-11 items-center justify-center rounded-full px-4 text-sm font-bold transition-colors";

  return (
    <main>
      <PageHero title={title} eyebrow={eyebrow}>
        Najnovija dešavanja iz našeg kluba, takmičenja, kampova i inkluzivnih programa.
      </PageHero>
      <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
          <div>
            <div className="grid gap-6 sm:grid-cols-2">
              {posts.map((p, i) => (
                <PostCard key={p.slug} post={p} priority={i < 2} />
              ))}
              {posts.length === 0 && <p className="text-muted">Nema vesti.</p>}
            </div>

        {paginate && NEWS_PAGES > 1 && (
          <nav aria-label="Paginacija vesti" className="mt-12 flex flex-wrap items-center justify-center gap-2">
            {page > 1 && (
              <Link href={newsPath(page - 1)} rel="prev" className={cn(base, "bg-brand-50 text-navy-900 hover:bg-brand-600 hover:text-white")}>
                ← Prethodna
              </Link>
            )}
            {pages.map((n) => (
              <Link
                key={n}
                href={newsPath(n)}
                aria-label={`Strana ${n}`}
                aria-current={n === page ? "page" : undefined}
                className={cn(
                  base,
                  n === page ? "bg-navy-900 text-white" : "bg-brand-50 text-navy-900 hover:bg-brand-600 hover:text-white",
                )}
              >
                {n}
              </Link>
            ))}
            {page < NEWS_PAGES && (
              <Link href={newsPath(page + 1)} rel="next" className={cn(base, "bg-brand-50 text-navy-900 hover:bg-brand-600 hover:text-white")}>
                Sledeća →
              </Link>
            )}
          </nav>
        )}
          </div>
          <NewsSidebar />
        </div>
      </div>
    </main>
  );
}

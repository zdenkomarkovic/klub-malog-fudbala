import Link from "next/link";
import {
  allPosts,
  archivePath,
  categoryPath,
  getArchives,
  getCategories,
  monthLabel,
  postPath,
} from "@/lib/content";
import { NewsSearch } from "@/components/home/NewsSearch";

const searchItems = allPosts.map((p) => ({ title: p.title, href: postPath(p) }));

function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-brand-50">
      <h2 className="border-l-4 border-gold-500 pl-3 text-sm font-extrabold uppercase tracking-[0.15em] text-navy-900">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

const link = "block rounded-lg px-2 py-1.5 text-sm font-semibold text-navy-900 hover:bg-brand-50 hover:text-brand-700";

export function NewsSidebar() {
  return (
    <aside aria-label="Bočna traka" className="space-y-6 lg:sticky lg:top-24 lg:self-start">
      <Box title="Pretraga">
        <NewsSearch items={searchItems} />
      </Box>
      <Box title="Najnoviji članci">
        <ul className="space-y-1">
          {allPosts.slice(0, 5).map((p) => (
            <li key={p.slug}>
              <Link href={postPath(p)} className={link}>
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </Box>
      <Box title="Arhive">
        <ul className="space-y-1">
          {getArchives().map((a) => (
            <li key={`${a.year}${a.month}`}>
              <Link href={archivePath(a.year, a.month)} className={link}>
                {monthLabel(a.year, a.month)} <span className="font-normal text-muted">({a.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </Box>
      <Box title="Kategorije">
        <ul className="space-y-1">
          {getCategories().map((c) => (
            <li key={c.slug}>
              <Link href={categoryPath(c.slug)} className={link}>
                {c.name} <span className="font-normal text-muted">({c.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </Box>
    </aside>
  );
}

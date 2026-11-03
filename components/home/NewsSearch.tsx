"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export interface SearchItem {
  title: string;
  href: string;
}

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "dj");

export function NewsSearch({ items }: { items: SearchItem[] }) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const n = norm(q.trim());
    return n.length < 2 ? [] : items.filter((i) => norm(i.title).includes(n)).slice(0, 8);
  }, [q, items]);

  return (
    <div>
      <label htmlFor="news-search" className="sr-only">
        Pretraga vesti
      </label>
      <input
        id="news-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Pretraži vesti…"
        autoComplete="off"
        className="w-full rounded-xl border border-brand-50 bg-white px-4 py-3 text-sm shadow-sm placeholder:text-muted/70 focus:border-brand-600"
      />
      {q.trim().length >= 2 && (
        <ul className="mt-2 space-y-1 text-sm" aria-live="polite">
          {results.length === 0 && <li className="px-1 text-muted">Nema rezultata.</li>}
          {results.map((r) => (
            <li key={r.href}>
              <Link href={r.href} className="block rounded-lg px-2 py-1.5 font-semibold text-navy-900 hover:bg-brand-50 hover:text-brand-700">
                {r.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

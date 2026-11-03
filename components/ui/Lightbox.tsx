"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Klik na sliku u sadržaju (.prose-kmf) ili u elementu sa data-lightbox otvara je u uvećanom prikazu.
 * Strelice / swipe dugmad prelaze na sledeću sliku iz iste grupe, Esc ili klik van slike zatvara.
 */
const SELECTOR = ".prose-kmf img, [data-lightbox] img";

interface Item {
  src: string;
  alt: string;
}

/** next/image URL (/_next/image?url=...) -> originalna putanja slike. */
function fullSrc(img: HTMLImageElement): string {
  const src = img.currentSrc || img.src;
  try {
    const u = new URL(src, window.location.href);
    if (u.pathname.startsWith("/_next/image")) {
      const original = u.searchParams.get("url");
      if (original) return original;
    }
  } catch {
    /* ignore */
  }
  return src;
}

export function Lightbox() {
  const [items, setItems] = useState<Item[]>([]);
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const move = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const img = (e.target as HTMLElement).closest?.("img") as HTMLImageElement | null;
      if (!img || !img.matches(SELECTOR) || img.closest("a")) return;
      const root = img.closest(".prose-kmf, [data-lightbox]");
      const group = Array.from(root?.querySelectorAll<HTMLImageElement>("img") ?? [img]);
      const list = group.filter((g) => !g.closest("a")).map((g) => ({ src: fullSrc(g), alt: g.alt }));
      setItems(list);
      setIndex(Math.max(0, group.filter((g) => !g.closest("a")).indexOf(img)));
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (index === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [index, close, move]);

  if (index === null || !items[index]) return null;
  const item = items[index];
  const btn =
    "absolute flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/30";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Uvećana slika"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      onClick={close}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.src}
        alt={item.alt}
        className="max-h-[90vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
      <button type="button" aria-label="Zatvori" className={`${btn} right-4 top-4`} onClick={close}>
        ✕
      </button>
      {items.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Prethodna slika"
            className={`${btn} left-4 top-1/2 -translate-y-1/2`}
            onClick={(e) => {
              e.stopPropagation();
              move(-1);
            }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Sledeća slika"
            className={`${btn} right-4 top-1/2 -translate-y-1/2`}
            onClick={(e) => {
              e.stopPropagation();
              move(1);
            }}
          >
            ›
          </button>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-3 py-1 text-sm text-white">
            {index + 1} / {items.length}
          </p>
        </>
      )}
    </div>
  );
}

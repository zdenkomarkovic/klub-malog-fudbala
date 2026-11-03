"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LOGO_PATH } from "@/lib/constants";
import { NAV, T, altPath, langOf } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const lang = langOf(pathname);
  const t = T[lang];
  const nav = NAV[lang];
  const home = lang === "en" ? "/en/" : "/";

  // <html lang> prati jezik stranice
  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en" : "sr-RS";
  }, [lang]);

  const isActive = (href: string) =>
    href === "/" || href === "/en/" ? pathname === href || pathname === href.replace(/\/$/, "") : !href.includes("#") && pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-50 bg-white/95 backdrop-blur">
      <a
        href="#sadrzaj"
        className="sr-only z-[60] rounded-md bg-gold-500 px-4 py-2 font-bold text-navy-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {t.skip}
      </a>
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-5">
        <Link href={home} className="flex shrink-0 items-center gap-3" onClick={() => setOpen(false)}>
          <Image src={LOGO_PATH} alt={t.logoAlt} width={56} height={56} priority className="h-14 w-14" />
          <span className="font-display leading-none">
            <span className="block text-xl font-extrabold text-navy-900">KMF 21</span>
            <span className="block text-[0.65rem] font-bold uppercase tracking-[0.25em] text-brand-700">Kragujevac</span>
          </span>
        </Link>

        <nav aria-label={t.mainNav} className="hidden xl:block">
          <ul className="flex items-center gap-5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "border-b-2 border-transparent py-1 text-[0.8rem] font-semibold text-navy-900 transition-colors hover:text-brand-600",
                    isActive(item.href) && "border-brand-600 text-brand-700",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={altPath(pathname)}
            hrefLang={lang === "en" ? "sr" : "en"}
            aria-label={t.switchLabel}
            title={t.switchLabel}
            className="inline-flex h-10 items-center gap-1 rounded-full border border-brand-50 px-3 text-xs font-extrabold text-navy-900 hover:bg-brand-50"
          >
            <span className={lang === "sr" ? "text-brand-700" : "text-muted"}>SR</span>
            <span className="text-muted">|</span>
            <span className={lang === "en" ? "text-brand-700" : "text-muted"}>EN</span>
          </Link>
          <ButtonLink href={t.enrollHref} className="hidden px-5 py-2.5 sm:inline-flex">
            {t.enroll}
          </ButtonLink>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-navy-900 hover:bg-brand-50 xl:hidden"
            aria-label={open ? t.closeMenu : t.openMenu}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label={t.mobileNav} className="border-t border-brand-50 bg-white xl:hidden">
          <ul className="mx-auto max-w-7xl px-5 py-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "block rounded-lg px-3 py-3 font-semibold text-navy-900 hover:bg-brand-50",
                    isActive(item.href) && "bg-brand-50 text-brand-700",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <ButtonLink href={t.enrollHref} className="w-full">
                {t.enroll}
              </ButtonLink>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CLUB, LOGO_PATH, SOCIAL } from "@/lib/constants";
import { NAV, T, langOf } from "@/lib/i18n";
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, YoutubeIcon } from "@/components/ui/Icons";

const social = [
  { href: SOCIAL.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: SOCIAL.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: SOCIAL.youtube, label: "YouTube", Icon: YoutubeIcon },
];

export function Footer() {
  const lang = langOf(usePathname());
  const t = T[lang].footer;
  const home = lang === "en" ? "/en/" : "/";
  const links = NAV[lang].filter((n) => !n.href.endsWith("#kontakt"));
  const half = Math.ceil(links.length / 2);

  return (
    <footer className="bg-navy-950 text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href={home} className="flex items-center gap-3">
            <Image src={LOGO_PATH} alt="" width={56} height={56} className="h-14 w-14" />
            <span className="font-display leading-none text-white">
              <span className="block text-xl font-extrabold">KMF 21</span>
              <span className="block text-[0.65rem] font-bold uppercase tracking-[0.25em] text-gold-400">Kragujevac</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            {t.tagline}
          </p>
          <p className="mt-3 text-xs text-white/50">
            {t.regNo}: {CLUB.registrationNumber} · PIB: {CLUB.taxId}
          </p>
        </div>

        <address className="space-y-3 text-sm not-italic">
          <h2 className="mb-1 text-sm font-bold uppercase tracking-wider text-white">{t.contact}</h2>
          <p className="flex items-start gap-3">
            <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
            <span>
              {CLUB.legalName}
              <br />
              {CLUB.city}, {CLUB.country}
            </span>
          </p>
          <p className="flex items-center gap-3">
            <PhoneIcon className="h-5 w-5 shrink-0 text-gold-400" />
            <a href={`tel:${CLUB.phoneHref}`} className="hover:text-white">{CLUB.phone}</a>
          </p>
          <p className="flex items-center gap-3">
            <MailIcon className="h-5 w-5 shrink-0 text-gold-400" />
            <a href={`mailto:${CLUB.email}`} className="break-all hover:text-white">{CLUB.email}</a>
          </p>
        </address>

        <nav aria-label={t.quick} className="lg:col-span-1">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">{t.quick}</h2>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {[...links.slice(0, half), ...links.slice(half)].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">{l.label}</Link>
              </li>
            ))}
            <li>
              <Link href={T[lang].enrollHref} className="hover:text-white">{t.enrollLink}</Link>
            </li>
            <li>
              <Link href={lang === "en" ? "/en/#kontakt" : "/#kontakt"} className="hover:text-white">{t.contact}</Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">{t.follow}</h2>
          <ul className="flex gap-3">
            {social.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-gold-500 hover:text-navy-950"
                >
                  <Icon className="h-5 w-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} KMF 21 Kragujevac. {t.rights}</p>
          <p>
            {t.madeBy}{" "}
            <a
              href="https://manikamwebsolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-white"
            >
              Manikam Web Solutions
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

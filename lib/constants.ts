export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://kmf21.rs").replace(/\/$/, "");
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Klub malog fudbala 21";
export const SITE_DESCRIPTION =
  "Klub malog fudbala „21.oktobar“ iz Kragujevca je registrovan sportski klub u Ministarstvu omladine i sporta Republike Srbije.";
export const SITE_TAGLINE =
  "Naš rad zasniva se na entuzijazmu trenera i dečaka koji vole sport i fudbal na malom prostoru.";

export const CLUB = {
  legalName: "Klub malog fudbala 21. Oktobar",
  city: "Kragujevac",
  country: "Srbija",
  phone: "+381 69 345 1270",
  phoneHref: "+381693451270",
  email: "kmf21.oktobar@gmail.com",
  registrationNumber: "17780913",
  taxId: "106420414",
} as const;

export const SOCIAL = {
  facebook: "https://www.facebook.com/Futsal21-Kragujevac-škola-malog-fudbala-120160032721900",
  instagram: "https://www.instagram.com/futsal21_skola_fudbala/",
  youtube: "https://www.youtube.com/channel/UCAYhfFephAQNuqa2SkzyUww",
} as const;

export const GOOGLE_SITE_VERIFICATION = "Jc_P4wNxNt4GlKLyp0hOFcCkQfdHXNazd4rqZEWXiO0";
export const LOGO_PATH = "/wp-content/uploads/2020/11/kmf21-kragujevac-logo.png";

export const NAV = [
  { href: "/", label: "Naslovna" },
  { href: "/o-klubu/", label: "O klubu" },
  { href: "/o-malom-fudbalu/", label: "O futsalu" },
  { href: "/strucni-tim/", label: "Stručni tim" },
  { href: "/takmicanje/", label: "Takmičenja" },
  { href: "/inkluzija/", label: "Inkluzija" },
  { href: "/letnji-kamp-kopaonik/", label: "Kamp" },
  { href: "/vesti/", label: "Vesti" },
  { href: "/#kontakt", label: "Kontakt" },
] as const;

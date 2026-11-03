export type Lang = "sr" | "en";

/** Parovi stranica: srpska ruta <-> engleska ruta (engleske rute su iste kao na starom sajtu). */
export const PAGE_PAIRS = [
  { sr: "/", en: "/en/" },
  { sr: "/o-klubu/", en: "/21-october-futsal-club-from-kragujevac/" },
  { sr: "/o-malom-fudbalu/", en: "/about-futsal/" },
  { sr: "/strucni-tim/", en: "/expert-team/" },
  { sr: "/takmicanje/", en: "/competitions/" },
  { sr: "/inkluzija/", en: "/inclusion/" },
  { sr: "/letnji-kamp-kopaonik/", en: "/kopaonik-summer-camp/" },
] as const;

export const EN_SLUGS = PAGE_PAIRS.filter((p) => p.en !== "/en/").map((p) => p.en.replace(/\//g, ""));

const norm = (p: string) => (p.endsWith("/") ? p : `${p}/`);

export function langOf(pathname: string): Lang {
  const p = norm(pathname);
  return PAGE_PAIRS.some((x) => x.en === p) ? "en" : "sr";
}

/** Putanja iste stranice na drugom jeziku (za prekidač jezika). Ako nema para, vodi na početnu tog jezika. */
export function altPath(pathname: string): string {
  const p = norm(pathname);
  const pair = PAGE_PAIRS.find((x) => x.sr === p || x.en === p);
  if (!pair) return langOf(pathname) === "en" ? "/" : "/en/";
  return langOf(pathname) === "en" ? pair.sr : pair.en;
}

export const NAV = {
  sr: [
    { href: "/", label: "Naslovna" },
    { href: "/o-klubu/", label: "O klubu" },
    { href: "/o-malom-fudbalu/", label: "O futsalu" },
    { href: "/strucni-tim/", label: "Stručni tim" },
    { href: "/takmicanje/", label: "Takmičenja" },
    { href: "/inkluzija/", label: "Inkluzija" },
    { href: "/letnji-kamp-kopaonik/", label: "Kamp" },
    { href: "/vesti/", label: "Vesti" },
    { href: "/#kontakt", label: "Kontakt" },
  ],
  en: [
    { href: "/en/", label: "Home" },
    { href: "/21-october-futsal-club-from-kragujevac/", label: "About the club" },
    { href: "/about-futsal/", label: "About futsal" },
    { href: "/expert-team/", label: "Expert team" },
    { href: "/competitions/", label: "Competitions" },
    { href: "/inclusion/", label: "Inclusion" },
    { href: "/kopaonik-summer-camp/", label: "Summer camp" },
    { href: "/en/#kontakt", label: "Contact" },
  ],
} as const;

export const T = {
  sr: {
    skip: "Preskoči na sadržaj",
    enroll: "UPIS U KLUB",
    enrollHref: "/#upis",
    openMenu: "Otvori meni",
    closeMenu: "Zatvori meni",
    mainNav: "Glavna navigacija",
    mobileNav: "Mobilna navigacija",
    logoAlt: "KMF 21 Kragujevac – logo kluba",
    switchLabel: "Promeni jezik na engleski",
    footer: {
      tagline: "Škola malog fudbala i inkluzije u Kragujevcu. Sport, razvoj i zajedništvo.",
      regNo: "Matični broj",
      contact: "Kontakt",
      quick: "Brzi linkovi",
      enrollLink: "Upis",
      follow: "Pratite nas",
      rights: "Sva prava zadržana.",
      madeBy: "Izrada sajta",
    },
    common: {
      enrollBtn: "Upis u klub",
      news: "Najnovije vesti",
      newsHref: "/vesti/",
      clubName: "Klub malog fudbala 21",
    },
    form: {
      name: "Ime i prezime",
      namePh: "Ime roditelja",
      email: "Email",
      phone: "Telefon (opciono)",
      message: "Poruka",
      messagePh: "Uzrast deteta, željena lokacija i termin…",
      send: "Pošalji poruku →",
      sending: "Šaljem…",
      ok: "Hvala! Poruka je poslata.",
      fail: "Slanje nije uspelo.",
    },
  },
  en: {
    skip: "Skip to content",
    enroll: "JOIN THE CLUB",
    enrollHref: "/en/#upis",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    mainNav: "Main navigation",
    mobileNav: "Mobile navigation",
    logoAlt: "KMF 21 Kragujevac – club logo",
    switchLabel: "Promeni jezik na srpski",
    footer: {
      tagline: "Futsal and inclusion school in Kragujevac. Sport, development and community.",
      regNo: "Registration no.",
      contact: "Contact",
      quick: "Quick links",
      enrollLink: "Enrollment",
      follow: "Follow us",
      rights: "All rights reserved.",
      madeBy: "Website by",
    },
    common: {
      enrollBtn: "Join the club",
      news: "Latest news",
      newsHref: "/vesti/",
      clubName: "Futsal Club 21",
    },
    form: {
      name: "Full name",
      namePh: "Parent's name",
      email: "Email",
      phone: "Phone (optional)",
      message: "Message",
      messagePh: "Child's age, preferred location and time…",
      send: "Send message →",
      sending: "Sending…",
      ok: "Thank you! Your message has been sent.",
      fail: "Sending failed.",
    },
  },
} as const;

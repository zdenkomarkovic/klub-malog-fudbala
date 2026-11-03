import Image from "next/image";
import Link from "next/link";
import { allPosts } from "@/lib/content";
import { CLUB, LOGO_PATH, SITE_URL, SOCIAL } from "@/lib/constants";
import { SPONSORS, TEAM } from "@/lib/team";
import { T, type Lang } from "@/lib/i18n";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  CapIcon,
  ChartIcon,
  ChildIcon,
  ClockIcon,
  HeartIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  UsersIcon,
} from "@/components/ui/Icons";
import { PostCard } from "@/components/home/PostCard";
import { JsonLd } from "@/components/seo/JsonLd";

const UP = "/wp-content/uploads";

const COPY = {
  sr: {
    hero: {
      eyebrow: "Klub malog fudbala 21",
      l1: "Škola malog",
      l2: "fudbala i inkluzije",
      l3: "u Kragujevcu",
      text: "KMF 21 je više od kluba – to je škola sporta, razvoja i zajedništva. Okupljamo decu od 5 do 14 godina kroz futsal, inkluzivne programe i zdrav način života.",
      more: "Saznaj više",
      moreHref: "/o-klubu/",
      slogan1: "Mali fudbal.",
      slogan2: "Velike mogućnosti!",
      imgAlt: "Polaznici škole malog fudbala KMF 21 Kragujevac sa trenerima",
    },
    statsLabel: "Klub u brojevima",
    stats: ["polaznika", "lokacije", "godina", "inkluzivni program"],
    cards: {
      school: {
        title: "Škola futsala",
        text: "Sistemski rad sa decom uz stručne trenere, mali fudbal kao osnovni sport i elementi atletike i sportske gimnastike.",
        btn: "Više o školi",
        href: "/o-klubu/",
      },
      incl: {
        title: "Inkluzivni rad",
        text: "Sport za sve – verujemo u jednake mogućnosti, prihvatanje i snagu zajedništva kroz fudbal.",
        btn: "Više o inkluziji",
        href: "/inkluzija/",
      },
    },
    why: {
      eyebrow: "O nama",
      title: "Zašto KMF 21?",
      text: "Kroz mali fudbal gradimo samopouzdanje, prijateljstva i zdrave životne navike. Naš cilj je da svako dete, bez obzira na razlike, pronađe svoje mesto u timu.",
      items: [
        { title: "Stručni rad", text: "Profesori sporta i fizičkog vaspitanja, psiholog i pedagog rade sa decom prilagođeno uzrastu." },
        { title: "Razvoj dece", text: "Fizički, psihološki i socijalni razvoj kroz sportsku igru, uz atletiku i sportsku gimnastiku." },
        {
          title: "Sportske vrednosti",
          text: "Druženje, primereno ponašanje i fer odnos prema drugima – uspeh nije imperativ, već rezultat posvećenosti.",
        },
      ],
    },
    team: {
      eyebrow: "Naš tim",
      title: "Stručni tim",
      text: "Naš tim čine iskusni i posvećeni treneri koji svakodnevno rade na razvoju dece kroz znanje, strpljenje i ljubav prema fudbalu.",
      btn: "Upoznaj ceo tim",
      href: "/strucni-tim/",
      tags: {
        "Branislav R. Lečić": "Osnivač kluba",
        "Uroš Đusić": "Škola fudbala",
        "Igor Jokić": "Inkluzija",
        "Janko Milovanović": "Škola fudbala",
      } as Record<string, string>,
    },
    news: {
      eyebrow: "Aktuelno",
      title: "Najnovije vesti",
      text: "Pratite najnovija dešavanja iz našeg kluba, takmičenja, kampova i inkluzivnih programa.",
      btn: "Sve vesti",
    },
    camp: {
      eyebrow: "Letnji kamp · 02 – 09. jul",
      title: "Sportski kamp na Kopaoniku",
      text: "Na kraju svake sportske sezone klub u julu održava sportske kampove na Kopaoniku. Primarne aktivnosti su obuka i usavršavanje plivanja, planinarenje i sportske aktivnosti u prirodi.",
      btn: "Saznaj više o kampu",
      href: "/letnji-kamp-kopaonik/",
      tags: ["Obuka plivanja", "Planinarenje", "Druženje", "Priroda na 2000 m"],
    },
    trainings: {
      eyebrow: "Termini",
      title: "Termini treninga",
      text: "Trenutno organizujemo treninge na tri lokacije u Kragujevcu.",
      places: [
        {
          place: "OŠ „Moma Stanojlović“",
          days: "Ponedeljak, Petak, Subota",
          times: ["19:00 – 20:00"],
          note: "Kada je lepo vreme, treninzi se održavaju na sportskom poligonu škole.",
        },
        { place: "OŠ „21. Oktobar“", days: "Utorak, Četvrtak", times: ["19:30 – 20:30"], note: "Subotom: 11:00 – 13:00" },
        { place: "SC „Kole“ Ilijina Voda", days: "Škola fudbala", times: [] as string[], note: "Za termine nas kontaktirajte." },
      ],
    },
    enroll: {
      eyebrow: "Upis",
      title: "Upis u klub",
      text: "U klubu treniraju učenici uzrasta od 5 do 14 godina. Javite nam se telefonom ili putem forme i rado ćemo vam pomoći oko upisa i termina treninga.",
      guide: "Preuzmite vodič za roditelje",
      call: "Pozovite nas",
      labels: ["Telefon", "Email", "Adresa"],
    },
    partners: "Partneri i sponzori",
  },
  en: {
    hero: {
      eyebrow: "Futsal Club 21",
      l1: "Futsal and",
      l2: "inclusion school",
      l3: "in Kragujevac",
      text: "KMF 21 is more than a club – it is a school of sport, development and community. We bring together children aged 5 to 14 through futsal, inclusive programmes and a healthy lifestyle.",
      more: "Learn more",
      moreHref: "/21-october-futsal-club-from-kragujevac/",
      slogan1: "Small-sided football.",
      slogan2: "Great possibilities!",
      imgAlt: "Pupils of the KMF 21 Kragujevac futsal school with their coaches",
    },
    statsLabel: "The club in numbers",
    stats: ["participants", "locations", "years of age", "inclusion programme"],
    cards: {
      school: {
        title: "Futsal school",
        text: "Systematic work with children led by expert coaches, with futsal as the main sport and elements of athletics and gymnastics.",
        btn: "About the school",
        href: "/21-october-futsal-club-from-kragujevac/",
      },
      incl: {
        title: "Inclusive work",
        text: "Sport for everyone – we believe in equal opportunities, acceptance and the power of community through football.",
        btn: "About inclusion",
        href: "/inclusion/",
      },
    },
    why: {
      eyebrow: "About us",
      title: "Why KMF 21?",
      text: "Through futsal we build self-confidence, friendships and healthy habits. Our goal is for every child, regardless of differences, to find their place in the team.",
      items: [
        { title: "Expert work", text: "Sports and physical education teachers, a psychologist and a pedagogue work with children adapted to their age." },
        { title: "Child development", text: "Physical, psychological and social development through sport, along with athletics and gymnastics." },
        { title: "Sporting values", text: "Friendship, good behaviour and fair play – success is not an imperative, but the result of dedication." },
      ],
    },
    team: {
      eyebrow: "Our team",
      title: "Expert team",
      text: "Our team consists of experienced and dedicated coaches who work every day on children's development through knowledge, patience and love for football.",
      btn: "Meet the whole team",
      href: "/expert-team/",
      tags: {
        "Branislav R. Lečić": "Club founder",
        "Uroš Đusić": "Football school",
        "Igor Jokić": "Inclusion",
        "Janko Milovanović": "Football school",
      } as Record<string, string>,
    },
    news: { eyebrow: "", title: "", text: "", btn: "" },
    camp: {
      eyebrow: "Summer camp · July 2 – 9",
      title: "Sports camp on Kopaonik",
      text: "At the end of each sports season the club holds sports camps on Kopaonik in July. The primary activities are swimming training, hiking and outdoor sports in nature.",
      btn: "More about the camp",
      href: "/kopaonik-summer-camp/",
      tags: ["Swimming training", "Hiking", "Socializing", "Nature at 2000 m"],
    },
    trainings: {
      eyebrow: "Schedule",
      title: "Training schedule",
      text: "We currently run training sessions at three locations in Kragujevac.",
      places: [
        {
          place: "„Moma Stanojlović“ Elementary School",
          days: "Monday, Friday, Saturday",
          times: ["19:00 – 20:00"],
          note: "In good weather, training takes place on the school's sports field.",
        },
        { place: "„21. Oktobar“ Elementary School", days: "Tuesday, Thursday", times: ["19:30 – 20:30"], note: "Saturdays: 11:00 – 13:00" },
        { place: "SC „Kole“ Ilijina Voda", days: "Football school", times: [] as string[], note: "Contact us for the schedule." },
      ],
    },
    enroll: {
      eyebrow: "Enrollment",
      title: "Join the club",
      text: "Pupils aged 5 to 14 train in the club. Call us or use the form and we will gladly help you with enrollment and the training schedule.",
      guide: "Download the guide for parents",
      call: "Call us",
      labels: ["Phone", "Email", "Address"],
    },
    partners: "Partners and sponsors",
  },
};

const STAT_ICONS = [UsersIcon, PinIcon, ChildIcon, HeartIcon];
const STAT_VALUES = ["100+", "3", "5–14", "40+"];
const WHY_ICONS = [CapIcon, ChartIcon, UsersIcon];
const TEAM_ON_HOME = ["Branislav R. Lečić", "Uroš Đusić", "Igor Jokić", "Janko Milovanović"];

export function HomeContent({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const t = T[lang];
  const home = lang === "en" ? "/en/" : "/";
  const latest = allPosts.slice(0, 3);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}${home}`,
        name: "Klub malog fudbala 21",
        description: "Naš rad zasniva se na entuzijazmu trenera i dečaka koji vole sport i fudbal na malom prostoru.",
        inLanguage: lang === "en" ? "en" : "sr-RS",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": ["Organization", "SportsOrganization"],
        "@id": `${SITE_URL}/#organization`,
        name: CLUB.legalName,
        url: `${SITE_URL}/`,
        logo: { "@type": "ImageObject", url: `${SITE_URL}${LOGO_PATH}`, width: 150, height: 150 },
        image: `${SITE_URL}${LOGO_PATH}`,
        email: CLUB.email,
        telephone: CLUB.phone,
        address: { "@type": "PostalAddress", addressLocality: CLUB.city, addressCountry: "RS" },
        sameAs: [SOCIAL.facebook, SOCIAL.instagram, SOCIAL.youtube],
      },
    ],
  };

  return (
    <main>
      <JsonLd data={schema} />

      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-navy-950 text-white">
        <Image
          src={`${UP}/2020/12/skola-malog-fudbala-futsal21-kragujevac-008-1024x512.jpg`}
          alt={c.hero.imgAlt}
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[70%_center] md:object-right"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/20 max-md:from-navy-950/90 max-md:via-navy-950/80 max-md:to-navy-950/70" />
        <div className="mx-auto max-w-7xl px-5 pb-28 pt-14 sm:pb-36 sm:pt-20">
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-gold-400">{c.hero.eyebrow}</p>
          <h1 className="mt-3 max-w-xl text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl">
            {c.hero.l1} <br />
            {c.hero.l2}
            <br />
            <span className="text-gold-400">{c.hero.l3}</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/85">{c.hero.text}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href={t.enrollHref}>{t.common.enrollBtn}</ButtonLink>
            <ButtonLink href={c.hero.moreHref} variant="outline-light" arrow={false}>
              {c.hero.more}
            </ButtonLink>
          </div>
          <p className="mt-10 max-w-xs -rotate-6 font-display text-2xl font-bold italic leading-tight text-white/90 md:absolute md:bottom-32 md:right-10 md:mt-0">
            {c.hero.slogan1}
            <br />
            {c.hero.slogan2}
          </p>
        </div>
      </section>

      {/* STATS */}
      <section aria-label={c.statsLabel} className="relative z-10 mx-auto -mt-16 max-w-6xl px-5 sm:-mt-20">
        <ul className="grid grid-cols-2 gap-y-6 rounded-3xl bg-white p-6 shadow-xl ring-1 ring-brand-50 lg:grid-cols-4 lg:divide-x lg:divide-brand-50">
          {STAT_ICONS.map((Icon, i) => (
            <li key={i} className="flex items-center justify-center gap-3 px-2">
              <Icon className="h-10 w-10 shrink-0 text-brand-600" />
              <span className="leading-tight">
                <span className="block font-display text-3xl font-extrabold text-brand-700 sm:text-4xl">{STAT_VALUES[i]}</span>
                <span className="block text-sm font-semibold text-muted">{c.stats[i]}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* DVE SEKCIJE */}
      <section className="mx-auto mt-12 grid max-w-7xl gap-6 px-5 md:grid-cols-2">
        <article className="relative isolate flex min-h-[20rem] overflow-hidden rounded-3xl bg-navy-900 p-8 text-white">
          <Image src={`${UP}/2020/11/futsal2.jpg`} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="-z-20 object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-900/85 to-navy-900/20" />
          <div className="flex max-w-xs flex-col justify-center">
            <h2 className="text-3xl font-extrabold">{c.cards.school.title}</h2>
            <p className="mt-3 text-white/85">{c.cards.school.text}</p>
            <div className="mt-6">
              <ButtonLink href={c.cards.school.href} variant="white">{c.cards.school.btn}</ButtonLink>
            </div>
          </div>
        </article>
        <article className="relative isolate flex min-h-[20rem] overflow-hidden rounded-3xl bg-gold-700 p-8 text-white">
          <Image src={`${UP}/2020/11/inkluzija.jpg`} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="-z-20 object-cover object-right" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#7a5208] via-[#8a5f0c]/85 to-[#8a5f0c]/10" />
          <div className="flex max-w-xs flex-col justify-center">
            <h2 className="text-3xl font-extrabold">{c.cards.incl.title}</h2>
            <p className="mt-3 text-white/90">{c.cards.incl.text}</p>
            <div className="mt-6">
              <ButtonLink href={c.cards.incl.href} variant="white">{c.cards.incl.btn}</ButtonLink>
            </div>
          </div>
        </article>
      </section>

      {/* ZASTO KMF 21 */}
      <section className="mx-auto mt-20 grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-[1fr_2fr]">
        <SectionHeading eyebrow={c.why.eyebrow} title={c.why.title}>
          {c.why.text}
        </SectionHeading>
        <ul className="grid gap-4 sm:grid-cols-3">
          {c.why.items.map((item, i) => {
            const Icon = WHY_ICONS[i]!;
            return (
              <li key={item.title} className="rounded-2xl bg-brand-50/70 p-6 text-center ring-1 ring-brand-50">
                <Icon className="mx-auto h-10 w-10 text-brand-600" />
                <h3 className="mt-3 text-lg font-extrabold text-navy-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* STRUCNI TIM */}
      <section className="mx-auto mt-20 grid max-w-7xl gap-10 px-5 lg:grid-cols-[1fr_3fr]">
        <div>
          <SectionHeading eyebrow={c.team.eyebrow} title={c.team.title}>
            {c.team.text}
          </SectionHeading>
          <div className="mt-6 pl-5">
            <ButtonLink href={c.team.href} variant="outline">{c.team.btn}</ButtonLink>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {TEAM.filter((m) => TEAM_ON_HOME.includes(m.name)).map((m) => (
            <li key={m.name}>
              <Link href={c.team.href} className="group block overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-brand-50 transition-shadow hover:shadow-xl">
                <div className="relative aspect-[4/5] overflow-hidden bg-brand-50">
                  <Image src={m.photo} alt={m.name} fill sizes="(min-width: 768px) 20vw, 45vw" className="object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-3 text-center">
                  <h3 className="text-sm font-extrabold text-navy-900">{m.name}</h3>
                  <p className="mt-0.5 text-xs text-muted">{c.team.tags[m.name]}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* VESTI (samo na srpskom – vesti nemaju englesku verziju) */}
      {lang === "sr" && (
        <section className="mx-auto mt-20 grid max-w-7xl gap-10 px-5 lg:grid-cols-[1fr_3fr]">
          <div>
            <SectionHeading eyebrow={c.news.eyebrow} title={c.news.title}>
              {c.news.text}
            </SectionHeading>
            <div className="mt-6 pl-5">
              <ButtonLink href="/vesti/" variant="outline">{c.news.btn}</ButtonLink>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {latest.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}

      {/* KAMP */}
      <section className="relative isolate mt-20 overflow-hidden bg-navy-900 text-white">
        <Image src={`${UP}/2020/11/klub-malog-fudbala-futsal21-kragujevac-004.jpg`} alt="" fill sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/40" />
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-16 lg:grid-cols-[3fr_2fr]">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-gold-400">{c.camp.eyebrow}</p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">{c.camp.title}</h2>
            <p className="mt-4 max-w-xl text-white/85">{c.camp.text}</p>
            <div className="mt-7">
              <ButtonLink href={c.camp.href}>{c.camp.btn}</ButtonLink>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-3 text-sm font-semibold">
            {c.camp.tags.map((tag) => (
              <li key={tag} className="rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/20 backdrop-blur">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TERMINI */}
      <section className="mx-auto mt-20 grid max-w-7xl gap-10 px-5 lg:grid-cols-[1fr_3fr]">
        <SectionHeading eyebrow={c.trainings.eyebrow} title={c.trainings.title}>
          {c.trainings.text}
        </SectionHeading>
        <ul className="grid gap-4 md:grid-cols-3">
          {c.trainings.places.map((p) => (
            <li key={p.place} className="rounded-2xl bg-brand-50/70 p-5 ring-1 ring-brand-50">
              <div className="flex items-start gap-3">
                <PinIcon className="mt-0.5 h-6 w-6 shrink-0 text-brand-600" />
                <div>
                  <h3 className="font-extrabold text-navy-900">{p.place}</h3>
                  <p className="text-sm text-muted">{p.days}</p>
                </div>
              </div>
              {p.times.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {p.times.map((time) => (
                    <li key={time} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-navy-900 shadow-sm">
                      <ClockIcon className="h-3.5 w-3.5 text-brand-600" />
                      {time}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-xs text-muted">{p.note}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* UPIS + KONTAKT */}
      <section id="upis" className="mx-auto mt-20 max-w-7xl px-5">
        <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 p-8 text-white shadow-xl sm:p-12">
          <div aria-hidden className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-gold-400">{c.enroll.eyebrow}</p>
              <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">{c.enroll.title}</h2>
              <p className="mt-4 max-w-xl leading-relaxed text-white/85">{c.enroll.text}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <ButtonLink href={`tel:${CLUB.phoneHref}`} arrow={false}>
                  {c.enroll.call}
                </ButtonLink>
                <ButtonLink href={`${UP}/2020/12/vodic-za-igrace-i-roditelje-kmf21.pdf`} variant="outline-light" arrow={false}>
                  {c.enroll.guide}
                </ButtonLink>
              </div>
            </div>

            <ul id="kontakt" className="grid gap-3">
              {[
                { Icon: PhoneIcon, label: c.enroll.labels[0], value: CLUB.phone, href: `tel:${CLUB.phoneHref}` },
                { Icon: MailIcon, label: c.enroll.labels[1], value: CLUB.email, href: `mailto:${CLUB.email}` },
                { Icon: PinIcon, label: c.enroll.labels[2], value: `${CLUB.legalName}, ${CLUB.city}`, href: undefined },
              ].map(({ Icon, label, value, href }) => (
                <li key={label} className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-500 text-navy-950">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-bold uppercase tracking-wider text-white/60">{label}</span>
                    {href ? (
                      <a href={href} className="block break-words font-bold hover:text-gold-400">{value}</a>
                    ) : (
                      <span className="block font-bold">{value}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PARTNERI */}
      <section aria-labelledby="partneri" className="mx-auto mt-20 max-w-7xl px-5 pb-20">
        <h2 id="partneri" className="text-xs font-extrabold uppercase tracking-[0.25em] text-navy-900">
          {c.partners}
        </h2>
        <ul className="mt-6 grid grid-cols-2 items-center gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {SPONSORS.map((s) => {
            const img = (
              <Image
                src={s.src}
                alt={s.name}
                width={160}
                height={90}
                className="h-16 w-full object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0"
              />
            );
            return (
              <li key={s.name} className="rounded-xl bg-white p-2 ring-1 ring-brand-50">
                {"href" in s && s.href ? (
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name}>{img}</a>
                ) : (
                  img
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}

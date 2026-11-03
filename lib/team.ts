export interface TeamMember {
  name: string;
  role: string;
  tags: string[];
  photo: string;
  bio: string[];
}

const U = "/wp-content/uploads";

export const TEAM: TeamMember[] = [
  {
    name: "Branislav R. Lečić",
    role: "Profesor sporta i fizičkog vaspitanja u OŠ „21. Oktobar“ u Kragujevcu",
    tags: ["Osnivač kluba", "Škola fudbala", "Inkluzija"],
    photo: `${U}/2020/11/klub-malog-fudbala-futsal21-kragujevac-branislav-lecic.jpg`,
    bio: [
      "Osnovne studije završava 1998. god. Diplomski rad brani na temu „Nastanak i razvoj malog fudbala u Jugoslaviji“.",
      "Od 1998. god. predaje predmet fizičko vaspitanje u OŠ „21. oktobar“ u Kragujevcu. Osnivač je Kluba malog fudbala „21.oktobar“ iz Kragujevca.",
      "Aktivno se bavio malim fudbalom. U periodu od 1980. do 2000. god. bio je učesnik više turnira i Letnje lige Večernjih novosti u malom fudbalu.",
      "1994. godine, na poziv Srbe Stamenkovića, igrao je mali fudbal u Americi za klub San Jose Grizzlies (letnja liga, CISL).",
      "Dao je doprinos u pisanju prve knjige o malom fudbalu kod nas „Mali fudbal“, autora Ace Kovačevića, selektora Srbije u malom fudbalu (futsalu).",
    ],
  },
  {
    name: "Uroš Đusić",
    role: "Profesor sporta i fizičkog vaspitanja",
    tags: ["Škola fudbala"],
    photo: `${U}/2025/08/urosdjusic.jpg`,
    bio: [
      "Asistent u nastavi OŠ „21.oktobar“ Kragujevac bio je 2013. godine.",
      "Diplomirao na osnovnim studijama sa prosečnom ocenom 9. Poseduje UEFA „C“ licencu fudbalskog trenera. Student postdiplomskih studija Fakulteta sporta i fizičkog vaspitanja.",
      "U klubu radi na stručnim poslovima – metodika malog fudbala, atletike, sportske gimnastike, plivanja, elementarnih igara.",
    ],
  },
  {
    name: "Dejan Jevtić",
    role: "Diplomirani defektolog u ŠOSO „Vukašin Marković“ u Kragujevcu",
    tags: ["Inkluzija"],
    photo: `${U}/2025/09/WhatsApp-Image-2025-09-02-at-6.31.01-PM.jpeg`,
    bio: [
      "Diplomirao na Defektološkom fakultetu u Beogradu 1996. god. Predaje predmet fizičko vaspitanje u srednjoj školi ŠOSO „Vukašin Marković“.",
      "U sekciji Kluba malog fudbala „Futsal 21. – inkluzija“ radi na aktivnostima animacije i organizacije učenika sa smetnjama u razvoju za njihovo što aktivnije uključivanje u sportske aktivnosti.",
      "Učestvovao je na svim manifestacijama kluba. Koordinator je u izboru učenika i sportske aktivnosti na kojima klub učestvuje.",
    ],
  },
  {
    name: "Igor Jokić",
    role: "Profesor sporta i fizičkog vaspitanja",
    tags: ["Inkluzija"],
    photo: `${U}/2020/11/klub-malog-fudbala-futsal21-kragujevac-igor-jokic.jpg`,
    bio: [
      "U klubu radi na poslovima inkluzivnog rada, sekcije kluba za rad sa osobama sa smetnjama u razvoju. Angažovan je na projektu „Futsal 21 – inkluzija“.",
      "Stalno je zaposlen i ima 12 godina radnog iskustva kao profesor i vaspitač u „Školi sa domom učenika za decu oštećenog sluha“, Kragujevac.",
    ],
  },
  {
    name: "Janko Milovanović",
    role: "Diplomirani psiholog",
    tags: ["Škola fudbala", "Inkluzija"],
    photo: `${U}/2020/11/klub-malog-fudbala-futsal21-kragujevac-janko-milovanovic.jpg`,
    bio: [
      "Rođen 1994. god. Elitan učenik OŠ „21.oktobar“ (sa prosekom 5,00), potom učenik Prve kragujevačke gimnazije. Završio je Filozofski fakultet u Beogradu.",
      "Uporedo se bavi malim fudbalom. Radio je u klubu pet godina do odlaska na studije.",
      "U klub se vraća od septembra 2020. da radi na stručnim poslovima sa učenicima najmlađih uzrasta, sekcija kluba – škola fudbala i inkluzija.",
    ],
  },
  {
    name: "Ilija Srećković",
    role: "Diplomirani pedagog",
    tags: ["Metodika malog fudbala", "Sportska edukacija najmlađih polaznika"],
    photo: `${U}/2025/08/WhatsApp-Image-2025-08-26-at-5.23.28-PM.jpeg`,
    bio: [
      "Ilija P. Srećković, rođen 2002. godine u Kragujevcu. Završio OŠ „21. oktobar“, a potom i „Ekonomsku školu“ u Kragujevcu.",
      "Trenutno je student Pedagoškog fakulteta u Jagodini na smeru diplomirani pedagog, vaspitač.",
      "Aktivno se fudbalom bavi od 5. godine, a trenutno je kapiten omladinske selekcije FK „Victoria“. Prve sportske korake napravio je u klubu KMF „21. Oktobar“. Zatim se aktivno bavio velikim fudbalom u FK „Šumadija“, FK „Sušica“ i FC „Victoria Kragujevac“.",
      "U Klub malog fudbala „21.oktobar“ se vraća 2021. godine da radi na stručnim poslovima: metodika malog fudbala i sportska edukacija najmlađih polaznika kluba.",
    ],
  },
];

export const TRAININGS = [
  {
    place: "OŠ „Moma Stanojlović“",
    days: "Ponedeljak, Petak, Subota",
    times: ["19:00 – 20:00"],
    note: "Kada je lepo vreme, treninzi se održavaju na sportskom poligonu škole.",
  },
  {
    place: "OŠ „21. Oktobar“",
    days: "Utorak, Četvrtak",
    times: ["19:30 – 20:30"],
    note: "Subotom: 11:00 – 13:00",
  },
  {
    place: "SC „Kole“ Ilijina Voda",
    days: "Škola fudbala",
    times: [],
    note: "Za termine nas kontaktirajte.",
  },
] as const;

export const SPONSORS = [
  { name: "Erste Bank", src: "/wp-content/uploads/2025/04/1000035970.jpg", href: "https://www.erstebank.rs/" },
  { name: "Sunce – vrata i prozori", src: "/wp-content/uploads/2022/06/logo-sunce.jpg", href: "https://www.suncemarinkovic.com/" },
  { name: "Grad Kragujevac", src: "/wp-content/uploads/2020/11/logo-kragujevac.jpg" },
  { name: "Milanović", src: "/wp-content/uploads/2020/11/logo-milanovic.jpg" },
  { name: "Poslastičarnica Srce", src: "/wp-content/uploads/2020/11/logo-srce.jpg" },
  { name: "Foto Soni", src: "/wp-content/uploads/2022/08/fotosoni.jpg" },
  { name: "Plan Invest nekretnine", src: "/wp-content/uploads/2024/05/nekretninelogo.jpg", href: "https://nekretnineplaninvest.com/" },
  { name: "Minakva", src: "/wp-content/uploads/2020/11/logo-minakva.jpg" },
] as const;

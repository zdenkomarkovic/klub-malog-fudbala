// Jednokratno: dodaje engleske verzije (roleEn, tagsEn, bioEn) članovima tima u Sanity-ju.
// Pokretanje: node --env-file=.env.local scripts/add-team-english.mjs
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const EN = {
  "Branislav R. Lečić": {
    roleEn: "Sports and physical education teacher at „21. oktobar“ Elementary School in Kragujevac",
    tagsEn: ["Club founder", "Football school", "Inclusion"],
    bioEn: [
      "Branislav graduated in 1998 with a thesis on „Emergence and development of futsal in Yugoslavia“.",
      "Since 1998 he has been teaching physical education at „21. oktobar“ Elementary School in Kragujevac. He is the founder of the „21. oktobar“ futsal club from Kragujevac.",
      "He actively played futsal. From 1980 to 2000 he took part in several tournaments and the Večernje novosti Summer Futsal League.",
      "In 1994, at the invitation of [Srba Stamenković](https://www.facebook.com/watch/?v=948641781889717), he played futsal in the USA for [San Jose Grizzlies](http://en.wikipedia.org/wiki/San_Jose_Grizzlies) ([summer league, CISL](https://www.youtube.com/watch?v=aYmHhY9VSYg)).",
      "He contributed to writing the first book on futsal in our country, [„Futsal“ by Aca Kovačević](http://www.futsalplanet.com/books/book-01.asp?BooId=10), coach of the Serbian futsal team.",
    ],
  },
  "Uroš Đusić": {
    roleEn: "Sports and physical education teacher",
    tagsEn: ["Football school"],
    bioEn: [
      "In 2013, Uroš was a teaching assistant at „21. oktobar“ Elementary School in Kragujevac.",
      "He graduated with a GPA of 9. He holds a UEFA „C“ football coach license and is a postgraduate student at the Faculty of Sports and Physical Education.",
      "In the club he works on professional tasks – the methodology of futsal, athletics, sports gymnastics, swimming and elementary games.",
    ],
  },
  "Dejan Jevtić": {
    roleEn: "Graduate special educator (defectologist) at „Vukašin Marković“ school in Kragujevac",
    tagsEn: ["Inclusion"],
    bioEn: [
      "He graduated from the Faculty of Special Education and Rehabilitation in Belgrade in 1996. He teaches physical education at the „Vukašin Marković“ secondary school.",
      "In the „Futsal 21 – inclusion“ section of the club he works on animating and organizing students with developmental disabilities so that they can take part in sports activities as actively as possible.",
      "He has taken part in all of the club's events. He coordinates the selection of students and the sports activities in which the club participates.",
    ],
  },
  "Igor Jokić": {
    roleEn: "Sports and physical education teacher",
    tagsEn: ["Inclusion"],
    bioEn: [
      "In the club he works on inclusion – the section for people with developmental disabilities. He is engaged in the „Futsal 21 – inclusion“ project.",
      "He is permanently employed and has 12 years of work experience as a teacher and educator at the „School with a home for students with hearing impairment“, Kragujevac.",
    ],
  },
  "Janko Milovanović": {
    roleEn: "Graduate psychologist",
    tagsEn: ["Football school", "Inclusion"],
    bioEn: [
      "Janko was born in 1994. He was an exceptional student of „21. oktobar“ Elementary School (GPA 5.00), then a student of the First Kragujevac Grammar School. He graduated from the Faculty of Philosophy in Belgrade.",
      "He plays futsal alongside his studies and worked in the club for five years before leaving for university.",
      "He returned to the club in September 2020 to work professionally with the youngest students, in the football school and inclusion sections.",
    ],
  },
  "Ilija Srećković": {
    roleEn: "Graduate pedagogue",
    tagsEn: ["Futsal methodology", "Sports education of the youngest participants"],
    bioEn: [
      "Ilija P. Srećković, born in 2002 in Kragujevac. He finished „21. oktobar“ Elementary School and then the Secondary School of Economics in Kragujevac.",
      "He is currently a student at the Faculty of Education in Jagodina, majoring in pedagogy (educator).",
      "He has been actively playing football since the age of 5 and is currently the captain of the youth team of FC „Victoria“. He took his first sports steps in the futsal club „21. oktobar“, then played football at FC „Šumadija“, FC „Sušica“ and FC „Victoria Kragujevac“.",
      "In 2021 he returned to the futsal club „21. oktobar“ to work on futsal methodology and sports education of the club's youngest members.",
    ],
  },
};

const doc = await client.getDocument("team");
for (const m of doc.members) {
  const en = EN[m.name];
  if (!en) console.warn("Nema prevoda za:", m.name);
  else Object.assign(m, en);
}
await client.createOrReplace(doc);
console.log("Gotovo – engleske verzije dodate.");

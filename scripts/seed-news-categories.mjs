// Jednokratno: pravi kategorije vesti u Sanity-ju (iste kao na sajtu), da se mogu birati u obrascu "Vest".
// Pokretanje: node --env-file=.env.local scripts/seed-news-categories.mjs
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const CATEGORIES = [
  { slug: "inkluzija", title: "Inkluzija" },
  { slug: "futsal21", title: "Futsal21" },
];

for (const c of CATEGORIES) {
  await client.createIfNotExists({
    _id: `newsCategory-${c.slug}`,
    _type: "newsCategory",
    title: c.title,
    slug: { _type: "slug", current: c.slug },
  });
  console.log("kategorija:", c.title);
}

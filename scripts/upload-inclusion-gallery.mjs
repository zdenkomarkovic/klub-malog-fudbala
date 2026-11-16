// Jednokratno: prebacuje postojeće fotografije sa stranice Inkluzija u Sanity (dokument "inclusionGallery").
// Pokretanje: node --env-file=.env.local scripts/upload-inclusion-gallery.mjs
// Potreban je SANITY_API_WRITE_TOKEN (sanity.io/manage -> API -> Tokens -> Editor) u .env.local.
import { createClient } from "@sanity/client";
import { createReadStream } from "node:fs";
import path from "node:path";

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) throw new Error("Nedostaje SANITY_API_WRITE_TOKEN u .env.local");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

const FILES = [
  "public/wp-content/uploads/2020/11/inkluzija.jpg",
  "public/wp-content/uploads/2020/11/klub-malog-fudbala-futsal-21-kragujevac-vesti-002.jpg",
  "public/wp-content/uploads/2020/11/klub-malog-fudbala-futsal-21-kragujevac-vesti-003.jpg",
  "public/wp-content/uploads/2022/08/pehar-inkluzija-682x1024.jpg",
];

const images = [];
for (const f of FILES) {
  const asset = await client.assets.upload("image", createReadStream(f), { filename: path.basename(f) });
  console.log("otpremljeno:", f);
  images.push({
    _type: "image",
    _key: asset._id.slice(-12),
    asset: { _type: "reference", _ref: asset._id },
    alt: "",
  });
}

await client.createOrReplace({ _id: "inclusionGallery", _type: "inclusionGallery", images });
console.log("Gotovo – galerija ima", images.length, "slika.");

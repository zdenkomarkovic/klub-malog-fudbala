// Jednokratno: prebacuje fotografije i YouTube snimke sa stranice Letnji kamp u Sanity (dokument "campMedia").
// Pokretanje: node --env-file=.env.local scripts/upload-camp-media.mjs
import { createClient } from "@sanity/client";
import { createReadStream, readFileSync } from "node:fs";
import path from "node:path";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const pages = JSON.parse(readFileSync("content/pages.json", "utf8"));
const html = pages.find((p) => p.slug === "letnji-kamp-kopaonik").html;
const files = [...html.matchAll(/<img[^>]*src="([^"]+)"/g)].map((m) => m[1]);
const videoIds = [...html.matchAll(/youtube(?:-nocookie)?\.com\/embed\/([\w-]{11})/g)].map((m) => m[1]);

const photos = [];
for (const f of files) {
  const file = path.join("public", f);
  const asset = await client.assets.upload("image", createReadStream(file), { filename: path.basename(file) });
  console.log("otpremljeno:", f);
  photos.push({ _type: "image", _key: asset._id.slice(-12), asset: { _type: "reference", _ref: asset._id }, alt: "" });
}
const videos = videoIds.map((id, i) => ({ _type: "video", _key: `v${i}-${id}`, url: `https://www.youtube.com/watch?v=${id}` }));

await client.createOrReplace({ _id: "campMedia", _type: "campMedia", photos, videos });
console.log(`Gotovo – ${photos.length} fotografija, ${videos.length} snimaka.`);

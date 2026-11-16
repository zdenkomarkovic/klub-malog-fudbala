// Jednokratno: prebacuje stručni tim iz lib/team.ts u Sanity (dokument "team").
// Pokretanje: node --env-file=.env.local scripts/upload-team.mjs   (potreban SANITY_API_WRITE_TOKEN)
import { createClient } from "@sanity/client";
import { createReadStream } from "node:fs";
import path from "node:path";
import { readFileSync } from "node:fs";

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) throw new Error("Nedostaje SANITY_API_WRITE_TOKEN u .env.local");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

// Učitavamo lib/team.ts kao tekst i izvlačimo TEAM (bez TS kompajlera).
const src = readFileSync("lib/team.ts", "utf8");
const block = src.slice(src.indexOf("export const TEAM"), src.indexOf("export const TRAININGS"));
const U = "/wp-content/uploads";
const body = block.slice(block.indexOf("["), block.lastIndexOf("]") + 1);
const TEAM = new Function("U", `return ${body.replace(/\$\{U\}/g, "${U}")}`)(U);

const ON_HOME = ["Branislav R. Lečić", "Uroš Đusić", "Igor Jokić", "Janko Milovanović"];
const members = [];
for (const m of TEAM) {
  const file = path.join("public", m.photo);
  const asset = await client.assets.upload("image", createReadStream(file), { filename: path.basename(file) });
  console.log("otpremljeno:", m.name);
  members.push({
    _type: "member",
    _key: asset._id.slice(-12),
    name: m.name,
    role: m.role,
    tags: m.tags,
    bio: m.bio,
    onHome: ON_HOME.includes(m.name),
    photo: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
  });
}
await client.createOrReplace({ _id: "team", _type: "team", members });
console.log("Gotovo –", members.length, "članova.");

// Jednokratno: prebacuje hronologiju takmičenja u Sanity (dokument "competitions"), najnovija sezona prva.
// Pokretanje: node --env-file=.env.local scripts/upload-competitions.mjs   (čita scripts/_competitions.json)
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const seasons = JSON.parse(readFileSync("scripts/_competitions.json", "utf8"));
await client.createOrReplace({ _id: "competitions", _type: "competitions", seasons });
console.log("Gotovo –", seasons.length, "sezona.");

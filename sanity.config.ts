"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { inclusionGallery } from "./sanity/schemaTypes/inclusionGallery";
import { team } from "./sanity/schemaTypes/team";
import { news, newsCategory } from "./sanity/schemaTypes/news";
import { campMedia } from "./sanity/schemaTypes/campMedia";
import { competitions } from "./sanity/schemaTypes/competitions";

const singletonId = "inclusionGallery";

export default defineConfig({
  name: "kmf21",
  title: "KMF 21. – sadržaj",
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "ix8h90ra",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  schema: { types: [inclusionGallery, team, news, newsCategory, campMedia, competitions] },
  plugins: [
    structureTool({
      // Jedan jedini dokument galerije (singleton)
      structure: (S) =>
        S.list()
          .title("Sadržaj")
          .items([
            S.listItem()
              .title("Galerija – Inkluzija")
              .id(singletonId)
              .child(S.document().schemaType("inclusionGallery").documentId(singletonId)),
            S.documentTypeListItem("news").title("Vesti"),
            S.documentTypeListItem("newsCategory").title("Kategorije vesti"),
            S.divider(),
            S.listItem()
              .title("Hronologija takmičenja")
              .id("competitions")
              .child(S.document().schemaType("competitions").documentId("competitions")),
            S.listItem()
              .title("Kamp – fotografije i snimci")
              .id("campMedia")
              .child(S.document().schemaType("campMedia").documentId("campMedia")),
            S.listItem()
              .title("Stručni tim")
              .id("team")
              .child(S.document().schemaType("team").documentId("team")),
          ]),
    }),
  ],
  document: {
    // Singleton: ne može se praviti novi niti brisati
    actions: (prev, { schemaType }) =>
      schemaType === "inclusionGallery" || schemaType === "team" || schemaType === "campMedia" || schemaType === "competitions" ? prev.filter((a) => a.action !== "delete" && a.action !== "duplicate") : prev,
    newDocumentOptions: (prev) => prev.filter((t) => t.templateId !== "inclusionGallery" && t.templateId !== "team" && t.templateId !== "campMedia" && t.templateId !== "competitions"),
  },
});

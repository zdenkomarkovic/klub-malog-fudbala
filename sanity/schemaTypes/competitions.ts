// Šema: jedan dokument "Hronologija takmičenja" sa sezonama.
// Na sajtu se sezone uvek prikazuju od najnovije ka najstarijoj (po godini iz polja "Sezona").
import { defineArrayMember, defineField, defineType } from "sanity";

export const competitions = defineType({
  name: "competitions",
  title: "Hronologija takmičenja",
  type: "document",
  fields: [
    defineField({
      name: "seasons",
      title: "Sezone",
      description: "Dodaj novu sezonu – redosled je automatski (najnovija prva).",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "season",
          title: "Sezona",
          fields: [
            defineField({
              name: "season",
              title: "Sezona (npr. 2024/2025)",
              type: "string",
              validation: (r) => r.required().regex(/^\d{4}\s*\/\s*\d{4}$/, { name: "format", invert: false }).error("Format: 2024/2025"),
            }),
            defineField({ name: "intro", title: "Uvodni tekst", type: "text", rows: 2 }),
            defineField({
              name: "items",
              title: "Stavke (takmičenja, plasmani)",
              type: "array",
              of: [{ type: "string" }],
            }),
            defineField({ name: "introEn", title: "Uvodni tekst (engleski)", type: "text", rows: 2 }),
            defineField({ name: "itemsEn", title: "Stavke (engleski)", type: "array", of: [{ type: "string" }] }),
          ],
          preview: { select: { title: "season", subtitle: "intro" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Hronologija takmičenja" }) },
});

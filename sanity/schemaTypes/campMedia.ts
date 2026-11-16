// Šema: jedan dokument "Kamp – fotografije i snimci" (stranica Letnji kamp Kopaonik).
// Prva fotografija ide na vrh stranice, ostale u mrežu; snimci su YouTube linkovi.
import { defineArrayMember, defineField, defineType } from "sanity";

export const campMedia = defineType({
  name: "campMedia",
  title: "Kamp – fotografije i snimci",
  type: "document",
  fields: [
    defineField({
      name: "photos",
      title: "Fotografije",
      description: "Prva fotografija je velika, ostale idu u mrežu. Redosled prevlačenjem.",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Opis slike", type: "string" })],
        }),
      ],
    }),
    defineField({
      name: "videos",
      title: "Snimci (YouTube)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "video",
          title: "YouTube snimak",
          fields: [
            defineField({ name: "url", title: "YouTube link", type: "url", validation: (r) => r.required() }),
            defineField({ name: "title", title: "Naslov (opciono)", type: "string" }),
          ],
          preview: { select: { title: "title", subtitle: "url" }, prepare: ({ title, subtitle }) => ({ title: title ?? subtitle, subtitle: title ? subtitle : "" }) },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Kamp – fotografije i snimci" }) },
});

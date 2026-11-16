// Šema: jedan dokument "Galerija – Inkluzija" sa fotografijama (redosled = redosled na sajtu).
import { defineArrayMember, defineField, defineType } from "sanity";

export const inclusionGallery = defineType({
  name: "inclusionGallery",
  title: "Galerija – Inkluzija",
  type: "document",
  fields: [
    defineField({
      name: "images",
      title: "Fotografije",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Opis slike", type: "string" })],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Galerija – Inkluzija" }) },
});

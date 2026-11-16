// Šema: jedan dokument "Stručni tim" sa listom članova (redosled prevlačenjem = redosled na sajtu).
// U biografiji možeš da napraviš link ovako: [tekst linka](https://adresa.rs)
import { defineArrayMember, defineField, defineType } from "sanity";

export const team = defineType({
  name: "team",
  title: "Stručni tim",
  type: "document",
  fields: [
    defineField({
      name: "members",
      title: "Članovi tima",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "member",
          title: "Član tima",
          fields: [
            defineField({
              name: "visible",
              title: "Prikaži na sajtu",
              description: "Isključi da ovog člana sakriješ sa sajta, a da ga ne brišeš (kasnije ga opet uključiš).",
              type: "boolean",
              initialValue: true,
            }),
            defineField({ name: "name", title: "Ime i prezime", type: "string", validation: (r) => r.required() }),
            defineField({ name: "role", title: "Zanimanje / uloga", type: "string" }),
            defineField({
              name: "tags",
              title: "Oznake (npr. Škola fudbala, Inkluzija)",
              type: "array",
              of: [{ type: "string" }],
              options: { layout: "tags" },
            }),
            defineField({ name: "photo", title: "Fotografija", type: "image", options: { hotspot: true } }),
            defineField({
              name: "bio",
              title: "Biografija (svaki pasus posebno)",
              description: "Link: [tekst linka](https://adresa.rs)",
              type: "array",
              of: [{ type: "text", rows: 3 }],
            }),
            defineField({ name: "roleEn", title: "Zanimanje / uloga (engleski)", type: "string" }),
            defineField({
              name: "tagsEn",
              title: "Oznake (engleski)",
              type: "array",
              of: [{ type: "string" }],
              options: { layout: "tags" },
            }),
            defineField({
              name: "bioEn",
              title: "Biografija (engleski, svaki pasus posebno)",
              description: "Link: [tekst linka](https://adresa.rs)",
              type: "array",
              of: [{ type: "text", rows: 3 }],
            }),
            defineField({
              name: "onHome",
              title: "Prikaži na početnoj stranici",
              type: "boolean",
              initialValue: false,
            }),
          ],
          preview: { select: { title: "name", subtitle: "role", media: "photo", visible: "visible" },
          prepare: ({ title, subtitle, media, visible }) => ({
            title,
            subtitle: visible === false ? "SAKRIVEN – " + (subtitle ?? "") : subtitle,
            media,
          }) },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Stručni tim" }) },
});

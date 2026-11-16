// Šeme za vesti: "Vest" (news) i "Kategorija vesti" (newsCategory).
// Svaka objavljena vest automatski dobija svoju stranicu (/godina/mesec/dan/slug/), pojavljuje se
// u listi Vesti, na početnoj i u bočnoj traci (Najnoviji članci, Pretraga, Arhive, Kategorije) sa linkom na vest.
import { defineArrayMember, defineField, defineType } from "sanity";

export const newsCategory = defineType({
  name: "newsCategory",
  title: "Kategorija vesti",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Naziv", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug (deo adrese)",
      type: "slug",
      options: { source: "title", maxLength: 60 },
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: "title" } },
});

export const news = defineType({
  name: "news",
  title: "Vest",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Naslov", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug (deo adrese)",
      description: "Klikni Generate – pravi se od naslova. Adresa vesti: /godina/mesec/dan/slug/",
      type: "slug",
      options: { source: "title", maxLength: 80 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "date",
      title: "Datum objave",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: "categories",
      title: "Kategorije",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "newsCategory" }] })],
    }),
    defineField({
      name: "image",
      title: "Naslovna fotografija",
      description: "Prikazuje se na kartici vesti i na vrhu vesti.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "excerpt",
      title: "Kratak opis (za kartice i pretragu)",
      description: "Ako ostane prazno, uzima se početak teksta.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "body",
      title: "Tekst vesti",
      description: "Pasusi, podnaslovi, liste, linkovi, fotografije (uzastopne se slažu u mrežu) i YouTube snimci.",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Pasus", value: "normal" },
            { title: "Podnaslov", value: "h2" },
            { title: "Manji podnaslov", value: "h3" },
          ],
          lists: [
            { title: "Lista", value: "bullet" },
            { title: "Numerisana lista", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Podebljano", value: "strong" },
              { title: "Kurziv", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "Adresa",
                    validation: (r) => r.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
                  },
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Opis slike", type: "string" })],
        }),
        defineArrayMember({
          name: "youtube",
          title: "YouTube snimak",
          type: "object",
          fields: [defineField({ name: "url", title: "YouTube link", type: "url", validation: (r) => r.required() })],
          preview: { select: { title: "url" }, prepare: ({ title }) => ({ title: title ?? "YouTube snimak" }) },
        }),
      ],
    }),
  ],
  orderings: [{ title: "Najnovije prvo", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: {
    select: { title: "title", date: "date", media: "image" },
    prepare: ({ title, date, media }) => ({
      title,
      subtitle: date ? new Date(date).toLocaleDateString("sr-RS") : "",
      media,
    }),
  },
});

import type { Metadata } from "next";
import { LOGO_PATH, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./constants";
import { PAGE_PAIRS } from "./i18n";

interface BuildMetadataOptions {
  /** Pun naslov (kao <title>), bez dodatnog sufiksa. */
  title?: string;
  description?: string;
  /** Putanja stranice, npr. "/o-klubu/" - koristi se za canonical i og:url. */
  path?: string;
  /** Putanja ili apsolutni URL slike za og/twitter. */
  image?: string | null;
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string | null;
  modifiedTime?: string | null;
  lang?: "sr" | "en";
}

export function buildMetadata({
  title = SITE_NAME,
  description = SITE_DESCRIPTION,
  path = "/",
  image,
  noIndex = false,
  type = "website",
  publishedTime,
  modifiedTime,
  lang = "sr",
}: BuildMetadataOptions = {}): Metadata {
  const url = `${SITE_URL}${path}`;
  // hreflang: srpska i engleska verzija iste stranice
  const pair = PAGE_PAIRS.find((p) => p.sr === path || p.en === path);
  const languages = pair
    ? { "sr-RS": `${SITE_URL}${pair.sr}`, en: `${SITE_URL}${pair.en}`, "x-default": `${SITE_URL}${pair.sr}` }
    : undefined;
  if (PAGE_PAIRS.some((p) => p.en === path)) lang = "en";
  const img = image ? (image.startsWith("http") ? image : `${SITE_URL}${image}`) : `${SITE_URL}${LOGO_PATH}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url, ...(languages && { languages }) },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: lang === "en" ? "en_US" : "sr_RS",
      type,
      images: [{ url: img }],
      ...(type === "article" && {
        ...(publishedTime && { publishedTime }),
        ...(modifiedTime && { modifiedTime }),
      }),
    },
    twitter: { card: "summary_large_image", title, description, images: [img] },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
  };
}

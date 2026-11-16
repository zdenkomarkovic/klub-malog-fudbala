import { createClient } from "@sanity/client";
import { TEAM as STATIC_TEAM, type TeamMember } from "@/lib/team";

const ON_HOME = ["Branislav R. Lečić", "Uroš Đusić", "Igor Jokić", "Janko Milovanović"];
const TEAM: TeamMember[] = STATIC_TEAM.map((m) => ({ ...m, onHome: ON_HOME.includes(m.name) }));

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const sanityClient = projectId
  ? createClient({ projectId, dataset, apiVersion: "2025-01-01", useCdn: true })
  : null;

export type GalleryImage = { url: string; alt: string };

/**
 * Fotografije za stranicu Inkluzija (dokument "inclusionGallery" u Sanity-ju).
 * Vraća null ako Sanity nije podešen, dokument ne postoji, nema slika ili upit ne uspe –
 * tada se prikazuju slike iz sadržaja stranice.
 */
export async function getInclusionGallery(): Promise<GalleryImage[] | null> {
  if (!sanityClient) return null;
  try {
    const doc = await sanityClient.fetch<{ images?: { url?: string; alt?: string }[] } | null>(
      `*[_type == "inclusionGallery"][0]{ images[]{ alt, "url": asset->url } }`,
      {},
      { next: { revalidate: 60 } },
    );
    const images = (doc?.images ?? [])
      .filter((i): i is { url: string; alt?: string } => !!i?.url)
      .map((i) => ({ url: `${i.url}?w=1600&auto=format`, alt: i.alt ?? "" }));
    return images.length ? images : null;
  } catch {
    return null;
  }
}

/**
 * Stručni tim (dokument "team" u Sanity-ju). Ako Sanity nije podešen ili je prazan,
 * koristi se statična lista iz lib/team.ts.
 */
export async function getTeam(lang: "sr" | "en" = "sr"): Promise<TeamMember[]> {
  if (!sanityClient) return TEAM;
  try {
    const members = await sanityClient.fetch<
      {
        name?: string;
        role?: string;
        tags?: string[];
        bio?: string[];
        roleEn?: string;
        tagsEn?: string[];
        bioEn?: string[];
        onHome?: boolean;
        visible?: boolean;
        photo?: string;
      }[] | null
    >(
      `*[_id == "team"][0].members[]{ name, role, tags, bio, roleEn, tagsEn, bioEn, onHome, visible, "photo": photo.asset->url }`,
      {},
      { next: { revalidate: 60 } },
    );
    const list = (members ?? [])
      .filter((m) => m?.name && m.visible !== false)
      .map((m) => ({
        name: m.name!,
        // Engleska verzija: koristi engleska polja, a ako nisu popunjena – srpska
        role: (lang === "en" && m.roleEn) || m.role || "",
        tags: (lang === "en" && m.tagsEn?.length ? m.tagsEn : m.tags) ?? [],
        bio: (lang === "en" && m.bioEn?.length ? m.bioEn : m.bio) ?? [],
        onHome: !!m.onHome,
        photo: m.photo ? `${m.photo}?w=800&auto=format` : "/logo.png",
      }));
    return list.length ? list : TEAM;
  } catch {
    return TEAM;
  }
}

export type CampMedia = { photos: GalleryImage[]; videos: { url: string; title: string }[] };

/** Fotografije i YouTube snimci za stranicu Letnji kamp (dokument "campMedia"). null = koristi sadržaj stranice. */
export async function getCampMedia(): Promise<CampMedia | null> {
  if (!sanityClient) return null;
  try {
    const doc = await sanityClient.fetch<{
      photos?: { url?: string; alt?: string }[];
      videos?: { url?: string; title?: string }[];
    } | null>(
      `*[_id == "campMedia"][0]{ photos[]{ alt, "url": asset->url }, videos[]{ url, title } }`,
      {},
      { next: { revalidate: 60 } },
    );
    const photos = (doc?.photos ?? [])
      .filter((i): i is { url: string; alt?: string } => !!i?.url)
      .map((i) => ({ url: `${i.url}?w=1600&auto=format`, alt: i.alt ?? "" }));
    const videos = (doc?.videos ?? [])
      .filter((v): v is { url: string; title?: string } => !!v?.url)
      .map((v) => ({ url: v.url, title: v.title ?? "" }));
    return photos.length || videos.length ? { photos, videos } : null;
  } catch {
    return null;
  }
}

export type CompetitionSeason = { season: string; intro: string; items: string[] };

/** Hronologija takmičenja (dokument "competitions"), najnovija sezona prva. null = koristi sadržaj stranice. */
export async function getCompetitions(lang: "sr" | "en" = "sr"): Promise<CompetitionSeason[] | null> {
  if (!sanityClient) return null;
  try {
    const rows = await sanityClient.fetch<
      { season?: string; intro?: string; items?: string[]; introEn?: string; itemsEn?: string[] }[] | null
    >(`*[_id == "competitions"][0].seasons[]{ season, intro, items, introEn, itemsEn }`, {}, { next: { revalidate: 60 } });
    const list = (rows ?? [])
      .filter((r) => r?.season)
      .map((r) => ({
        season: r.season!,
        intro: ((lang === "en" && r.introEn) || r.intro || "").trim(),
        items: ((lang === "en" && r.itemsEn?.length ? r.itemsEn : r.items) ?? []).filter(Boolean),
      }))
      .sort((a, b) => parseInt(b.season) - parseInt(a.season));
    return list.length ? list : null;
  } catch {
    return null;
  }
}

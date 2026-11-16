import archive from "@/content/archive.json";

export interface ArchiveSection {
  id: string;
  title: string;
  html: string;
}

export const ARCHIVE = archive as ArchiveSection[];
/** Broj celina (sezona/meseci) po strani. */
export const ARCHIVE_PER_PAGE = 2;
export const ARCHIVE_PAGES = Math.max(1, Math.ceil(ARCHIVE.length / ARCHIVE_PER_PAGE));
export const archivePagePath = (page: number) => (page <= 1 ? "/arhiva/" : `/arhiva/strana/${page}/`);

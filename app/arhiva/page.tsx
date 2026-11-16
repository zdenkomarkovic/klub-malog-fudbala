import { buildMetadata } from "@/lib/metadata";
import { ArchiveList } from "@/components/archive/ArchiveList";

export const metadata = buildMetadata({
  title: "Arhiva - Klub malog fudbala 21",
  description: "Hronološki pregled dešavanja KMF „21.oktobar“ Kragujevac – sezone 2010–2013: utakmice, turniri i takmičenja.",
  path: "/arhiva/",
});

export default function ArchivePage() {
  return <ArchiveList page={1} />;
}

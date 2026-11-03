import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = buildMetadata({ title: "Stranica nije pronađena", noIndex: true });

export default function NotFoundPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-24 text-center">
      <p className="font-display text-7xl font-extrabold text-brand-700">404</p>
      <h1 className="mt-4 text-3xl font-extrabold text-navy-900">Stranica nije pronađena</h1>
      <p className="mt-3 text-muted">Stranica koju tražite ne postoji ili je premeštena.</p>
      <div className="mt-8 flex justify-center gap-4">
        <ButtonLink href="/">Vrati se na početnu</ButtonLink>
        <Link href="/vesti/" className="self-center font-bold text-brand-700 hover:text-navy-900">Vesti</Link>
      </div>
    </main>
  );
}

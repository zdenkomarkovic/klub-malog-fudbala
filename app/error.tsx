"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-2xl px-5 py-24 text-center">
      <h1 className="text-3xl font-extrabold text-navy-900">Došlo je do greške</h1>
      <p className="mt-3 text-muted">Nešto nije u redu. Pokušajte ponovo.</p>
      <button
        onClick={reset}
        className="mt-8 rounded-full bg-gold-500 px-6 py-3 text-sm font-bold text-navy-950 hover:bg-gold-400"
      >
        Pokušaj ponovo
      </button>
    </main>
  );
}

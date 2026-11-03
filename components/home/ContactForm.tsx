"use client";

import { useState } from "react";
import { T, type Lang } from "@/lib/i18n";

type Status = "idle" | "sending" | "ok" | "error";

const field =
  "w-full rounded-xl border border-brand-50 bg-white px-4 py-3 text-sm text-ink shadow-sm placeholder:text-muted/70 focus:border-brand-600";

export function ContactForm({ lang = "sr" }: { lang?: Lang }) {
  const f = T[lang].form;
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setError("");
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? f.fail);
      setStatus("ok");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : f.fail);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-semibold text-navy-900">
          {f.name}
          <input name="name" required minLength={2} autoComplete="name" className={field} placeholder={f.namePh} />
        </label>
        <label className="grid gap-1 text-sm font-semibold text-navy-900">
          {f.email}
          <input name="email" type="email" required autoComplete="email" className={field} placeholder="vas@email.com" />
        </label>
      </div>
      <label className="grid gap-1 text-sm font-semibold text-navy-900">
        {f.phone}
        <input name="phone" type="tel" autoComplete="tel" className={field} placeholder="+381 6x xxx xxxx" />
      </label>
      <label className="grid gap-1 text-sm font-semibold text-navy-900">
        {f.message}
        <textarea
          name="message"
          required
          minLength={10}
          rows={5}
          className={field}
          placeholder={f.messagePh}
        />
      </label>
      {/* honeypot */}
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-gold-500 px-7 py-3 text-sm font-bold text-navy-950 shadow-lg shadow-gold-500/25 transition-colors hover:bg-gold-400 disabled:opacity-60"
        >
          {status === "sending" ? f.sending : f.send}
        </button>
        <p role="status" aria-live="polite" className="text-sm">
          {status === "ok" && <span className="font-semibold text-green-700">{f.ok}</span>}
          {status === "error" && <span className="font-semibold text-red-700">{error}</span>}
        </p>
      </div>
    </form>
  );
}

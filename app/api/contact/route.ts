import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations";
import { CLUB } from "@/lib/constants";

export const runtime = "nodejs";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Neispravan zahtev." }, { status: 400 });

  // honeypot - botovi popunjavaju skriveno polje
  if (body.website) return NextResponse.json({ ok: true });

  const parsed = contactFormSchema.safeParse({
    name: body.name,
    email: body.email,
    message: body.message,
    phone: body.phone || undefined,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Proverite unete podatke." },
      { status: 422 },
    );
  }

  const { MAILJET_API_KEY, MAILJET_SECRET_KEY, SITE_MAIL_SENDER, SITE_MAIL_RECEIVER } = process.env;
  const receiver = SITE_MAIL_RECEIVER?.includes("@") && !SITE_MAIL_RECEIVER.startsWith("@") ? SITE_MAIL_RECEIVER : CLUB.email;
  if (!MAILJET_API_KEY || !MAILJET_SECRET_KEY || !SITE_MAIL_SENDER) {
    return NextResponse.json(
      { error: `Slanje trenutno nije dostupno. Pišite nam na ${CLUB.email}.` },
      { status: 503 },
    );
  }

  const { name, email, phone, message } = parsed.data;
  const res = await fetch("https://api.mailjet.com/v3.1/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from(`${MAILJET_API_KEY}:${MAILJET_SECRET_KEY}`).toString("base64"),
    },
    body: JSON.stringify({
      Messages: [
        {
          From: { Email: SITE_MAIL_SENDER.trim(), Name: "KMF 21 sajt" },
          To: [{ Email: receiver.trim() }],
          ReplyTo: { Email: email, Name: name },
          Subject: `Nova poruka sa sajta – ${name}`,
          HTMLPart: `<p><b>Ime:</b> ${esc(name)}</p><p><b>Email:</b> ${esc(email)}</p><p><b>Telefon:</b> ${esc(phone ?? "-")}</p><p>${esc(message).replace(/\n/g, "<br>")}</p>`,
        },
      ],
    }),
  });

  if (!res.ok) return NextResponse.json({ error: "Slanje nije uspelo. Pokušajte ponovo." }, { status: 502 });
  return NextResponse.json({ ok: true });
}

import { allPosts, postPath } from "@/lib/content";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export function GET() {
  const items = allPosts
    .map(
      (p) => `<item>
<title>${esc(p.title)}</title>
<link>${SITE_URL}${postPath(p)}</link>
<guid isPermaLink="true">${SITE_URL}${postPath(p)}</guid>
<pubDate>${new Date(p.date).toUTCString()}</pubDate>
<description>${esc(p.excerpt)}</description>
</item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${esc(SITE_NAME)}</title>
<link>${SITE_URL}/</link>
<description>${esc(SITE_DESCRIPTION)}</description>
<language>sr-RS</language>
${items}
</channel></rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}

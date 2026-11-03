// Jednokratni uvoz sadržaja sa starog WordPress sajta (kmf21.rs) preko REST API-ja.
// Pokretanje: node scripts/import-wp.mjs
// Rezultat: content/posts.json, content/pages.json i slike u public/wp-content/uploads/...
import fs from "node:fs";
import path from "node:path";

const ORIGIN = "https://kmf21.rs";
const API = `${ORIGIN}/wp-json/wp/v2/`;
const UA = { "user-agent": "Mozilla/5.0" };
const SR_PAGES = ["about-futsal", "kopaonik-summer-camp", "inclusion", "competitions", "expert-team", "21-october-futsal-club-from-kragujevac", "o-klubu", "takmicanje", "inkluzija", "letnji-kamp-kopaonik", "o-malom-fudbalu", "strucni-tim", "klub-malog-fudbala-21"];

async function all(type) {
  const out = [];
  for (let p = 1; ; p++) {
    const r = await fetch(`${API}${type}?per_page=100&page=${p}&_embed=wp:featuredmedia`, { headers: UA });
    if (!r.ok) break;
    const j = await r.json();
    out.push(...j);
    if (j.length < 100) break;
  }
  return out;
}

const images = new Set();
const dec = (s) =>
  s.replace(/&#8222;/g, "„").replace(/&#8220;/g, "“").replace(/&#8211;/g, "–").replace(/&#8217;/g, "’")
    .replace(/&hellip;/g, "…").replace(/&nbsp;/g, " ").replace(/&#038;|&amp;/g, "&")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));

const local = (u) => {
  const m = u.match(/^https?:\/\/(?:www\.)?kmf21\.rs(\/wp-content\/uploads\/[^?#]+)/);
  if (!m) return null;
  images.add(m[1]);
  return decodeURI(m[1]);
};

// Elementor video vidžeti čuvaju YouTube link samo u data-settings -> pretvori u iframe
const ytWidgets = (html) =>
  html.replace(/<div[^>]*data-settings="[^"]*youtube_url&quot;:&quot;([^"]*?)&quot;[^"]*"[^>]*>/g, (m, url) => {
    const id = (url.split("\\").join("").match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/) || [])[1];
    return id ? `<iframe src="https://www.youtube-nocookie.com/embed/${id}"></iframe>` : m;
  });

// WordPress video plejlista -> običan <video> za svaki snimak (mp4 se preuzima lokalno)
const playlists = (html) =>
  html.replace(/<div class="wp-playlist[^"]*">[\s\S]*?<script type="application\/json" class="wp-playlist-script">([\s\S]*?)<\/script>\s*<\/div>/g, (m, json) => {
    try {
      return JSON.parse(json)
        .tracks.map((t) => {
          const l = local(t.src);
          return l ? `<video controls preload="metadata" playsinline src="${l}"></video>` : "";
        })
        .join("");
    } catch {
      return m;
    }
  });

function clean(html) {
  let h = playlists(ytWidgets(html))
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/g, "")
    // emoji slike -> sam emoji
    .replace(/<img[^>]*alt="([^"]+)"[^>]*src="https:\/\/fonts\.gstatic\.com[^"]*"[^>]*>/g, "$1")
    .replace(/<img[^>]*src="https:\/\/fonts\.gstatic\.com[^"]*"[^>]*alt="([^"]+)"[^>]*>/g, "$1");
  // slike: zadrži src(lokalni)/alt
  h = h.replace(/<img\b[^>]*>/g, (tag) => {
    const src = (tag.match(/\bsrc="([^"]+)"/) || [])[1];
    const alt = (tag.match(/\balt="([^"]*)"/) || [])[1] || "";
    const l = src && local(src);
    return l ? `<img src="${l}" alt="${alt}" loading="lazy">` : "";
  });
  // linkovi
  h = h.replace(/<a\b([^>]*)>/g, (_, attrs) => {
    let href = (attrs.match(/\bhref="([^"]+)"/) || [])[1] || "#";
    const l = local(href);
    if (l) href = l;
    else href = href.replace(/^https?:\/\/(?:www\.)?kmf21\.rs/, "") || "/";
    const ext = /^https?:/.test(href);
    return `<a href="${href}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ""}>`;
  });
  // ukloni sve atribute osim na img/a/iframe
  h = h.replace(/<(p|h[1-6]|ul|ol|li|strong|b|em|i|u|span|div|section|figure|figcaption|table|thead|tbody|tr|td|th|blockquote|br|hr)\b[^>]*?(\/?)>/g, "<$1$2>");
  // iframe (youtube) - zadrži src
  h = h.replace(/<iframe\b[^>]*?\bsrc="([^"]+)"[^>]*>\s*<\/iframe>/g, '<iframe src="$1" loading="lazy" allowfullscreen title="Video"></iframe>');
  // razmotaj div/section/span
  h = h.replace(/<\/?(div|section|span|figure)>/g, (t) => (t.includes("div class") ? t : ""));
  h = h.replace(/<\/?div>/g, "");
  h = h.replace(/<p>(?:\s|&nbsp;)*<\/p>/g, "").replace(/\n{2,}/g, "\n").trim();
  return h;
}

const yo = (y = {}) => ({
  title: y.title ? dec(y.title) : null,
  description: y.description ? dec(y.description) : y.og_description ? dec(y.og_description) : null,
  canonical: y.canonical ?? null,
  ogImage: y.og_image?.[0]?.url ?? null,
  ogType: y.og_type ?? null,
  published: y.article_published_time ?? null,
  modified: y.article_modified_time ?? null,
});

const [posts, pages, cats] = await Promise.all([all("posts"), all("pages"), all("categories")]);
const catById = new Map(cats.map((c) => [c.id, { slug: c.slug, name: dec(c.name) }]));

const outPosts = posts
  .map((p) => {
    const d = p.date.slice(0, 10);
    const [Y, M, D] = d.split("-");
    const feat = p.yoast_head_json?.og_image?.[0]?.url ?? p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
    return {
      slug: p.slug,
      categories: (p.categories ?? []).map((id) => catById.get(id)).filter(Boolean),
      year: Y, month: M, day: D,
      date: p.date,
      modified: p.modified,
      title: dec(p.title.rendered),
      excerpt: dec(p.excerpt.rendered.replace(/<[^>]+>/g, "")).replace(/\s*Cela vest »?\s*$/, "").trim(),
      image: feat ? local(feat) : null,
      html: clean(p.content.rendered),
      meta: yo(p.yoast_head_json),
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

const outPages = pages
  .filter((p) => SR_PAGES.includes(p.slug))
  .map((p) => ({
    slug: p.slug,
    title: dec(p.title.rendered),
    modified: p.modified,
    html: clean(p.content.rendered),
    meta: yo(p.yoast_head_json),
  }));

fs.writeFileSync("content/posts.json", JSON.stringify(outPosts, null, 1));
fs.writeFileSync("content/pages.json", JSON.stringify(outPages, null, 1));

// preuzimanje slika (zadržava istu putanju kao na starom sajtu)
let ok = 0, fail = [];
const list = [...images];
const worker = async () => {
  while (list.length) {
    const u = list.pop();
    const dest = path.join("public", decodeURI(u));
    if (fs.existsSync(dest)) { ok++; continue; }
    try {
      const r = await fetch(ORIGIN + u, { headers: UA });
      if (!r.ok) throw new Error(r.status);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
      ok++;
    } catch (e) { fail.push(u + " " + e.message); }
  }
};
await Promise.all(Array.from({ length: 8 }, worker));
console.log({ posts: outPosts.length, pages: outPages.length, images: images.size, ok, fail });

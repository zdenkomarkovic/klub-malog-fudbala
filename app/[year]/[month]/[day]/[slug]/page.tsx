import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { allPosts, getPost, postPath, tidyHtml, toLocal, trimDesc } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { CLUB, LOGO_PATH, SITE_NAME, SITE_URL } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";

export const dynamicParams = false;

export function generateStaticParams() {
  return allPosts.map(({ year, month, day, slug }) => ({ year, month, day, slug }));
}

type Props = { params: Promise<{ year: string; month: string; day: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year, month, day, slug } = await params;
  const post = getPost(year, month, day, slug);
  if (!post) return {};
  return buildMetadata({
    title: post.meta.title ?? `${post.title} - ${SITE_NAME}`,
    description: trimDesc(post.meta.description) ?? post.excerpt,
    path: postPath(post),
    image: toLocal(post.meta.ogImage ?? post.image),
    type: "article",
    publishedTime: post.meta.published ?? post.date,
    modifiedTime: post.meta.modified ?? post.modified,
  });
}

export default async function PostPage({ params }: Props) {
  const { year, month, day, slug } = await params;
  const post = getPost(year, month, day, slug);
  if (!post) notFound();

  const idx = allPosts.indexOf(post);
  const newer = allPosts[idx - 1];
  const older = allPosts[idx + 1];
  const image = toLocal(post.meta.ogImage ?? post.image);

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: trimDesc(post.meta.description) ?? post.excerpt,
          datePublished: post.meta.published ?? post.date,
          dateModified: post.meta.modified ?? post.modified,
          mainEntityOfPage: `${SITE_URL}${postPath(post)}`,
          image: image ? [`${SITE_URL}${image}`] : undefined,
          inLanguage: "sr-RS",
          author: { "@type": "Organization", name: CLUB.legalName },
          publisher: {
            "@type": "Organization",
            name: CLUB.legalName,
            logo: { "@type": "ImageObject", url: `${SITE_URL}${LOGO_PATH}` },
          },
        }}
      />
      <article className="mx-auto max-w-7xl px-5 py-10 sm:py-14">
        <nav aria-label="Putanja" className="text-sm text-muted">
          <Link href="/" className="hover:text-brand-700">Naslovna</Link> /{" "}
          <Link href="/vesti/" className="hover:text-brand-700">Vesti</Link>
        </nav>
        <header className="mt-4">
          <time dateTime={post.date} className="text-sm font-bold text-brand-700">
            {formatDate(post.date)}
          </time>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight text-navy-900 sm:text-4xl">{post.title}</h1>
        </header>
        {post.image && (
          <div data-lightbox className="relative mt-8 aspect-[16/10] overflow-hidden rounded-2xl bg-brand-50 shadow-lg">
            <Image src={post.image} alt="" fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </div>
        )}
        <div className="prose-kmf mt-8" dangerouslySetInnerHTML={{ __html: tidyHtml(post.html) }} />

        <nav aria-label="Ostale vesti" className="mt-12 grid gap-4 border-t border-brand-50 pt-8 sm:grid-cols-2">
          {newer && (
            <Link href={postPath(newer)} className="rounded-xl bg-brand-50 p-4 hover:bg-brand-50/60">
              <span className="text-xs font-bold uppercase text-muted">← Novija vest</span>
              <span className="mt-1 block font-bold text-navy-900">{newer.title}</span>
            </Link>
          )}
          {older && (
            <Link href={postPath(older)} className="rounded-xl bg-brand-50 p-4 text-right hover:bg-brand-50/60 sm:col-start-2">
              <span className="text-xs font-bold uppercase text-muted">Starija vest →</span>
              <span className="mt-1 block font-bold text-navy-900">{older.title}</span>
            </Link>
          )}
        </nav>
        <div className="mt-8">
          <ButtonLink href="/vesti/" variant="outline">Sve vesti</ButtonLink>
        </div>
      </article>
    </main>
  );
}

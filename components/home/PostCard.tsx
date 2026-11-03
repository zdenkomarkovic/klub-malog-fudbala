import Image from "next/image";
import Link from "next/link";
import { postPath, type Post } from "@/lib/content";
import { formatDate, truncate } from "@/lib/utils";

export function PostCard({ post, priority = false }: { post: Post; priority?: boolean }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-brand-50 transition-shadow hover:shadow-xl">
      <Link href={postPath(post)} className="relative block aspect-[16/10] overflow-hidden bg-brand-50">
        {post.image && (
          <Image
            src={post.image}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <time dateTime={post.date} className="text-xs font-semibold text-muted">
          {formatDate(post.date)}
        </time>
        <h3 className="mt-2 text-lg font-extrabold leading-snug text-navy-900">
          <Link href={postPath(post)} className="hover:text-brand-600">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{truncate(post.excerpt, 140)}</p>
        <Link href={postPath(post)} className="mt-4 text-sm font-bold text-brand-700 hover:text-navy-900">
          Cela vest »
        </Link>
      </div>
    </article>
  );
}

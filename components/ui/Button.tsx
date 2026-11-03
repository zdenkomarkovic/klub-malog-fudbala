import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "gold" | "outline-light" | "white" | "outline" | "brand";

const styles: Record<Variant, string> = {
  gold: "bg-gold-500 text-navy-950 hover:bg-gold-400 shadow-lg shadow-gold-500/25",
  "outline-light": "border-2 border-white/70 text-white hover:bg-white hover:text-navy-900",
  white: "bg-white text-navy-900 hover:bg-brand-50 shadow-md",
  outline: "border-2 border-brand-600 text-brand-700 hover:bg-brand-600 hover:text-white",
  brand: "bg-brand-700 text-white hover:bg-navy-900",
};

export function ButtonLink({
  href,
  children,
  variant = "gold",
  className,
  arrow = true,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
}) {
  const external = /^(https?:|mailto:|tel:)/.test(href);
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-colors",
    styles[variant],
    className,
  );
  const content = (
    <>
      {children}
      {arrow && <span aria-hidden>→</span>}
    </>
  );
  return external ? (
    <a
      href={href}
      className={cls}
      {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {content}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}

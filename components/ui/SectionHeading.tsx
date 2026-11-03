import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-l-4 border-gold-500 pl-4", className)}>
      {eyebrow && (
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-700">{eyebrow}</p>
      )}
      <h2 className="mt-1 text-3xl font-extrabold text-navy-900 sm:text-4xl">{title}</h2>
      {children && <div className="mt-3 max-w-prose leading-relaxed text-muted">{children}</div>}
    </div>
  );
}

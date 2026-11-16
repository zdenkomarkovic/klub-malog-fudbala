"use client";

import { usePathname } from "next/navigation";

/** Zaglavlje i podnožje sajta se ne prikazuju u Sanity Studiju (/studio). */
export function SiteShell({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const studio = usePathname()?.startsWith("/studio");
  if (studio) return <>{children}</>;
  return (
    <>
      {header}
      <div id="sadrzaj" className="flex-1">
        {children}
      </div>
      {footer}
    </>
  );
}

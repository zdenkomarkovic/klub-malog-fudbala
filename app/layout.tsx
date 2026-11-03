import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import {
  GOOGLE_SITE_VERIFICATION,
  LOGO_PATH,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  SOCIAL,
} from "@/lib/constants";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Lightbox } from "@/components/ui/Lightbox";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter", display: "swap" });
const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-montserrat",
  weight: ["600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a2552",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} - ${SITE_NAME}`, template: `%s - ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": [{ url: "/feed.xml", title: `${SITE_NAME} » довод` }] },
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    type: "website",
    locale: "sr_RS",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    images: [{ url: LOGO_PATH, width: 150, height: 150, type: "image/png" }],
  },
  twitter: { card: "summary_large_image" },
  verification: { google: GOOGLE_SITE_VERIFICATION },
  // Isto kao na starom sajtu (Yoast): <meta property="article:publisher">
  other: { "article:publisher": SOCIAL.facebook },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr-RS" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Header />
        <div id="sadrzaj" className="flex-1">
          {children}
        </div>
        <Footer />
        <Lightbox />
      </body>
    </html>
  );
}

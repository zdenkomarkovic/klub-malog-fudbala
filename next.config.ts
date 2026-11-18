import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Stari WordPress sajt je koristio kose crte na kraju URL-a (/o-klubu/, /2026/05/27/slug/)
  trailingSlash: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/(studio|api)/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  async redirects() {
    return [
      // www -> glavni domen (jedinstven kanonski host)
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.kmf21.rs" }],
        destination: "https://kmf21.rs/:path*",
        permanent: true,
      },
      // stari WordPress URL-ovi
      { source: "/feed", destination: "/feed.xml", permanent: true },
      { source: "/o-futsalu", destination: "/o-malom-fudbalu/", permanent: true },
    ];
  },
};

export default nextConfig;

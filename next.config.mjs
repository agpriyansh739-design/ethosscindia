/** @type {import('next').NextConfig} */
const nextConfig = {
  // GSAP/ScrollTrigger pins several sections on this page; StrictMode's
  // dev-only double-invoke of effects was causing duplicate ScrollTrigger
  // instances ("Invalid scope" warnings, flaky pin behavior).
  reactStrictMode: false,

  // For fully-static prerendered pages Next.js emits
  // `Cache-Control: s-maxage=31536000` — a ONE YEAR shared-cache
  // lifetime. Hostinger's CDN honours it, so once an edge node cached a
  // page it kept serving that copy long after new deploys, and because
  // different edges cached at different moments they disagreed with each
  // other: the same URL returned different ETags depending on which node
  // answered. That is what made deployed changes appear intermittently
  // rather than not at all.
  //
  // Listing the real pages explicitly rather than a catch-all, so the
  // content-hashed bundles under /_next/static keep their correct
  // immutable caching — those filenames change on every build, so they
  // are safe to cache forever and expensive to re-fetch.
  async headers() {
    const revalidate = [
      {
        key: "Cache-Control",
        value: "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
      },
    ];
    return [
      { source: "/", headers: revalidate },
      { source: "/secretariat", headers: revalidate },
      { source: "/fort-biosphere", headers: revalidate },
    ];
  },
};

export default nextConfig;

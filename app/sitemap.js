// Next generates /sitemap.xml from this at build time. Without one,
// crawlers only find sub-pages by following links from the homepage —
// which the homepage's nav does provide, but a sitemap makes discovery
// immediate and lets Search Console report per-page indexing status.
const BASE = "https://ethosscindia.com";

export default function sitemap() {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/policy-labs`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/secretariat`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/fort-biosphere`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}

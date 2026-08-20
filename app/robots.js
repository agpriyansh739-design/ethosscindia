// Next generates /robots.txt from this at build time.
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://ethosscindia.com/sitemap.xml",
  };
}

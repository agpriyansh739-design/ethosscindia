/** @type {import('next').NextConfig} */
const nextConfig = {
  // GSAP/ScrollTrigger pins several sections on this page; StrictMode's
  // dev-only double-invoke of effects was causing duplicate ScrollTrigger
  // instances ("Invalid scope" warnings, flaky pin behavior).
  reactStrictMode: false,
};

export default nextConfig;

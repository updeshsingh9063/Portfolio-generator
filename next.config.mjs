/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep Node-only résumé parsers out of the bundle (they read files at runtime).
  serverExternalPackages: ["pdf-parse", "mammoth", "@napi-rs/canvas"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep Node-only résumé parsers out of the bundle (they read files at runtime).
  serverExternalPackages: ["pdf-parse", "mammoth", "@napi-rs/canvas"],
  // pdf.js loads its worker via a runtime path, so Next's tracer never sees it
  // and it's missing from the serverless bundle ("Cannot find pdf.worker.mjs").
  // Force-include the worker for the route that runs résumé import (/create).
  outputFileTracingIncludes: {
    "/create": ["./node_modules/**/pdfjs-dist/legacy/build/pdf.worker.mjs"],
  },
  experimental: {
    // Photo/résumé uploads POST a file to a Server Action; the default 1MB
    // request cap rejected real photos before our handler ran. Match the 8MB
    // upload limit (with multipart headroom).
    serverActions: { bodySizeLimit: "12mb" },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;

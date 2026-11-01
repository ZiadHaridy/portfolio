import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: deploy the `out/` folder anywhere (Vercel, Netlify, GitHub Pages, S3 + CloudFront).
  output: "export",
  images: { unoptimized: true },
  trailingSlash: false,
};

export default nextConfig;

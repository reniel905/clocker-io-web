import type { NextConfig } from "next";

const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const API_URL = raw.startsWith("http://") || raw.startsWith("https://")
  ? raw
  : `https://${raw}`;

console.log("[next.config] API_URL:", API_URL);

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

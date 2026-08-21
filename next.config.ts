import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Esto le dice a Vercel que ignore los warnings de código
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Esto le dice a Vercel que ignore los errores de tipos de TypeScript
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
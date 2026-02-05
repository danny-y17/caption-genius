import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  },
  experimental: {
    webpackBuildWorker: true,
    webpackMemoryOptimizations: true,
    preloadEntriesOnStart: false,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;

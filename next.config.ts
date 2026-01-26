import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [new URL("https://covers.openlibrary.org/**")],
  },
};

export default nextConfig;

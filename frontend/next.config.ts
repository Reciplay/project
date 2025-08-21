import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/chatbot:path*",
        destination: "http://127.0.0.1:8000/:path*",
      },
      {
        source: "/api/rest/:path*",
        destination: "",
      },
      {
        source: "/test/local/:path*",
        destination: "http://127.0.0.1:6080/:path*",
      },
      {
        source: "/chatbot/whisper",
        destination:
          "",
      },
    ];
  },
};

export default nextConfig;

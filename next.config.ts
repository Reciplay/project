import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "reciplay-media.s3.ap-northeast-2.amazonaws.com",
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
        destination: "http://i13e104.p.ssafy.io:8080/api/v1/:path*",
      },
      {
        source: "/test/local/:path*",
        destination: "http://127.0.0.1:6080/:path*",
      },
    ];
  },
};

export default nextConfig;

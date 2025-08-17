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
        destination: "https://i13e104.p.ssafy.io/api/v1/:path*",
      },
      {
        source: "/test/local/:path*",
        destination: "http://127.0.0.1:6080/:path*",
      },
      {
        source: "/chatbot/whisper",
        destination:
          "https://gms.ssafy.io/gmsapi/api.openai.com/v1/audio/transcriptions",
      },
    ];
  },
};

export default nextConfig;

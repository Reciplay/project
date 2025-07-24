import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/chatbot:path*',
        destination: 'http://127.0.0.1:8000/',
      },
      {
        source: '/api/rest/:path*',
        destination: 'http://i13e104.p.ssafy.io:8080/api/v1/:path*'
      }
    ];
  }
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.us-east-005.backblazeb2.com",
        port: "",
        pathname: "/photogra/**",
      },
      {
        protocol: "https",
        hostname: "f005.backblazeb2.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

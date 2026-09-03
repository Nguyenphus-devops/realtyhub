import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ['192.168.1.102'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "assets.mixkit.co",
        port: "",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8010",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8010",
        pathname: "**",
      },
    ]
  },

  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

};

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is required");
}
let serverOrigin = "";
if (!apiUrl.startsWith("http")) {
  throw new Error("NEXT_PUBLIC_API_URL must be an absolute URL");
}
serverOrigin = new URL(apiUrl).origin;

nextConfig.rewrites = async () => {
  return [
    {
      source: "/uploads/:path*",
      destination: `${serverOrigin}/uploads/:path*`,
    },
  ];
};

export default nextConfig;

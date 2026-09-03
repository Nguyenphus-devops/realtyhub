import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Ghim goc workspace vao chinh thu muc nay.
  // Repo co ba project canh nhau (web, admin, backend), moi project mot
  // package-lock.json rieng. Neu khong ghim, Next tu suy ra goc bang cach di
  // nguoc len tim lockfile - chi can mot file lockfile lac o C:\SalePlust la
  // no chon nham thu muc cha, roi di tim node_modules o do va khong thay.
  turbopack: {
    root: path.join(__dirname),
  },

  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", pathname: "**" },
      { protocol: "http", hostname: "127.0.0.1", pathname: "**" },
    ],
  },
};

export default nextConfig;

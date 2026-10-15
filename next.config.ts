import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // La app vive en /bitacora para poder integrarla después a AcorDesk como módulo.
  async redirects() {
    return [{ source: "/", destination: "/bitacora", permanent: false }];
  },
};

export default nextConfig;

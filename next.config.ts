import { withSerwist } from "@serwist/turbopack";
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
  // La versión anterior de AcorDesk (HTML suelto) se instaló con /index.html como inicio.
  async redirects() {
    return [{ source: "/index.html", destination: "/", permanent: false }];
  },
};

export default withSerwist(nextConfig);

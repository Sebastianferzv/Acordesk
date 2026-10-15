import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/bitacora",
    name: "Bitácora de viaje",
    short_name: "Bitácora",
    description: "Registro de ensayos y conocimiento musical.",
    lang: "es",
    start_url: "/bitacora",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f1e9d8",
    theme_color: "#f1e9d8",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

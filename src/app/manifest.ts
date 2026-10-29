import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    // Mismo id que la AcorDesk ya instalada (su inicio era ./index.html), para que se actualice en vez de duplicarse.
    id: "/index.html",
    name: "AcorDesk",
    short_name: "AcorDesk",
    description: "Acordes, ensayos y conocimiento musical.",
    lang: "es",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#141311",
    theme_color: "#141311",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

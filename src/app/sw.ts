/// <reference lib="webworker" />
// Service worker (lo empaqueta Serwist; está excluido del tsconfig principal).
import { defaultCache } from "@serwist/turbopack/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  // La versión nueva espera a que el usuario toque "Actualizar": nunca se recarga sola
  // (podría cortar una grabación o el cronómetro).
  skipWaiting: false,
  clientsClaim: true,
  navigationPreload: false,
  runtimeCaching: [
    {
      // Navegaciones: primero la página precargada (buscada por ruta, sin ?id=…), así la
      // app abre al instante y sin conexión. Si no hay conexión, las demás redirigen a /bitacora.
      matcher: ({ request }) => request.mode === "navigate",
      handler: async ({ request }) => {
        const ruta = new URL(request.url).pathname.replace(/\/$/, "") || "/";
        const precargada = await serwist.matchPrecache(ruta);
        if (precargada) return precargada;
        try {
          return await fetch(request);
        } catch {
          // Sin conexión: se redirige (no se sirve el HTML de /bitacora con otra URL, eso rompe la hidratación).
          return Response.redirect(new URL("/bitacora", self.location.origin).href, 302);
        }
      },
    },
    ...defaultCache,
  ],
});

serwist.addEventListeners();

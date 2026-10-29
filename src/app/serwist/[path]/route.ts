import { createSerwistRoute } from "@serwist/turbopack";
import { PAGINAS } from "@/features/apps/rutas";

// Cada deploy cambia la revisión, así las páginas precargadas se renuevan.
const revision = process.env.VERCEL_DEPLOYMENT_ID ?? String(Date.now());

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
  swSrc: "src/app/sw.ts",
  // esbuild nativo en todas las plataformas (en Vercel el valor por defecto sería esbuild-wasm).
  useNativeEsbuild: true,
  additionalPrecacheEntries: PAGINAS.map((url) => ({ url, revision })),
});

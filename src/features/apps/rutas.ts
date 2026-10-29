import { PAGINAS_ACORDES } from "@/features/acordes/rutas";
import { PAGINAS_BITACORA } from "@/features/bitacora/rutas";

/** Todas las páginas de la app. El service worker las precarga para que abra sin conexión. */
export const PAGINAS = ["/", ...PAGINAS_ACORDES, ...PAGINAS_BITACORA];

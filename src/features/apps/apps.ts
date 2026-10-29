import type { ColorBauhaus, TipoForma } from "@/ui/Forma";
import { crearAlmacenLocal } from "@/lib/almacenLocal";

export interface App {
  id: string;
  nombre: string;
  /** Ruta base: todas las pantallas de la app viven bajo ella. */
  raiz: string;
  forma: TipoForma;
  color: ColorBauhaus;
}

/** Apps de la barra superior, en orden. Para sumar una app: agregarla aquí y crear su carpeta en src/app. */
export const APPS: App[] = [
  { id: "acordes", nombre: "AcorDesk", raiz: "/acordes", forma: "circulo", color: "rojo" },
  { id: "bitacora", nombre: "Bitácora", raiz: "/bitacora", forma: "cuadrado", color: "azul" },
];

export const appDeRuta = (ruta: string) =>
  APPS.find((a) => ruta === a.raiz || ruta.startsWith(a.raiz + "/"));

/** Última pantalla visitada de cada app (ruta + ?búsqueda), para volver a ella al cambiar de pestaña. */
export const almacenUltimaRuta = crearAlmacenLocal<Record<string, string>>("ultimaRuta", {}, (v) =>
  v && typeof v === "object" ? (v as Record<string, string>) : {},
);

/** App que se abrió por última vez: es la que muestra la app al iniciar. */
export const almacenUltimaApp = crearAlmacenLocal<string>("ultimaApp", APPS[0].id, (v) =>
  APPS.some((a) => a.id === v) ? (v as string) : APPS[0].id,
);

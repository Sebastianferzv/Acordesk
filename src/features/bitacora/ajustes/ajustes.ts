import { crearAlmacenLocal } from "@/lib/almacenLocal";

export interface AjustesBitacora {
  /** Nombres de notas: C-D-E o Do-Re-Mi. */
  notacion: "letras" | "solfeo";
  /** Tonalidad del instrumento para transponer (Eb = saxo alto). */
  instrumento: string;
  /** Preferencia para nombrar las tónicas alteradas (Db o C#). */
  alteraciones: "bemoles" | "sostenidos";
  etiquetasRapidas: string[];
}

export const AJUSTES_POR_DEFECTO: AjustesBitacora = {
  notacion: "letras",
  instrumento: "Eb",
  alteraciones: "bemoles",
  etiquetasRapidas: ["Banda", "Solo", "Clase"],
};

const almacen = crearAlmacenLocal<AjustesBitacora>("bitacora.ajustes", AJUSTES_POR_DEFECTO, (crudo) => ({
  ...AJUSTES_POR_DEFECTO,
  ...(typeof crudo === "object" && crudo !== null ? crudo : {}),
}));

export const leerAjustes = almacen.leer;
export const useAjustes = () => almacen.useAlmacen();

export function guardarAjustes(cambios: Partial<AjustesBitacora>) {
  almacen.guardar({ ...almacen.leer(), ...cambios });
}

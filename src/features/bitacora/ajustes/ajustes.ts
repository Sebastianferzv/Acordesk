import { crearAlmacenLocal } from "@/lib/almacenLocal";

export interface AjustesBitacora {
  /** Nombres de notas: C-D-E o Do-Re-Mi. */
  notacion: "letras" | "solfeo";
  etiquetasRapidas: string[];
}

export const AJUSTES_POR_DEFECTO: AjustesBitacora = {
  notacion: "letras",
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

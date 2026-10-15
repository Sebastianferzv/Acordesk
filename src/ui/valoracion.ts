import type { ColorBauhaus } from "./Forma";

const PALABRAS = ["Flojo", "Regular", "Bien", "Muy bien", "Excelente"];

/** Azul = flojo, amarillo = bien, rojo = excelente. */
export function colorValoracion(valor: number): ColorBauhaus {
  if (valor <= 2) return "azul";
  if (valor === 3) return "amarillo";
  return "rojo";
}

export const palabraValoracion = (valor: number) => PALABRAS[valor - 1];

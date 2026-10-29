// Círculo de quintas: tonalidades, armaduras y escalas listas para dibujar en clave de sol.

import { escribirEscala, LETRAS, leerNota } from "./notas";

export interface SectorCirculo {
  mayor: string;
  menor: string;
  /** Sostenidos (>0) o bemoles (<0) de la armadura. */
  armadura: number;
}

/** Desde C en el sentido del reloj. Gb se escribe en bemoles (6 ♭). */
export const CIRCULO: SectorCirculo[] = [
  { mayor: "C", menor: "A", armadura: 0 },
  { mayor: "G", menor: "E", armadura: 1 },
  { mayor: "D", menor: "B", armadura: 2 },
  { mayor: "A", menor: "F#", armadura: 3 },
  { mayor: "E", menor: "C#", armadura: 4 },
  { mayor: "B", menor: "G#", armadura: 5 },
  { mayor: "Gb", menor: "Eb", armadura: -6 },
  { mayor: "Db", menor: "Bb", armadura: -5 },
  { mayor: "Ab", menor: "F", armadura: -4 },
  { mayor: "Eb", menor: "C", armadura: -3 },
  { mayor: "Bb", menor: "G", armadura: -2 },
  { mayor: "F", menor: "D", armadura: -1 },
];

const ORDEN_SOSTENIDOS = ["F", "C", "G", "D", "A", "E", "B"];
const ORDEN_BEMOLES = ["B", "E", "A", "D", "G", "C", "F"];

/** Posición en el pentagrama: paso diatónico absoluto (C4 = 28, E4 = línea inferior = 30). */
export const paso = (letra: string, octava: number) => octava * 7 + LETRAS.indexOf(letra as (typeof LETRAS)[number]);

// Dónde va cada alteración de la armadura en clave de sol.
const POS_SOSTENIDOS = [paso("F", 5), paso("C", 5), paso("G", 5), paso("D", 5), paso("A", 4), paso("E", 5), paso("B", 4)];
const POS_BEMOLES = [paso("B", 4), paso("E", 5), paso("A", 4), paso("D", 5), paso("G", 4), paso("C", 5), paso("F", 4)];

/** Notas alteradas de la armadura, en orden ("F#", "C#"… o "Bb", "Eb"…). */
export function notasArmadura(armadura: number): string[] {
  return armadura >= 0
    ? ORDEN_SOSTENIDOS.slice(0, armadura).map((l) => l + "#")
    : ORDEN_BEMOLES.slice(0, -armadura).map((l) => l + "b");
}

/** Pasos del pentagrama donde se dibuja cada alteración de la armadura. */
export function posicionesArmadura(armadura: number): number[] {
  return armadura >= 0 ? POS_SOSTENIDOS.slice(0, armadura) : POS_BEMOLES.slice(0, -armadura);
}

const GRADOS_MAYOR_8 = ["1", "2", "3", "4", "5", "6", "7", "8"];
const GRADOS_MENOR_8 = ["1", "2", "b3", "4", "5", "b6", "b7", "8"];

export interface NotaPentagrama {
  nota: string;
  paso: number;
}

/** Escala de una octava (tónica a tónica) escrita con letras consecutivas, desde la tónica en la octava 4. */
export function escalaPentagrama(tonica: string, modo: "mayor" | "menor"): NotaPentagrama[] {
  const inicio = paso(tonica[0], 4);
  return escribirEscala(tonica, modo === "mayor" ? GRADOS_MAYOR_8 : GRADOS_MENOR_8).map((nota, i) => ({
    nota,
    paso: inicio + i,
  }));
}

/** true si la nota (por ejemplo "Cb") lleva alteración. */
export const tieneAlteracion = (nota: string) => (leerNota(nota)?.alteracion ?? 0) !== 0;

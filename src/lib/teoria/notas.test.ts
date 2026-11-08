import { describe, expect, it } from "vitest";
import { CATALOGO, GRADOS_MAYOR, GRADOS_MENOR, escalaDelCatalogo } from "./catalogo";
import { escribirEscala, formula, textoNota } from "./notas";

const grados = (id: string) => escalaDelCatalogo(id)!.grados;

describe("escribirEscala", () => {
  it("escribe las escalas mayores con la alteración correcta", () => {
    expect(escribirEscala("C", GRADOS_MAYOR)).toEqual(["C", "D", "E", "F", "G", "A", "B"]);
    expect(escribirEscala("F", GRADOS_MAYOR)).toEqual(["F", "G", "A", "Bb", "C", "D", "E"]);
    expect(escribirEscala("Eb", GRADOS_MAYOR)).toEqual(["Eb", "F", "G", "Ab", "Bb", "C", "D"]);
    expect(escribirEscala("Gb", GRADOS_MAYOR)).toEqual(["Gb", "Ab", "Bb", "Cb", "Db", "Eb", "F"]);
    expect(escribirEscala("F#", GRADOS_MAYOR)).toEqual(["F#", "G#", "A#", "B", "C#", "D#", "E#"]);
  });

  it("escribe el blues y las disminuidas sin confundir letras", () => {
    expect(escribirEscala("Eb", grados("blues-menor"))).toEqual(["Eb", "Gb", "Ab", "A", "Bb", "Db"]);
    expect(escribirEscala("C", grados("disminuida-st"))).toEqual(["C", "Db", "D#", "E", "F#", "G", "A", "Bb"]);
    expect(escribirEscala("C", grados("disminuida-ts"))).toEqual(["C", "D", "Eb", "F", "Gb", "G#", "A", "B"]);
  });

  it("admite dobles alteraciones cuando corresponde", () => {
    expect(escribirEscala("Db", GRADOS_MENOR)).toEqual(["Db", "Eb", "Fb", "Gb", "Ab", "Bbb", "Cb"]);
  });

  it("cada escala del catálogo tiene grados válidos y ascendentes", () => {
    for (const e of CATALOGO) {
      const notas = escribirEscala("C", e.grados);
      expect(notas.every((n) => n !== "?"), e.id).toBe(true);
      expect(formula(e.grados).length, e.id).toBe(e.grados.length);
    }
  });
});

describe("formula y textos", () => {
  it("calcula los pasos", () => {
    expect(formula(GRADOS_MAYOR)).toEqual(["T", "T", "S", "T", "T", "T", "S"]);
    expect(formula(grados("pentatonica-menor"))).toEqual(["T½", "T", "T", "T½", "T"]);
  });

  it("muestra la nota en letras o en solfeo", () => {
    expect(textoNota("Bb", "letras")).toBe("B♭");
    expect(textoNota("F#", "solfeo")).toBe("Fa♯");
  });
});

import { describe, expect, it } from "vitest";
import { CATALOGO, GRADOS_MAYOR, GRADOS_MENOR, escalaDelCatalogo } from "./catalogo";
import { claseDeAltura, escribirEscala, formula, mejorTonica, textoNota, transponer } from "./notas";

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

describe("mejorTonica", () => {
  it("elige la escritura con menos alteraciones", () => {
    expect(mejorTonica(1, GRADOS_MAYOR, "sostenidos")).toBe("Db"); // Db mayor (5 b) y no C# (7 #)
    expect(mejorTonica(1, GRADOS_MENOR, "bemoles")).toBe("C#"); // C# menor (4 #) y no Db menor
    expect(mejorTonica(10, GRADOS_MAYOR, "sostenidos")).toBe("Bb");
    expect(mejorTonica(9, GRADOS_MAYOR, "bemoles")).toBe("A");
  });

  it("en un empate decide la preferencia", () => {
    expect(mejorTonica(6, GRADOS_MAYOR, "bemoles")).toBe("Gb");
    expect(mejorTonica(6, GRADOS_MAYOR, "sostenidos")).toBe("F#");
  });
});

describe("transposición", () => {
  it("Do de concierto se escribe La para el saxo alto y Re para el tenor", () => {
    expect(transponer(claseDeAltura("C"), "Eb")).toBe(claseDeAltura("A"));
    expect(transponer(claseDeAltura("C"), "Bb")).toBe(claseDeAltura("D"));
    expect(transponer(claseDeAltura("C"), "C")).toBe(0);
  });

  it("Fa sostenido mayor de concierto se escribe Mi bemol mayor (no Re sostenido) en el alto", () => {
    const escrita = transponer(claseDeAltura("F#"), "Eb");
    expect(mejorTonica(escrita, GRADOS_MAYOR, "sostenidos")).toBe("Eb");
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

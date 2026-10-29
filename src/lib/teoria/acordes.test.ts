import { describe, expect, it } from "vitest";
import {
  alturasAcorde,
  escribirAcorde,
  gradoAcorde,
  leerAcorde,
  notasFuera,
  preferenciaDeTonalidad,
  semitonosEntre,
  separarLinea,
  tonalidadParaInstrumento,
  transponerAcorde,
  transponerTexto,
} from "./acordes";
import { escalaPentagrama, notasArmadura, posicionesArmadura, paso } from "./circulo";

const tr = (acorde: string, semis: number, tonalidad: string) =>
  escribirAcorde(transponerAcorde(acorde, semis, preferenciaDeTonalidad(tonalidad))!);

describe("leerAcorde", () => {
  it("separa raíz, calidad y bajo", () => {
    expect(leerAcorde("Bbmaj7/D")).toEqual({ raiz: "Bb", calidad: "maj7", bajo: "D" });
    expect(leerAcorde("F#m7b5")).toEqual({ raiz: "F#", calidad: "m7b5", bajo: null });
    expect(leerAcorde("C")).toEqual({ raiz: "C", calidad: "", bajo: null });
  });

  it("rechaza palabras que no son acordes", () => {
    expect(leerAcorde("Coro")).toBeNull();
    expect(leerAcorde("Estrofa")).toBeNull();
    expect(leerAcorde("x")).toBeNull();
  });
});

describe("sostenidos y bemoles según la tonalidad", () => {
  it("C G D A E B en sostenidos", () => {
    expect(preferenciaDeTonalidad("C")).toBe("sostenidos");
    expect(preferenciaDeTonalidad("B")).toBe("sostenidos");
    expect(tr("Bb7", 0, "C")).toBe("A#7");
    expect(tr("Am7", 9, "A")).toBe("F#m7");
  });

  it("F Bb Eb Ab Db Gb en bemoles", () => {
    expect(preferenciaDeTonalidad("F")).toBe("bemoles");
    expect(preferenciaDeTonalidad("Gb")).toBe("bemoles");
    expect(tr("G7/B", 3, "Eb")).toBe("Bb7/D");
    expect(tr("C#m", 0, "Ab")).toBe("Dbm");
  });
});

describe("transposición", () => {
  it("calcula semitonos entre tónicas", () => {
    expect(semitonosEntre("C", "Eb")).toBe(3);
    expect(semitonosEntre("Eb", "C")).toBe(9);
    expect(semitonosEntre("", "C")).toBe(0);
  });

  it("da la tonalidad en que lee cada instrumento", () => {
    expect(tonalidadParaInstrumento("C", "Eb")).toBe("A"); // saxo alto
    expect(tonalidadParaInstrumento("C", "Bb")).toBe("D"); // saxo tenor
    expect(tonalidadParaInstrumento("Eb", "Eb")).toBe("C");
    expect(tonalidadParaInstrumento("F", "C")).toBe("F");
  });

  it("transpone texto conservando letra, espacios y puntuación", () => {
    expect(transponerTexto("Coro: C  Am7 | F G7.", 2, "sostenidos")).toBe("Coro: D  Bm7 | G A7.");
  });
});

describe("análisis", () => {
  it("cuenta notas fuera de la tonalidad", () => {
    expect(notasFuera("Dm7", "C")).toBe(0);
    expect(notasFuera("D7", "C")).toBe(1);
    expect(notasFuera("Bb7", "C")).toBe(2);
    expect(notasFuera("Dm7", "")).toBeNull();
    expect(notasFuera("Cxyz", "C")).toBeNull();
  });

  it("incluye el bajo en las notas del acorde", () => {
    expect(alturasAcorde("C/Bb")).toEqual([0, 4, 7, 10]);
  });

  it("da grados romanos", () => {
    expect(gradoAcorde("Dm7", "C")).toBe("ii");
    expect(gradoAcorde("G7", "C")).toBe("V");
    expect(gradoAcorde("Bb", "C")).toBe("bVII");
    expect(gradoAcorde("Bm7b5", "C")).toBe("vii");
    expect(gradoAcorde("Fmaj7", "C")).toBe("IV");
  });

  it("separa acordes de texto", () => {
    expect(separarLinea("Am, hola").map((p) => p.tipo)).toEqual(["acorde", "espacio", "texto"]);
  });
});

describe("círculo de quintas", () => {
  it("escribe escalas con letras consecutivas", () => {
    expect(escalaPentagrama("Gb", "mayor").map((n) => n.nota)).toEqual(["Gb", "Ab", "Bb", "Cb", "Db", "Eb", "F", "Gb"]);
    expect(escalaPentagrama("F#", "menor").map((n) => n.nota)).toEqual(["F#", "G#", "A", "B", "C#", "D", "E", "F#"]);
  });

  it("sube por pasos desde la tónica en la octava 4", () => {
    const b = escalaPentagrama("B", "mayor");
    expect(b[0].paso).toBe(paso("B", 4));
    expect(b[7].paso).toBe(paso("B", 5));
  });

  it("da la armadura y su posición", () => {
    expect(notasArmadura(3)).toEqual(["F#", "C#", "G#"]);
    expect(notasArmadura(-2)).toEqual(["Bb", "Eb"]);
    expect(posicionesArmadura(1)).toEqual([paso("F", 5)]);
    expect(posicionesArmadura(-1)).toEqual([paso("B", 4)]);
  });
});

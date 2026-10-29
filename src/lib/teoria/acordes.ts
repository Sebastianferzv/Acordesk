// Acordes cifrados (Cmaj7, Bb7/D, F#m7b5…): lectura, transposición, notas y grados.
// Es la lógica de AcorDesk. Las notas van en notación anglosajona, como en notas.ts.

import { claseDeAltura, desplazamientoInstrumento, nombreSimple, type Preferencia } from "./notas";

const modulo12 = (n: number) => ((n % 12) + 12) % 12;

// ── Tonalidades ──────────────────────────────────────────────────

/** Tónicas mayores que ofrece AcorDesk, en orden cromático. */
export const TONALIDADES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"] as const;

export const RELATIVA_MENOR: Record<string, string> = {
  C: "Am", Db: "Bbm", D: "Bm", Eb: "Cm", E: "C#m", F: "Dm",
  Gb: "Ebm", G: "Em", Ab: "Fm", A: "F#m", Bb: "Gm", B: "G#m",
};

/** C G D A E B se escriben con sostenidos; F Bb Eb Ab Db Gb con bemoles. */
const TONALIDADES_SOSTENIDOS = new Set(["C", "G", "D", "A", "E", "B"]);

export function preferenciaDeTonalidad(tonalidad: string): Preferencia {
  return TONALIDADES_SOSTENIDOS.has(tonalidad) ? "sostenidos" : "bemoles";
}

/** Tónica de TONALIDADES con esa clase de altura. */
export const tonalidadDeAltura = (pc: number) => TONALIDADES[modulo12(pc)];

/** Semitonos (0 … 11) para ir de una tónica a otra. */
export function semitonosEntre(desde: string, hasta: string): number {
  if (!desde || !hasta) return 0;
  return modulo12(claseDeAltura(hasta) - claseDeAltura(desde));
}

/** Tonalidad en la que lee un instrumento en `claveInstrumento` una canción en `tonalidad` (concierto). */
export function tonalidadParaInstrumento(tonalidad: string, claveInstrumento: string): string {
  return tonalidadDeAltura(claseDeAltura(tonalidad) + desplazamientoInstrumento(claveInstrumento));
}

// ── Instrumentos (las 12 claves posibles) ────────────────────────

export const CLAVES_INSTRUMENTO: { clave: string; nombre: string }[] = TONALIDADES.map((clave) => ({
  clave,
  nombre: { C: "Real", Eb: "Saxo alto", Bb: "Saxo tenor", F: "Corno" }[clave as string] ?? "",
}));

// ── Lectura de acordes ───────────────────────────────────────────

export interface Acorde {
  raiz: string;
  calidad: string;
  bajo: string | null;
}

const INICIOS_CALIDAD = new Set(["m", "M", "+", "°", "Δ", "ø", "("]);
const PALABRAS_CALIDAD = ["aug", "dim", "sus", "add", "no", "maj", "min"];

function calidadValida(q: string) {
  if (!q || /^\d/.test(q) || INICIOS_CALIDAD.has(q[0])) return true;
  const l = q.toLowerCase();
  return PALABRAS_CALIDAD.some((p) => l.startsWith(p));
}

export function leerAcorde(texto: string): Acorde | null {
  const m = texto.match(/^([A-G][#b]?)/);
  if (!m) return null;
  const raiz = m[1];
  let resto = texto.slice(raiz.length);
  let bajo: string | null = null;
  const b = resto.match(/\/([A-G][#b]?)$/);
  if (b) {
    bajo = b[1];
    resto = resto.slice(0, -b[0].length);
  }
  return calidadValida(resto) ? { raiz, calidad: resto, bajo } : null;
}

const notaMovida = (nota: string, semitonos: number, pref: Preferencia) =>
  nombreSimple(claseDeAltura(nota) + semitonos, pref);

/** Acorde transpuesto, o null si el texto no es un acorde. */
export function transponerAcorde(texto: string, semitonos: number, pref: Preferencia): Acorde | null {
  const a = leerAcorde(texto);
  if (!a) return null;
  return {
    raiz: notaMovida(a.raiz, semitonos, pref),
    calidad: a.calidad,
    bajo: a.bajo && notaMovida(a.bajo, semitonos, pref),
  };
}

export const escribirAcorde = (a: Acorde) => a.raiz + a.calidad + (a.bajo ? "/" + a.bajo : "");

// ── Notas del acorde ─────────────────────────────────────────────

/** Intervalos (en semitonos desde la raíz) de cada calidad reconocida. */
export const INTERVALOS: Record<string, number[]> = {
  // Tríadas
  "": [0, 4, 7], m: [0, 3, 7], min: [0, 3, 7], M: [0, 4, 7],
  "+": [0, 4, 8], aug: [0, 4, 8], "°": [0, 3, 6], dim: [0, 3, 6], "5": [0, 7],
  // Sextas
  "6": [0, 4, 7, 9], m6: [0, 3, 7, 9], M6: [0, 4, 7, 9],
  // Séptimas
  "7": [0, 4, 7, 10], M7: [0, 4, 7, 11], maj7: [0, 4, 7, 11], "Δ": [0, 4, 7, 11], "Δ7": [0, 4, 7, 11],
  m7: [0, 3, 7, 10], min7: [0, 3, 7, 10],
  mM7: [0, 3, 7, 11], mmaj7: [0, 3, 7, 11], minmaj7: [0, 3, 7, 11],
  "°7": [0, 3, 6, 9], dim7: [0, 3, 6, 9],
  "ø": [0, 3, 6, 10], "ø7": [0, 3, 6, 10], m7b5: [0, 3, 6, 10],
  "+7": [0, 4, 8, 10], aug7: [0, 4, 8, 10],
  "+M7": [0, 4, 8, 11], augM7: [0, 4, 8, 11], "M7#5": [0, 4, 8, 11],
  // Suspendidos
  sus: [0, 5, 7], sus4: [0, 5, 7], sus2: [0, 2, 7],
  "7sus": [0, 5, 7, 10], "7sus4": [0, 5, 7, 10], "7sus2": [0, 2, 7, 10],
  // Novenas
  "9": [0, 4, 7, 10, 14], M9: [0, 4, 7, 11, 14], maj9: [0, 4, 7, 11, 14],
  m9: [0, 3, 7, 10, 14], min9: [0, 3, 7, 10, 14],
  add9: [0, 4, 7, 14], add2: [0, 2, 4, 7], madd9: [0, 3, 7, 14],
  // Oncenas
  "11": [0, 4, 7, 10, 14, 17], m11: [0, 3, 7, 10, 14, 17], min11: [0, 3, 7, 10, 14, 17],
  M11: [0, 4, 7, 11, 14, 17], maj11: [0, 4, 7, 11, 14, 17],
  // Trecenas
  "13": [0, 4, 7, 10, 14, 17, 21], m13: [0, 3, 7, 10, 14, 17, 21], min13: [0, 3, 7, 10, 14, 17, 21],
  M13: [0, 4, 7, 11, 14, 17, 21], maj13: [0, 4, 7, 11, 14, 17, 21],
  // Dominantes alterados
  "7b5": [0, 4, 6, 10], "7#5": [0, 4, 8, 10], "7b9": [0, 4, 7, 10, 13], "7#9": [0, 4, 7, 10, 15],
  "7#11": [0, 4, 7, 10, 14, 18], "7b13": [0, 4, 7, 10, 20], "9#11": [0, 4, 7, 10, 14, 18],
};

/** Clases de altura del acorde (sin repetir; el bajo al final si no está). null si la calidad no se conoce. */
export function alturasAcorde(texto: string, semitonos = 0): number[] | null {
  const a = leerAcorde(texto);
  const intervalos = a && INTERVALOS[a.calidad];
  if (!a || !intervalos) return null;
  const raiz = claseDeAltura(a.raiz) + semitonos;
  const alturas = [...new Set(intervalos.map((i) => modulo12(raiz + i)))];
  if (a.bajo) {
    const bajo = modulo12(claseDeAltura(a.bajo) + semitonos);
    if (!alturas.includes(bajo)) alturas.push(bajo);
  }
  return alturas;
}

// ── Análisis en la tonalidad ─────────────────────────────────────

const ESCALA_MAYOR = [0, 2, 4, 5, 7, 9, 11];

/** Clases de altura de la escala mayor de la tónica. */
export function alturasTonalidad(tonica: string): Set<number> {
  const t = claseDeAltura(tonica);
  return new Set(ESCALA_MAYOR.map((i) => modulo12(t + i)));
}

/** Cuántas notas del acorde (en concierto) quedan fuera de la tonalidad; null si no se puede saber. */
export function notasFuera(texto: string, tonica: string): number | null {
  const alturas = alturasAcorde(texto);
  if (!alturas || !tonica) return null;
  const escala = alturasTonalidad(tonica);
  return alturas.filter((a) => !escala.has(a)).length;
}

const GRADOS = ["I", "bII", "II", "bIII", "III", "IV", "bV", "V", "bVI", "VI", "bVII", "VII"];

/** Grado romano del acorde en la tonalidad; en minúscula si es menor o disminuido. */
export function gradoAcorde(texto: string, tonica: string): string {
  const a = leerAcorde(texto);
  if (!a || !tonica) return "";
  const grado = GRADOS[modulo12(claseDeAltura(a.raiz) - claseDeAltura(tonica))];
  const q = a.calidad;
  const menor =
    (q.startsWith("m") && !q.toLowerCase().startsWith("maj")) ||
    q.includes("°") ||
    q.toLowerCase().includes("dim") ||
    q.startsWith("ø");
  return menor ? grado.toLowerCase() : grado;
}

// ── Texto con acordes ────────────────────────────────────────────

export type Pieza =
  | { tipo: "espacio"; texto: string }
  | { tipo: "texto"; texto: string }
  | { tipo: "acorde"; texto: string; final: string };

/** Separa una línea en espacios, acordes (con su puntuación final aparte) y texto suelto. */
export function separarLinea(linea: string): Pieza[] {
  return linea
    .split(/(\s+)/)
    .filter(Boolean)
    .map((parte): Pieza => {
      if (/^\s+$/.test(parte)) return { tipo: "espacio", texto: parte };
      const m = parte.match(/^(.*?)([.,|;:!?…]*)$/)!;
      return m[1] && leerAcorde(m[1]) ? { tipo: "acorde", texto: m[1], final: m[2] } : { tipo: "texto", texto: parte };
    });
}

/** Todo el texto transpuesto, como texto plano (para copiar). */
export function transponerTexto(texto: string, semitonos: number, pref: Preferencia): string {
  return texto
    .split("\n")
    .map((linea) =>
      separarLinea(linea)
        .map((p) => {
          if (p.tipo !== "acorde") return p.texto;
          const t = transponerAcorde(p.texto, semitonos, pref);
          return (t ? escribirAcorde(t) : p.texto) + p.final;
        })
        .join(""),
    )
    .join("\n");
}

// Teoría musical independiente del instrumento. Las notas se escriben en notación
// anglosajona ("C", "Bb", "F#", "Ebb", "C##"); la interfaz las muestra en letras o en solfeo.

export const LETRAS = ["C", "D", "E", "F", "G", "A", "B"] as const;
const PC_NATURAL = [0, 2, 4, 5, 7, 9, 11];
const SEMITONOS_MAYOR = [0, 2, 4, 5, 7, 9, 11];
const TEXTO_ALTERACION: Record<number, string> = { [-2]: "bb", [-1]: "b", 0: "", 1: "#", 2: "##" };

export type Preferencia = "bemoles" | "sostenidos";

export interface Nota {
  /** Índice en LETRAS (0 = C). */
  letra: number;
  /** -2 … 2 (doble bemol … doble sostenido). */
  alteracion: number;
}

const modulo12 = (n: number) => ((n % 12) + 12) % 12;
/** Diferencia en semitonos llevada al rango -6 … 5. */
const diferencia = (n: number) => modulo12(n + 6) - 6;

export function leerNota(texto: string): Nota | null {
  const m = texto.trim().match(/^([A-Ga-g])(bb|b|##|#)?$/);
  if (!m) return null;
  const alteracion = { bb: -2, b: -1, "": 0, "#": 1, "##": 2 }[m[2] ?? ""] ?? 0;
  return { letra: LETRAS.indexOf(m[1].toUpperCase() as (typeof LETRAS)[number]), alteracion };
}

export function escribirNota(n: Nota): string {
  return LETRAS[n.letra] + (TEXTO_ALTERACION[n.alteracion] ?? "");
}

/** Clase de altura: 0 = C, 1 = C#/Db, … 11 = B. */
export function claseDeAltura(n: Nota | string): number {
  const nota = typeof n === "string" ? leerNota(n) : n;
  if (!nota) return -1;
  return modulo12(PC_NATURAL[nota.letra] + nota.alteracion);
}

/** Lee un grado como "b3", "#4", "7", "b9". */
export function leerGrado(grado: string): { numero: number; alteracion: number } | null {
  const m = grado.trim().match(/^(bb|b|##|#)?(\d{1,2})$/);
  if (!m || Number(m[2]) < 1) return null;
  return { numero: Number(m[2]), alteracion: { bb: -2, b: -1, "": 0, "#": 1, "##": 2 }[m[1] ?? ""] ?? 0 };
}

export function semitonosDeGrado(grado: string): number {
  const g = leerGrado(grado);
  if (!g) return 0;
  const i = g.numero - 1;
  return SEMITONOS_MAYOR[i % 7] + 12 * Math.floor(i / 7) + g.alteracion;
}

/**
 * Escribe una escala por grado: la letra de cada nota es la de la tónica más
 * (número del grado − 1), y la alteración se calcula. Así Fa mayor lleva Si bemol (no La sostenido).
 */
export function escribirEscala(tonica: Nota | string, grados: string[]): string[] {
  const t = typeof tonica === "string" ? leerNota(tonica) : tonica;
  if (!t) return [];
  const pcTonica = claseDeAltura(t);
  return grados.map((grado) => {
    const g = leerGrado(grado);
    if (!g) return "?";
    const letra = (t.letra + g.numero - 1) % 7;
    const alteracion = diferencia(pcTonica + semitonosDeGrado(grado) - PC_NATURAL[letra]);
    return Math.abs(alteracion) <= 2 ? escribirNota({ letra, alteracion }) : nombreSimple(pcTonica + semitonosDeGrado(grado), "bemoles");
  });
}

/** Cantidad total de alteraciones de una lista de notas. */
export function contarAlteraciones(notas: string[]): number {
  return notas.reduce((total, n) => total + Math.abs(leerNota(n)?.alteracion ?? 0), 0);
}

/** Nombre más simple para una clase de altura (sin dobles alteraciones). */
export function nombreSimple(pc: number, preferencia: Preferencia): string {
  const bemoles = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  const sostenidos = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  return (preferencia === "bemoles" ? bemoles : sostenidos)[modulo12(pc)];
}

/**
 * La mejor forma de escribir la tónica de una escala con esa clase de altura:
 * la que deja menos alteraciones en la escala completa (Re bemol mayor y no Do sostenido mayor;
 * Do sostenido menor y no Re bemol menor). Si empatan, decide la preferencia.
 */
export function mejorTonica(pc: number, grados: string[], preferencia: Preferencia): string {
  const candidatas: Nota[] = [];
  for (let letra = 0; letra < 7; letra++) {
    const alteracion = diferencia(pc - PC_NATURAL[letra]);
    if (Math.abs(alteracion) <= 1) candidatas.push({ letra, alteracion });
  }
  const puntaje = (n: Nota) => {
    const escala = escribirEscala(n, grados);
    const dobles = escala.filter((x) => /bb|##/.test(x)).length;
    const desempate = n.alteracion === 0 ? 0 : (n.alteracion < 0) === (preferencia === "bemoles") ? 0.5 : 0.6;
    return contarAlteraciones(escala) + dobles * 10 + desempate;
  };
  candidatas.sort((a, b) => puntaje(a) - puntaje(b));
  return escribirNota(candidatas[0]);
}

/** Pasos entre notas consecutivas (cerrando en la octava): T, S, T½… */
export function formula(grados: string[]): string[] {
  const semis = grados.map(semitonosDeGrado);
  return semis.map((s, i) => {
    const d = (i + 1 < semis.length ? semis[i + 1] : 12) - s;
    return ({ 1: "S", 2: "T", 3: "T½", 4: "2T" } as Record<number, string>)[d] ?? `${d}s`;
  });
}

// ── Instrumentos transpositores ──────────────────────────────────

export const INSTRUMENTOS = [
  { clave: "C", nombre: "Concierto", detalle: "Piano, guitarra, flauta, voz" },
  { clave: "Eb", nombre: "Saxo alto", detalle: "También saxo barítono (en Mi♭)" },
  { clave: "Bb", nombre: "Saxo tenor", detalle: "También soprano, trompeta, clarinete (en Si♭)" },
  { clave: "F", nombre: "Corno", detalle: "Corno francés (en Fa)" },
] as const;

export const nombreInstrumento = (clave: string) => INSTRUMENTOS.find((i) => i.clave === clave)?.nombre ?? clave;

/** Semitonos a sumar al sonido real para obtener la nota escrita de un instrumento en `clave`. */
export function desplazamientoInstrumento(clave: string): number {
  const pc = claseDeAltura(clave);
  return pc < 0 ? 0 : (12 - pc) % 12;
}

/** Clase de altura escrita para el instrumento, a partir de la de concierto. */
export const transponer = (pcConcierto: number, claveInstrumento: string) =>
  modulo12(pcConcierto + desplazamientoInstrumento(claveInstrumento));

// ── Nombres ──────────────────────────────────────────────────────

const SOLFEO: Record<string, string> = { C: "Do", D: "Re", E: "Mi", F: "Fa", G: "Sol", A: "La", B: "Si" };

/** Texto plano con ♭ y ♯ (para lugares donde no se puede dibujar, como un <select>). */
export function textoNota(nota: string, notacion: "letras" | "solfeo"): string {
  const letra = nota.charAt(0);
  const alteracion = nota.slice(1).replace(/bb/, "𝄫").replace(/##/, "𝄪").replace(/b/, "♭").replace(/#/, "♯");
  return (notacion === "solfeo" ? SOLFEO[letra] ?? letra : letra) + alteracion;
}

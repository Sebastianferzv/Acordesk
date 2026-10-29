import { crearAlmacenLocal } from "@/lib/almacenLocal";
import type { Preferencia } from "@/lib/teoria/notas";

/** Lo que se está trabajando. Se guarda al instante, así no se pierde al cambiar de pestaña. */
export interface Trabajo {
  nombre: string;
  acordes: string;
  tonica: string;
  nuevaTonica: string;
  instrumento: string;
  /** Solo se usa cuando no hay tónica: con tónica, la tonalidad decide. */
  preferencia: Preferencia;
  verGrados: boolean;
  tamanos: { vista: number; tonalidad: number; instrumento: number };
  abiertos: { tonalidad: boolean; instrumento: boolean };
}

export const TRABAJO_INICIAL: Trabajo = {
  nombre: "",
  acordes: "",
  tonica: "",
  nuevaTonica: "",
  instrumento: "Eb",
  preferencia: "bemoles",
  verGrados: false,
  tamanos: { vista: 1.15, tonalidad: 1.15, instrumento: 1.45 },
  abiertos: { tonalidad: false, instrumento: false },
};

export const almacenTrabajo = crearAlmacenLocal<Trabajo>("acordesk_actual", TRABAJO_INICIAL, (v) => {
  const t = (v && typeof v === "object" ? v : {}) as Partial<Trabajo>;
  return {
    ...TRABAJO_INICIAL,
    ...t,
    tamanos: { ...TRABAJO_INICIAL.tamanos, ...t.tamanos },
    abiertos: { ...TRABAJO_INICIAL.abiertos, ...t.abiertos },
  };
});

// ── Canciones guardadas ──────────────────────────────────────────
// Mismo formato y clave que la AcorDesk anterior, así las canciones ya guardadas siguen apareciendo.

export interface CancionGuardada {
  id: string;
  name: string;
  chords: string;
  origKey: string;
  targKey: string;
  instrKey: string;
  accPref: "flat" | "sharp";
  fontSize: number;
  previewSize: number;
  savedAt: string;
}

export const almacenCanciones = crearAlmacenLocal<CancionGuardada[]>("acordesk_v1", [], (v) =>
  Array.isArray(v) ? (v as CancionGuardada[]) : [],
);

export function guardarCancion(t: Trabajo) {
  const cancion: CancionGuardada = {
    id: Date.now().toString(),
    name: t.nombre.trim(),
    chords: t.acordes,
    origKey: t.tonica,
    targKey: t.nuevaTonica,
    instrKey: t.instrumento,
    accPref: t.preferencia === "bemoles" ? "flat" : "sharp",
    fontSize: t.tamanos.instrumento,
    previewSize: t.tamanos.tonalidad,
    savedAt: new Date().toISOString(),
  };
  almacenCanciones.guardar([cancion, ...almacenCanciones.leer()]);
}

export function abrirCancion(c: CancionGuardada): Trabajo {
  const actual = almacenTrabajo.leer();
  return {
    ...actual,
    nombre: c.name,
    acordes: c.chords ?? "",
    tonica: c.origKey ?? "",
    nuevaTonica: c.targKey ?? "",
    instrumento: c.instrKey || "Eb",
    preferencia: c.accPref === "sharp" ? "sostenidos" : "bemoles",
    tamanos: {
      ...actual.tamanos,
      tonalidad: c.previewSize || TRABAJO_INICIAL.tamanos.tonalidad,
      instrumento: c.fontSize || TRABAJO_INICIAL.tamanos.instrumento,
    },
  };
}

export const borrarCancion = (id: string) => almacenCanciones.guardar(almacenCanciones.leer().filter((c) => c.id !== id));

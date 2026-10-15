import { db } from "./db";
import { grabaciones } from "./repositorio";
import type { Grabacion, Id } from "./tipos";

/** Guarda una grabación: los metadatos (sincronizables) y el audio (solo en este dispositivo). */
export async function guardarGrabacion(
  blob: Blob,
  datos: Pick<Grabacion, "tipoMime" | "duracionSeg" | "ensayoId" | "cancionId" | "nombre">,
): Promise<Grabacion> {
  return db.transaction("rw", db.grabaciones, db.audios, async () => {
    const g = await grabaciones.crear(datos);
    await db.audios.put({ id: g.id, blob });
    return g;
  });
}

export const obtenerAudio = (id: Id) => db.audios.get(id);

/** Extensión de archivo según el tipo de audio. */
export function extensionAudio(tipoMime: string): string {
  if (tipoMime.includes("mp4") || tipoMime.includes("aac")) return "m4a";
  if (tipoMime.includes("ogg")) return "ogg";
  return "webm";
}

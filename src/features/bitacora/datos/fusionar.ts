import type { Table } from "dexie";
import { db } from "./db";
import type { Cancion, Ensayo, Escala, Grabacion, Registro, Tip } from "./tipos";

/**
 * Datos sincronizables. Es el formato del respaldo y será el de la sincronización:
 * incluye los registros borrados, para que el borrado también viaje.
 */
export interface DatosSincronizables {
  ensayos: Ensayo[];
  canciones: Cancion[];
  escalas: Escala[];
  tips: Tip[];
  grabaciones: Grabacion[];
}

export const TABLAS_SINCRONIZABLES = ["ensayos", "canciones", "escalas", "tips", "grabaciones"] as const;

/** Registros entrantes que hay que guardar: los nuevos y los modificados más recientemente. */
export function registrosAGuardar<T extends Registro>(locales: T[], entrantes: T[]): T[] {
  const porId = new Map(locales.map((r) => [r.id, r]));
  return entrantes.filter((r) => {
    const local = porId.get(r.id);
    return !local || r.actualizadoEn > local.actualizadoEn;
  });
}

/** Combina datos externos con los locales; en cada registro gana el modificado más recientemente. */
export async function fusionar(entrantes: DatosSincronizables): Promise<{ guardados: number }> {
  let guardados = 0;
  await db.transaction("rw", [db.ensayos, db.canciones, db.escalas, db.tips, db.grabaciones], async () => {
    for (const nombre of TABLAS_SINCRONIZABLES) {
      const tabla = db[nombre] as unknown as Table<Registro, string>;
      const nuevos = registrosAGuardar(await tabla.toArray(), (entrantes[nombre] ?? []) as Registro[]);
      await tabla.bulkPut(nuevos);
      guardados += nuevos.length;
    }
  });
  return { guardados };
}

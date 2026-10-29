import { fechaLocal } from "@/lib/fechas";
import { db } from "./db";
import { fusionar, TABLAS_SINCRONIZABLES, type DatosSincronizables } from "./fusionar";

// Identificador histórico de los respaldos: no cambiarlo, o los respaldos antiguos dejan de importarse.
const APP = "bitacora-de-viaje";
const VERSION = 1;
const CLAVE_ULTIMO_RESPALDO = "ultimoRespaldo";

interface ArchivoRespaldo {
  app: typeof APP;
  version: number;
  exportadoEn: string;
  datos: DatosSincronizables;
}

export async function crearRespaldo(): Promise<ArchivoRespaldo> {
  const [ensayos, canciones, escalas, tips, grabaciones] = await Promise.all([
    db.ensayos.toArray(),
    db.canciones.toArray(),
    db.escalas.toArray(),
    db.tips.toArray(),
    db.grabaciones.toArray(),
  ]);
  return {
    app: APP,
    version: VERSION,
    exportadoEn: new Date().toISOString(),
    datos: { ensayos, canciones, escalas, tips, grabaciones },
  };
}

/**
 * Exporta todo (sin el audio de las grabaciones) a un archivo JSON.
 * En el celular abre la hoja de compartir; si no se puede, lo descarga.
 */
export async function exportarRespaldo(): Promise<void> {
  const respaldo = await crearRespaldo();
  const nombre = `bitacora-${fechaLocal()}.json`;
  const archivo = new File([JSON.stringify(respaldo)], nombre, { type: "application/json" });

  let compartido = false;
  if (navigator.canShare?.({ files: [archivo] })) {
    try {
      await navigator.share({ files: [archivo], title: "Respaldo de Bitácora de ensayos" });
      compartido = true;
    } catch (e) {
      if ((e as DOMException).name === "AbortError") return;
    }
  }
  if (!compartido) {
    const url = URL.createObjectURL(archivo);
    const a = document.createElement("a");
    a.href = url;
    a.download = nombre;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  await db.meta.put({ clave: CLAVE_ULTIMO_RESPALDO, valor: Date.now() });
}

export class ErrorRespaldo extends Error {}

/** Lee un archivo de respaldo y lo combina con los datos actuales (no borra nada). */
export async function importarRespaldo(archivo: File): Promise<{ guardados: number }> {
  let contenido: Partial<ArchivoRespaldo>;
  try {
    contenido = JSON.parse(await archivo.text());
  } catch {
    throw new ErrorRespaldo("El archivo no es un respaldo válido.");
  }
  if (contenido.app !== APP || !contenido.datos) throw new ErrorRespaldo("El archivo no es un respaldo de Bitácora de ensayos.");
  if ((contenido.version ?? 0) > VERSION) throw new ErrorRespaldo("El respaldo es de una versión más nueva de la app.");
  const datos = Object.fromEntries(
    TABLAS_SINCRONIZABLES.map((t) => [t, Array.isArray(contenido.datos?.[t]) ? contenido.datos[t] : []]),
  ) as unknown as DatosSincronizables;
  return fusionar(datos);
}

export async function ultimoRespaldo(): Promise<number | null> {
  const meta = await db.meta.get(CLAVE_ULTIMO_RESPALDO);
  return typeof meta?.valor === "number" ? meta.valor : null;
}

/** Días desde el último respaldo, o null si nunca se hizo. */
export async function diasDesdeUltimoRespaldo(): Promise<number | null> {
  const r = await ultimoRespaldo();
  return r === null ? null : Math.floor((Date.now() - r) / 86_400_000);
}

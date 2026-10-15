import { db } from "./db";
import { ensayos } from "./repositorio";
import type { Cronometro, Id } from "./tipos";

// El cronómetro guarda marcas de tiempo (no un contador), así sigue corriendo
// aunque se cierre la app o se apague la pantalla.

const ID = "actual" as const;

export function tiempoTranscurrido(c: Pick<Cronometro, "tramoDesde" | "acumuladoMs">, ahora = Date.now()): number {
  return c.acumuladoMs + (c.tramoDesde !== null ? Math.max(0, ahora - c.tramoDesde) : 0);
}

export const obtenerCronometro = () => db.cronometro.get(ID);

/** Crea el ensayo de hoy y empieza a medir. Si ya hay uno corriendo, devuelve ese ensayo. */
export async function iniciarCronometro(fecha: string): Promise<Id> {
  const actual = await obtenerCronometro();
  if (actual) return actual.ensayoId;
  const ensayo = await ensayos.crear({ fecha });
  await db.cronometro.put({ id: ID, ensayoId: ensayo.id, tramoDesde: Date.now(), acumuladoMs: 0 });
  return ensayo.id;
}

export async function pausarCronometro() {
  const c = await obtenerCronometro();
  if (!c || c.tramoDesde === null) return;
  await db.cronometro.put({ ...c, acumuladoMs: tiempoTranscurrido(c), tramoDesde: null });
}

export async function reanudarCronometro() {
  const c = await obtenerCronometro();
  if (!c || c.tramoDesde !== null) return;
  await db.cronometro.put({ ...c, tramoDesde: Date.now() });
}

/** Detiene el cronómetro y guarda la duración (en minutos, al menos 1) en el ensayo. */
export async function terminarCronometro(): Promise<Id | undefined> {
  const c = await obtenerCronometro();
  if (!c) return undefined;
  const minutos = Math.max(1, Math.round(tiempoTranscurrido(c) / 60_000));
  await db.transaction("rw", db.cronometro, db.ensayos, async () => {
    await ensayos.actualizar(c.ensayoId, { duracionMin: minutos });
    await db.cronometro.delete(ID);
  });
  return c.ensayoId;
}

/** Descarta la medición; el ensayo queda borrado (se puede deshacer). */
export async function descartarCronometro(): Promise<Id | undefined> {
  const c = await obtenerCronometro();
  if (!c) return undefined;
  await db.cronometro.delete(ID);
  await ensayos.borrar(c.ensayoId);
  return c.ensayoId;
}

/** "4:07" o "1:04:07". */
export function formatoReloj(ms: number): string {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const dos = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${dos(m)}:${dos(s)}` : `${m}:${dos(s)}`;
}

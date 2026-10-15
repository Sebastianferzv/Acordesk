import { aFecha, diasEntre, sumarDias } from "@/lib/fechas";
import type { Cancion, Ensayo, Id } from "../datos/tipos";

type EnsayoMinimo = Pick<Ensayo, "fecha" | "duracionMin">;

/**
 * Días seguidos con al menos un ensayo, contando hacia atrás desde hoy.
 * Si hoy todavía no se ensayó, la racha sigue viva mientras ayer sí.
 */
export function rachaActual(fechas: Iterable<string>, hoy: string): number {
  const dias = new Set(fechas);
  let dia = dias.has(hoy) ? hoy : sumarDias(hoy, -1);
  let racha = 0;
  while (dias.has(dia)) {
    racha++;
    dia = sumarDias(dia, -1);
  }
  return racha;
}

/** La racha más larga de la historia. */
export function mejorRacha(fechas: Iterable<string>): number {
  const dias = [...new Set(fechas)].sort();
  let mejor = 0;
  let actual = 0;
  for (let i = 0; i < dias.length; i++) {
    actual = i > 0 && diasEntre(dias[i - 1], dias[i]) === 1 ? actual + 1 : 1;
    mejor = Math.max(mejor, actual);
  }
  return mejor;
}

/** Lunes de la semana de la fecha (las semanas van de lunes a domingo). */
export function inicioSemana(fecha: string): string {
  const desdeLunes = (aFecha(fecha).getDay() + 6) % 7;
  return sumarDias(fecha, -desdeLunes);
}

export function resumenSemana(ensayos: EnsayoMinimo[], hoy: string) {
  const lunes = inicioSemana(hoy);
  const deLaSemana = ensayos.filter((e) => e.fecha >= lunes && e.fecha <= hoy);
  return {
    ensayos: deLaSemana.length,
    minutos: deLaSemana.reduce((total, e) => total + (e.duracionMin ?? 0), 0),
  };
}

export interface Periodo {
  /** Primer día del periodo, 'YYYY-MM-DD'. */
  inicio: string;
  minutos: number;
  ensayos: number;
}

/** Minutos de las últimas `n` semanas (la última es la actual), de la más antigua a la más nueva. */
export function minutosPorSemana(ensayos: EnsayoMinimo[], hoy: string, n = 12): Periodo[] {
  const actual = inicioSemana(hoy);
  const semanas: Periodo[] = Array.from({ length: n }, (_, i) => ({
    inicio: sumarDias(actual, -7 * (n - 1 - i)),
    minutos: 0,
    ensayos: 0,
  }));
  const indice = new Map(semanas.map((s, i) => [s.inicio, i]));
  for (const e of ensayos) {
    const i = indice.get(inicioSemana(e.fecha));
    if (i === undefined || e.fecha > hoy) continue;
    semanas[i].minutos += e.duracionMin ?? 0;
    semanas[i].ensayos++;
  }
  return semanas;
}

const mesDe = (fecha: string) => fecha.slice(0, 7);

function ultimosMeses(hoy: string, n: number): string[] {
  const [a, m] = hoy.split("-").map(Number);
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(a, m - 1 - (n - 1 - i), 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
}

/** Minutos de los últimos `n` meses (el último es el actual). `inicio` es 'YYYY-MM'. */
export function minutosPorMes(ensayos: EnsayoMinimo[], hoy: string, n = 12): Periodo[] {
  const meses = ultimosMeses(hoy, n).map((inicio) => ({ inicio, minutos: 0, ensayos: 0 }));
  const indice = new Map(meses.map((m, i) => [m.inicio, i]));
  for (const e of ensayos) {
    const i = indice.get(mesDe(e.fecha));
    if (i === undefined || e.fecha > hoy) continue;
    meses[i].minutos += e.duracionMin ?? 0;
    meses[i].ensayos++;
  }
  return meses;
}

/** Valoración promedio por mes (null si ese mes no hubo ensayos valorados). */
export function valoracionPorMes(ensayos: Pick<Ensayo, "fecha" | "valoracion">[], hoy: string, n = 12) {
  return ultimosMeses(hoy, n).map((mes) => {
    const valores = ensayos.filter((e) => mesDe(e.fecha) === mes && e.valoracion).map((e) => e.valoracion!);
    return { mes, promedio: valores.length ? valores.reduce((a, b) => a + b, 0) / valores.length : null };
  });
}

/** Canciones marcadas como sacadas en cada uno de los últimos `n` meses. */
export function sacadasPorMes(canciones: Pick<Cancion, "estado" | "sacadaEn">[], hoy: string, n = 12) {
  return ultimosMeses(hoy, n).map((mes) => ({
    mes,
    cantidad: canciones.filter((c) => c.estado === "sacada" && c.sacadaEn && mesDe(c.sacadaEn) === mes).length,
  }));
}

/**
 * Minutos dedicados a cada canción. Se suman los minutos explícitos y el resto de la
 * duración del ensayo se reparte en partes iguales entre las canciones sin minutos.
 */
export function minutosPorCancion(ensayos: Pick<Ensayo, "duracionMin" | "items">[]): Map<Id, number> {
  const total = new Map<Id, number>();
  const sumar = (id: Id, min: number) => total.set(id, (total.get(id) ?? 0) + min);
  for (const e of ensayos) {
    const conMinutos = e.items.filter((i) => i.minutos);
    const sinMinutos = e.items.filter((i) => !i.minutos);
    const explicitos = conMinutos.reduce((s, i) => s + (i.minutos ?? 0), 0);
    conMinutos.forEach((i) => sumar(i.cancionId, i.minutos!));
    const resto = Math.max(0, (e.duracionMin ?? 0) - explicitos);
    sinMinutos.forEach((i) => sumar(i.cancionId, resto / sinMinutos.length));
  }
  return total;
}

/** "45 min", "1 h", "2 h 05". */
export function formatoDuracion(minutos: number): string {
  const redondeo = Math.round(minutos);
  const horas = Math.floor(redondeo / 60);
  const resto = redondeo % 60;
  if (horas === 0) return `${resto} min`;
  return resto === 0 ? `${horas} h` : `${horas} h ${String(resto).padStart(2, "0")}`;
}

/** Horas con un decimal y coma: "12,5". */
export const formatoHoras = (minutos: number) =>
  (minutos / 60).toLocaleString("es-CL", { maximumFractionDigits: minutos < 600 ? 1 : 0 });

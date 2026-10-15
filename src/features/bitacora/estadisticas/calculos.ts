import { aFecha, sumarDias } from "@/lib/fechas";
import type { Ensayo } from "../datos/tipos";

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

/** "45 min", "1 h", "2 h 05". */
export function formatoDuracion(minutos: number): string {
  const horas = Math.floor(minutos / 60);
  const resto = Math.round(minutos % 60);
  if (horas === 0) return `${resto} min`;
  return resto === 0 ? `${horas} h` : `${horas} h ${String(resto).padStart(2, "0")}`;
}

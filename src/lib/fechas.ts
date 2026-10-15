/**
 * Fechas "de calendario" en hora local, como texto 'YYYY-MM-DD'.
 * Se guardan así (y no como instantes UTC) para que las rachas y las semanas
 * correspondan al día en que realmente se ensayó.
 */

const DIAS_CORTOS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const DIAS_LARGOS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MESES_CORTOS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const MESES_LARGOS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

const dosDigitos = (n: number) => String(n).padStart(2, "0");

/** Fecha local de un instante, en formato 'YYYY-MM-DD'. */
export function fechaLocal(instante: Date = new Date()): string {
  return `${instante.getFullYear()}-${dosDigitos(instante.getMonth() + 1)}-${dosDigitos(instante.getDate())}`;
}

function partes(fecha: string): [number, number, number] {
  const [a, m, d] = fecha.split("-").map(Number);
  return [a, m, d];
}

/** Medianoche local del día indicado. */
export function aFecha(fecha: string): Date {
  const [a, m, d] = partes(fecha);
  return new Date(a, m - 1, d);
}

/** Suma (o resta) días de calendario. */
export function sumarDias(fecha: string, dias: number): string {
  const [a, m, d] = partes(fecha);
  return fechaLocal(new Date(a, m - 1, d + dias));
}

/** Días de calendario entre dos fechas (hasta − desde). Inmune a los cambios de horario. */
export function diasEntre(desde: string, hasta: string): number {
  const [a1, m1, d1] = partes(desde);
  const [a2, m2, d2] = partes(hasta);
  return Math.round((Date.UTC(a2, m2 - 1, d2) - Date.UTC(a1, m1 - 1, d1)) / 86_400_000);
}

export interface PartesFecha {
  diaSemana: string;
  diaSemanaLargo: string;
  dia: number;
  mes: string;
  mesLargo: string;
  anio: number;
}

export function partesFecha(fecha: string): PartesFecha {
  const f = aFecha(fecha);
  return {
    diaSemana: DIAS_CORTOS[f.getDay()],
    diaSemanaLargo: DIAS_LARGOS[f.getDay()],
    dia: f.getDate(),
    mes: MESES_CORTOS[f.getMonth()],
    mesLargo: MESES_LARGOS[f.getMonth()],
    anio: f.getFullYear(),
  };
}

/** "martes 14 de octubre" (agrega el año si no es el actual). */
export function fechaLarga(fecha: string, hoy: string = fechaLocal()): string {
  const p = partesFecha(fecha);
  const base = `${p.diaSemanaLargo} ${p.dia} de ${p.mesLargo}`;
  return p.anio === partesFecha(hoy).anio ? base : `${base} de ${p.anio}`;
}

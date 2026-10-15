"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { obtenerCronometro } from "./cronometro";
import * as repo from "./repositorio";

// Todas las consultas son "vivas": se actualizan solas al cambiar los datos.
// Devuelven `undefined` mientras cargan; las de un registro devuelven `null` si no existe.

export const useEnsayos = () => useLiveQuery(() => repo.ensayos.listar(), []);
export const useCanciones = () => useLiveQuery(() => repo.canciones.listar(), []);
export const useEscalas = () => useLiveQuery(() => repo.escalas.listar(), []);
export const useTips = () => useLiveQuery(() => repo.tips.listar(), []);
export const useGrabaciones = () => useLiveQuery(() => repo.grabaciones.listar(), []);

export function useEnsayo(id: string | null) {
  return useLiveQuery(async () => (id ? repo.ensayos.obtener(id) : null), [id]);
}

export function useCancion(id: string | null) {
  return useLiveQuery(async () => (id ? repo.canciones.obtener(id) : null), [id]);
}

export function useEscala(id: string | null) {
  return useLiveQuery(async () => (id ? repo.escalas.obtener(id) : null), [id]);
}

export function useTipsDeEnsayo(ensayoId: string | null) {
  return useLiveQuery(async () => (ensayoId ? repo.tips.deEnsayo(ensayoId) : []), [ensayoId]);
}

/** El cronómetro en curso, o null si no hay. */
export function useCronometro() {
  return useLiveQuery(async () => (await obtenerCronometro()) ?? null, []);
}

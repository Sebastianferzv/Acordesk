"use client";

import { useLiveQuery } from "dexie-react-hooks";
import * as repo from "./repositorio";

/** Lista de ensayos, viva. `undefined` mientras carga. */
export function useEnsayos() {
  return useLiveQuery(() => repo.ensayos.listar(), []);
}

"use client";

import { useSyncExternalStore } from "react";
import { fechaLocal } from "./fechas";

// Se revisa cada minuto y al volver a la app, por si se cruzó la medianoche.
function suscribir(aviso: () => void) {
  const alVolver = () => {
    if (document.visibilityState === "visible") aviso();
  };
  document.addEventListener("visibilitychange", alVolver);
  const intervalo = setInterval(aviso, 60_000);
  return () => {
    document.removeEventListener("visibilitychange", alVolver);
    clearInterval(intervalo);
  };
}

/** Fecha local de hoy ('YYYY-MM-DD'). Es `null` en el servidor y durante la hidratación. */
export function useHoy(): string | null {
  return useSyncExternalStore(suscribir, () => fechaLocal(), () => null);
}

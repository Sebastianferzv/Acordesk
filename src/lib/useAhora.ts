"use client";

import { useCallback, useSyncExternalStore } from "react";

/** La hora actual redondeada al segundo, actualizada cada segundo mientras `activo`. */
export function useAhora(activo = true): number {
  const suscribir = useCallback(
    (aviso: () => void) => {
      if (!activo) return () => {};
      const t = setInterval(aviso, 250);
      return () => clearInterval(t);
    },
    [activo],
  );
  return useSyncExternalStore(
    suscribir,
    () => (activo ? Math.floor(Date.now() / 1000) * 1000 : 0),
    () => 0,
  );
}

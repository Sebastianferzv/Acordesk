import { useSyncExternalStore } from "react";

/**
 * Valor persistido en localStorage y observable desde React.
 * Se usa para preferencias que deben leerse de forma síncrona al iniciar (tema, ajustes).
 * En el servidor y durante la hidratación entrega el valor por defecto.
 */
export function crearAlmacenLocal<T>(clave: string, porDefecto: T, normalizar: (crudo: unknown) => T = (v) => v as T) {
  let cache: T | undefined;
  const oyentes = new Set<() => void>();

  function leer(): T {
    if (cache !== undefined) return cache;
    if (typeof window === "undefined") return porDefecto;
    try {
      const crudo = window.localStorage.getItem(clave);
      cache = crudo === null ? porDefecto : normalizar(JSON.parse(crudo));
    } catch {
      cache = porDefecto;
    }
    return cache;
  }

  function guardar(valor: T) {
    cache = valor;
    try {
      window.localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
      // Sin almacenamiento (modo privado estricto): el valor vive solo en memoria.
    }
    oyentes.forEach((oyente) => oyente());
  }

  function suscribir(oyente: () => void) {
    oyentes.add(oyente);
    const alCambiarEnOtraPestana = (e: StorageEvent) => {
      if (e.key !== clave) return;
      cache = undefined;
      oyente();
    };
    window.addEventListener("storage", alCambiarEnOtraPestana);
    return () => {
      oyentes.delete(oyente);
      window.removeEventListener("storage", alCambiarEnOtraPestana);
    };
  }

  function useAlmacen(): T {
    return useSyncExternalStore(suscribir, leer, () => porDefecto);
  }

  return { leer, guardar, useAlmacen };
}

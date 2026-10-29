"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

interface Aviso {
  id: number;
  texto: string;
  accion?: { etiqueta: string; alHacer: () => void };
}

type Mostrar = (aviso: Omit<Aviso, "id"> & { duracionMs?: number }) => void;

const ContextoAvisos = createContext<Mostrar>(() => {});

/** Aviso breve en la parte inferior, con una acción opcional (por ejemplo "Deshacer"). */
export function ProveedorAvisos({ children }: { children: ReactNode }) {
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const temporizador = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const mostrar = useCallback<Mostrar>(({ duracionMs = 5000, ...datos }) => {
    clearTimeout(temporizador.current);
    const id = Date.now();
    setAviso({ ...datos, id });
    temporizador.current = setTimeout(() => setAviso((actual) => (actual?.id === id ? null : actual)), duracionMs);
  }, []);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  return (
    <ContextoAvisos value={mostrar}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-40 flex justify-center px-4"
      >
        {aviso && (
          <div
            key={aviso.id}
            className="pointer-events-auto flex w-full max-w-[608px] animate-aparecer rounded-[var(--radio)] items-center justify-between gap-4 bg-tinta px-4 py-3 shadow-lg text-fondo"
          >
            <span className="text-sm font-medium">{aviso.texto}</span>
            {aviso.accion && (
              <button
                type="button"
                className="etiqueta shrink-0 text-amarillo"
                onClick={() => {
                  aviso.accion?.alHacer();
                  setAviso(null);
                }}
              >
                {aviso.accion.etiqueta}
              </button>
            )}
          </div>
        )}
      </div>
    </ContextoAvisos>
  );
}

export const useAviso = () => useContext(ContextoAvisos);

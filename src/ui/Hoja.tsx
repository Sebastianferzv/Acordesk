"use client";

import { useEffect, useEffectEvent, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { IconoCerrar } from "./Iconos";

interface Props {
  abierta: boolean;
  onCerrar: () => void;
  titulo: string;
  children: ReactNode;
}

/** Panel que sube desde abajo (hoja inferior). Se cierra con Escape o tocando el fondo. */
export function Hoja({ abierta, onCerrar, titulo, children }: Props) {
  const idTitulo = useId();
  const panel = useRef<HTMLDivElement>(null);
  const alEscape = useEffectEvent(() => onCerrar());

  useEffect(() => {
    if (!abierta) return;
    const enfocadoAntes = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") alEscape();
    };
    document.addEventListener("keydown", alTeclear);
    const desborde = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alTeclear);
      document.body.style.overflow = desborde;
      enfocadoAntes?.focus?.();
    };
  }, [abierta]);

  if (!abierta) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div aria-hidden className="absolute inset-0 animate-aparecer bg-black/50" onClick={onCerrar} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        tabIndex={-1}
        className="relative w-full max-w-[640px] animate-subir border-t-[3px] border-linea bg-superficie px-4 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] outline-none sm:border-x-[3px]"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id={idTitulo} className="titulo-bauhaus text-[1.75rem]">
            {titulo}
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="inline-flex size-10 items-center justify-center border-[3px] border-linea bg-fondo"
          >
            <IconoCerrar tamano={16} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}

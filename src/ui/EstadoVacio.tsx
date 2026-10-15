import type { ReactNode } from "react";

/** Mensaje para listas vacías, con una pequeña composición Bauhaus. */
export function EstadoVacio({ titulo, children }: { titulo: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <svg viewBox="0 0 120 84" className="mb-5 w-44" aria-hidden>
        <circle cx="42" cy="40" r="27" fill="none" stroke="var(--tinta)" strokeWidth="3" />
        <polygon points="58,72 102,72 80,32" fill="var(--amarillo)" />
        <circle cx="96" cy="17" r="8" fill="var(--rojo)" />
        <rect x="14" y="58" width="16" height="16" fill="var(--azul)" />
        <path d="M6 76h108" stroke="var(--tinta)" strokeWidth="3" />
      </svg>
      <p className="titulo-bauhaus text-xl">{titulo}</p>
      {children && <div className="mt-2 max-w-xs text-[0.95rem] leading-snug text-tinta-suave">{children}</div>}
    </div>
  );
}

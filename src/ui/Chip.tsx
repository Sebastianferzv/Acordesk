import type { ButtonHTMLAttributes } from "react";
import { cx } from "./cx";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  seleccionado?: boolean;
}

/** Opción rápida que se activa con un toque. */
export function Chip({ seleccionado = false, className, type = "button", ...resto }: Props) {
  return (
    <button
      type={type}
      aria-pressed={seleccionado}
      className={cx(
        "inline-flex h-10 items-center gap-1.5 border-2 border-linea px-3.5 text-sm font-medium transition-colors active:translate-y-px",
        seleccionado ? "bg-tinta text-fondo" : "bg-superficie text-tinta",
        className,
      )}
      {...resto}
    />
  );
}

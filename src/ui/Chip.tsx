import type { ButtonHTMLAttributes } from "react";
import { cx } from "./cx";

export type TonoChip = "rojo" | "amarillo" | "azul" | "hundido";

const LLENO: Record<TonoChip, string> = {
  rojo: "border-rojo bg-rojo text-sobre-color",
  amarillo: "border-amarillo bg-amarillo text-sobre-amarillo",
  azul: "border-azul bg-azul text-sobre-color",
  hundido: "border-transparent bg-hundido text-tinta",
};

const BORDE: Record<TonoChip, string> = {
  rojo: "border-rojo bg-transparent text-tinta",
  amarillo: "border-amarillo bg-transparent text-tinta",
  azul: "border-azul bg-transparent text-tinta",
  hundido: "border-transparent bg-hundido text-tinta",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  seleccionado?: boolean;
  /** Color del chip: con borde de ese color, y relleno si está seleccionado o `lleno`. */
  tono?: TonoChip;
  /** Siempre relleno (para acciones, no opciones). */
  lleno?: boolean;
}

/** Opción rápida que se activa con un toque. */
export function Chip({ seleccionado = false, tono, lleno = false, className, type = "button", ...resto }: Props) {
  const aspecto = tono
    ? (seleccionado || lleno ? LLENO : BORDE)[tono]
    : seleccionado
      ? "border-tinta bg-tinta text-fondo"
      : "border-sutil bg-transparent text-tinta";
  return (
    <button
      type={type}
      aria-pressed={lleno ? undefined : seleccionado}
      className={cx(
        "inline-flex h-10 items-center gap-1.5 border-2 px-3.5 text-sm font-medium transition-colors active:translate-y-px",
        aspecto,
        className,
      )}
      {...resto}
    />
  );
}

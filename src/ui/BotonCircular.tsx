import type { ButtonHTMLAttributes } from "react";
import { cx } from "./cx";

export type ColorBoton = "rojo" | "azul" | "amarillo" | "tinta" | "superficie";

const COLORES: Record<ColorBoton, string> = {
  rojo: "bg-rojo text-sobre-color",
  azul: "bg-azul text-sobre-color",
  amarillo: "bg-amarillo text-sobre-amarillo",
  tinta: "bg-tinta text-fondo",
  superficie: "bg-superficie text-tinta",
};

const TAMANOS = {
  sm: "size-10",
  md: "size-14",
  lg: "size-[4.5rem]",
  xl: "size-24",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ColorBoton;
  tamano?: keyof typeof TAMANOS;
  /** Texto accesible (los botones circulares suelen llevar solo un ícono). */
  etiqueta: string;
}

export function BotonCircular({
  color = "rojo",
  tamano = "md",
  etiqueta,
  className,
  children,
  type = "button",
  ...resto
}: Props) {
  return (
    <button
      type={type}
      aria-label={etiqueta}
      title={etiqueta}
      className={cx(
        "inline-flex shrink-0 items-center justify-center rounded-full border-[3px] border-linea transition-transform active:scale-95 disabled:opacity-40",
        COLORES[color],
        TAMANOS[tamano],
        className,
      )}
      {...resto}
    >
      {children}
    </button>
  );
}

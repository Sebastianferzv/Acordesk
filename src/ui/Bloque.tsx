import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";
import { Forma, type ColorBauhaus, type TipoForma } from "./Forma";

interface Props extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  como?: "section" | "div" | "article";
  titulo?: ReactNode;
  /** Forma de color junto al título. */
  acento?: { forma: TipoForma; color: ColorBauhaus };
  /** Rellena la franja del título con el color del acento. */
  tituloDeColor?: boolean;
}

const FRANJA: Partial<Record<ColorBauhaus, string>> = {
  rojo: "border-rojo bg-rojo text-sobre-color",
  amarillo: "border-amarillo bg-amarillo text-sobre-amarillo",
  azul: "border-azul bg-azul text-sobre-color",
};

/** Contenedor básico: tarjeta recta con línea fina. */
export function Bloque({ como: Etiqueta = "section", titulo, acento, tituloDeColor = false, className, children, ...resto }: Props) {
  const franja = tituloDeColor && acento ? FRANJA[acento.color] : undefined;
  return (
    <Etiqueta className={cx("border-2 border-sutil bg-superficie", className)} {...resto}>
      {titulo && (
        <header className={cx("etiqueta flex items-center justify-between gap-3 border-b-2 px-4 py-2.5", franja ?? "border-sutil")}>
          <span>{titulo}</span>
          {/* Con franja de color, la franja ya es el acento. */}
          {acento && !franja && <Forma tipo={acento.forma} relleno={acento.color} trazo="ninguno" tamano={12} />}
        </header>
      )}
      {children}
    </Etiqueta>
  );
}

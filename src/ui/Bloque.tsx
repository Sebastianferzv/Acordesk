import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";
import { Forma, type ColorBauhaus, type TipoForma } from "./Forma";

interface Props extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  como?: "section" | "div" | "article";
  titulo?: ReactNode;
  /** Forma de color junto al título. */
  acento?: { forma: TipoForma; color: ColorBauhaus };
}

/** Contenedor básico: bloque recto con borde grueso. */
export function Bloque({ como: Etiqueta = "section", titulo, acento, className, children, ...resto }: Props) {
  return (
    <Etiqueta className={cx("border-[3px] border-linea bg-superficie", className)} {...resto}>
      {titulo && (
        <header className="etiqueta flex items-center justify-between gap-3 border-b-[3px] border-linea px-4 py-2.5">
          <span>{titulo}</span>
          {acento && <Forma tipo={acento.forma} relleno={acento.color} trazo="ninguno" tamano={16} />}
        </header>
      )}
      {children}
    </Etiqueta>
  );
}

import type { ButtonHTMLAttributes } from "react";
import { cx } from "./cx";

export type VarianteBoton = "primario" | "secundario" | "rojo" | "azul" | "amarillo" | "fantasma";

const VARIANTES: Record<VarianteBoton, string> = {
  primario: "border-linea bg-tinta text-fondo",
  secundario: "border-linea bg-superficie text-tinta",
  rojo: "border-linea bg-rojo text-sobre-color",
  azul: "border-linea bg-azul text-sobre-color",
  amarillo: "border-linea bg-amarillo text-sobre-amarillo",
  fantasma: "border-transparent bg-transparent text-tinta",
};

/** Clases de botón, para reutilizarlas también en enlaces. */
export function clasesBoton(variante: VarianteBoton = "primario", anchoCompleto = false, className?: string) {
  return cx(
    "inline-flex h-12 items-center justify-center gap-2 border-[3px] px-5 text-sm font-semibold uppercase tracking-[0.08em] transition-transform active:translate-y-px disabled:opacity-40",
    VARIANTES[variante],
    anchoCompleto && "w-full",
    className,
  );
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBoton;
  anchoCompleto?: boolean;
}

export function Boton({ variante, anchoCompleto, className, type = "button", ...resto }: Props) {
  return <button type={type} className={clasesBoton(variante, anchoCompleto, className)} {...resto} />;
}

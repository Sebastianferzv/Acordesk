import type { ButtonHTMLAttributes } from "react";
import { cx } from "./cx";

export type VarianteBoton = "primario" | "secundario" | "rojo" | "azul" | "amarillo" | "fantasma";

const VARIANTES: Record<VarianteBoton, string> = {
  primario: "border-transparent bg-tinta text-fondo",
  secundario: "border-sutil bg-superficie text-tinta",
  rojo: "border-transparent bg-rojo text-sobre-color",
  azul: "border-transparent bg-azul text-sobre-color",
  amarillo: "border-transparent bg-amarillo text-sobre-amarillo",
  fantasma: "border-transparent bg-transparent text-tinta",
};

/** Clases de botón, para reutilizarlas también en enlaces. */
export function clasesBoton(variante: VarianteBoton = "primario", anchoCompleto = false, className?: string) {
  return cx(
    "inline-flex h-12 items-center justify-center gap-2 border-2 px-5 text-sm font-semibold tracking-[0.02em] transition-[transform,opacity] active:translate-y-px active:opacity-80 disabled:opacity-40",
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

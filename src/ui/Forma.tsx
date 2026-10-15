import type { ReactNode } from "react";

export type TipoForma = "circulo" | "cuadrado" | "triangulo" | "semicirculo" | "barras";
export type ColorBauhaus = "rojo" | "amarillo" | "azul" | "tinta" | "fondo" | "superficie";

export const VAR_COLOR: Record<ColorBauhaus, string> = {
  rojo: "var(--rojo)",
  amarillo: "var(--amarillo)",
  azul: "var(--azul)",
  tinta: "var(--tinta)",
  fondo: "var(--fondo)",
  superficie: "var(--superficie)",
};

interface Props {
  tipo: TipoForma;
  tamano?: number;
  /** "multicolor" solo aplica a las barras (azul, rojo, amarillo). */
  relleno?: ColorBauhaus | "multicolor";
  trazo?: ColorBauhaus | "ninguno";
  grosor?: number;
  className?: string;
  /** Si se indica, la forma se anuncia como imagen; si no, es decorativa. */
  titulo?: string;
}

/** Las formas primarias del Bauhaus, dibujadas en una caja de 24×24. */
export function Forma({ tipo, tamano = 24, relleno, trazo = "tinta", grosor = 2.5, className, titulo }: Props) {
  const fill = relleno && relleno !== "multicolor" ? VAR_COLOR[relleno] : "none";
  const stroke = trazo === "ninguno" ? "none" : VAR_COLOR[trazo];
  const m = trazo === "ninguno" ? 0 : grosor / 2;
  const estilo = { fill, stroke, strokeWidth: grosor };

  let dibujo: ReactNode;
  switch (tipo) {
    case "circulo":
      dibujo = <circle cx={12} cy={12} r={11.5 - m} {...estilo} />;
      break;
    case "cuadrado":
      dibujo = <rect x={1 + m} y={1 + m} width={22 - 2 * m} height={22 - 2 * m} {...estilo} />;
      break;
    case "triangulo":
      dibujo = <polygon points={`12,${2 + 2 * m} ${23 - m},${22.5 - m} ${1 + m},${22.5 - m}`} {...estilo} />;
      break;
    case "semicirculo":
      dibujo = <path d={`M${1 + m} 18.5A${11 - m} ${11 - m} 0 0 1 ${23 - m} 18.5Z`} {...estilo} />;
      break;
    case "barras": {
      const colores =
        relleno === "multicolor" ? [VAR_COLOR.azul, VAR_COLOR.rojo, VAR_COLOR.amarillo] : [fill, fill, fill];
      dibujo = (
        <>
          <rect x={1.5 + m} y={11} width={5} height={11.5 - m} {...estilo} fill={colores[0]} />
          <rect x={9.5} y={2 + m} width={5} height={20.5 - 2 * m} {...estilo} fill={colores[1]} />
          <rect x={17.5 - m} y={7.5} width={5} height={15 - m} {...estilo} fill={colores[2]} />
        </>
      );
      break;
    }
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width={tamano}
      height={tamano}
      className={className}
      role={titulo ? "img" : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
    >
      {dibujo}
    </svg>
  );
}

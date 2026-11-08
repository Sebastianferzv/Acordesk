import type { ReactNode } from "react";

export type TipoForma = "circulo" | "barras" | TipoIcono;

/** Íconos de línea comunes, en el color del relleno (o del trazo si no hay relleno). */
export type TipoIcono =
  | "calendario"
  | "nota"
  | "libro"
  | "cuaderno"
  | "bombilla"
  | "lapiz"
  | "enlace"
  | "reloj"
  | "ojo"
  | "flechas"
  | "etiqueta"
  | "descarga"
  | "disco"
  | "lista";

const ICONOS: Record<TipoIcono, ReactNode> = {
  calendario: (
    <>
      <rect x="3" y="4.5" width="18" height="16.5" rx="2" />
      <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
    </>
  ),
  nota: (
    <>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" fill="currentColor" />
      <circle cx="18" cy="16" r="3" fill="currentColor" />
    </>
  ),
  libro: <path d="M12 7v14M3 18V4h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5v14h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />,
  cuaderno: (
    <>
      <rect x="4" y="2.5" width="16" height="19" rx="2" />
      <path d="M8.5 2.5v19M12 7.5h4.5M12 11.5h4.5" />
    </>
  ),
  bombilla: <path d="M15 14c.2-1 .7-1.7 1.5-2.5A5.5 5.5 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4" />,
  lapiz: <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />,
  enlace: (
    <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
  ),
  reloj: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  ojo: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  flechas: <path d="M7 16V4M3 8l4-4 4 4M17 8v12M21 16l-4 4-4-4" />,
  etiqueta: (
    <>
      <path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4z" />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
    </>
  ),
  descarga: <path d="M12 3v12M7 10l5 5 5-5M4 21h16" />,
  disco: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5M3 12c0 1.7 4 3 9 3s9-1.3 9-3" />
    </>
  ),
  lista: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
};
export type ColorBauhaus = "rojo" | "amarillo" | "azul" | "morado" | "tinta" | "fondo" | "superficie";

export const VAR_COLOR: Record<ColorBauhaus, string> = {
  rojo: "var(--rojo)",
  amarillo: "var(--amarillo)",
  azul: "var(--azul)",
  morado: "var(--morado)",
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

/** Círculo, barras o un ícono de línea, dibujados en una caja de 24×24. */
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
    default:
      dibujo = (
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          color={relleno && relleno !== "multicolor" ? VAR_COLOR[relleno] : trazo === "ninguno" ? VAR_COLOR.tinta : VAR_COLOR[trazo]}
        >
          {ICONOS[tipo]}
        </g>
      );
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

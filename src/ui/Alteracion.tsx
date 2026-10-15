import { cx } from "./cx";

export type TipoAlteracion = "b" | "#" | "bb" | "##";

const NOMBRES: Record<TipoAlteracion, string> = {
  b: "bemol",
  "#": "sostenido",
  bb: "doble bemol",
  "##": "doble sostenido",
};

const BEMOL = "M3 1.5V22c4.6-2.4 7.2-5.1 6.5-7.6-.6-2.2-3.4-2.4-6.5 0";

/**
 * Bemol y sostenido dibujados en SVG: la fuente Jost no trae ♭ ni ♯.
 * Toma el color y el tamaño del texto que la rodea.
 */
export function Alteracion({ tipo, className }: { tipo: TipoAlteracion; className?: string }) {
  const ancho = tipo === "bb" ? 21 : 12;
  const alto = 0.82;
  return (
    <svg
      viewBox={`0 0 ${ancho} 24`}
      role="img"
      aria-label={NOMBRES[tipo]}
      className={cx("inline-block shrink-0", className)}
      style={{ height: `${alto}em`, width: `${(alto * ancho) / 24}em`, verticalAlign: "-0.02em" }}
      fill="none"
      stroke="currentColor"
    >
      {tipo === "b" && <path d={BEMOL} strokeWidth={2.2} />}
      {tipo === "bb" && (
        <>
          <path d={BEMOL} strokeWidth={2.2} />
          <path d={BEMOL} strokeWidth={2.2} transform="translate(9 0)" />
        </>
      )}
      {tipo === "#" && (
        <>
          <path d="M4.3 3.5V23M7.7 1v19.5" strokeWidth={1.7} />
          <path d="M1 10.2l10-2.6M1 16.7l10-2.6" strokeWidth={2.8} />
        </>
      )}
      {tipo === "##" && <path d="M2 9.5l8 8M10 9.5l-8 8" strokeWidth={2.8} />}
    </svg>
  );
}

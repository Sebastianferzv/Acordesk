// Teclado de dos octavas (desde C) con las notas de la escala marcadas.

const BLANCAS = [0, 2, 4, 5, 7, 9, 11];
const NEGRAS = [
  { pc: 1, despues: 0 },
  { pc: 3, despues: 1 },
  { pc: 6, despues: 3 },
  { pc: 8, despues: 4 },
  { pc: 10, despues: 5 },
];

const ANCHO = 20;
const ALTO = 86;

interface Props {
  /** Clases de altura de la escala. */
  notas: Set<number>;
  tonica: number;
  className?: string;
}

export function Teclado({ notas, tonica, className }: Props) {
  const octavas = [0, 1];
  const marca = (pc: number, x: number, y: number, negra: boolean) =>
    notas.has(pc) ? (
      <circle
        cx={x}
        cy={y}
        r={6.2}
        fill={pc === tonica ? "var(--rojo)" : "var(--azul)"}
        stroke={negra ? "var(--superficie)" : "none"}
        strokeWidth={negra ? 1.8 : 0}
      />
    ) : null;

  return (
    <svg
      viewBox={`0 0 ${ANCHO * 14 + 4} ${ALTO + 4}`}
      className={className}
      role="img"
      aria-label="Teclado con las notas de la escala marcadas"
    >
      <g transform="translate(2 2)">
        {octavas.map((o) =>
          BLANCAS.map((pc, i) => {
            const x = (o * 7 + i) * ANCHO;
            return (
              <g key={`b${o}${pc}`}>
                <rect x={x} y={0} width={ANCHO} height={ALTO} fill="#fbf7ee" stroke="var(--linea)" strokeWidth={2} />
                {marca(pc, x + ANCHO / 2, ALTO - 13, false)}
              </g>
            );
          }),
        )}
        {octavas.map((o) =>
          NEGRAS.map(({ pc, despues }) => {
            const x = (o * 7 + despues + 1) * ANCHO - 6.5;
            return (
              <g key={`n${o}${pc}`}>
                <rect x={x} y={0} width={13} height={ALTO * 0.6} fill="#16130f" stroke="var(--linea)" strokeWidth={1.5} />
                {marca(pc, x + 6.5, ALTO * 0.6 - 10, true)}
              </g>
            );
          }),
        )}
        <rect x={0} y={0} width={ANCHO * 14} height={ALTO} fill="none" stroke="var(--linea)" strokeWidth={3} />
      </g>
    </svg>
  );
}

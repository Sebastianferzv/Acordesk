import { VAR_COLOR, type ColorBauhaus } from "@/ui/Forma";
import { colorValoracion } from "@/ui/valoracion";

interface Props {
  /** Texto estable (el id del ensayo) que decide la composición. */
  semilla: string;
  duracionMin?: number;
  valoracion?: number;
  canciones: number;
  conAprendizajes: boolean;
  tamano?: number;
  className?: string;
}

interface Diseno {
  circulo: [number, number];
  cuadrados: { x: number; y: number; vertical: boolean };
  triangulo: string;
  linea: string;
}

// Cuatro composiciones base sobre una caja de 64×64 (borde de 3).
const DISENOS: Diseno[] = [
  { circulo: [25, 26], cuadrados: { x: 8, y: 51, vertical: false }, triangulo: "45,57 58,57 51.5,44", linea: "M45 3V38" },
  { circulo: [39, 25], cuadrados: { x: 8, y: 8, vertical: true }, triangulo: "7,57 20,57 13.5,44", linea: "M24 47H61" },
  { circulo: [32, 37], cuadrados: { x: 8, y: 8, vertical: false }, triangulo: "46,20 59,20 52.5,7", linea: "M13 22V61" },
  { circulo: [34, 38], cuadrados: { x: 51, y: 8, vertical: true }, triangulo: "7,21 20,21 13.5,8", linea: "M24 13H45" },
];

function hash(texto: string): number {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Mini composición Bauhaus que resume un ensayo:
 * círculo = duración (color según valoración), cuadrados = canciones, triángulo = hubo aprendizajes.
 */
export function SelloEnsayo({
  semilla,
  duracionMin,
  valoracion,
  canciones,
  conAprendizajes,
  tamano = 56,
  className,
}: Props) {
  const diseno = DISENOS[hash(semilla) % DISENOS.length];
  const [cx, cy] = diseno.circulo;
  const radio = duracionMin ? Math.min(21, Math.max(9, 7 + duracionMin * 0.12)) : 7;
  const colorCirculo: ColorBauhaus = valoracion ? colorValoracion(valoracion) : "tinta";
  const colorTriangulo: ColorBauhaus = colorCirculo === "amarillo" ? "rojo" : "amarillo";
  const nCuadrados = Math.min(canciones, 4);

  return (
    <svg viewBox="0 0 64 64" width={tamano} height={tamano} className={className} aria-hidden>
      <rect x="1" y="1" width="62" height="62" fill="var(--fondo)" stroke="var(--sutil)" strokeWidth="2" />
      <path d={diseno.linea} stroke="var(--tinta)" strokeWidth="2.5" />
      {duracionMin ? (
        <circle cx={cx} cy={cy} r={radio} fill={VAR_COLOR[colorCirculo]} />
      ) : (
        <circle cx={cx} cy={cy} r={radio} fill="none" stroke="var(--tinta)" strokeWidth="2.5" />
      )}
      {Array.from({ length: nCuadrados }, (_, i) => {
        const { x, y, vertical } = diseno.cuadrados;
        return (
          <rect
            key={i}
            x={vertical ? x : x + i * 9}
            y={vertical ? y + i * 9 : y}
            width="6"
            height="6"
            fill={i % 2 ? "var(--azul)" : "var(--tinta)"}
          />
        );
      })}
      {conAprendizajes && <polygon points={diseno.triangulo} fill={VAR_COLOR[colorTriangulo]} />}
    </svg>
  );
}

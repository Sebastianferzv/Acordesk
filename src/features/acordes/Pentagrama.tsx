import { posicionesArmadura, type NotaPentagrama } from "@/lib/teoria/circulo";
import { BEMOL, SOSTENIDO } from "@/ui/Alteracion";

const S = 12; // distancia entre líneas
const ANCHO = 440;
const ALTO = 172;
const Y_ABAJO = 104; // línea inferior (E4 = paso 30)
const y = (paso: number) => Y_ABAJO - ((paso - 30) * S) / 2;

/** Alteración de la armadura centrada en la línea o espacio `cy`. */
function Alteracion({ x, cy, sostenido }: { x: number; cy: number; sostenido: boolean }) {
  // Los trazos vienen en una caja de 12×24; el sostenido se centra en y=12 y el bemol en su panza (y≈17).
  const escala = (S * 2.3) / 24;
  const centro = sostenido ? 12 : 17.2;
  return (
    <g transform={`translate(${x - 6 * escala} ${cy - centro * escala}) scale(${escala})`} fill="none" stroke="currentColor">
      {sostenido ? (
        <>
          <path d={SOSTENIDO.verticales} strokeWidth={1.7} />
          <path d={SOSTENIDO.horizontales} strokeWidth={2.8} />
        </>
      ) : (
        <path d={BEMOL} strokeWidth={2.2} />
      )}
    </g>
  );
}

/** Letra + alteración para texto dentro del SVG (Jost no trae ♭ ni ♯). */
export function NombreEnSvg({ nota }: { nota: string }) {
  const alteracion = nota.slice(1).replace("bb", "𝄫").replace("##", "𝄪").replace("b", "♭").replace("#", "♯");
  return (
    <>
      {nota[0]}
      {alteracion && <tspan fontFamily="'Segoe UI Symbol','Noto Sans Symbols 2','Apple Symbols',sans-serif">{alteracion}</tspan>}
    </>
  );
}

/** Clave de sol, armadura y una escala en redondas (sin alteraciones: las da la armadura). */
export function Pentagrama({ notas, armadura }: { notas: NotaPentagrama[]; armadura: number }) {
  const posiciones = posicionesArmadura(armadura);
  const x0 = 80 + posiciones.length * 16 + 12;
  const dx = (ANCHO - 26 - x0) / (notas.length - 1);
  const lineaAdicional = (cx: number, paso: number) => (
    <line key={`l${paso}`} x1={cx - S} x2={cx + S} y1={y(paso)} y2={y(paso)} stroke="currentColor" strokeWidth={1.2} />
  );

  return (
    <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} className="block w-full text-tinta" role="img" aria-label="Escala en el pentagrama">
      {[0, 1, 2, 3, 4].map((k) => (
        <line key={k} x1={8} x2={ANCHO - 8} y1={Y_ABAJO - k * S} y2={Y_ABAJO - k * S} stroke="currentColor" strokeOpacity={0.55} />
      ))}
      <text
        x={10}
        y={Y_ABAJO + S * 0.2}
        fontSize={S * 7.2}
        fill="currentColor"
        fontFamily="'Noto Music','Segoe UI Symbol','Apple Symbols',serif"
      >
        𝄞
      </text>

      {posiciones.map((p, k) => (
        <Alteracion key={k} x={70 + k * 16} cy={y(p)} sostenido={armadura > 0} />
      ))}

      {notas.map((n, k) => {
        const cx = x0 + k * dx;
        const cy = y(n.paso);
        const tonica = k === 0 || k === notas.length - 1;
        const adicionales = [];
        for (let p = 28; p >= n.paso; p -= 2) adicionales.push(lineaAdicional(cx, p));
        for (let p = 40; p <= n.paso; p += 2) adicionales.push(lineaAdicional(cx, p));
        return (
          <g key={k} className={tonica ? "text-rojo" : undefined}>
            {adicionales}
            <ellipse
              cx={cx}
              cy={cy}
              rx={S * 0.68}
              ry={S * 0.47}
              transform={`rotate(-20 ${cx} ${cy})`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2.4}
            />
            <text x={cx} y={ALTO - 12} textAnchor="middle" fontSize={15} fontWeight={700} fill="currentColor">
              <NombreEnSvg nota={n.nota} />
            </text>
          </g>
        );
      })}
    </svg>
  );
}

"use client";

import { useState } from "react";
import { cx } from "@/ui/cx";

export interface Punto {
  etiqueta: string;
  /** Texto del detalle al tocar la barra (por ejemplo "Semana del 6 oct"). */
  detalle: string;
  valor: number | null;
}

interface PropsBarras {
  titulo: string;
  puntos: Punto[];
  color: "azul" | "rojo";
  formato: (valor: number) => string;
  /** Cada cuántas barras se rotula el eje. */
  cadaEtiqueta?: number;
}

const ALTO = 120;

/** Barras verticales de una sola serie. Tocar (o pasar el mouse) muestra el valor. */
export function GraficoBarras({ titulo, puntos, color, formato, cadaEtiqueta = 1 }: PropsBarras) {
  const [elegido, setElegido] = useState<number>(puntos.length - 1);
  const maximo = Math.max(1, ...puntos.map((p) => p.valor ?? 0));
  const ancho = 100 / puntos.length;
  const p = puntos[elegido];

  return (
    <figure>
      <figcaption className="mb-2 flex items-baseline justify-between gap-3">
        <span className="etiqueta">{titulo}</span>
        <span className="text-sm text-tinta-suave" aria-live="polite">
          {p?.detalle}: <strong className="text-tinta">{formato(p?.valor ?? 0)}</strong>
        </span>
      </figcaption>
      <div className="relative" style={{ height: ALTO }}>
        <div aria-hidden className="absolute inset-x-0 top-0 border-t border-hundido" />
        <div aria-hidden className="absolute inset-x-0 top-1/2 border-t border-hundido" />
        <div className="absolute inset-0 flex items-end" role="list" aria-label={titulo}>
          {puntos.map((punto, i) => {
            const alto = ((punto.valor ?? 0) / maximo) * 100;
            return (
              <button
                key={i}
                type="button"
                role="listitem"
                aria-label={`${punto.detalle}: ${formato(punto.valor ?? 0)}`}
                onPointerEnter={() => setElegido(i)}
                onFocus={() => setElegido(i)}
                onClick={() => setElegido(i)}
                className="flex h-full items-end px-[1px]"
                style={{ width: `${ancho}%` }}
              >
                <span
                  className={cx(
                    "block w-full transition-opacity",
                    color === "azul" ? "bg-azul" : "bg-rojo",
                    i !== elegido && "opacity-55",
                  )}
                  style={{ height: `${Math.max(alto, punto.valor ? 2 : 0)}%` }}
                />
              </button>
            );
          })}
        </div>
      </div>
      <div className="h-[3px] bg-linea" />
      <div className="mt-1 flex" aria-hidden>
        {puntos.map((punto, i) => (
          <span key={i} className="overflow-visible text-center text-[0.6rem] whitespace-nowrap text-tinta-suave" style={{ width: `${ancho}%` }}>
            {i % cadaEtiqueta === (puntos.length - 1) % cadaEtiqueta ? punto.etiqueta : ""}
          </span>
        ))}
      </div>
    </figure>
  );
}

/** Valoración promedio por mes: puntos unidos en una escala fija de 1 a 5. */
export function GraficoValoracion({ puntos }: { puntos: Punto[] }) {
  const [elegido, setElegido] = useState<number | null>(null);
  const W = 300;
  const H = 110;
  const x = (i: number) => 10 + (i * (W - 20)) / Math.max(1, puntos.length - 1);
  const y = (v: number) => 8 + ((5 - v) / 4) * (H - 16);
  const conValor = puntos.map((p, i) => ({ ...p, i })).filter((p) => p.valor !== null);
  const ultimo = conValor.at(-1);
  const p = elegido !== null ? puntos[elegido] : ultimo;

  return (
    <figure>
      <figcaption className="mb-2 flex items-baseline justify-between gap-3">
        <span className="etiqueta">Valoración promedio</span>
        {p && p.valor !== null && (
          <span className="text-sm text-tinta-suave">
            {p.detalle}: <strong className="text-tinta">{p.valor.toLocaleString("es-CL", { maximumFractionDigits: 1 })} / 5</strong>
          </span>
        )}
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Valoración promedio por mes">
        {[1, 3, 5].map((v) => (
          <g key={v}>
            <line x1={0} x2={W} y1={y(v)} y2={y(v)} stroke="var(--hundido)" strokeWidth={1} />
            <text x={0} y={y(v) - 2} fontSize={8} fill="var(--tinta-suave)">
              {v}
            </text>
          </g>
        ))}
        <polyline
          points={conValor.map((p) => `${x(p.i)},${y(p.valor!)}`).join(" ")}
          fill="none"
          stroke="var(--tinta)"
          strokeWidth={2}
        />
        {conValor.map((p) => (
          <circle
            key={p.i}
            cx={x(p.i)}
            cy={y(p.valor!)}
            r={p.i === (elegido ?? ultimo?.i) ? 6 : 4.5}
            fill={p.valor! <= 2.5 ? "var(--azul)" : p.valor! < 3.5 ? "var(--amarillo)" : "var(--rojo)"}
            stroke="var(--superficie)"
            strokeWidth={2}
          />
        ))}
        {puntos.map((p, i) => (
          <rect
            key={i}
            x={x(i) - W / puntos.length / 2}
            y={0}
            width={W / puntos.length}
            height={H}
            fill="transparent"
            onPointerEnter={() => setElegido(i)}
            onClick={() => setElegido(i)}
          >
            <title>{p.valor === null ? `${p.detalle}: sin valoraciones` : `${p.detalle}: ${p.valor.toFixed(1)}`}</title>
          </rect>
        ))}
      </svg>
      <div className="flex justify-between text-[0.6rem] text-tinta-suave" aria-hidden>
        <span>{puntos[0]?.etiqueta}</span>
        <span>{puntos.at(-1)?.etiqueta}</span>
      </div>
    </figure>
  );
}

/** Tabla equivalente a un gráfico (para lectores de pantalla y para ver los números exactos). */
export function TablaDatos({ titulo, filas }: { titulo: string; filas: [string, string][] }) {
  return (
    <details className="mt-3 text-sm">
      <summary className="etiqueta cursor-pointer text-tinta-suave">Ver como tabla</summary>
      <table className="mt-2 w-full">
        <caption className="sr-only">{titulo}</caption>
        <tbody>
          {filas.map(([a, b]) => (
            <tr key={a} className="border-b border-hundido">
              <td className="py-1">{a}</td>
              <td className="py-1 text-right font-semibold tabular-nums">{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}

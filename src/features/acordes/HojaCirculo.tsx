"use client";

import { useState } from "react";
import { CIRCULO, escalaPentagrama, notasArmadura } from "@/lib/teoria/circulo";
import { textoNota } from "@/lib/teoria/notas";
import { Hoja } from "@/ui/Hoja";
import { NombreNota } from "@/ui/NombreNota";
import { NombreEnSvg, Pentagrama } from "./Pentagrama";

type Seleccion = { i: number; modo: "mayor" | "menor" };

const C = 200;
const R_AFUERA = [132, 192];
const R_ADENTRO = [80, 128];

function arco(r1: number, r2: number, a1: number, a2: number) {
  const p = (r: number, a: number) => `${C + r * Math.cos(a)},${C + r * Math.sin(a)}`;
  return `M${p(r1, a1)}L${p(r2, a1)}A${r2},${r2},0,0,1,${p(r2, a2)}L${p(r1, a2)}A${r1},${r1},0,0,0,${p(r1, a1)}Z`;
}
const rad = (g: number) => (g * Math.PI) / 180;

// Mayores en rojo, menores en azul.
const COLOR = { mayor: "var(--rojo)", menor: "var(--azul)" };

export function HojaCirculo({ abierta, onCerrar }: { abierta: boolean; onCerrar: () => void }) {
  const [sel, setSel] = useState<Seleccion | null>(null);

  return (
    <Hoja abierta={abierta} onCerrar={onCerrar} titulo="Círculo de quintas">
      <svg viewBox="0 0 400 400" className="mx-auto block w-full max-w-[380px]" role="group" aria-label="Círculo de quintas">
        {CIRCULO.map((s, i) => {
          const a1 = rad(-105 + i * 30 + 1.6);
          const a2 = rad(-105 + (i + 1) * 30 - 1.6);
          const am = rad(-90 + i * 30);
          const anillos = [
            { modo: "mayor" as const, r: R_AFUERA, nota: s.mayor, sufijo: "", tam: 17 },
            { modo: "menor" as const, r: R_ADENTRO, nota: s.menor, sufijo: "m", tam: 12.5 },
          ];
          return anillos.map(({ modo, r, nota, sufijo, tam }) => {
            const activo = sel?.i === i && sel.modo === modo;
            const rm = (r[0] + r[1]) / 2;
            const x = C + rm * Math.cos(am);
            const y = C + rm * Math.sin(am);
            return (
              <g
                key={`${modo}${i}`}
                role="button"
                tabIndex={0}
                aria-label={`${textoNota(nota, "letras")} ${modo}`}
                aria-pressed={activo}
                onClick={() => setSel({ i, modo })}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSel({ i, modo })}
                className="cursor-pointer outline-none"
              >
                <path
                  d={arco(r[0], r[1], a1, a2)}
                  fill={activo ? "var(--tinta)" : COLOR[modo]}
                  stroke={activo ? "var(--tinta)" : "none"}
                  strokeWidth={3}
                  className="transition-[filter] hover:brightness-110"
                />
                <text
                  x={x}
                  y={y - (modo === "menor" ? 4 : 0)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={tam}
                  fontWeight={700}
                  fill={activo ? "var(--fondo)" : "var(--sobre-color)"}
                  style={{ pointerEvents: "none" }}
                >
                  <NombreEnSvg nota={nota} />
                  {sufijo}
                </text>
                {modo === "menor" && (
                  <text
                    x={x}
                    y={y + 9}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={8.5}
                    fill={activo ? "var(--fondo)" : "var(--sobre-color)"}
                    fillOpacity={0.8}
                    style={{ pointerEvents: "none" }}
                  >
                    {s.armadura === 0 ? "" : `${Math.abs(s.armadura)}`}
                    <tspan fontFamily="'Segoe UI Symbol','Noto Sans Symbols 2','Apple Symbols',sans-serif">
                      {s.armadura > 0 ? "♯" : s.armadura < 0 ? "♭" : ""}
                    </tspan>
                  </text>
                )}
              </g>
            );
          });
        })}
        <circle cx={C} cy={C} r={72} className="fill-tinta" />
        <text x={C} y={C} textAnchor="middle" dominantBaseline="central" fontSize={30} fontWeight={800} className="fill-[var(--fondo)]">
          5ª
        </text>
      </svg>

      {sel ? <DetalleTonalidad sel={sel} /> : (
        <p className="mt-3 text-center text-sm text-tinta-suave">
          Toca una tonalidad para ver su escala y su armadura. Afuera las mayores, adentro las menores.
        </p>
      )}
    </Hoja>
  );
}

function DetalleTonalidad({ sel }: { sel: Seleccion }) {
  const sector = CIRCULO[sel.i];
  const tonica = sel.modo === "mayor" ? sector.mayor : sector.menor;
  const armadura = notasArmadura(sector.armadura);
  const n = Math.abs(sector.armadura);
  const tipo = sector.armadura > 0 ? "sostenido" : "bemol";
  return (
    <div className="mt-4">
      <h3 className="titulo-bauhaus text-2xl">
        <NombreNota nota={tonica} /> {sel.modo}
        <span className="ml-2 text-base font-semibold tracking-normal text-tinta-suave normal-case">
          ({textoNota(tonica, "solfeo")} {sel.modo})
        </span>
      </h3>
      <p className="mt-1 text-sm text-tinta-suave">
        Armadura:{" "}
        {n === 0 ? (
          "sin alteraciones"
        ) : (
          <>
            {n} {tipo}
            {n > 1 ? (tipo === "sostenido" ? "s" : "es") : ""}:{" "}
            {armadura.map((nota, k) => (
              <span key={nota}>
                {k > 0 && " "}
                <NombreNota nota={nota} className="font-semibold text-tinta" />
              </span>
            ))}
          </>
        )}
        {sel.modo === "menor" && " · escala menor natural"}
      </p>
      <div className="mt-3 border-2 border-sutil bg-fondo px-1 py-2">
        <Pentagrama notas={escalaPentagrama(tonica, sel.modo)} armadura={sector.armadura} />
      </div>
    </div>
  );
}

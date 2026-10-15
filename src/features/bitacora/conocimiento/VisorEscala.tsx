"use client";

import { useState } from "react";
import {
  claseDeAltura,
  desplazamientoInstrumento,
  escribirEscala,
  formula,
  mejorTonica,
  nombreInstrumento,
  transponer,
} from "@/lib/teoria/notas";
import { cx } from "@/ui/cx";
import { NombreNota } from "@/ui/NombreNota";
import { useAjustes } from "../ajustes/ajustes";
import { Teclado } from "./Teclado";

const PCS = Array.from({ length: 12 }, (_, i) => i);

/**
 * Muestra una escala en cualquier tónica, en concierto o escrita para el instrumento.
 * La tónica elegida se guarda como sonido real: al cambiar de vista suena igual y solo cambia la escritura.
 */
export function VisorEscala({ grados }: { grados: string[] }) {
  const { notacion, instrumento, alteraciones } = useAjustes();
  const [pcConcierto, setPcConcierto] = useState(0);
  const [vista, setVista] = useState<"concierto" | "instrumento">(instrumento === "C" ? "concierto" : "instrumento");

  const transpone = instrumento !== "C" && vista === "instrumento";
  const pcVista = transpone ? transponer(pcConcierto, instrumento) : pcConcierto;
  const tonica = mejorTonica(pcVista, grados, alteraciones);
  const notas = escribirEscala(tonica, grados);
  const pasos = formula(grados);

  const elegir = (pc: number) =>
    setPcConcierto(transpone ? (pc - desplazamientoInstrumento(instrumento) + 12) % 12 : pc);

  return (
    <div className="space-y-5">
      {instrumento !== "C" && (
        <div role="radiogroup" aria-label="Vista" className="grid grid-cols-2 border-[3px] border-linea">
          {(["concierto", "instrumento"] as const).map((v) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={vista === v}
              onClick={() => setVista(v)}
              className={cx(
                "etiqueta h-12 border-linea first:border-r-[3px]",
                vista === v ? "bg-tinta text-fondo" : "bg-superficie",
              )}
            >
              {v === "concierto" ? "Concierto" : nombreInstrumento(instrumento)}
            </button>
          ))}
        </div>
      )}

      <div>
        <p className="etiqueta mb-2 text-tinta-suave">Tónica</p>
        <div className="grid grid-cols-6 gap-1.5">
          {PCS.map((pc) => {
            const nombre = mejorTonica(pc, grados, alteraciones);
            return (
              <button
                key={pc}
                type="button"
                aria-pressed={pc === pcVista}
                onClick={() => elegir(pc)}
                className={cx(
                  "h-11 border-2 border-linea text-[0.95rem] font-semibold",
                  pc === pcVista ? "bg-rojo text-sobre-color" : "bg-superficie",
                )}
              >
                <NombreNota nota={nombre} notacion={notacion} />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="etiqueta mb-2 text-tinta-suave">
          Notas{transpone ? ` · escritas para ${nombreInstrumento(instrumento).toLowerCase()}` : " · en concierto"}
        </p>
        <ol className="flex flex-wrap gap-1.5">
          {notas.map((n, i) => (
            <li key={i} className="flex flex-col items-center">
              <span
                className={cx(
                  "flex size-12 items-center justify-center text-lg font-bold",
                  i === 0 ? "rounded-full border-[3px] border-linea bg-rojo text-sobre-color" : "border-[3px] border-linea bg-superficie",
                )}
              >
                <NombreNota nota={n} notacion={notacion} />
              </span>
              <span className="mt-1 text-[0.7rem] font-semibold text-tinta-suave">{grados[i]}</span>
            </li>
          ))}
        </ol>
        <p className="mt-2 text-sm text-tinta-suave">
          Fórmula: <span className="font-semibold text-tinta">{pasos.join(" – ")}</span>
        </p>
      </div>

      <Teclado notas={new Set(notas.map((n) => claseDeAltura(n)))} tonica={pcVista} className="w-full" />
      {transpone && (
        <p className="text-xs text-tinta-suave">
          El teclado muestra las notas escritas. Suena igual que la escala de{" "}
          <NombreNota nota={mejorTonica(pcConcierto, grados, alteraciones)} notacion={notacion} /> en concierto.
        </p>
      )}
    </div>
  );
}

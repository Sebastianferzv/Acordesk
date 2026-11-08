"use client";

import { useState } from "react";
import { TONALIDADES } from "@/lib/teoria/acordes";
import { claseDeAltura, escribirEscala, formula } from "@/lib/teoria/notas";
import { cx } from "@/ui/cx";
import { NombreNota } from "@/ui/NombreNota";
import { useAjustes } from "../ajustes/ajustes";
import { Teclado } from "./Teclado";

/** Muestra una escala en cualquier tónica. Las teclas negras se nombran en bemoles: D♭ E♭ G♭ A♭ B♭. */
export function VisorEscala({ grados }: { grados: string[] }) {
  const { notacion } = useAjustes();
  const [tonica, setTonica] = useState<string>("C");
  const notas = escribirEscala(tonica, grados);
  const pasos = formula(grados);

  return (
    <div className="space-y-5">
      <div>
        <p className="etiqueta mb-2 text-tinta-suave">Tónica</p>
        <div className="grid grid-cols-6 gap-1.5">
          {TONALIDADES.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={t === tonica}
              onClick={() => setTonica(t)}
              className={cx(
                "h-11 border-2 border-sutil text-[0.95rem] font-semibold",
                t === tonica ? "bg-rojo text-sobre-color" : "bg-superficie",
              )}
            >
              <NombreNota nota={t} notacion={notacion} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="etiqueta mb-2 text-tinta-suave">Notas</p>
        <ol className="flex flex-wrap gap-1.5">
          {notas.map((n, i) => (
            <li key={i} className="flex flex-col items-center">
              <span
                className={cx(
                  "flex size-12 items-center justify-center text-lg font-bold",
                  i === 0 ? "rounded-full border-2 border-sutil bg-rojo text-sobre-color" : "border-2 border-sutil bg-superficie",
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

      <Teclado notas={new Set(notas.map((n) => claseDeAltura(n)))} tonica={claseDeAltura(tonica)} className="w-full" />
    </div>
  );
}

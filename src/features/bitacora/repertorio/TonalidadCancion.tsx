"use client";

import { GRADOS_MAYOR, GRADOS_MENOR } from "@/lib/teoria/catalogo";
import { claseDeAltura, mejorTonica, nombreInstrumento, textoNota, transponer } from "@/lib/teoria/notas";
import { Campo, clasesEntrada } from "@/ui/Campos";
import { cx } from "@/ui/cx";
import { NombreNota } from "@/ui/NombreNota";
import { useAjustes } from "../ajustes/ajustes";

const PCS = Array.from({ length: 12 }, (_, i) => i);

/** Divide "Bbm" en tónica y modo. */
export function leerTonalidad(tonalidad: string) {
  const menor = tonalidad.endsWith("m");
  return { tonica: menor ? tonalidad.slice(0, -1) : tonalidad, menor };
}

interface Props {
  tonalidad: string | undefined;
  onCambiar: (tonalidad: string | undefined) => void;
}

/** Tonalidad en concierto, con su versión escrita para el instrumento elegido en Ajustes. */
export function TonalidadCancion({ tonalidad, onCambiar }: Props) {
  const { notacion, instrumento, alteraciones } = useAjustes();
  const opcion = (pc: number, menor: boolean) => mejorTonica(pc, menor ? GRADOS_MENOR : GRADOS_MAYOR, alteraciones) + (menor ? "m" : "");

  let escrita: { tonica: string; menor: boolean } | null = null;
  if (tonalidad && instrumento !== "C") {
    const { tonica, menor } = leerTonalidad(tonalidad);
    const pc = transponer(claseDeAltura(tonica), instrumento);
    escrita = { tonica: mejorTonica(pc, menor ? GRADOS_MENOR : GRADOS_MAYOR, alteraciones), menor };
  }

  return (
    <div>
      <Campo etiqueta="Tonalidad (en concierto)">
        <select
          value={tonalidad ?? ""}
          onChange={(e) => onCambiar(e.target.value || undefined)}
          className={cx(clasesEntrada, "h-12")}
        >
          <option value="">Sin indicar</option>
          <optgroup label="Mayores">
            {PCS.map((pc) => {
              const v = opcion(pc, false);
              return (
                <option key={v} value={v}>
                  {textoNota(v, notacion)} mayor
                </option>
              );
            })}
          </optgroup>
          <optgroup label="Menores">
            {PCS.map((pc) => {
              const v = opcion(pc, true);
              return (
                <option key={v} value={v}>
                  {textoNota(v.slice(0, -1), notacion)} menor
                </option>
              );
            })}
          </optgroup>
        </select>
      </Campo>
      {escrita && (
        <p className="mt-2 text-sm">
          Para {nombreInstrumento(instrumento).toLowerCase()}:{" "}
          <strong>
            <NombreNota nota={escrita.tonica} notacion={notacion} /> {escrita.menor ? "menor" : "mayor"}
          </strong>
        </p>
      )}
    </div>
  );
}

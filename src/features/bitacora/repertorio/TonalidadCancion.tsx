"use client";

import { TONALIDADES, TONALIDADES_MENORES } from "@/lib/teoria/acordes";
import { textoNota } from "@/lib/teoria/notas";
import { Campo, clasesEntrada } from "@/ui/Campos";
import { cx } from "@/ui/cx";
import { useAjustes } from "../ajustes/ajustes";

/** Divide "Bbm" en tónica y modo. */
export function leerTonalidad(tonalidad: string) {
  const menor = tonalidad.endsWith("m");
  return { tonica: menor ? tonalidad.slice(0, -1) : tonalidad, menor };
}

interface Props {
  tonalidad: string | undefined;
  onCambiar: (tonalidad: string | undefined) => void;
}

/** Tonalidad de la canción, en concierto. */
export function TonalidadCancion({ tonalidad, onCambiar }: Props) {
  const { notacion } = useAjustes();

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
            {TONALIDADES.map((v) => (
              <option key={v} value={v}>
                {textoNota(v, notacion)} mayor
              </option>
            ))}
          </optgroup>
          <optgroup label="Menores">
            {TONALIDADES_MENORES.map((v) => (
              <option key={v} value={v}>
                {textoNota(v.slice(0, -1), notacion)} menor
              </option>
            ))}
          </optgroup>
        </select>
      </Campo>
    </div>
  );
}

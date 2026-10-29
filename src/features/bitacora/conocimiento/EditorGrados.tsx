"use client";

import { GRADOS_CROMATICOS } from "@/lib/teoria/catalogo";
import { semitonosDeGrado } from "@/lib/teoria/notas";
import { cx } from "@/ui/cx";

/** Grilla de los 12 grados cromáticos para armar una escala propia. El 1 siempre está. */
export function EditorGrados({ grados, onCambiar }: { grados: string[]; onCambiar: (grados: string[]) => void }) {
  const alternar = (g: string) => {
    if (g === "1") return;
    const nuevos = grados.includes(g) ? grados.filter((x) => x !== g) : [...grados, g];
    onCambiar(nuevos.sort((a, b) => semitonosDeGrado(a) - semitonosDeGrado(b)));
  };
  return (
    <div className="grid grid-cols-6 gap-1.5" role="group" aria-label="Grados de la escala">
      {GRADOS_CROMATICOS.map((g) => {
        const activo = grados.includes(g);
        return (
          <button
            key={g}
            type="button"
            aria-pressed={activo}
            disabled={g === "1"}
            onClick={() => alternar(g)}
            className={cx(
              "h-11 border-2 border-sutil font-semibold disabled:opacity-100",
              activo ? (g === "1" ? "bg-rojo text-sobre-color" : "bg-azul text-sobre-color") : "bg-superficie",
            )}
          >
            {g.replace("b", "♭").replace("#", "♯")}
          </button>
        );
      })}
    </div>
  );
}

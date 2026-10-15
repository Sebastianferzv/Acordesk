"use client";

import { cx } from "./cx";
import { Forma } from "./Forma";
import { colorValoracion, palabraValoracion } from "./valoracion";

export type ValorValoracion = 1 | 2 | 3 | 4 | 5;

const VALORES: ValorValoracion[] = [1, 2, 3, 4, 5];

interface Props {
  valor?: number;
  /** Sin `onCambiar` se muestra en modo solo lectura. Tocar el valor actual lo borra. */
  onCambiar?: (valor: ValorValoracion | undefined) => void;
  tamano?: number;
  mostrarPalabra?: boolean;
  className?: string;
}

/** Valoración de 1 a 5 círculos; el color va del azul (flojo) al rojo (excelente). */
export function ValoracionFormas({ valor, onCambiar, tamano = 34, mostrarPalabra = true, className }: Props) {
  const color = valor ? colorValoracion(valor) : undefined;
  const relleno = (n: number) => (valor && n <= valor ? color : undefined);

  if (!onCambiar) {
    return (
      <span
        role="img"
        aria-label={valor ? `Valoración: ${valor} de 5` : "Sin valorar"}
        className={cx("inline-flex items-center gap-0.5", className)}
      >
        {VALORES.map((n) => (
          <Forma key={n} tipo="circulo" tamano={tamano} relleno={relleno(n)} grosor={2.5} />
        ))}
      </span>
    );
  }

  return (
    <div className={cx("flex items-center gap-3", className)}>
      <div role="radiogroup" aria-label="Valoración" className="flex items-center gap-1">
        {VALORES.map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={valor === n}
            aria-label={`${n} de 5: ${palabraValoracion(n)}`}
            onClick={() => onCambiar(valor === n ? undefined : n)}
            className="rounded-full p-0.5 transition-transform active:scale-90"
          >
            <Forma tipo="circulo" tamano={tamano} relleno={relleno(n)} />
          </button>
        ))}
      </div>
      {mostrarPalabra && (
        <span className="etiqueta text-tinta-suave">{valor ? palabraValoracion(valor) : "Sin valorar"}</span>
      )}
    </div>
  );
}

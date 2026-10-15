import Link from "next/link";
import type { ReactNode } from "react";
import { Forma, type ColorBauhaus, type TipoForma } from "./Forma";
import { IconoVolver } from "./Iconos";

interface Props {
  titulo: string;
  forma?: { tipo: TipoForma; color: ColorBauhaus | "multicolor" };
  /** Ruta a la que vuelve el botón ←. */
  volverA?: string;
  acciones?: ReactNode;
  subtitulo?: ReactNode;
}

/** Encabezado de las pantallas internas: forma de la sección, título grande y una regla gruesa. */
export function Encabezado({ titulo, forma, volverA, acciones, subtitulo }: Props) {
  return (
    <header className="px-4 pt-[calc(env(safe-area-inset-top)+1.25rem)]">
      <div className="flex items-end justify-between gap-3">
        <div className="flex min-w-0 items-end gap-3">
          {volverA && (
            <Link
              href={volverA}
              aria-label="Volver"
              className="inline-flex size-10 shrink-0 items-center justify-center border-[3px] border-linea bg-superficie"
            >
              <IconoVolver tamano={18} />
            </Link>
          )}
          {forma && (
            <Forma
              tipo={forma.tipo}
              relleno={forma.color}
              trazo={forma.tipo === "barras" ? "tinta" : "ninguno"}
              grosor={2}
              tamano={30}
              className="mb-0.5 shrink-0"
            />
          )}
          <h1 className="titulo-bauhaus truncate pt-[0.14em] text-[2.1rem] leading-[1.02]">{titulo}</h1>
        </div>
        {acciones && <div className="flex shrink-0 items-center gap-2">{acciones}</div>}
      </div>
      {subtitulo && <p className="etiqueta mt-2 text-tinta-suave">{subtitulo}</p>}
      <div className="mt-3 h-[3px] bg-linea" />
    </header>
  );
}

import Link from "next/link";
import { partesFecha } from "@/lib/fechas";
import { Forma } from "@/ui/Forma";
import { IconoAjustes } from "@/ui/Iconos";

/** Cabecera de la portada, a modo de afiche Bauhaus: título, fecha de hoy y acceso a Ajustes. */
export function CabeceraBitacora({ hoy, subtitulo }: { hoy: string | null; subtitulo: string }) {
  const f = hoy ? partesFecha(hoy) : null;
  return (
    <header className="px-4 pt-[calc(env(safe-area-inset-top)+1rem)]">
      <div className="flex border-[3px] border-linea bg-superficie">
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 p-4">
          <h1 className="titulo-bauhaus text-[clamp(2.1rem,10.5vw,3.3rem)]">
            Bitácora
            <br />
            de viaje
          </h1>
          <div className="flex items-center gap-1.5" aria-hidden>
            <Forma tipo="circulo" relleno="rojo" trazo="ninguno" tamano={16} />
            <Forma tipo="triangulo" relleno="amarillo" trazo="ninguno" tamano={16} />
            <Forma tipo="cuadrado" relleno="azul" trazo="ninguno" tamano={16} />
            <span className="etiqueta ml-2 text-[0.65rem] text-tinta-suave">{subtitulo}</span>
          </div>
        </div>
        <div className="flex w-[5.25rem] shrink-0 flex-col border-l-[3px] border-linea">
          <div className="h-10 border-b-[3px] border-linea bg-rojo" />
          <div className="flex flex-1 flex-col items-center justify-center px-1 py-2 text-center">
            {f && (
              <>
                <span className="etiqueta text-[0.65rem]">{f.diaSemana}</span>
                <span className="text-[2rem] leading-none font-extrabold">{f.dia}</span>
                <span className="etiqueta text-[0.65rem]">{f.mes}</span>
              </>
            )}
          </div>
          <Link
            href="/bitacora/ajustes"
            aria-label="Ajustes"
            className="flex h-11 items-center justify-center border-t-[3px] border-linea bg-amarillo text-sobre-amarillo"
          >
            <IconoAjustes tamano={20} />
          </Link>
        </div>
      </div>
    </header>
  );
}

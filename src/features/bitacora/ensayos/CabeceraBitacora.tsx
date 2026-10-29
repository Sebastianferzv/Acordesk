import Link from "next/link";
import { partesFecha } from "@/lib/fechas";
import { Forma } from "@/ui/Forma";
import { IconoAjustes } from "@/ui/Iconos";

/** Cabecera de la portada: fecha de hoy, acceso a Ajustes y el título con las tres formas. */
export function CabeceraBitacora({ hoy }: { hoy: string | null }) {
  const f = hoy ? partesFecha(hoy) : null;
  return (
    <header className="px-5 pt-5">
      <div className="flex items-center justify-between">
        <p className="etiqueta text-tinta-suave">{f ? `${f.diaSemana} ${f.dia} ${f.mes}` : " "}</p>
        <Link
          href="/bitacora/ajustes"
          aria-label="Ajustes"
          className="-mr-2 inline-flex size-10 items-center justify-center rounded-full text-tinta-suave active:bg-hundido"
        >
          <IconoAjustes tamano={20} />
        </Link>
      </div>
      <div className="mt-6 flex items-end justify-between gap-4">
        <h1 className="titulo-bauhaus text-[clamp(2.4rem,12vw,3.4rem)]">
          Bitácora
          <br />
          de ensayos
        </h1>
        <div className="mb-1.5 flex shrink-0 flex-col items-center gap-1.5" aria-hidden>
          <Forma tipo="circulo" relleno="rojo" trazo="ninguno" tamano={18} />
          <Forma tipo="triangulo" relleno="amarillo" trazo="ninguno" tamano={18} />
          <Forma tipo="cuadrado" relleno="azul" trazo="ninguno" tamano={18} />
        </div>
      </div>
      <div className="mt-5 border-b-2 border-sutil" />
    </header>
  );
}

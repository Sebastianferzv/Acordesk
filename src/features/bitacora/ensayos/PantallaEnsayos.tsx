"use client";

import { useHoy } from "@/lib/useHoy";
import { EstadoVacio } from "@/ui/EstadoVacio";
import { Forma } from "@/ui/Forma";
import { useEnsayos } from "../datos/hooks";
import type { Ensayo } from "../datos/tipos";
import { formatoDuracion, rachaActual, resumenSemana } from "../estadisticas/calculos";
import { CabeceraBitacora } from "./CabeceraBitacora";
import { FilaEnsayo } from "./FilaEnsayo";

export function PantallaEnsayos() {
  const hoy = useHoy();
  const ensayos = useEnsayos();

  return (
    <>
      <CabeceraBitacora hoy={hoy} />
      <div className="px-4 pt-4">
        <Resumen ensayos={ensayos ?? []} hoy={hoy} />
      </div>
      <section className="px-4 pt-7" aria-labelledby="titulo-ensayos">
        <h2 id="titulo-ensayos" className="etiqueta mb-2 flex items-center gap-2">
          <Forma tipo="cuadrado" relleno="azul" trazo="ninguno" tamano={14} />
          Ensayos
        </h2>
        {ensayos === undefined ? null : ensayos.length === 0 ? (
          <EstadoVacio titulo="Tu bitácora está en blanco">
            Toca el círculo rojo de abajo para registrar tu primer ensayo.
          </EstadoVacio>
        ) : (
          <div className="border-[3px] border-linea">
            {ensayos.map((e) => (
              <FilaEnsayo key={e.id} ensayo={e} href={`/bitacora/ensayo?id=${e.id}`} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function Resumen({ ensayos, hoy }: { ensayos: Ensayo[]; hoy: string | null }) {
  const racha = hoy ? rachaActual(ensayos.map((e) => e.fecha), hoy) : 0;
  const semana = hoy ? resumenSemana(ensayos, hoy) : { ensayos: 0, minutos: 0 };
  return (
    <div className="grid grid-cols-2 border-[3px] border-linea">
      <div className="border-r-[3px] border-linea bg-amarillo p-3 text-sobre-amarillo">
        <p className="etiqueta">Racha</p>
        <p className="mt-2 text-[2.6rem] leading-none font-extrabold">{racha}</p>
        <p className="mt-1 text-sm font-medium">{racha === 1 ? "día seguido" : "días seguidos"}</p>
      </div>
      <div className="bg-azul p-3 text-sobre-color">
        <p className="etiqueta">Esta semana</p>
        <p className="mt-2 text-[2.6rem] leading-none font-extrabold">{formatoDuracion(semana.minutos)}</p>
        <p className="mt-1 text-sm font-medium">
          {semana.ensayos} {semana.ensayos === 1 ? "ensayo" : "ensayos"}
        </p>
      </div>
    </div>
  );
}

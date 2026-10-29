"use client";

import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { partesFecha } from "@/lib/fechas";
import { useHoy } from "@/lib/useHoy";
import { EstadoVacio } from "@/ui/EstadoVacio";
import { Forma } from "@/ui/Forma";
import { IconoFlecha } from "@/ui/Iconos";
import { useEnsayos, useGrabaciones } from "../datos/hooks";
import { diasDesdeUltimoRespaldo } from "../datos/respaldo";
import type { Ensayo } from "../datos/tipos";
import { formatoDuracion, rachaActual, resumenSemana } from "../estadisticas/calculos";
import { CabeceraBitacora } from "./CabeceraBitacora";
import { FilaEnsayo } from "./FilaEnsayo";

const DIAS_SIN_RESPALDO = 14;

export function PantallaEnsayos() {
  const hoy = useHoy();
  const ensayos = useEnsayos();
  const grabaciones = useGrabaciones() ?? [];
  const diasSinRespaldo = useLiveQuery(() => diasDesdeUltimoRespaldo(), []);

  const pedirRespaldo =
    ensayos !== undefined &&
    diasSinRespaldo !== undefined &&
    ensayos.length >= 5 &&
    (diasSinRespaldo === null || diasSinRespaldo > DIAS_SIN_RESPALDO);

  return (
    <>
      <CabeceraBitacora hoy={hoy} />
      <div className="px-5 pt-6">
        <Resumen ensayos={ensayos ?? []} hoy={hoy} />
        {pedirRespaldo && (
          <Link
            href="/bitacora/ajustes"
            className="mt-3 flex items-center justify-between gap-3 border-2 border-sutil bg-superficie px-4 py-3.5 text-[0.95rem]"
          >
            <span className="flex items-center gap-2">
              <Forma tipo="triangulo" relleno="rojo" trazo="ninguno" tamano={12} />
              Haz un respaldo de tus datos
            </span>
            <IconoFlecha tamano={16} className="text-tinta-suave" />
          </Link>
        )}
        {grabaciones.length > 0 && (
          <Link
            href="/bitacora/grabaciones"
            className="mt-3 flex items-center justify-between gap-3 border-2 border-sutil bg-superficie px-4 py-3.5 text-[0.95rem]"
          >
            <span className="flex items-center gap-2">
              <Forma tipo="circulo" relleno="rojo" trazo="ninguno" tamano={12} />
              Grabaciones · {grabaciones.length}
            </span>
            <IconoFlecha tamano={16} className="text-tinta-suave" />
          </Link>
        )}
      </div>
      <section className="px-5 pt-10" aria-labelledby="titulo-ensayos">
        <h2 id="titulo-ensayos" className="titulo-bauhaus mb-4 text-[1.4rem]">
          Ensayos
        </h2>
        {ensayos === undefined ? null : ensayos.length === 0 ? (
          <EstadoVacio titulo="Tu bitácora está en blanco">
            Toca el círculo rojo de abajo para registrar tu primer ensayo.
          </EstadoVacio>
        ) : (
          <ListaPorMes ensayos={ensayos} />
        )}
      </section>
    </>
  );
}

function ListaPorMes({ ensayos }: { ensayos: Ensayo[] }) {
  const grupos: { mes: string; ensayos: Ensayo[] }[] = [];
  for (const e of ensayos) {
    const mes = e.fecha.slice(0, 7);
    if (grupos.at(-1)?.mes !== mes) grupos.push({ mes, ensayos: [] });
    grupos.at(-1)!.ensayos.push(e);
  }
  return (
    <div className="space-y-8">
      {grupos.map((g) => {
        const f = partesFecha(`${g.mes}-01`);
        const minutos = g.ensayos.reduce((s, e) => s + (e.duracionMin ?? 0), 0);
        return (
          <div key={g.mes}>
            <p className="etiqueta mb-2 flex justify-between text-tinta-suave">
              <span>
                {f.mesLargo} {f.anio}
              </span>
              <span>{minutos > 0 ? formatoDuracion(minutos) : ""}</span>
            </p>
            <div className="border-2 border-sutil bg-superficie">
              {g.ensayos.map((e) => (
                <FilaEnsayo key={e.id} ensayo={e} href={`/bitacora/ensayo?id=${e.id}`} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Resumen({ ensayos, hoy }: { ensayos: Ensayo[]; hoy: string | null }) {
  const racha = hoy ? rachaActual(ensayos.map((e) => e.fecha), hoy) : 0;
  const semana = hoy ? resumenSemana(ensayos, hoy) : { ensayos: 0, minutos: 0 };
  return (
    <div className="grid grid-cols-2 border-2 border-sutil bg-superficie">
      <div className="p-4">
        <p className="etiqueta flex items-center gap-2 text-tinta-suave">
          <Forma tipo="circulo" relleno="amarillo" trazo="ninguno" tamano={10} />
          Racha
        </p>
        <p className="mt-3 text-[2.75rem] leading-none font-bold tabular-nums">{racha}</p>
        <p className="mt-1.5 text-sm text-tinta-suave">{racha === 1 ? "día seguido" : "días seguidos"}</p>
      </div>
      <div className="border-l-2 border-sutil p-4">
        <p className="etiqueta flex items-center gap-2 text-tinta-suave">
          <Forma tipo="cuadrado" relleno="azul" trazo="ninguno" tamano={10} />
          Esta semana
        </p>
        <p className="mt-3 text-[2.75rem] leading-none font-bold whitespace-nowrap tabular-nums">{formatoDuracion(semana.minutos)}</p>
        <p className="mt-1.5 text-sm text-tinta-suave">
          {semana.ensayos} {semana.ensayos === 1 ? "ensayo" : "ensayos"}
        </p>
      </div>
    </div>
  );
}

"use client";

import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { partesFecha } from "@/lib/fechas";
import { useHoy } from "@/lib/useHoy";
import { nombreInstrumento } from "@/lib/teoria/notas";
import { EstadoVacio } from "@/ui/EstadoVacio";
import { Forma } from "@/ui/Forma";
import { IconoFlecha } from "@/ui/Iconos";
import { useAjustes } from "../ajustes/ajustes";
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
  const { instrumento } = useAjustes();
  const diasSinRespaldo = useLiveQuery(() => diasDesdeUltimoRespaldo(), []);

  const pedirRespaldo =
    ensayos !== undefined &&
    diasSinRespaldo !== undefined &&
    ensayos.length >= 5 &&
    (diasSinRespaldo === null || diasSinRespaldo > DIAS_SIN_RESPALDO);

  return (
    <>
      <CabeceraBitacora hoy={hoy} subtitulo={`Ensayos · ${nombreInstrumento(instrumento).toLowerCase()}`} />
      <div className="space-y-3 px-4 pt-4">
        <Resumen ensayos={ensayos ?? []} hoy={hoy} />
        {pedirRespaldo && (
          <Link
            href="/bitacora/ajustes"
            className="flex items-center justify-between gap-3 border-[3px] border-linea bg-superficie p-3 text-sm font-medium"
          >
            <span className="flex items-center gap-2">
              <Forma tipo="triangulo" relleno="rojo" trazo="ninguno" tamano={16} />
              Haz un respaldo de tus datos
            </span>
            <IconoFlecha tamano={16} />
          </Link>
        )}
        {grabaciones.length > 0 && (
          <Link
            href="/bitacora/grabaciones"
            className="flex items-center justify-between gap-3 border-[3px] border-linea bg-superficie p-3 text-sm font-medium"
          >
            <span className="flex items-center gap-2">
              <Forma tipo="circulo" relleno="rojo" trazo="ninguno" tamano={16} />
              Grabaciones · {grabaciones.length}
            </span>
            <IconoFlecha tamano={16} />
          </Link>
        )}
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
    <div className="space-y-5">
      {grupos.map((g) => {
        const f = partesFecha(`${g.mes}-01`);
        const minutos = g.ensayos.reduce((s, e) => s + (e.duracionMin ?? 0), 0);
        return (
          <div key={g.mes}>
            <p className="etiqueta mb-1.5 flex justify-between text-tinta-suave">
              <span>
                {f.mesLargo} {f.anio}
              </span>
              <span>{minutos > 0 ? formatoDuracion(minutos) : ""}</span>
            </p>
            <div className="border-[3px] border-linea">
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
    <div className="grid grid-cols-2 border-[3px] border-linea">
      <div className="border-r-[3px] border-linea bg-amarillo p-3 text-sobre-amarillo">
        <p className="etiqueta">Racha</p>
        <p className="mt-2 text-[2.6rem] leading-none font-extrabold">{racha}</p>
        <p className="mt-1 text-sm font-medium">{racha === 1 ? "día seguido" : "días seguidos"}</p>
      </div>
      <div className="bg-azul p-3 text-sobre-color">
        <p className="etiqueta">Esta semana</p>
        <p className="mt-2 text-[2.3rem] leading-none font-extrabold whitespace-nowrap">{formatoDuracion(semana.minutos)}</p>
        <p className="mt-1 text-sm font-medium">
          {semana.ensayos} {semana.ensayos === 1 ? "ensayo" : "ensayos"}
        </p>
      </div>
    </div>
  );
}

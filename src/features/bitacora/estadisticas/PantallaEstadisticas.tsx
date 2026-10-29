"use client";

import Link from "next/link";
import { useState } from "react";
import { partesFecha } from "@/lib/fechas";
import { useHoy } from "@/lib/useHoy";
import { Bloque } from "@/ui/Bloque";
import { cx } from "@/ui/cx";
import { Encabezado } from "@/ui/Encabezado";
import { EstadoVacio } from "@/ui/EstadoVacio";
import { useCanciones, useEnsayos } from "../datos/hooks";
import { MarcaEstado } from "../repertorio/estados";
import {
  formatoDuracion,
  formatoHoras,
  mejorRacha,
  minutosPorCancion,
  minutosPorMes,
  minutosPorSemana,
  rachaActual,
  sacadasPorMes,
  valoracionPorMes,
} from "./calculos";
import { GraficoBarras, GraficoValoracion, TablaDatos, type Punto } from "./Graficos";

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const nombreMes = (mes: string) => `${MESES[Number(mes.slice(5, 7)) - 1]} ${mes.slice(2, 4)}`;

export function PantallaEstadisticas() {
  const hoy = useHoy();
  const ensayos = useEnsayos();
  const canciones = useCanciones() ?? [];
  const [vista, setVista] = useState<"semanas" | "meses">("semanas");

  if (!hoy || ensayos === undefined) return <Encabezado titulo="Estadísticas" forma={{ tipo: "barras", color: "multicolor" }} />;

  if (ensayos.length === 0) {
    return (
      <>
        <Encabezado titulo="Estadísticas" forma={{ tipo: "barras", color: "multicolor" }} />
        <EstadoVacio titulo="Todavía no hay números">
          Registra algunos ensayos y aquí verás tus horas, rachas y canciones.
        </EstadoVacio>
      </>
    );
  }

  const fechas = ensayos.map((e) => e.fecha);
  const totalMin = ensayos.reduce((s, e) => s + (e.duracionMin ?? 0), 0);
  const valorados = ensayos.filter((e) => e.valoracion);
  const promedio = valorados.length ? valorados.reduce((s, e) => s + e.valoracion!, 0) / valorados.length : null;

  const periodos: Punto[] =
    vista === "semanas"
      ? minutosPorSemana(ensayos, hoy, 12).map((s) => {
          const f = partesFecha(s.inicio);
          return { etiqueta: `${f.dia}/${Number(s.inicio.slice(5, 7))}`, detalle: `Semana del ${f.dia} ${f.mes}`, valor: s.minutos };
        })
      : minutosPorMes(ensayos, hoy, 12).map((m) => ({ etiqueta: MESES[Number(m.inicio.slice(5, 7)) - 1], detalle: nombreMes(m.inicio), valor: m.minutos }));

  const porCancion = [...minutosPorCancion(ensayos)]
    .map(([id, min]) => ({ cancion: canciones.find((c) => c.id === id), min }))
    .filter((x) => x.cancion && x.min > 0)
    .sort((a, b) => b.min - a.min)
    .slice(0, 10);
  const maxCancion = Math.max(1, ...porCancion.map((x) => x.min));

  const valoracion: Punto[] = valoracionPorMes(ensayos, hoy, 12).map((v) => ({
    etiqueta: nombreMes(v.mes),
    detalle: nombreMes(v.mes),
    valor: v.promedio,
  }));
  const sacadas = sacadasPorMes(canciones, hoy, 12);

  return (
    <>
      <Encabezado titulo="Estadísticas" forma={{ tipo: "barras", color: "multicolor" }} />
      <div className="space-y-5 px-4 pt-5">
        <div className="grid grid-cols-2 border-2 border-sutil">
          <Cifra valor={formatoHoras(totalMin)} unidad="horas" etiqueta="En total" />
          <Cifra valor={String(ensayos.length)} unidad={ensayos.length === 1 ? "ensayo" : "ensayos"} etiqueta="Registrados" borde />
          <Cifra valor={String(rachaActual(fechas, hoy))} unidad={rachaActual(fechas, hoy) === 1 ? "día" : "días"} etiqueta="Racha actual" arriba />
          <Cifra valor={String(mejorRacha(fechas))} unidad={mejorRacha(fechas) === 1 ? "día" : "días"} etiqueta="Mejor racha" borde arriba />
        </div>

        <Bloque titulo="Tiempo de ensayo" acento={{ forma: "cuadrado", color: "azul" }}>
          <div className="p-4">
            <div role="radiogroup" aria-label="Agrupar por" className="mb-4 grid grid-cols-2 border-2 border-sutil">
              {(["semanas", "meses"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={vista === v}
                  onClick={() => setVista(v)}
                  className={cx("etiqueta h-10 border-sutil first:border-r-2", vista === v ? "bg-tinta text-fondo" : "bg-superficie")}
                >
                  {v === "semanas" ? "12 semanas" : "12 meses"}
                </button>
              ))}
            </div>
            <GraficoBarras
              key={vista}
              titulo={vista === "semanas" ? "Por semana" : "Por mes"}
              puntos={periodos}
              color="azul"
              formato={formatoDuracion}
              cadaEtiqueta={vista === "semanas" ? 3 : 2}
            />
            <TablaDatos titulo="Tiempo de ensayo" filas={periodos.map((p) => [p.detalle, formatoDuracion(p.valor ?? 0)])} />
          </div>
        </Bloque>

        <Bloque titulo="Horas por canción" acento={{ forma: "triangulo", color: "amarillo" }}>
          <div className="p-4">
            {porCancion.length === 0 ? (
              <p className="text-tinta-suave">Agrega canciones a tus ensayos para ver dónde va tu tiempo.</p>
            ) : (
              <ul className="space-y-2.5">
                {porCancion.map(({ cancion, min }) => (
                  <li key={cancion!.id}>
                    <Link href={`/bitacora/cancion?id=${cancion!.id}`} className="block">
                      <span className="mb-1 flex items-center justify-between gap-2 text-sm">
                        <span className="flex min-w-0 items-center gap-1.5 font-semibold">
                          <MarcaEstado estado={cancion!.estado} tamano={12} />
                          <span className="truncate">{cancion!.nombre}</span>
                        </span>
                        <span className="shrink-0 tabular-nums">{formatoDuracion(min)}</span>
                      </span>
                      <span className="block h-2.5 bg-hundido">
                        <span className="block h-full bg-rojo" style={{ width: `${(min / maxCancion) * 100}%` }} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-xs text-tinta-suave">
              Si un ensayo no detalla los minutos por canción, su duración se reparte en partes iguales.
            </p>
          </div>
        </Bloque>

        <Bloque titulo="Cómo van los ensayos" acento={{ forma: "circulo", color: "rojo" }}>
          <div className="space-y-5 p-4">
            {promedio !== null ? (
              <>
                <p className="text-sm text-tinta-suave">
                  Promedio general:{" "}
                  <strong className="text-tinta">{promedio.toLocaleString("es-CL", { maximumFractionDigits: 1 })} de 5</strong>
                </p>
                <GraficoValoracion puntos={valoracion} />
              </>
            ) : (
              <p className="text-tinta-suave">Valora tus ensayos para ver cómo evolucionan.</p>
            )}
            <GraficoBarras
              titulo="Canciones sacadas"
              puntos={sacadas.map((s) => ({ etiqueta: MESES[Number(s.mes.slice(5, 7)) - 1], detalle: nombreMes(s.mes), valor: s.cantidad }))}
              color="rojo"
              formato={(n) => `${n} ${n === 1 ? "canción" : "canciones"}`}
              cadaEtiqueta={2}
            />
          </div>
        </Bloque>
      </div>
    </>
  );
}

function Cifra({ valor, unidad, etiqueta, borde, arriba }: { valor: string; unidad: string; etiqueta: string; borde?: boolean; arriba?: boolean }) {
  return (
    <div className={cx("bg-superficie p-3", borde && "border-l-2 border-sutil", arriba && "border-t-2 border-sutil")}>
      <p className="etiqueta text-tinta-suave">{etiqueta}</p>
      <p className="mt-1.5 flex items-baseline gap-1.5">
        <span className="text-[2.2rem] leading-none font-extrabold">{valor}</span>
        <span className="text-sm font-medium">{unidad}</span>
      </p>
    </div>
  );
}

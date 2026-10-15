"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { partesFecha } from "@/lib/fechas";
import { useAviso } from "@/ui/Aviso";
import { EntradaRapida } from "@/ui/Campos";
import { Chip } from "@/ui/Chip";
import { Encabezado } from "@/ui/Encabezado";
import { EstadoVacio } from "@/ui/EstadoVacio";
import { useCanciones, useEnsayos } from "../datos/hooks";
import { canciones as repoCanciones } from "../datos/repositorio";
import type { EstadoCancion } from "../datos/tipos";
import { formatoDuracion, minutosPorCancion } from "../estadisticas/calculos";
import { ESTADOS, MarcaEstado } from "./estados";

export function PantallaRepertorio() {
  const router = useRouter();
  const avisar = useAviso();
  const canciones = useCanciones();
  const ensayos = useEnsayos() ?? [];
  const [filtro, setFiltro] = useState<EstadoCancion | "todas">("todas");

  const minutos = minutosPorCancion(ensayos);
  const ultimoEnsayo = new Map<string, string>();
  for (const e of ensayos) for (const i of e.items) if (!ultimoEnsayo.has(i.cancionId)) ultimoEnsayo.set(i.cancionId, e.fecha);

  const crear = async (nombre: string) => {
    const existente = canciones?.find((c) => c.nombre.toLocaleLowerCase("es") === nombre.toLocaleLowerCase("es"));
    if (existente) {
      avisar({ texto: "Esa canción ya está en tu repertorio." });
      return;
    }
    const c = await repoCanciones.crear({ nombre });
    avisar({ texto: `«${nombre}» agregada.`, accion: { etiqueta: "Abrir", alHacer: () => router.push(`/bitacora/cancion?id=${c.id}`) } });
  };

  const visibles = (canciones ?? []).filter((c) => filtro === "todas" || c.estado === filtro);
  const cuenta = (estado: EstadoCancion) => (canciones ?? []).filter((c) => c.estado === estado).length;

  return (
    <>
      <Encabezado titulo="Repertorio" forma={{ tipo: "triangulo", color: "amarillo" }} />
      <div className="space-y-4 px-4 pt-5">
        <EntradaRapida placeholder="Nueva canción" etiquetaBoton="Agregar canción" onAgregar={crear} />

        {canciones && canciones.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Chip seleccionado={filtro === "todas"} onClick={() => setFiltro("todas")}>
              Todas · {canciones.length}
            </Chip>
            {ESTADOS.map((e) => (
              <Chip key={e.valor} seleccionado={filtro === e.valor} onClick={() => setFiltro(e.valor)}>
                {e.etiqueta} · {cuenta(e.valor)}
              </Chip>
            ))}
          </div>
        )}

        {canciones === undefined ? null : canciones.length === 0 ? (
          <EstadoVacio titulo="Sin canciones todavía">
            Agrega las canciones que estás sacando, o créalas desde la ficha de un ensayo.
          </EstadoVacio>
        ) : visibles.length === 0 ? (
          <p className="py-6 text-center text-tinta-suave">No hay canciones con ese estado.</p>
        ) : (
          <ul className="border-[3px] border-linea">
            {visibles.map((c) => {
              const ultimo = ultimoEnsayo.get(c.id);
              const f = ultimo ? partesFecha(ultimo) : null;
              const min = minutos.get(c.id) ?? 0;
              return (
                <li key={c.id} className="border-b-[3px] border-linea last:border-b-0">
                  <Link href={`/bitacora/cancion?id=${c.id}`} className="flex items-center gap-3 bg-superficie p-3">
                    <MarcaEstado estado={c.estado} tamano={22} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[1.05rem] font-semibold">{c.nombre}</span>
                      <span className="block truncate text-xs text-tinta-suave">
                        {[c.artista, f ? `último ensayo ${f.dia} ${f.mes}` : "sin ensayos"].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-bold">{min > 0 ? formatoDuracion(min) : ""}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

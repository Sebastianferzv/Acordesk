"use client";

import { partesFecha } from "@/lib/fechas";
import { Encabezado } from "@/ui/Encabezado";
import { EstadoVacio } from "@/ui/EstadoVacio";
import { useCanciones, useEnsayos, useGrabaciones } from "../datos/hooks";
import { Grabador } from "./Grabador";
import { Reproductor } from "./Reproductor";

export function PantallaGrabaciones() {
  const grabaciones = useGrabaciones();
  const ensayos = new Map((useEnsayos() ?? []).map((e) => [e.id, e.fecha]));
  const canciones = new Map((useCanciones() ?? []).map((c) => [c.id, c.nombre]));

  const contexto = (ensayoId?: string, cancionId?: string) => {
    const partes: string[] = [];
    const fecha = ensayoId ? ensayos.get(ensayoId) : undefined;
    if (fecha) partes.push(`Ensayo del ${partesFecha(fecha).dia} ${partesFecha(fecha).mes}`);
    const cancion = cancionId ? canciones.get(cancionId) : undefined;
    if (cancion) partes.push(cancion);
    return partes.join(" · ") || "Toma suelta";
  };

  return (
    <>
      <Encabezado titulo="Grabaciones" forma={{ tipo: "circulo", color: "rojo" }} volverA="/bitacora" />
      <div className="space-y-3 px-4 pt-5">
        <Grabador />
        {grabaciones === undefined ? null : grabaciones.length === 0 ? (
          <EstadoVacio titulo="Sin grabaciones">
            Graba tomas sueltas aquí, o desde la ficha de un ensayo o de una canción para dejarlas asociadas.
          </EstadoVacio>
        ) : (
          grabaciones.map((g) => <Reproductor key={g.id} grabacion={g} contexto={contexto(g.ensayoId, g.cancionId)} />)
        )}
      </div>
    </>
  );
}

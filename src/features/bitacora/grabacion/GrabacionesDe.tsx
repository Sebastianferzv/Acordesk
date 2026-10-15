"use client";

import { Bloque } from "@/ui/Bloque";
import { useGrabaciones } from "../datos/hooks";
import { Grabador } from "./Grabador";
import { Reproductor } from "./Reproductor";

/** Grabaciones de un ensayo o de una canción, con botón para grabar una nueva. */
export function GrabacionesDe({ ensayoId, cancionId }: { ensayoId?: string; cancionId?: string }) {
  const todas = useGrabaciones() ?? [];
  const propias = todas.filter((g) => (ensayoId ? g.ensayoId === ensayoId : g.cancionId === cancionId));

  return (
    <Bloque titulo="Grabaciones" acento={{ forma: "circulo", color: "rojo" }}>
      <div className="space-y-2 p-4">
        <Grabador ensayoId={ensayoId} cancionId={cancionId} />
        {propias.map((g) => (
          <Reproductor key={g.id} grabacion={g} />
        ))}
      </div>
    </Bloque>
  );
}

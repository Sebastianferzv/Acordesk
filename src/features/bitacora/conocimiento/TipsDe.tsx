"use client";

import { useState } from "react";
import { Bloque } from "@/ui/Bloque";
import { EntradaRapida } from "@/ui/Campos";
import { useTips } from "../datos/hooks";
import { tips as repoTips } from "../datos/repositorio";
import type { Tip } from "../datos/tipos";
import { HojaTip, TarjetaTip, useReferencias } from "./Tips";

/** Tips asociados a una escala o a una canción, con alta rápida. */
export function TipsDe({ escalaId, cancionId }: { escalaId?: string; cancionId?: string }) {
  const todos = useTips() ?? [];
  const referencias = useReferencias();
  const [editando, setEditando] = useState<Tip | null>(null);
  const propios = todos.filter((t) => (escalaId ? t.escalaId === escalaId : t.cancionId === cancionId));

  return (
    <Bloque titulo="Tips" acento={{ forma: "semicirculo", color: "rojo" }}>
      <div className="space-y-2 p-4">
        {propios.map((t) => (
          <TarjetaTip key={t.id} tip={t} referencias={referencias} onEditar={() => setEditando(t)} />
        ))}
        <EntradaRapida
          placeholder="Nuevo tip"
          etiquetaBoton="Agregar tip"
          onAgregar={(texto) => void repoTips.crear({ texto, escalaId, cancionId })}
        />
      </div>
      <HojaTip tip={editando} abierta={editando !== null} onCerrar={() => setEditando(null)} referencias={referencias} />
    </Bloque>
  );
}

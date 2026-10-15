"use client";

import { useState } from "react";
import { Boton } from "@/ui/Boton";
import { clasesEntrada } from "@/ui/Campos";
import { Chip } from "@/ui/Chip";
import { cx } from "@/ui/cx";
import { EstadoVacio } from "@/ui/EstadoVacio";
import { useTips } from "../datos/hooks";
import type { Tip } from "../datos/tipos";
import { CATEGORIAS_TIP, EncabezadoConocimiento } from "./comun";
import { HojaTip, TarjetaTip, useReferencias } from "./Tips";

export function PantallaTips() {
  const tips = useTips();
  const referencias = useReferencias();
  const [categoria, setCategoria] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [hoja, setHoja] = useState<{ tip: Tip | null } | null>(null);

  const texto = busqueda.trim().toLocaleLowerCase("es");
  const visibles = (tips ?? [])
    .filter((t) => !categoria || t.categoria === categoria)
    .filter((t) => !texto || t.texto.toLocaleLowerCase("es").includes(texto));

  return (
    <>
      <EncabezadoConocimiento />
      <div className="space-y-4 px-4 pt-5">
        <Boton variante="rojo" anchoCompleto onClick={() => setHoja({ tip: null })}>
          Nuevo tip
        </Boton>

        {tips && tips.length > 0 && (
          <>
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar en tus tips"
              aria-label="Buscar en tus tips"
              className={cx(clasesEntrada, "h-12")}
            />
            <div className="flex flex-wrap gap-2">
              <Chip seleccionado={categoria === null} onClick={() => setCategoria(null)}>
                Todos
              </Chip>
              {CATEGORIAS_TIP.filter((c) => tips.some((t) => t.categoria === c)).map((c) => (
                <Chip key={c} seleccionado={categoria === c} onClick={() => setCategoria(categoria === c ? null : c)}>
                  {c}
                </Chip>
              ))}
            </div>
          </>
        )}

        {tips === undefined ? null : tips.length === 0 ? (
          <EstadoVacio titulo="Aún no tienes tips">
            Escríbelos aquí o pasa a conocimiento los aprendizajes de tus ensayos.
          </EstadoVacio>
        ) : visibles.length === 0 ? (
          <p className="py-6 text-center text-tinta-suave">No hay tips que coincidan.</p>
        ) : (
          <div className="space-y-2">
            {visibles.map((t) => (
              <TarjetaTip key={t.id} tip={t} referencias={referencias} onEditar={() => setHoja({ tip: t })} />
            ))}
          </div>
        )}
      </div>
      <HojaTip
        tip={hoja?.tip ?? null}
        abierta={hoja !== null}
        onCerrar={() => setHoja(null)}
        referencias={referencias}
        inicial={categoria ? { categoria } : undefined}
      />
    </>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { useAviso } from "@/ui/Aviso";
import { Bloque } from "@/ui/Bloque";
import { clasesEntrada, EntradaRapida } from "@/ui/Campos";
import { Chip } from "@/ui/Chip";
import { cx } from "@/ui/cx";
import { IconoCerrar, IconoMas } from "@/ui/Iconos";
import { useCanciones, useEnsayos } from "../datos/hooks";
import { canciones as repoCanciones, ensayos } from "../datos/repositorio";
import type { Cancion, Ensayo, ItemEnsayo } from "../datos/tipos";
import { cambiosDeEstado, MarcaEstado, SelectorEstado } from "../repertorio/estados";

/** Canciones ordenadas por la última vez que se ensayaron (las nunca ensayadas, al final). */
export function ordenarPorUso(canciones: Cancion[], ensayos: Ensayo[]): Cancion[] {
  const ultimoUso = new Map<string, string>();
  for (const e of ensayos) for (const i of e.items) if (!ultimoUso.has(i.cancionId)) ultimoUso.set(i.cancionId, e.fecha);
  return [...canciones].sort((a, b) => (ultimoUso.get(b.id) ?? "").localeCompare(ultimoUso.get(a.id) ?? ""));
}

export function SeccionCanciones({ ensayo }: { ensayo: Ensayo }) {
  const avisar = useAviso();
  const canciones = useCanciones() ?? [];
  const todos = useEnsayos() ?? [];
  const [filtro, setFiltro] = useState("");
  const porId = new Map(canciones.map((c) => [c.id, c]));

  const guardarItems = (items: ItemEnsayo[]) => void ensayos.actualizar(ensayo.id, { items });
  const agregar = (cancionId: string) => {
    if (!ensayo.items.some((i) => i.cancionId === cancionId)) guardarItems([...ensayo.items, { cancionId }]);
  };

  const crearYAgregar = async (nombre: string) => {
    const existente = canciones.find((c) => c.nombre.toLocaleLowerCase("es") === nombre.toLocaleLowerCase("es"));
    const cancion = existente ?? (await repoCanciones.crear({ nombre }));
    agregar(cancion.id);
    setFiltro("");
  };

  const quitar = (cancionId: string) => {
    const antes = ensayo.items;
    guardarItems(antes.filter((i) => i.cancionId !== cancionId));
    avisar({ texto: "Canción quitada del ensayo.", accion: { etiqueta: "Deshacer", alHacer: () => guardarItems(antes) } });
  };

  const textoFiltro = filtro.trim().toLocaleLowerCase("es");
  const disponibles = ordenarPorUso(canciones, todos)
    .filter((c) => !ensayo.items.some((i) => i.cancionId === c.id))
    .filter((c) => !textoFiltro || c.nombre.toLocaleLowerCase("es").includes(textoFiltro))
    .slice(0, 8);

  return (
    <Bloque titulo="Canciones" acento={{ forma: "triangulo", color: "amarillo" }}>
      <div className="space-y-3 p-4">
        {ensayo.items.map((item) => {
          const c = porId.get(item.cancionId);
          return (
            <div key={item.cancionId} className="space-y-2 border-2 border-sutil bg-fondo p-2.5">
              <div className="flex items-center gap-2">
                {c ? <MarcaEstado estado={c.estado} /> : null}
                {c ? (
                  <Link href={`/bitacora/cancion?id=${c.id}`} className="min-w-0 flex-1 truncate font-semibold">
                    {c.nombre}
                  </Link>
                ) : (
                  <span className="flex-1 text-tinta-suave italic">Canción eliminada</span>
                )}
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={item.minutos ?? ""}
                  placeholder="min"
                  aria-label={`Minutos dedicados a ${c?.nombre ?? "la canción"}`}
                  onChange={(e) => {
                    const n = Math.round(Number(e.target.value));
                    guardarItems(
                      ensayo.items.map((i) => (i.cancionId === item.cancionId ? { ...i, minutos: n > 0 ? n : undefined } : i)),
                    );
                  }}
                  className={cx(clasesEntrada, "h-10 w-20! shrink-0 border-2 px-2 text-sm")}
                />
                <button
                  type="button"
                  onClick={() => quitar(item.cancionId)}
                  aria-label={`Quitar ${c?.nombre ?? "canción"}`}
                  className="inline-flex size-10 shrink-0 items-center justify-center text-tinta-suave"
                >
                  <IconoCerrar tamano={14} />
                </button>
              </div>
              {c && (
                <SelectorEstado
                  compacto
                  estado={c.estado}
                  onCambiar={(estado) => void repoCanciones.actualizar(c.id, cambiosDeEstado(estado, ensayo.fecha))}
                />
              )}
            </div>
          );
        })}

        <EntradaRapida
          placeholder="Buscar o crear canción"
          etiquetaBoton="Crear y agregar canción"
          onEscribir={setFiltro}
          onAgregar={crearYAgregar}
        />
        {disponibles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {disponibles.map((c) => (
              <Chip key={c.id} onClick={() => agregar(c.id)}>
                <IconoMas tamano={11} />
                {c.nombre}
              </Chip>
            ))}
          </div>
        )}
        {ensayo.items.length > 1 && (
          <p className="text-xs text-tinta-suave">
            Los minutos por canción son opcionales: el tiempo sin asignar se reparte en partes iguales.
          </p>
        )}
      </div>
    </Bloque>
  );
}

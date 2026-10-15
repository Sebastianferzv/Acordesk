"use client";

import Link from "next/link";
import { useState } from "react";
import { partesFecha } from "@/lib/fechas";
import { useAviso } from "@/ui/Aviso";
import { Boton } from "@/ui/Boton";
import { Campo, clasesEntrada } from "@/ui/Campos";
import { Chip } from "@/ui/Chip";
import { cx } from "@/ui/cx";
import { Hoja } from "@/ui/Hoja";
import { useCanciones, useEnsayos, useEscalas } from "../datos/hooks";
import { tips } from "../datos/repositorio";
import type { Datos, Tip } from "../datos/tipos";
import { CATEGORIAS_TIP, nombreEscala } from "./comun";

/** Nombres de lo que un tip puede referenciar. */
export function useReferencias() {
  const escalas = useEscalas() ?? [];
  const canciones = useCanciones() ?? [];
  const ensayos = useEnsayos() ?? [];
  return {
    escalas,
    canciones,
    escala: new Map(escalas.map((e) => [e.id, nombreEscala(e)])),
    cancion: new Map(canciones.map((c) => [c.id, c.nombre])),
    fechaEnsayo: new Map(ensayos.map((e) => [e.id, e.fecha])),
  };
}

type Referencias = ReturnType<typeof useReferencias>;

export function TarjetaTip({ tip, referencias, onEditar }: { tip: Tip; referencias: Referencias; onEditar: () => void }) {
  const fecha = tip.origen ? referencias.fechaEnsayo.get(tip.origen.ensayoId) : undefined;
  const escala = tip.escalaId ? referencias.escala.get(tip.escalaId) : undefined;
  const cancion = tip.cancionId ? referencias.cancion.get(tip.cancionId) : undefined;
  return (
    <article className="border-[3px] border-linea bg-superficie">
      <button type="button" onClick={onEditar} className="block w-full p-3 text-left" aria-label="Editar tip">
        <p className="leading-snug whitespace-pre-line">{tip.texto}</p>
      </button>
      {(tip.categoria || escala || cancion || fecha) && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 border-t-2 border-linea px-3 py-2 text-xs">
          {tip.categoria && <span className="etiqueta text-[0.65rem]">{tip.categoria}</span>}
          {escala && (
            <Link href={`/bitacora/escala?id=${tip.escalaId}`} className="font-semibold text-rojo underline-offset-2 hover:underline">
              ◐ {escala}
            </Link>
          )}
          {cancion && (
            <Link href={`/bitacora/cancion?id=${tip.cancionId}`} className="font-semibold underline-offset-2 hover:underline">
              ▲ {cancion}
            </Link>
          )}
          {fecha && tip.origen && (
            <Link href={`/bitacora/ensayo?id=${tip.origen.ensayoId}`} className="text-tinta-suave underline-offset-2 hover:underline">
              Del ensayo del {partesFecha(fecha).dia} {partesFecha(fecha).mes}
            </Link>
          )}
        </div>
      )}
    </article>
  );
}

interface PropsHojaTip {
  /** El tip a editar; null = crear uno nuevo. */
  tip: Tip | null;
  abierta: boolean;
  onCerrar: () => void;
  referencias: Referencias;
  /** Valores iniciales al crear (por ejemplo, la escala desde la que se crea). */
  inicial?: Partial<Datos<Tip>>;
}

export function HojaTip({ tip, abierta, onCerrar, referencias, inicial }: PropsHojaTip) {
  return (
    <Hoja abierta={abierta} onCerrar={onCerrar} titulo={tip ? "Editar tip" : "Nuevo tip"}>
      {abierta && <FormularioTip key={tip?.id ?? "nuevo"} tip={tip} onListo={onCerrar} referencias={referencias} inicial={inicial} />}
    </Hoja>
  );
}

function FormularioTip({
  tip,
  onListo,
  referencias,
  inicial,
}: {
  tip: Tip | null;
  onListo: () => void;
  referencias: Referencias;
  inicial?: Partial<Datos<Tip>>;
}) {
  const avisar = useAviso();
  const [datos, setDatos] = useState<Partial<Datos<Tip>>>(tip ?? inicial ?? {});
  const cambiar = (c: Partial<Datos<Tip>>) => setDatos((d) => ({ ...d, ...c }));

  const guardar = async () => {
    const texto = datos.texto?.trim();
    if (!texto) return;
    const limpio = { ...datos, texto };
    if (tip) await tips.actualizar(tip.id, limpio);
    else await tips.crear(limpio);
    onListo();
  };

  const eliminar = async () => {
    if (!tip) return;
    await tips.borrar(tip.id);
    onListo();
    avisar({ texto: "Tip eliminado.", accion: { etiqueta: "Deshacer", alHacer: () => void tips.restaurar(tip.id) } });
  };

  return (
    <div className="max-h-[70dvh] space-y-4 overflow-y-auto pb-1">
      <textarea
        value={datos.texto ?? ""}
        onChange={(e) => cambiar({ texto: e.target.value })}
        placeholder="El tip, en tus palabras"
        aria-label="Texto del tip"
        rows={4}
        className={cx(clasesEntrada, "min-h-28 py-2.5 leading-snug")}
      />
      <div>
        <span className="etiqueta mb-1.5 block text-tinta-suave">Categoría</span>
        <div className="flex flex-wrap gap-2">
          {CATEGORIAS_TIP.map((c) => (
            <Chip
              key={c}
              seleccionado={datos.categoria === c}
              onClick={() => cambiar({ categoria: datos.categoria === c ? undefined : c })}
            >
              {c}
            </Chip>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Campo etiqueta="Escala">
          <select
            value={datos.escalaId ?? ""}
            onChange={(e) => cambiar({ escalaId: e.target.value || undefined })}
            className={cx(clasesEntrada, "h-12 px-2")}
          >
            <option value="">Ninguna</option>
            {referencias.escalas.map((e) => (
              <option key={e.id} value={e.id}>
                {nombreEscala(e)}
              </option>
            ))}
          </select>
        </Campo>
        <Campo etiqueta="Canción">
          <select
            value={datos.cancionId ?? ""}
            onChange={(e) => cambiar({ cancionId: e.target.value || undefined })}
            className={cx(clasesEntrada, "h-12 px-2")}
          >
            <option value="">Ninguna</option>
            {referencias.canciones.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </Campo>
      </div>
      <div className={cx("grid gap-2", tip ? "grid-cols-2" : "grid-cols-1")}>
        {tip && (
          <Boton variante="secundario" onClick={() => void eliminar()}>
            Eliminar
          </Boton>
        )}
        <Boton disabled={!datos.texto?.trim()} onClick={() => void guardar()}>
          Guardar
        </Boton>
      </div>
    </div>
  );
}

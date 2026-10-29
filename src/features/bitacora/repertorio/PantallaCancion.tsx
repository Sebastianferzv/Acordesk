"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useHoy } from "@/lib/useHoy";
import { useAviso } from "@/ui/Aviso";
import { Bloque } from "@/ui/Bloque";
import { Boton } from "@/ui/Boton";
import { Campo, CampoTexto } from "@/ui/Campos";
import { cx } from "@/ui/cx";
import { Encabezado } from "@/ui/Encabezado";
import { EstadoVacio } from "@/ui/EstadoVacio";
import { ListaEnlaces } from "../comun/ListaEnlaces";
import { TipsDe } from "../conocimiento/TipsDe";
import { useCancion, useEnsayos } from "../datos/hooks";
import { canciones } from "../datos/repositorio";
import type { Cancion, Datos } from "../datos/tipos";
import { FilaEnsayo } from "../ensayos/FilaEnsayo";
import { formatoDuracion, minutosPorCancion } from "../estadisticas/calculos";
import { GrabacionesDe } from "../grabacion/GrabacionesDe";
import { datosEstado, SelectorEstado, cambiosDeEstado } from "./estados";
import { TonalidadCancion } from "./TonalidadCancion";

export function PantallaCancion() {
  const id = useSearchParams().get("id");
  const cancion = useCancion(id);
  if (cancion === undefined) return null;
  if (cancion === null) {
    return (
      <>
        <Encabezado titulo="Canción" volverA="/bitacora/repertorio" />
        <EstadoVacio titulo="Esta canción no existe">
          Puede que la hayas eliminado. <Link href="/bitacora/repertorio" className="underline">Volver al repertorio</Link>
        </EstadoVacio>
      </>
    );
  }
  return <FichaCancion key={cancion.id} cancion={cancion} />;
}

function FichaCancion({ cancion }: { cancion: Cancion }) {
  const router = useRouter();
  const avisar = useAviso();
  const hoy = useHoy();
  const ensayos = useEnsayos() ?? [];

  const guardar = (cambios: Partial<Datos<Cancion>>) => void canciones.actualizar(cancion.id, cambios);
  const delaCancion = ensayos.filter((e) => e.items.some((i) => i.cancionId === cancion.id));
  const minutos = minutosPorCancion(delaCancion).get(cancion.id) ?? 0;

  const eliminar = async () => {
    await canciones.borrar(cancion.id);
    router.push("/bitacora/repertorio");
    avisar({
      texto: `«${cancion.nombre}» eliminada.`,
      accion: { etiqueta: "Deshacer", alHacer: () => void canciones.restaurar(cancion.id) },
    });
  };

  return (
    <>
      <Encabezado
        titulo={cancion.nombre}
        forma={{ tipo: "triangulo", color: datosEstado(cancion.estado).color }}
        volverA="/bitacora/repertorio"
        subtitulo={cancion.artista}
      />
      <div className="space-y-5 px-4 pt-5">
        <div className="grid grid-cols-3 border-2 border-sutil text-center">
          <Dato valor={minutos > 0 ? formatoDuracion(minutos) : "—"} etiqueta="Dedicado" />
          <Dato valor={String(delaCancion.length)} etiqueta={delaCancion.length === 1 ? "Ensayo" : "Ensayos"} borde />
          <Dato
            valor={cancion.estado === "sacada" && cancion.sacadaEn ? cancion.sacadaEn.slice(8, 10) + "/" + cancion.sacadaEn.slice(5, 7) : "—"}
            etiqueta="Sacada"
            borde
          />
        </div>

        <Bloque titulo="Estado" acento={{ forma: "triangulo", color: datosEstado(cancion.estado).color }}>
          <div className="p-4">
            <SelectorEstado estado={cancion.estado} onCambiar={(e) => hoy && guardar(cambiosDeEstado(e, hoy))} />
          </div>
        </Bloque>

        <Bloque titulo="Datos" acento={{ forma: "cuadrado", color: "azul" }}>
          <div className="space-y-4 p-4">
            <Campo etiqueta="Nombre">
              <CampoTexto valor={cancion.nombre} onGuardar={(t) => t && guardar({ nombre: t })} />
            </Campo>
            <Campo etiqueta="Artista o versión">
              <CampoTexto valor={cancion.artista} onGuardar={(t) => guardar({ artista: t || undefined })} placeholder="Opcional" />
            </Campo>
            <TonalidadCancion tonalidad={cancion.tonalidad} onCambiar={(tonalidad) => guardar({ tonalidad })} />
            <Campo etiqueta="Notas">
              <CampoTexto
                valor={cancion.notas}
                onGuardar={(t) => guardar({ notas: t || undefined })}
                multilinea
                placeholder="Forma, partes difíciles, digitaciones…"
              />
            </Campo>
          </div>
        </Bloque>

        <Bloque titulo="Links" acento={{ forma: "cuadrado", color: "azul" }}>
          <div className="p-4">
            <ListaEnlaces enlaces={cancion.links} onCambiar={(links) => guardar({ links })} />
          </div>
        </Bloque>

        <TipsDe cancionId={cancion.id} />
        <GrabacionesDe cancionId={cancion.id} />

        <Bloque titulo="Historial" acento={{ forma: "circulo", color: "rojo" }}>
          {delaCancion.length === 0 ? (
            <p className="p-4 text-tinta-suave">Todavía no aparece en ningún ensayo.</p>
          ) : (
            <div>
              {delaCancion.map((e) => (
                <FilaEnsayo key={e.id} ensayo={e} href={`/bitacora/ensayo?id=${e.id}`} />
              ))}
            </div>
          )}
        </Bloque>

        <div className="flex justify-end pt-2">
          <Boton variante="secundario" onClick={() => void eliminar()}>
            Eliminar canción
          </Boton>
        </div>
      </div>
    </>
  );
}

function Dato({ valor, etiqueta, borde }: { valor: string; etiqueta: string; borde?: boolean }) {
  return (
    <div className={cx("bg-superficie px-2 py-3", borde && "border-l-2 border-sutil")}>
      <p className="text-xl leading-none font-extrabold">{valor}</p>
      <p className="etiqueta mt-1.5 text-[0.65rem] text-tinta-suave">{etiqueta}</p>
    </div>
  );
}

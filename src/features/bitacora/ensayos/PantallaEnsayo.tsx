"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { fechaLarga } from "@/lib/fechas";
import { useAhora } from "@/lib/useAhora";
import { useAviso } from "@/ui/Aviso";
import { Bloque } from "@/ui/Bloque";
import { Boton, clasesBoton } from "@/ui/Boton";
import { Campo, CampoTexto, clasesEntrada } from "@/ui/Campos";
import { Chip } from "@/ui/Chip";
import { cx } from "@/ui/cx";
import { Encabezado } from "@/ui/Encabezado";
import { EstadoVacio } from "@/ui/EstadoVacio";
import { IconoFlecha } from "@/ui/Iconos";
import { ValoracionFormas } from "@/ui/ValoracionFormas";
import { useAjustes } from "../ajustes/ajustes";
import { ListaEnlaces } from "../comun/ListaEnlaces";
import { descartarCronometro, formatoReloj, tiempoTranscurrido } from "../datos/cronometro";
import { useCronometro, useEnsayo } from "../datos/hooks";
import { ensayos } from "../datos/repositorio";
import type { Datos, Ensayo } from "../datos/tipos";
import { GrabacionesDe } from "../grabacion/GrabacionesDe";
import { SeccionAprendizajes } from "./SeccionAprendizajes";
import { SeccionCanciones } from "./SeccionCanciones";

const DURACIONES = [15, 30, 45, 60, 90, 120];

export function PantallaEnsayo() {
  const id = useSearchParams().get("id");
  const ensayo = useEnsayo(id);

  if (ensayo === undefined) return null;
  if (ensayo === null) {
    return (
      <>
        <Encabezado titulo="Ensayo" volverA="/bitacora" />
        <EstadoVacio titulo="Este ensayo no existe">
          Puede que lo hayas eliminado. <Link href="/bitacora" className="underline">Volver a la bitácora</Link>
        </EstadoVacio>
      </>
    );
  }
  // La key reinicia los campos de texto si se cambia de ensayo.
  return <FichaEnsayo key={ensayo.id} ensayo={ensayo} />;
}

function FichaEnsayo({ ensayo }: { ensayo: Ensayo }) {
  const router = useRouter();
  const avisar = useAviso();
  const ajustes = useAjustes();
  const cronometro = useCronometro();
  const midiendo = cronometro?.ensayoId === ensayo.id;

  const guardar = (cambios: Partial<Datos<Ensayo>>) => void ensayos.actualizar(ensayo.id, cambios);

  const etiquetas = [...new Set([...ajustes.etiquetasRapidas, ...ensayo.etiquetas])];
  const alternarEtiqueta = (e: string) =>
    guardar({
      etiquetas: ensayo.etiquetas.includes(e) ? ensayo.etiquetas.filter((x) => x !== e) : [...ensayo.etiquetas, e],
    });

  const eliminar = async () => {
    if (midiendo) await descartarCronometro();
    else await ensayos.borrar(ensayo.id);
    router.push("/bitacora");
    avisar({
      texto: "Ensayo eliminado.",
      accion: { etiqueta: "Deshacer", alHacer: () => void ensayos.restaurar(ensayo.id) },
    });
  };

  return (
    <>
      <Encabezado titulo="Ensayo" volverA="/bitacora" subtitulo={fechaLarga(ensayo.fecha)} />
      <div className="space-y-5 px-4 pt-5">
        {midiendo && cronometro && <AvisoCronometro tramoDesde={cronometro.tramoDesde} acumuladoMs={cronometro.acumuladoMs} />}

        <Bloque titulo="Cuándo y cuánto" acento={{ forma: "circulo", color: "rojo" }}>
          <div className="space-y-4 p-4">
            <Campo etiqueta="Fecha">
              <input
                type="date"
                value={ensayo.fecha}
                onChange={(e) => e.target.value && guardar({ fecha: e.target.value })}
                className={cx(clasesEntrada, "h-12")}
              />
            </Campo>
            <div>
              <span className="etiqueta mb-1.5 block text-tinta-suave">Duración</span>
              <div className="flex flex-wrap gap-2">
                {DURACIONES.map((m) => (
                  <Chip
                    key={m}
                    seleccionado={ensayo.duracionMin === m}
                    onClick={() => guardar({ duracionMin: ensayo.duracionMin === m ? undefined : m })}
                  >
                    {m < 60 ? `${m} min` : m % 60 ? `${Math.floor(m / 60)} h ${m % 60}` : `${m / 60} h`}
                  </Chip>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={600}
                  value={ensayo.duracionMin ?? ""}
                  placeholder="Otro"
                  aria-label="Duración en minutos"
                  onChange={(e) => {
                    const n = Math.round(Number(e.target.value));
                    guardar({ duracionMin: n > 0 ? Math.min(n, 600) : undefined });
                  }}
                  className={cx(clasesEntrada, "h-11 w-28!")}
                />
                <span className="text-sm text-tinta-suave">minutos</span>
              </div>
            </div>
          </div>
        </Bloque>

        <Bloque titulo="Cómo estuvo" acento={{ forma: "circulo", color: "amarillo" }}>
          <div className="space-y-4 p-4">
            <ValoracionFormas valor={ensayo.valoracion} onCambiar={(v) => guardar({ valoracion: v })} />
            <div className="flex flex-wrap gap-2">
              {etiquetas.map((e) => (
                <Chip key={e} seleccionado={ensayo.etiquetas.includes(e)} onClick={() => alternarEtiqueta(e)}>
                  {e}
                </Chip>
              ))}
            </div>
          </div>
        </Bloque>

        <Bloque titulo="Minuta" acento={{ forma: "cuadrado", color: "azul" }}>
          <div className="space-y-3 p-4">
            <CampoTexto
              valor={ensayo.titulo}
              onGuardar={(t) => guardar({ titulo: t || undefined })}
              placeholder="¿De qué se trató?"
              etiquetaAccesible="Título"
            />
            <CampoTexto
              valor={ensayo.notas}
              onGuardar={(t) => guardar({ notas: t || undefined })}
              multilinea
              placeholder="Qué hicimos, qué salió bien, qué hay que mejorar…"
              etiquetaAccesible="Notas"
            />
          </div>
        </Bloque>

        <SeccionCanciones ensayo={ensayo} />
        <SeccionAprendizajes ensayo={ensayo} />

        <Bloque titulo="Links" acento={{ forma: "cuadrado", color: "azul" }}>
          <div className="p-4">
            <ListaEnlaces enlaces={ensayo.links} onCambiar={(links) => guardar({ links })} />
          </div>
        </Bloque>

        <GrabacionesDe ensayoId={ensayo.id} />

        <div className="flex items-center justify-between gap-3 pt-2">
          <p className="text-sm text-tinta-suave">Todo se guarda solo.</p>
          <Boton variante="secundario" onClick={() => void eliminar()}>
            Eliminar
          </Boton>
        </div>
      </div>
    </>
  );
}

function AvisoCronometro({ tramoDesde, acumuladoMs }: { tramoDesde: number | null; acumuladoMs: number }) {
  const ahora = useAhora(tramoDesde !== null);
  const ms = tiempoTranscurrido({ tramoDesde, acumuladoMs }, ahora);
  return (
    <Link href="/bitacora/cronometro" className={clasesBoton("rojo", true, "h-14 justify-between")}>
      <span>{tramoDesde === null ? "Cronómetro en pausa" : "Cronómetro en curso"}</span>
      <span className="flex items-center gap-2 text-base tabular-nums">
        {formatoReloj(ms)} <IconoFlecha tamano={16} />
      </span>
    </Link>
  );
}

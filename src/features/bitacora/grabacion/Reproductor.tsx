"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAviso } from "@/ui/Aviso";
import { BotonCircular } from "@/ui/BotonCircular";
import { IconoCerrar } from "@/ui/Iconos";
import { extensionAudio, obtenerAudio } from "../datos/audios";
import { formatoReloj } from "../datos/cronometro";
import { grabaciones } from "../datos/repositorio";
import type { Grabacion } from "../datos/tipos";

/** Reproductor con controles geométricos (▲ reproducir, ▮▮ pausa) y barra de avance. */
export function Reproductor({ grabacion, contexto }: { grabacion: Grabacion; contexto?: string }) {
  const avisar = useAviso();
  const audio = useLiveQuery(async () => (await obtenerAudio(grabacion.id)) ?? null, [grabacion.id]);
  const url = useMemo(() => (audio ? URL.createObjectURL(audio.blob) : null), [audio]);
  const elemento = useRef<HTMLAudioElement>(null);
  const [sonando, setSonando] = useState(false);
  const [posicion, setPosicion] = useState(0);

  useEffect(() => () => {
    if (url) URL.revokeObjectURL(url);
  }, [url]);

  const duracion = grabacion.duracionSeg; // el webm de Chrome informa una duración infinita
  const alternar = () => {
    const a = elemento.current;
    if (!a) return;
    if (a.paused) void a.play();
    else a.pause();
  };

  const compartir = async () => {
    if (!audio) return;
    const archivo = new File([audio.blob], `${grabacion.nombre ?? "grabacion"}.${extensionAudio(grabacion.tipoMime)}`, {
      type: grabacion.tipoMime,
    });
    if (navigator.canShare?.({ files: [archivo] })) {
      try {
        await navigator.share({ files: [archivo], title: grabacion.nombre });
        return;
      } catch (e) {
        if ((e as DOMException).name === "AbortError") return;
      }
    }
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(archivo);
    enlace.download = archivo.name;
    enlace.click();
    setTimeout(() => URL.revokeObjectURL(enlace.href), 1000);
  };

  const eliminar = async () => {
    await grabaciones.borrar(grabacion.id);
    avisar({ texto: "Grabación eliminada.", accion: { etiqueta: "Deshacer", alHacer: () => void grabaciones.restaurar(grabacion.id) } });
  };

  return (
    <div className="border-2 border-sutil bg-superficie p-2.5">
      <div className="flex items-center gap-3">
        <BotonCircular
          etiqueta={sonando ? "Pausar" : "Reproducir"}
          color={sonando ? "tinta" : "rojo"}
          tamano="sm"
          disabled={!url}
          onClick={alternar}
        >
          {sonando ? (
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
              <rect x="5" y="4" width="5" height="16" fill="currentColor" />
              <rect x="14" y="4" width="5" height="16" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
              <polygon points="6,3 21,12 6,21" fill="currentColor" />
            </svg>
          )}
        </BotonCircular>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{grabacion.nombre ?? "Grabación"}</p>
          {contexto && <p className="truncate text-xs text-tinta-suave">{contexto}</p>}
        </div>
        <span className="shrink-0 text-xs font-semibold tabular-nums text-tinta-suave">
          {formatoReloj(posicion * 1000)} / {formatoReloj(duracion * 1000)}
        </span>
        <button
          type="button"
          onClick={() => void eliminar()}
          aria-label="Eliminar grabación"
          className="inline-flex size-9 shrink-0 items-center justify-center text-tinta-suave"
        >
          <IconoCerrar tamano={13} />
        </button>
      </div>
      <input
        type="range"
        min={0}
        max={duracion}
        step={0.1}
        value={Math.min(posicion, duracion)}
        disabled={!url}
        aria-label="Avance"
        onChange={(e) => {
          const t = Number(e.target.value);
          if (elemento.current) elemento.current.currentTime = t;
          setPosicion(t);
        }}
        className="mt-2 h-2 w-full cursor-pointer appearance-none bg-hundido accent-rojo"
      />
      <div className="mt-1.5 flex justify-end gap-4">
        {audio === null ? (
          <span className="text-xs text-tinta-suave">El audio no está en este dispositivo.</span>
        ) : (
          <button type="button" onClick={() => void compartir()} className="etiqueta text-[0.65rem]">
            Compartir
          </button>
        )}
      </div>
      {url && (
        <audio
          ref={elemento}
          src={url}
          preload="metadata"
          onPlay={() => setSonando(true)}
          onPause={() => setSonando(false)}
          onEnded={() => {
            setSonando(false);
            setPosicion(0);
          }}
          onTimeUpdate={(e) => setPosicion(e.currentTarget.currentTime)}
        />
      )}
    </div>
  );
}

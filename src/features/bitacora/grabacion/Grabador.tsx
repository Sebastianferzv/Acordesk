"use client";

import { useAhora } from "@/lib/useAhora";
import { useAviso } from "@/ui/Aviso";
import { BotonCircular } from "@/ui/BotonCircular";
import { Forma } from "@/ui/Forma";
import { formatoReloj } from "../datos/cronometro";
import { guardarGrabacion } from "../datos/audios";
import { pedirPersistencia } from "../datos/persistencia";
import { useGrabador } from "./useGrabador";
import { Visualizador } from "./Visualizador";

const nombrePorDefecto = () =>
  `Toma ${new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}`;

/** Botón de grabar ● / detener ■ con tiempo y visualizador. */
export function Grabador({ ensayoId, cancionId }: { ensayoId?: string; cancionId?: string }) {
  const avisar = useAviso();
  const { estado, error, inicio, analizador, iniciar, detener } = useGrabador(async (r) => {
    await guardarGrabacion(r.blob, { ...r, ensayoId, cancionId, nombre: nombrePorDefecto() });
    avisar({ texto: `Grabación guardada (${formatoReloj(r.duracionSeg * 1000)}).` });
    void pedirPersistencia();
  });
  const ahora = useAhora(estado === "grabando");
  const grabando = estado === "grabando";

  return (
    <div className="border-[3px] border-linea bg-fondo p-3">
      <div className="flex items-center gap-4">
        {grabando ? (
          <BotonCircular etiqueta="Detener grabación" color="tinta" tamano="lg" onClick={detener}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
              <rect x="4" y="4" width="16" height="16" fill="currentColor" />
            </svg>
          </BotonCircular>
        ) : (
          <BotonCircular
            etiqueta="Grabar"
            color="superficie"
            tamano="lg"
            disabled={estado === "pidiendo"}
            onClick={() => void iniciar()}
          >
            <Forma tipo="circulo" relleno="rojo" trazo="ninguno" tamano={30} />
          </BotonCircular>
        )}
        <div className="min-w-0 flex-1">
          {grabando && inicio ? (
            <>
              <p className="etiqueta flex items-center gap-2 text-rojo">
                <span className="size-2.5 animate-latido rounded-full bg-rojo" /> Grabando
              </p>
              <p className="text-2xl font-extrabold tabular-nums">{formatoReloj(Math.max(0, ahora - inicio))}</p>
            </>
          ) : (
            <>
              <p className="font-semibold">{estado === "pidiendo" ? "Pidiendo el micrófono…" : "Grabar una toma"}</p>
              <p className="text-sm text-tinta-suave">El audio queda guardado en este dispositivo.</p>
            </>
          )}
        </div>
      </div>
      {grabando && analizador && (
        <div className="mt-3 border-t-2 border-linea pt-3">
          <Visualizador analizador={analizador} />
        </div>
      )}
      {error && <p className="mt-2 text-sm font-medium text-rojo">{error}</p>}
    </div>
  );
}

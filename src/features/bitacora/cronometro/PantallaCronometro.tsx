"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { fechaLocal } from "@/lib/fechas";
import { useAhora } from "@/lib/useAhora";
import { useAviso } from "@/ui/Aviso";
import { Boton, clasesBoton } from "@/ui/Boton";
import { BotonCircular } from "@/ui/BotonCircular";
import { Encabezado } from "@/ui/Encabezado";
import { EstadoVacio } from "@/ui/EstadoVacio";
import {
  descartarCronometro,
  formatoReloj,
  iniciarCronometro,
  pausarCronometro,
  reanudarCronometro,
  terminarCronometro,
  tiempoTranscurrido,
} from "../datos/cronometro";
import { db } from "../datos/db";
import { useCronometro } from "../datos/hooks";
import { pedirPersistencia } from "../datos/persistencia";
import { ensayos } from "../datos/repositorio";
import type { Cronometro } from "../datos/tipos";
import { formatoDuracion } from "../estadisticas/calculos";

const HORA = 3_600_000;

export function PantallaCronometro() {
  const router = useRouter();
  const cronometro = useCronometro();

  if (cronometro === undefined) return null;

  return (
    <>
      <Encabezado titulo="Cronómetro" volverA="/bitacora" />
      {cronometro === null ? (
        <EstadoVacio titulo="No hay un ensayo en curso">
          <Boton
            variante="rojo"
            className="mt-4"
            onClick={async () => {
              await iniciarCronometro(fechaLocal());
              void pedirPersistencia();
            }}
          >
            Iniciar cronómetro
          </Boton>
        </EstadoVacio>
      ) : (
        <Reloj cronometro={cronometro} onTerminado={(id) => router.push(`/bitacora/ensayo?id=${id}`)} />
      )}
    </>
  );
}

function Reloj({ cronometro, onTerminado }: { cronometro: Cronometro; onTerminado: (ensayoId: string) => void }) {
  const avisar = useAviso();
  const enPausa = cronometro.tramoDesde === null;
  const ahora = useAhora(!enPausa);
  const ms = tiempoTranscurrido(cronometro, ahora);

  const radio = 120;
  const circunferencia = 2 * Math.PI * radio;
  const avance = (ms % HORA) / HORA;
  const horas = Math.floor(ms / HORA);

  const terminar = async () => {
    const id = await terminarCronometro();
    if (!id) return;
    const ensayo = await ensayos.obtener(id);
    onTerminado(id);
    avisar({ texto: `Ensayo guardado: ${formatoDuracion(ensayo?.duracionMin ?? 0)}.` });
  };

  const descartar = async () => {
    const copia = { ...cronometro };
    await descartarCronometro();
    avisar({
      texto: "Medición descartada.",
      accion: {
        etiqueta: "Deshacer",
        alHacer: async () => {
          await ensayos.restaurar(copia.ensayoId);
          await db.cronometro.put(copia);
        },
      },
    });
  };

  return (
    <div className="flex flex-col items-center px-4 pt-6">
      <div className="relative w-full max-w-[19rem]">
        <svg viewBox="0 0 280 280" className="w-full" role="img" aria-label={`Tiempo: ${formatoReloj(ms)}`}>
          <circle cx="140" cy="140" r={radio} fill="var(--superficie)" stroke="var(--hundido)" strokeWidth="22" />
          <circle
            cx="140"
            cy="140"
            r={radio}
            fill="none"
            stroke={enPausa ? "var(--tinta-suave)" : "var(--rojo)"}
            strokeWidth="22"
            strokeDasharray={`${avance * circunferencia} ${circunferencia}`}
            transform="rotate(-90 140 140)"
          />
          <circle cx="140" cy="140" r={radio + 11} fill="none" stroke="var(--linea)" strokeWidth="3" />
          <circle cx="140" cy="140" r={radio - 11} fill="none" stroke="var(--linea)" strokeWidth="3" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[3.4rem] leading-none font-extrabold tabular-nums">{formatoReloj(ms)}</span>
          <span className="etiqueta mt-2 text-tinta-suave">{enPausa ? "En pausa" : "En curso"}</span>
          {horas > 0 && (
            <span className="mt-3 flex gap-1" aria-label={`${horas} horas completas`}>
              {Array.from({ length: Math.min(horas, 8) }, (_, i) => (
                <span key={i} className="size-3 bg-tinta" />
              ))}
            </span>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-start justify-center gap-10">
        <div className="flex flex-col items-center gap-2">
          {enPausa ? (
            <BotonCircular etiqueta="Reanudar" color="rojo" tamano="xl" onClick={() => void reanudarCronometro()}>
              <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden>
                <polygon points="7,3 21,12 7,21" fill="currentColor" />
              </svg>
            </BotonCircular>
          ) : (
            <BotonCircular etiqueta="Pausar" color="tinta" tamano="xl" onClick={() => void pausarCronometro()}>
              <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden>
                <rect x="5" y="4" width="5" height="16" fill="currentColor" />
                <rect x="14" y="4" width="5" height="16" fill="currentColor" />
              </svg>
            </BotonCircular>
          )}
          <span className="etiqueta">{enPausa ? "Reanudar" : "Pausar"}</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <BotonCircular etiqueta="Terminar" color="azul" tamano="xl" onClick={() => void terminar()}>
            <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
              <rect x="4" y="4" width="16" height="16" fill="currentColor" />
            </svg>
          </BotonCircular>
          <span className="etiqueta">Terminar</span>
        </div>
      </div>

      <div className="mt-10 grid w-full gap-2">
        <Link href={`/bitacora/ensayo?id=${cronometro.ensayoId}`} className={clasesBoton("secundario", true)}>
          Anotar mientras tanto
        </Link>
        <Boton variante="fantasma" anchoCompleto onClick={() => void descartar()}>
          Descartar medición
        </Boton>
      </div>
    </div>
  );
}

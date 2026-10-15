"use client";

import { useSerwist } from "@serwist/turbopack/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useAhora } from "@/lib/useAhora";
import { ProveedorAvisos, useAviso } from "@/ui/Aviso";
import { cx } from "@/ui/cx";
import { IconoFlecha } from "@/ui/Iconos";
import { useSeguirTema } from "@/ui/tema";
import { formatoReloj, tiempoTranscurrido } from "../datos/cronometro";
import { useCronometro } from "../datos/hooks";
import { pedirPersistencia } from "../datos/persistencia";
import type { Cronometro } from "../datos/tipos";
import { BarraNavegacion } from "./BarraNavegacion";
import { HojaEnsayar } from "./HojaEnsayar";

/** Estructura común del módulo: columna central, barra inferior, cronómetro y hoja "Ensayar". */
export function Marco({ children }: { children: ReactNode }) {
  const [hojaAbierta, setHojaAbierta] = useState(false);
  const cronometro = useCronometro() ?? null;
  const ruta = usePathname();
  const router = useRouter();
  useSeguirTema();

  const conMiniBarra = cronometro !== null && ruta !== "/bitacora/cronometro";

  return (
    <ProveedorAvisos>
      <div className="min-h-dvh bg-hundido">
        <div
          className={cx(
            "mx-auto min-h-dvh w-full max-w-[640px] bg-fondo sm:border-x-[3px] sm:border-linea",
            conMiniBarra ? "pb-[calc(9rem+env(safe-area-inset-bottom))]" : "pb-[calc(6.5rem+env(safe-area-inset-bottom))]",
          )}
        >
          {children}
        </div>
      </div>
      {conMiniBarra && <MiniBarra cronometro={cronometro} />}
      <BarraNavegacion
        cronometro={cronometro}
        onEnsayar={() => (cronometro ? router.push("/bitacora/cronometro") : setHojaAbierta(true))}
      />
      <HojaEnsayar abierta={hojaAbierta} onCerrar={() => setHojaAbierta(false)} />
      <EfectosGlobales />
    </ProveedorAvisos>
  );
}

function MiniBarra({ cronometro }: { cronometro: Cronometro }) {
  const enPausa = cronometro.tramoDesde === null;
  const ahora = useAhora(!enPausa);
  return (
    <div className="fixed inset-x-0 bottom-[calc(4rem+3px+env(safe-area-inset-bottom))] z-30">
      <Link
        href="/bitacora/cronometro"
        className="mx-auto flex h-10 max-w-[640px] items-center justify-between border-t-[3px] border-linea bg-rojo px-4 text-sobre-color sm:border-x-[3px]"
      >
        <span className="etiqueta flex items-center gap-2">
          <span className={cx("size-2.5 rounded-full bg-sobre-color", !enPausa && "animate-latido")} />
          {enPausa ? "En pausa" : "Ensayando"} · <span className="tabular-nums">{formatoReloj(tiempoTranscurrido(cronometro, ahora))}</span>
        </span>
        <span className="etiqueta flex items-center gap-1.5">
          Ver <IconoFlecha tamano={14} />
        </span>
      </Link>
    </div>
  );
}

/** Aviso de versión nueva (sin recargar sola) y pedido de almacenamiento persistente al instalar. */
function EfectosGlobales() {
  const { serwist } = useSerwist();
  const avisar = useAviso();

  useEffect(() => {
    if (!serwist) return;
    const alEsperar = () =>
      avisar({
        texto: "Hay una versión nueva de la app.",
        duracionMs: 60_000,
        accion: {
          etiqueta: "Actualizar",
          alHacer: () => {
            serwist.addEventListener("controlling", () => window.location.reload());
            serwist.messageSkipWaiting();
          },
        },
      });
    serwist.addEventListener("waiting", alEsperar);
    return () => serwist.removeEventListener("waiting", alEsperar);
  }, [serwist, avisar]);

  useEffect(() => {
    const alInstalar = () => void pedirPersistencia();
    window.addEventListener("appinstalled", alInstalar);
    return () => window.removeEventListener("appinstalled", alInstalar);
  }, []);

  return null;
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useAhora } from "@/lib/useAhora";
import { cx } from "@/ui/cx";
import { IconoFlecha } from "@/ui/Iconos";
import { formatoReloj, tiempoTranscurrido } from "../datos/cronometro";
import { useCronometro } from "../datos/hooks";
import type { Cronometro } from "../datos/tipos";
import { BarraNavegacion } from "./BarraNavegacion";
import { HojaEnsayar } from "./HojaEnsayar";

/** Estructura común del módulo: columna central, barra inferior, cronómetro y hoja "Ensayar". */
export function Marco({ children }: { children: ReactNode }) {
  const [hojaAbierta, setHojaAbierta] = useState(false);
  const cronometro = useCronometro() ?? null;
  const ruta = usePathname();
  const router = useRouter();

  const conMiniBarra = cronometro !== null && ruta !== "/bitacora/cronometro";

  return (
    <>
      <div className="bg-fondo">
        <div
          className={cx(
            "mx-auto min-h-[calc(100dvh-3rem)] w-full max-w-[640px] bg-fondo sm:border-x-2 sm:border-sutil",
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
    </>
  );
}

function MiniBarra({ cronometro }: { cronometro: Cronometro }) {
  const enPausa = cronometro.tramoDesde === null;
  const ahora = useAhora(!enPausa);
  return (
    <div className="fixed inset-x-0 bottom-[calc(4rem+2px+env(safe-area-inset-bottom))] z-30">
      <Link
        href="/bitacora/cronometro"
        className="mx-auto flex h-10 max-w-[640px] items-center justify-between bg-rojo px-5 text-sobre-color"
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

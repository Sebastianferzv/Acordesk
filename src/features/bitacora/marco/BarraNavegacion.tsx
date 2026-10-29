"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/ui/cx";
import { Forma, type ColorBauhaus, type TipoForma } from "@/ui/Forma";
import { IconoMas } from "@/ui/Iconos";
import { useAhora } from "@/lib/useAhora";
import { formatoReloj, tiempoTranscurrido } from "../datos/cronometro";
import type { Cronometro } from "../datos/tipos";

interface Pestana {
  href: string;
  etiqueta: string;
  forma: TipoForma;
  color: ColorBauhaus | "multicolor";
  rutas: string[];
}

const IZQUIERDA: Pestana[] = [
  { href: "/bitacora", etiqueta: "Ensayos", forma: "cuadrado", color: "azul", rutas: ["/bitacora/ensayo", "/bitacora/cronometro"] },
  { href: "/bitacora/repertorio", etiqueta: "Repertorio", forma: "triangulo", color: "amarillo", rutas: ["/bitacora/cancion"] },
];

const DERECHA: Pestana[] = [
  { href: "/bitacora/escalas", etiqueta: "Conocimiento", forma: "semicirculo", color: "rojo", rutas: ["/bitacora/escala", "/bitacora/tips"] },
  { href: "/bitacora/estadisticas", etiqueta: "Estadísticas", forma: "barras", color: "multicolor", rutas: [] },
];

function estaActiva(pestana: Pestana, ruta: string) {
  if (ruta === pestana.href) return true;
  return [pestana.href, ...pestana.rutas].some((r) => r !== "/bitacora" && ruta.startsWith(r));
}

export function BarraNavegacion({ onEnsayar, cronometro }: { onEnsayar: () => void; cronometro: Cronometro | null }) {
  const ruta = usePathname();
  const ahora = useAhora(cronometro !== null && cronometro.tramoDesde !== null);

  const pestana = (p: Pestana) => {
    const activa = estaActiva(p, ruta);
    return (
      <Link
        key={p.href}
        href={p.href}
        aria-current={activa ? "page" : undefined}
        className="relative flex flex-col items-center justify-center gap-1 pt-1"
      >
        <Forma
          tipo={p.forma}
          tamano={20}
          relleno={activa ? p.color : undefined}
          trazo={activa && p.forma !== "barras" ? "ninguno" : undefined}
          grosor={1.75}
        />
        <span
          className={cx(
            "text-[0.68rem] leading-none font-medium",
            activa ? "text-tinta" : "text-tinta-suave/80",
          )}
        >
          {p.etiqueta}
        </span>
      </Link>
    );
  };

  return (
    <nav aria-label="Navegación principal" className="fixed inset-x-0 bottom-0 z-30">
      <div className="mx-auto max-w-[640px] border-t-2 border-sutil bg-superficie pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="grid h-16 grid-cols-5">
          {IZQUIERDA.map(pestana)}
          <div className="flex items-start justify-center">
            <button
              type="button"
              onClick={onEnsayar}
              aria-label={cronometro ? "Ir al cronómetro" : "Ensayar"}
              className="-mt-5 inline-flex size-[3.75rem] items-center justify-center rounded-full border-2 border-fondo bg-rojo text-sobre-color shadow-[0_6px_16px_-6px_rgb(207_52_39/0.6)] transition-transform active:scale-95"
            >
              {cronometro ? (
                <span className="text-sm font-bold tabular-nums">
                  {formatoReloj(tiempoTranscurrido(cronometro, ahora))}
                </span>
              ) : (
                <IconoMas tamano={22} />
              )}
            </button>
          </div>
          {DERECHA.map(pestana)}
        </div>
      </div>
    </nav>
  );
}

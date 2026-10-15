"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/ui/cx";
import { Forma, VAR_COLOR, type ColorBauhaus, type TipoForma } from "@/ui/Forma";
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
        {activa && (
          <span
            aria-hidden
            className="absolute inset-x-3 top-0 h-1"
            style={{ background: p.color === "multicolor" ? VAR_COLOR.tinta : VAR_COLOR[p.color] }}
          />
        )}
        <Forma
          tipo={p.forma}
          tamano={22}
          relleno={activa ? p.color : undefined}
          grosor={2.25}
        />
        <span
          className={cx(
            "text-[0.7rem] leading-none font-semibold",
            activa ? "text-tinta" : "text-tinta-suave",
          )}
        >
          {p.etiqueta}
        </span>
      </Link>
    );
  };

  return (
    <nav aria-label="Navegación principal" className="fixed inset-x-0 bottom-0 z-30">
      <div className="mx-auto max-w-[640px] border-t-[3px] border-linea bg-superficie pb-[env(safe-area-inset-bottom)] sm:border-x-[3px]">
        <div className="grid h-16 grid-cols-5">
          {IZQUIERDA.map(pestana)}
          <div className="flex items-start justify-center">
            <button
              type="button"
              onClick={onEnsayar}
              aria-label={cronometro ? "Ir al cronómetro" : "Ensayar"}
              className="-mt-6 inline-flex size-[4.25rem] items-center justify-center rounded-full border-[3px] border-linea bg-rojo text-sobre-color transition-transform active:scale-95"
            >
              {cronometro ? (
                <span className="text-sm font-bold tabular-nums">
                  {formatoReloj(tiempoTranscurrido(cronometro, ahora))}
                </span>
              ) : (
                <IconoMas tamano={26} />
              )}
            </button>
          </div>
          {DERECHA.map(pestana)}
        </div>
      </div>
    </nav>
  );
}

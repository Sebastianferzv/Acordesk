"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/ui/cx";
import { Forma, type ColorBauhaus, type TipoForma } from "@/ui/Forma";

interface Pestana {
  href: string;
  etiqueta: string;
  forma: TipoForma;
  color: ColorBauhaus | "multicolor";
  rutas: string[];
}

const PESTANAS: Pestana[] = [
  { href: "/bitacora", etiqueta: "Ensayos", forma: "calendario", color: "azul", rutas: ["/bitacora/ensayo", "/bitacora/cronometro"] },
  { href: "/bitacora/escalas", etiqueta: "Conocimiento", forma: "libro", color: "rojo", rutas: ["/bitacora/escala", "/bitacora/tips"] },
  { href: "/bitacora/repertorio", etiqueta: "Repertorio", forma: "nota", color: "amarillo", rutas: ["/bitacora/cancion"] },
  { href: "/bitacora/estadisticas", etiqueta: "Estadísticas", forma: "barras", color: "multicolor", rutas: [] },
];

function estaActiva(pestana: Pestana, ruta: string) {
  if (ruta === pestana.href) return true;
  return [pestana.href, ...pestana.rutas].some((r) => r !== "/bitacora" && ruta.startsWith(r));
}

export function BarraNavegacion() {
  const ruta = usePathname();

  return (
    <nav aria-label="Navegación principal" className="fixed inset-x-0 bottom-0 z-30">
      <div className="mx-auto max-w-[640px] border-t-2 border-sutil bg-superficie pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="grid h-16 grid-cols-4">
          {PESTANAS.map((p) => {
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
          })}
        </div>
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { cx } from "@/ui/cx";
import { Forma, VAR_COLOR } from "@/ui/Forma";
import { APPS, almacenUltimaApp, almacenUltimaRuta, appDeRuta } from "./apps";

/** Pestañas fijas arriba para cambiar de app. Cada pestaña vuelve a la última pantalla de su app. */
export function BarraApps() {
  const ruta = usePathname();
  const busqueda = useSearchParams().toString();
  const ultimas = almacenUltimaRuta.useAlmacen();
  const actual = appDeRuta(ruta);

  useEffect(() => {
    const app = appDeRuta(ruta);
    if (!app) return;
    const completa = ruta + (busqueda ? `?${busqueda}` : "");
    const guardadas = almacenUltimaRuta.leer();
    if (guardadas[app.id] !== completa) almacenUltimaRuta.guardar({ ...guardadas, [app.id]: completa });
    if (almacenUltimaApp.leer() !== app.id) almacenUltimaApp.guardar(app.id);
  }, [ruta, busqueda]);

  return (
    <nav aria-label="Apps" className="sticky top-0 z-40 bg-fondo pt-[env(safe-area-inset-top)]">
      <div className="mx-auto grid max-w-[640px] grid-flow-col auto-cols-fr border-b-2 border-sutil sm:border-x-2">
        {APPS.map((app) => {
          const activa = app.id === actual?.id;
          // En la pestaña activa, tocarla de nuevo lleva al inicio de esa app.
          const destino = activa ? app.raiz : (ultimas[app.id] ?? app.raiz);
          return (
            <Link
              key={app.id}
              href={destino}
              aria-current={activa ? "page" : undefined}
              className={cx(
                "relative flex h-12 items-center justify-center gap-2 text-sm font-semibold tracking-[0.02em] transition-colors",
                activa ? "text-tinta" : "text-tinta-suave",
              )}
            >
              <Forma
                tipo={app.forma}
                tamano={14}
                relleno={activa ? app.color : undefined}
                trazo={activa ? "ninguno" : "tinta"}
                grosor={2}
                className={activa ? undefined : "opacity-60"}
              />
              {app.nombre}
              {activa && (
                <span aria-hidden className="absolute inset-x-0 -bottom-0.5 h-1" style={{ background: VAR_COLOR[app.color] }} />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

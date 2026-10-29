"use client";

import { useSerwist } from "@serwist/turbopack/react";
import { Suspense, useEffect, type ReactNode } from "react";
import { pedirPersistencia } from "@/features/bitacora/datos/persistencia";
import { ProveedorAvisos, useAviso } from "@/ui/Aviso";
import { useSeguirTema } from "@/ui/tema";
import { BarraApps } from "./BarraApps";

/** Estructura común a todas las apps: pestañas arriba, avisos y efectos globales. */
export function MarcoApps({ children }: { children: ReactNode }) {
  useSeguirTema();
  return (
    <ProveedorAvisos>
      {/* useSearchParams exige un Suspense para el build estático. */}
      <Suspense>
        <BarraApps />
      </Suspense>
      {children}
      <EfectosGlobales />
    </ProveedorAvisos>
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

"use client";

import { useState, type ReactNode } from "react";
import { ProveedorAvisos } from "@/ui/Aviso";
import { useSeguirTema } from "@/ui/tema";
import { BarraNavegacion } from "./BarraNavegacion";
import { HojaEnsayar } from "./HojaEnsayar";

/** Estructura común del módulo: columna central, barra inferior y hoja "Ensayar". */
export function Marco({ children }: { children: ReactNode }) {
  const [hojaAbierta, setHojaAbierta] = useState(false);
  useSeguirTema();

  return (
    <ProveedorAvisos>
      <div className="min-h-dvh bg-hundido">
        <div className="mx-auto min-h-dvh w-full max-w-[640px] bg-fondo pb-[calc(6.5rem+env(safe-area-inset-bottom))] sm:border-x-[3px] sm:border-linea">
          {children}
        </div>
      </div>
      <BarraNavegacion onEnsayar={() => setHojaAbierta(true)} />
      <HojaEnsayar abierta={hojaAbierta} onCerrar={() => setHojaAbierta(false)} />
    </ProveedorAvisos>
  );
}

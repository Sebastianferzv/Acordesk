"use client";

import { useState } from "react";
import { Boton } from "@/ui/Boton";
import { Hoja } from "@/ui/Hoja";
import { IconoBasura } from "@/ui/Iconos";
import { almacenCanciones, borrarCancion, type CancionGuardada } from "./estado";

interface Props {
  abierta: boolean;
  onCerrar: () => void;
  onAbrir: (c: CancionGuardada) => void;
}

const fecha = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "2-digit" });

export function HojaCanciones({ abierta, onCerrar, onAbrir }: Props) {
  const canciones = almacenCanciones.useAlmacen();
  const [porBorrar, setPorBorrar] = useState<CancionGuardada | null>(null);

  return (
    <Hoja abierta={abierta} onCerrar={onCerrar} titulo="Canciones">
      {canciones.length === 0 ? (
        <p className="py-4 text-sm text-tinta-suave">
          Todavía no hay canciones guardadas. Escribe un nombre arriba de los acordes y toca Guardar.
        </p>
      ) : (
        <ul className="border-2 border-sutil">
          {canciones.map((c) => (
            <li key={c.id} className="flex items-stretch border-b-2 border-sutil bg-fondo last:border-b-0">
              <button type="button" onClick={() => onAbrir(c)} className="min-w-0 flex-1 px-3.5 py-3 text-left">
                <span className="block truncate font-semibold">{c.name}</span>
                <span className="etiqueta text-tinta-suave">{fecha(c.savedAt)}</span>
              </button>
              {porBorrar?.id === c.id ? (
                <div className="flex items-center gap-1.5 pr-2">
                  <Boton variante="rojo" className="h-10 px-3" onClick={() => (borrarCancion(c.id), setPorBorrar(null))}>
                    Borrar
                  </Boton>
                  <Boton variante="secundario" className="h-10 px-3" onClick={() => setPorBorrar(null)}>
                    No
                  </Boton>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setPorBorrar(c)}
                  aria-label={`Borrar ${c.name}`}
                  className="flex w-12 shrink-0 items-center justify-center text-tinta-suave"
                >
                  <IconoBasura />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </Hoja>
  );
}

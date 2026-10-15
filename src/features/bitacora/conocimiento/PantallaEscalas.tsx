"use client";

import Link from "next/link";
import { useState } from "react";
import { escalaDelCatalogo } from "@/lib/teoria/catalogo";
import { Boton } from "@/ui/Boton";
import { EstadoVacio } from "@/ui/EstadoVacio";
import { Forma } from "@/ui/Forma";
import { IconoFlecha } from "@/ui/Iconos";
import { useEscalas, useTips } from "../datos/hooks";
import { EncabezadoConocimiento, gradosEscala, nombreEscala } from "./comun";
import { HojaAgregarEscala } from "./HojaAgregarEscala";

export function PantallaEscalas() {
  const mias = useEscalas();
  const tips = useTips() ?? [];
  const [agregando, setAgregando] = useState(false);

  return (
    <>
      <EncabezadoConocimiento />
      <div className="space-y-4 px-4 pt-5">
        <Boton variante="rojo" anchoCompleto onClick={() => setAgregando(true)}>
          Agregar escala
        </Boton>

        {mias === undefined ? null : mias.length === 0 ? (
          <EstadoVacio titulo="Tus escalas aparecerán aquí">
            Agrega las que has aprendido desde el catálogo, o crea las tuyas. Las verás en cualquier tónica y
            transpuestas para tu instrumento.
          </EstadoVacio>
        ) : (
          <ul className="border-[3px] border-linea">
            {mias.map((e) => {
              const nTips = tips.filter((t) => t.escalaId === e.id).length;
              const uso = escalaDelCatalogo(e.catalogoId)?.uso;
              return (
                <li key={e.id} className="border-b-[3px] border-linea last:border-b-0">
                  <Link href={`/bitacora/escala?id=${e.id}`} className="flex items-center gap-3 bg-superficie p-3">
                    <Forma tipo="semicirculo" relleno={e.catalogoId ? "rojo" : "azul"} trazo="ninguno" tamano={22} className="shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[1.05rem] font-semibold">{nombreEscala(e)}</span>
                      <span className="block truncate text-xs text-tinta-suave">
                        {gradosEscala(e).join(" ")}
                        {nTips > 0 ? ` · ${nTips} ${nTips === 1 ? "tip" : "tips"}` : ""}
                        {!nTips && uso ? ` · ${uso}` : ""}
                      </span>
                    </span>
                    <IconoFlecha tamano={16} className="shrink-0" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <HojaAgregarEscala abierta={agregando} onCerrar={() => setAgregando(false)} mias={mias ?? []} />
    </>
  );
}

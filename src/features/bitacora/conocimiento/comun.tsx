"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { escalaDelCatalogo } from "@/lib/teoria/catalogo";
import { cx } from "@/ui/cx";
import { Encabezado } from "@/ui/Encabezado";
import type { Escala } from "../datos/tipos";

export const CATEGORIAS_TIP = ["Técnica", "Sonido", "Improvisación", "Teoría", "Repertorio", "Ensayo"];

export const nombreEscala = (e: Escala) => escalaDelCatalogo(e.catalogoId)?.nombre ?? e.nombre ?? "Escala";
export const gradosEscala = (e: Escala) => escalaDelCatalogo(e.catalogoId)?.grados ?? e.grados ?? ["1"];

/** Encabezado de Conocimiento con sus pestañas (Escalas | Tips). */
export function EncabezadoConocimiento() {
  const ruta = usePathname();
  const pestanas = [
    { href: "/bitacora/escalas", etiqueta: "Escalas" },
    { href: "/bitacora/tips", etiqueta: "Tips" },
  ];
  return (
    <>
      <Encabezado titulo="Conocimiento" forma={{ tipo: "semicirculo", color: "rojo" }} />
      <nav aria-label="Secciones de conocimiento" className="mx-4 mt-4 grid grid-cols-2 border-2 border-sutil">
        {pestanas.map((p) => {
          const activa = ruta === p.href;
          return (
            <Link
              key={p.href}
              href={p.href}
              aria-current={activa ? "page" : undefined}
              className={cx(
                "etiqueta flex h-11 items-center justify-center border-sutil first:border-r-2",
                activa ? "bg-tinta text-fondo" : "bg-superficie",
              )}
            >
              {p.etiqueta}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

"use client";

import Link from "next/link";
import { Bloque } from "@/ui/Bloque";
import { cx } from "@/ui/cx";
import { Encabezado } from "@/ui/Encabezado";
import { IconoFlecha } from "@/ui/Iconos";
import { guardarTema, useTema, type Tema } from "@/ui/tema";

const TEMAS: { valor: Tema; etiqueta: string }[] = [
  { valor: "claro", etiqueta: "Crema" },
  { valor: "oscuro", etiqueta: "Oscuro" },
  { valor: "sistema", etiqueta: "Sistema" },
];

export function PantallaAjustes() {
  const tema = useTema();

  return (
    <>
      <Encabezado titulo="Ajustes" volverA="/bitacora" />
      <div className="space-y-5 px-4 pt-5">
        <Bloque titulo="Tema" acento={{ forma: "circulo", color: "amarillo" }}>
          <div role="radiogroup" aria-label="Tema" className="grid grid-cols-3">
            {TEMAS.map((t) => (
              <button
                key={t.valor}
                type="button"
                role="radio"
                aria-checked={tema === t.valor}
                onClick={() => guardarTema(t.valor)}
                className={cx(
                  "etiqueta h-14 border-r-[3px] border-linea last:border-r-0",
                  tema === t.valor ? "bg-tinta text-fondo" : "bg-superficie",
                )}
              >
                {t.etiqueta}
              </button>
            ))}
          </div>
        </Bloque>

        <Bloque titulo="Diseño" acento={{ forma: "cuadrado", color: "azul" }}>
          <Link href="/bitacora/muestrario" className="flex items-center justify-between gap-3 p-4 font-medium">
            Ver el muestrario de componentes
            <IconoFlecha />
          </Link>
        </Bloque>

        <p className="etiqueta text-tinta-suave">Bitácora de viaje · v0.1 · Los datos se guardan en este dispositivo.</p>
      </div>
    </>
  );
}

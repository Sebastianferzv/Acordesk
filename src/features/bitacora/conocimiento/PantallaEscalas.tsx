"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { escalasDeFamilia, FAMILIAS, type EscalaCatalogo } from "@/lib/teoria/catalogo";
import { Boton } from "@/ui/Boton";
import { cx } from "@/ui/cx";
import { Forma, type TipoForma } from "@/ui/Forma";
import { IconoFlecha } from "@/ui/Iconos";
import { useEscalas, useTips } from "../datos/hooks";
import { escalas } from "../datos/repositorio";
import { EncabezadoConocimiento, gradosEscala } from "./comun";
import { HojaCrearEscala } from "./HojaCrearEscala";

type Acento = { forma: TipoForma; color: "rojo" | "amarillo" | "azul" | "morado" };

// Cada lista con su color: borde y figura junto al título.
const ACENTOS: Acento[] = [
  { forma: "circulo", color: "rojo" },
  { forma: "circulo", color: "azul" },
  { forma: "circulo", color: "amarillo" },
  { forma: "circulo", color: "morado" },
];
const CREADAS: Acento = { forma: "lapiz", color: "amarillo" };

const BORDE: Record<Acento["color"], string> = {
  rojo: "border-rojo",
  amarillo: "border-amarillo",
  azul: "border-azul",
  morado: "border-morado",
};

/** En los modos, el nombre dice su color: 3ra mayor en rojo, 3ra menor en azul y la locria (5ta disminuida) en morado. */
function colorModo(e: EscalaCatalogo, familia: string) {
  if (familia !== "Modos") return undefined;
  if (e.id === "locria") return "text-morado";
  return e.grados.includes("3") ? "text-rojo" : "text-azul";
}

export function PantallaEscalas() {
  const router = useRouter();
  const mias = useEscalas() ?? [];
  const tips = useTips() ?? [];
  const [creando, setCreando] = useState(false);

  const nTips = (id?: string) => (id ? tips.filter((t) => t.escalaId === id).length : 0);

  // Las del catálogo se guardan al abrirlas por primera vez, para colgarles notas y tips.
  const abrirDelCatalogo = async (catalogoId: string) => {
    const existente = mias.find((m) => m.catalogoId === catalogoId);
    const id = existente ? existente.id : (await escalas.crear({ catalogoId })).id;
    router.push(`/bitacora/escala?id=${id}`);
  };

  const propias = mias.filter((m) => !m.catalogoId);

  return (
    <>
      <EncabezadoConocimiento />
      <div className="space-y-3 px-4 pt-5">
        {FAMILIAS.map((familia, i) => {
          const lista = escalasDeFamilia(familia);
          return (
            <Desplegable key={familia} titulo={familia} cantidad={lista.length} acento={ACENTOS[i]}>
              {lista.map((e) => (
                <FilaEscala
                  key={e.id}
                  nombre={e.nombre}
                  colorNombre={colorModo(e, familia)}
                  detalle={e.descripcion}
                  grados={e.grados}
                  tips={nTips(mias.find((m) => m.catalogoId === e.id)?.id)}
                  onAbrir={() => void abrirDelCatalogo(e.id)}
                />
              ))}
            </Desplegable>
          );
        })}

        <Desplegable titulo="Creadas por mí" cantidad={propias.length} acento={CREADAS}>
          {propias.map((e) => (
            <FilaEscala
              key={e.id}
              nombre={e.nombre ?? "Escala"}
              grados={gradosEscala(e)}
              tips={nTips(e.id)}
              onAbrir={() => router.push(`/bitacora/escala?id=${e.id}`)}
            />
          ))}
          <li className="border-t-2 border-sutil p-3">
            <Boton variante="amarillo" anchoCompleto onClick={() => setCreando(true)}>
              Crear una escala
            </Boton>
          </li>
        </Desplegable>
      </div>
      <HojaCrearEscala abierta={creando} onCerrar={() => setCreando(false)} />
    </>
  );
}

function Desplegable({ titulo, cantidad, acento, children }: {
  titulo: string;
  cantidad: number;
  acento: Acento;
  children: ReactNode;
}) {
  return (
    <details className={cx("group border-2 bg-superficie", BORDE[acento.color])}>
      <summary className="etiqueta flex cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <Forma tipo={acento.forma} relleno={acento.color} trazo="ninguno" tamano={14} />
        <span className="flex-1">{titulo}</span>
        <span className="text-tinta-suave">{cantidad}</span>
        <span aria-hidden className="text-xs transition-transform group-open:rotate-180">▼</span>
      </summary>
      <ul>{children}</ul>
    </details>
  );
}

function FilaEscala({ nombre, colorNombre, detalle, grados, tips, onAbrir }: {
  nombre: string;
  colorNombre?: string;
  detalle?: string;
  grados: string[];
  tips: number;
  onAbrir: () => void;
}) {
  return (
    <li className="border-t-2 border-sutil">
      <button type="button" onClick={onAbrir} className="flex w-full items-center gap-3 p-3 text-left">
        <span className="min-w-0 flex-1">
          <span className={cx("block text-[1.05rem] font-semibold", colorNombre)}>{nombre}</span>
          {detalle && <span className="block text-sm leading-snug">{detalle}</span>}
          <span className="block text-xs text-tinta-suave">
            {grados.join(" ")}
            {tips > 0 ? ` · ${tips} ${tips === 1 ? "tip" : "tips"}` : ""}
          </span>
        </span>
        <IconoFlecha tamano={16} className="shrink-0" />
      </button>
    </li>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATALOGO, type EscalaCatalogo } from "@/lib/teoria/catalogo";
import { Boton } from "@/ui/Boton";
import { clasesEntrada } from "@/ui/Campos";
import { cx } from "@/ui/cx";
import { Hoja } from "@/ui/Hoja";
import { IconoFlecha } from "@/ui/Iconos";
import { escalas } from "../datos/repositorio";
import type { Escala } from "../datos/tipos";
import { EditorGrados } from "./EditorGrados";

const FAMILIAS: EscalaCatalogo["familia"][] = ["Mayor y modos", "Menores", "Pentatónicas y blues", "Jazz y simétricas"];

interface Props {
  abierta: boolean;
  onCerrar: () => void;
  mias: Escala[];
}

/** Agregar una escala a "mis escalas": desde el catálogo o creando una propia. */
export function HojaAgregarEscala({ abierta, onCerrar, mias }: Props) {
  const router = useRouter();
  const [propia, setPropia] = useState(false);
  const [nombre, setNombre] = useState("");
  const [grados, setGrados] = useState<string[]>(["1"]);

  const abrir = (id: string) => {
    onCerrar();
    router.push(`/bitacora/escala?id=${id}`);
  };

  const agregarDelCatalogo = async (catalogoId: string) => {
    const existente = mias.find((m) => m.catalogoId === catalogoId);
    abrir(existente ? existente.id : (await escalas.crear({ catalogoId })).id);
  };

  const crearPropia = async () => {
    const escala = await escalas.crear({ nombre: nombre.trim() || "Mi escala", grados });
    setPropia(false);
    setNombre("");
    setGrados(["1"]);
    abrir(escala.id);
  };

  return (
    <Hoja abierta={abierta} onCerrar={onCerrar} titulo="Agregar escala">
      <div className="max-h-[65dvh] space-y-5 overflow-y-auto pb-2">
        {propia ? (
          <div className="space-y-4">
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre de la escala"
              aria-label="Nombre de la escala"
              className={cx(clasesEntrada, "h-12")}
            />
            <EditorGrados grados={grados} onCambiar={setGrados} />
            <div className="grid grid-cols-2 gap-2">
              <Boton variante="secundario" onClick={() => setPropia(false)}>
                Volver
              </Boton>
              <Boton disabled={grados.length < 3} onClick={() => void crearPropia()}>
                Crear
              </Boton>
            </div>
          </div>
        ) : (
          <>
            <Boton variante="amarillo" anchoCompleto onClick={() => setPropia(true)}>
              Crear una escala propia
            </Boton>
            {FAMILIAS.map((familia) => (
              <section key={familia}>
                <h3 className="etiqueta mb-2 text-tinta-suave">{familia}</h3>
                <ul className="border-2 border-sutil">
                  {CATALOGO.filter((e) => e.familia === familia).map((e) => {
                    const yaEsta = mias.some((m) => m.catalogoId === e.id);
                    return (
                      <li key={e.id} className="border-b-2 border-sutil last:border-b-0">
                        <button
                          type="button"
                          onClick={() => void agregarDelCatalogo(e.id)}
                          className="flex w-full items-center gap-3 bg-fondo p-3 text-left"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block font-semibold">
                              {e.nombre} {yaEsta && <span className="etiqueta text-tinta-suave">· ya está</span>}
                            </span>
                            <span className="block text-sm leading-snug text-tinta-suave">{e.uso}</span>
                          </span>
                          <IconoFlecha tamano={16} className="shrink-0" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </>
        )}
      </div>
    </Hoja>
  );
}

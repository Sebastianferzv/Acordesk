"use client";

import { useState, type ReactNode } from "react";
import { useAviso } from "@/ui/Aviso";
import { Bloque } from "@/ui/Bloque";
import { Boton } from "@/ui/Boton";
import { BotonCircular } from "@/ui/BotonCircular";
import { Chip } from "@/ui/Chip";
import { Encabezado } from "@/ui/Encabezado";
import { Forma } from "@/ui/Forma";
import { Hoja } from "@/ui/Hoja";
import { IconoMas } from "@/ui/Iconos";
import { NombreNota } from "@/ui/NombreNota";
import { ValoracionFormas, type ValorValoracion } from "@/ui/ValoracionFormas";
import type { Ensayo } from "../datos/tipos";
import { FilaEnsayo } from "../ensayos/FilaEnsayo";
import { SelloEnsayo } from "../ensayos/SelloEnsayo";

const COLORES = [
  { nombre: "Fondo", clase: "bg-fondo" },
  { nombre: "Superficie", clase: "bg-superficie" },
  { nombre: "Tinta", clase: "bg-tinta" },
  { nombre: "Rojo", clase: "bg-rojo" },
  { nombre: "Amarillo", clase: "bg-amarillo" },
  { nombre: "Azul", clase: "bg-azul" },
];

const base = { creadoEn: 0, actualizadoEn: 0, borradoEn: null, links: [] };
const EJEMPLOS: Ensayo[] = [
  {
    ...base,
    id: "ejemplo-1",
    fecha: "2026-10-14",
    duracionMin: 90,
    valoracion: 5,
    titulo: "Blue Bossa con la banda",
    etiquetas: ["Banda"],
    items: [{ cancionId: "a" }, { cancionId: "b" }, { cancionId: "c" }],
    aprendizajes: [{ id: "x", texto: "Respirar antes del puente" }],
  },
  {
    ...base,
    id: "ejemplo-2",
    fecha: "2026-10-12",
    duracionMin: 45,
    valoracion: 3,
    notas: "Escalas mayores en todas las tonalidades",
    etiquetas: ["Solo"],
    items: [{ cancionId: "a" }],
    aprendizajes: [],
  },
  {
    ...base,
    id: "ejemplo-3",
    fecha: "2026-10-10",
    duracionMin: 30,
    valoracion: 2,
    notas: "Poco tiempo, mucho ruido",
    etiquetas: [],
    items: [],
    aprendizajes: [{ id: "y", texto: "Calentar más" }],
  },
  {
    ...base,
    id: "ejemplo-4",
    fecha: "2026-10-09",
    etiquetas: ["Clase"],
    items: [{ cancionId: "a" }, { cancionId: "b" }],
    aprendizajes: [],
  },
];

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="etiqueta border-b-[3px] border-linea pb-1.5">{titulo}</h2>
      {children}
    </section>
  );
}

export function PantallaMuestrario() {
  const [valor, setValor] = useState<ValorValoracion | undefined>(4);
  const [chips, setChips] = useState<string[]>(["Banda"]);
  const [hoja, setHoja] = useState(false);
  const avisar = useAviso();

  const alternarChip = (c: string) => setChips((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));

  return (
    <>
      <Encabezado titulo="Muestrario" volverA="/bitacora/ajustes" subtitulo="Sistema de diseño Bauhaus" />
      <div className="space-y-8 px-4 pt-5">
        <Seccion titulo="Colores">
          <div className="grid grid-cols-3 border-[3px] border-linea">
            {COLORES.map((c) => (
              <div key={c.nombre} className="border-linea [&:nth-child(-n+3)]:border-b-[3px] [&:not(:nth-child(3n))]:border-r-[3px]">
                <div className={`h-14 ${c.clase}`} />
                <p className="etiqueta border-t-[3px] border-linea bg-superficie px-2 py-1.5 text-[0.65rem]">{c.nombre}</p>
              </div>
            ))}
          </div>
        </Seccion>

        <Seccion titulo="Tipografía · Jost">
          <p className="titulo-bauhaus text-5xl">Ensayo</p>
          <p className="text-2xl font-bold uppercase">Título de sección</p>
          <p className="text-base">Texto normal para notas y minutas del ensayo.</p>
          <p className="etiqueta text-tinta-suave">Etiqueta · 14 oct · 60 min</p>
          <p className="text-3xl font-bold">
            <NombreNota nota="Bb" /> · <NombreNota nota="F#" /> · <NombreNota nota="Ebb" /> ·{" "}
            <NombreNota nota="C##" /> · <NombreNota nota="Eb" notacion="solfeo" />
          </p>
        </Seccion>

        <Seccion titulo="Formas">
          <div className="flex flex-wrap items-center gap-3">
            <Forma tipo="circulo" relleno="rojo" trazo="ninguno" tamano={40} />
            <Forma tipo="cuadrado" relleno="azul" trazo="ninguno" tamano={40} />
            <Forma tipo="triangulo" relleno="amarillo" trazo="ninguno" tamano={40} />
            <Forma tipo="semicirculo" relleno="tinta" trazo="ninguno" tamano={40} />
            <Forma tipo="barras" relleno="multicolor" tamano={40} grosor={2} />
            <Forma tipo="circulo" tamano={40} />
            <Forma tipo="triangulo" tamano={40} />
          </div>
        </Seccion>

        <Seccion titulo="Botones">
          <div className="flex flex-wrap items-center gap-3">
            <BotonCircular etiqueta="Agregar" tamano="lg">
              <IconoMas />
            </BotonCircular>
            <BotonCircular etiqueta="Reproducir" color="tinta" tamano="md">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                <polygon points="6,3 21,12 6,21" fill="currentColor" />
              </svg>
            </BotonCircular>
            <BotonCircular etiqueta="Detener" color="azul" tamano="md">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
                <rect x="3" y="3" width="18" height="18" fill="currentColor" />
              </svg>
            </BotonCircular>
            <BotonCircular etiqueta="Grabar" color="superficie" tamano="md">
              <Forma tipo="circulo" relleno="rojo" trazo="ninguno" tamano={20} />
            </BotonCircular>
          </div>
          <div className="grid gap-2">
            <Boton anchoCompleto>Guardar</Boton>
            <div className="grid grid-cols-2 gap-2">
              <Boton variante="secundario">Cancelar</Boton>
              <Boton variante="rojo">Terminar</Boton>
            </div>
          </div>
        </Seccion>

        <Seccion titulo="Chips">
          <div className="flex flex-wrap gap-2">
            {["Banda", "Solo", "Clase", "+ Nueva"].map((c) => (
              <Chip key={c} seleccionado={chips.includes(c)} onClick={() => alternarChip(c)}>
                {c}
              </Chip>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {[15, 30, 45, 60, 90, 120].map((m) => (
              <Chip key={m} seleccionado={m === 60}>
                {m} min
              </Chip>
            ))}
          </div>
        </Seccion>

        <Seccion titulo="Valoración">
          <ValoracionFormas valor={valor} onCambiar={setValor} />
        </Seccion>

        <Seccion titulo="Sellos de ensayo">
          <div className="flex flex-wrap gap-3">
            {EJEMPLOS.map((e) => (
              <SelloEnsayo
                key={e.id}
                semilla={e.id}
                duracionMin={e.duracionMin}
                valoracion={e.valoracion}
                canciones={e.items.length}
                conAprendizajes={e.aprendizajes.length > 0}
                tamano={64}
              />
            ))}
          </div>
          <p className="text-sm text-tinta-suave">
            Círculo = duración (color según valoración) · cuadrados = canciones · triángulo = aprendizajes.
          </p>
        </Seccion>

        <Seccion titulo="Lista de ensayos">
          <div className="border-[3px] border-linea">
            {EJEMPLOS.map((e) => (
              <FilaEnsayo key={e.id} ensayo={e} />
            ))}
          </div>
        </Seccion>

        <Seccion titulo="Bloques, hoja y avisos">
          <Bloque titulo="Aprendizajes" acento={{ forma: "triangulo", color: "amarillo" }}>
            <p className="p-4">Respirar antes del puente y no apurar el final de la frase.</p>
          </Bloque>
          <div className="grid grid-cols-2 gap-2">
            <Boton variante="secundario" onClick={() => setHoja(true)}>
              Abrir hoja
            </Boton>
            <Boton
              variante="secundario"
              onClick={() =>
                avisar({
                  texto: "Ensayo eliminado.",
                  accion: { etiqueta: "Deshacer", alHacer: () => avisar({ texto: "Restaurado." }) },
                })
              }
            >
              Ver aviso
            </Boton>
          </div>
        </Seccion>
      </div>

      <Hoja abierta={hoja} onCerrar={() => setHoja(false)} titulo="Hoja de ejemplo">
        <p className="mb-4">Los paneles suben desde abajo y se cierran tocando afuera o con Escape.</p>
        <Boton anchoCompleto onClick={() => setHoja(false)}>
          Entendido
        </Boton>
      </Hoja>
    </>
  );
}

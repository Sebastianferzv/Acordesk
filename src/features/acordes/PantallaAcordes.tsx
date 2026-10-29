"use client";

import { useState, type ReactNode } from "react";
import {
  CLAVES_INSTRUMENTO,
  RELATIVA_MENOR,
  semitonosEntre,
  TONALIDADES,
  tonalidadParaInstrumento,
} from "@/lib/teoria/acordes";
import { desplazamientoInstrumento, textoNota } from "@/lib/teoria/notas";
import { useAviso } from "@/ui/Aviso";
import { Bloque } from "@/ui/Bloque";
import { Boton } from "@/ui/Boton";
import { clasesEntrada } from "@/ui/Campos";
import { Chip } from "@/ui/Chip";
import { cx } from "@/ui/cx";
import { Encabezado } from "@/ui/Encabezado";
import { NombreNota } from "@/ui/NombreNota";
import { almacenTrabajo, abrirCancion, guardarCancion, type Trabajo } from "./estado";
import { HojaCanciones } from "./HojaCanciones";
import { HojaCirculo } from "./HojaCirculo";
import { HojaAyuda, HojaDiccionario } from "./HojasAyuda";
import { ControlesSalida, SalidaAcordes, textoParaCopiar } from "./SalidaAcordes";

type HojaAbierta = "canciones" | "circulo" | "diccionario" | "ayuda" | null;

const etiquetaTonalidad = (t: string) => `${textoNota(t, "letras")} / ${textoNota(RELATIVA_MENOR[t], "letras")}`;

/** Tonalidad mayor / relativa menor, con ♭ y ♯ dibujados. */
function NombreTonalidad({ tonalidad }: { tonalidad: string }) {
  return (
    <>
      <NombreNota nota={tonalidad} /> / <NombreNota nota={RELATIVA_MENOR[tonalidad].slice(0, -1)} />m
    </>
  );
}

function SelectorTonalidad({ valor, onCambiar, vacio, disabled, etiqueta }: {
  valor: string;
  onCambiar: (t: string) => void;
  vacio: string;
  disabled?: boolean;
  etiqueta: string;
}) {
  return (
    <select
      value={valor}
      disabled={disabled}
      aria-label={etiqueta}
      onChange={(e) => onCambiar(e.target.value)}
      className={cx(clasesEntrada, "h-11 w-auto pr-8 font-semibold disabled:opacity-40", !valor && !disabled && "border-amarillo")}
    >
      <option value="">{vacio}</option>
      {TONALIDADES.map((t) => (
        <option key={t} value={t}>
          {etiquetaTonalidad(t)}
        </option>
      ))}
    </select>
  );
}

export function PantallaAcordes() {
  const t = almacenTrabajo.useAlmacen();
  const cambiar = (cambio: Partial<Trabajo>) => almacenTrabajo.guardar({ ...almacenTrabajo.leer(), ...cambio });
  const [hoja, setHoja] = useState<HojaAbierta>(null);
  const [nombreFaltante, setNombreFaltante] = useState(false);
  const avisar = useAviso();

  const semisTonalidad = t.nuevaTonica ? semitonosEntre(t.tonica, t.nuevaTonica) : 0;
  const semisInstrumento = desplazamientoInstrumento(t.instrumento);
  const tonalidadBase = t.nuevaTonica || t.tonica;
  const tonalidadInstrumento = tonalidadBase ? tonalidadParaInstrumento(tonalidadBase, t.instrumento) : "";

  const tamano = (clave: keyof Trabajo["tamanos"], paso: number, cambioSigno: number) =>
    cambiar({
      tamanos: { ...t.tamanos, [clave]: Math.max(0.75, Math.min(4, t.tamanos[clave] + cambioSigno * paso)) },
    });

  const comunes = { tonica: t.tonica, preferencia: t.preferencia, verGrados: t.verGrados };
  const controles = (clave: keyof Trabajo["tamanos"], paso: number, semitonos: number, tonalidadSalida: string) => (
    <ControlesSalida
      verGrados={t.verGrados}
      puedeVerGrados={!!t.tonica}
      onGrados={() => cambiar({ verGrados: !t.verGrados })}
      onTamano={(s) => tamano(clave, paso, s)}
      textoCopiar={() => textoParaCopiar(t.acordes, semitonos, tonalidadSalida, t.preferencia)}
    />
  );

  const guardar = () => {
    if (!t.nombre.trim()) {
      setNombreFaltante(true);
      return;
    }
    guardarCancion(t);
    avisar({ texto: `“${t.nombre.trim()}” guardada.`, duracionMs: 2200 });
  };

  return (
    <div className="mx-auto min-h-[calc(100dvh-3rem)] w-full max-w-[640px] bg-fondo pb-[calc(3rem+env(safe-area-inset-bottom))] sm:border-x-2 sm:border-sutil">
      <Encabezado
        titulo="AcorDesk"
        forma={{ tipo: "circulo", color: "rojo" }}
        acciones={
          <button
            type="button"
            onClick={() => setHoja("ayuda")}
            aria-label="Cómo usar AcorDesk"
            className="inline-flex size-10 items-center justify-center border-2 border-amarillo bg-amarillo text-lg font-bold text-sobre-amarillo"
          >
            ?
          </button>
        }
      />

      <div className="space-y-4 px-4 pt-4">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 whitespace-nowrap [&>*]:shrink-0">
          <Chip tono="azul" lleno onClick={() => setHoja("canciones")}>Canciones</Chip>
          <Chip tono="rojo" lleno onClick={() => setHoja("circulo")}>Círculo de quintas</Chip>
          <Chip tono="amarillo" lleno onClick={() => setHoja("diccionario")}>Diccionario</Chip>
        </div>

        <div className="flex">
          <input
            type="text"
            value={t.nombre}
            placeholder="Nombre de la canción…"
            aria-label="Nombre de la canción"
            autoComplete="off"
            onChange={(e) => {
              setNombreFaltante(false);
              cambiar({ nombre: e.target.value });
            }}
            className={cx(clasesEntrada, "h-12 min-w-0 flex-1 rounded-r-none border-r-0", nombreFaltante && "border-rojo")}
          />
          <Boton variante="rojo" className="rounded-l-none" onClick={guardar}>Guardar</Boton>
        </div>

        <Bloque tituloDeColor titulo="Acordes · concierto" acento={{ forma: "circulo", color: "rojo" }}>
          <div className="space-y-3 p-4">
            <label className="flex items-center gap-3">
              <span className="etiqueta text-tinta-suave">Tónica</span>
              <SelectorTonalidad
                valor={t.tonica}
                etiqueta="Tónica de la canción"
                vacio="—"
                onCambiar={(v) => cambiar({ tonica: v, ...(v ? {} : { nuevaTonica: "" }) })}
              />
            </label>
            <textarea
              value={t.acordes}
              onChange={(e) => cambiar({ acordes: e.target.value })}
              aria-label="Acordes de la canción"
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              rows={5}
              placeholder={"Escribe los acordes separados por espacios o en varias líneas:\n\nCmaj7   Am7   Dm7   G7"}
              className={cx(clasesEntrada, "min-h-32 resize-y py-3 font-mono text-[1.05rem] leading-relaxed")}
            />
          </div>
        </Bloque>

        <Bloque tituloDeColor titulo="Vista previa" acento={{ forma: "cuadrado", color: "amarillo" }}>
          <div className="space-y-3 p-4">
            {controles("vista", 0.15, 0, t.tonica)}
            <SalidaAcordes
              {...comunes}
              texto={t.acordes}
              semitonos={0}
              tonalidadSalida={t.tonica}
              tamano={t.tamanos.vista}
              vacio="Escribe acordes arriba…"
            />
          </div>
        </Bloque>

        <div className="grid grid-cols-2 gap-2.5">
          <BotonPanel
            abierto={t.abiertos.tonalidad}
            color="amarillo"
            onClick={() => cambiar({ abiertos: { ...t.abiertos, tonalidad: !t.abiertos.tonalidad } })}
          >
            Cambiar tonalidad
          </BotonPanel>
          <BotonPanel
            abierto={t.abiertos.instrumento}
            color="azul"
            onClick={() => cambiar({ abiertos: { ...t.abiertos, instrumento: !t.abiertos.instrumento } })}
          >
            Transponer a instrumento
          </BotonPanel>
        </div>

        {t.abiertos.tonalidad && (
          <Bloque
            tituloDeColor
            titulo="Cambiar tonalidad"
            acento={{ forma: "triangulo", color: "amarillo" }}
            className="animate-aparecer"
          >
            <div className="space-y-3 p-4">
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <span className="etiqueta mb-1.5 block text-tinta-suave">Original</span>
                  <span className="inline-flex h-11 items-center border-2 border-sutil bg-hundido px-3.5 font-semibold">
                    {t.tonica ? <NombreTonalidad tonalidad={t.tonica} /> : "—"}
                  </span>
                </div>
                <span className="pb-2.5 text-xl font-bold text-amarillo">→</span>
                <div>
                  <span className="etiqueta mb-1.5 block text-tinta-suave">Nueva tónica</span>
                  <SelectorTonalidad
                    valor={t.nuevaTonica}
                    etiqueta="Nueva tónica"
                    vacio="— Sin cambio —"
                    disabled={!t.tonica}
                    onCambiar={(v) => cambiar({ nuevaTonica: v })}
                  />
                </div>
                {t.nuevaTonica && (
                  <span className="etiqueta mb-3 ml-auto text-tinta-suave">
                    {semisTonalidad === 0
                      ? "sin cambio"
                      : semisTonalidad <= 6
                        ? `+${semisTonalidad} semitonos`
                        : `−${12 - semisTonalidad} semitonos`}
                  </span>
                )}
              </div>
              {t.tonica && t.nuevaTonica ? (
                <>
                  {controles("tonalidad", 0.15, semisTonalidad, t.nuevaTonica)}
                  <SalidaAcordes
                    {...comunes}
                    texto={t.acordes}
                    semitonos={semisTonalidad}
                    tonalidadSalida={t.nuevaTonica}
                    tamano={t.tamanos.tonalidad}
                    vacio="Escribe acordes arriba…"
                  />
                </>
              ) : (
                <p className="text-sm text-tinta-suave italic">
                  {t.tonica ? "Elige la nueva tónica para ver los acordes en esa tonalidad." : "Primero elige la tónica de la canción, junto a los acordes."}
                </p>
              )}
            </div>
          </Bloque>
        )}

        {t.abiertos.instrumento && (
          <Bloque tituloDeColor titulo="Transponer a instrumento" acento={{ forma: "semicirculo", color: "azul" }} className="animate-aparecer">
            <div className="space-y-3 p-4">
              <div className="grid grid-cols-6 gap-1.5">
                {CLAVES_INSTRUMENTO.map((i) => {
                  const activo = i.clave === t.instrumento;
                  return (
                    <button
                      key={i.clave}
                      type="button"
                      aria-pressed={activo}
                      onClick={() => cambiar({ instrumento: i.clave })}
                      className={cx(
                        "flex h-12 flex-col items-center justify-center border-2 leading-none transition-colors",
                        activo ? "border-azul bg-azul text-sobre-color" : "border-sutil bg-fondo text-tinta",
                      )}
                    >
                      <NombreNota nota={i.clave} className="text-base font-bold" />
                      <span className={cx("mt-0.5 text-[0.55rem] whitespace-nowrap", activo ? "opacity-90" : "text-tinta-suave")}>
                        {i.nombre || " "}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="text-sm text-tinta-suave">
                <b className="text-tinta">{CLAVES_INSTRUMENTO.find((i) => i.clave === t.instrumento)?.nombre || "Instrumento"}</b> en{" "}
                <NombreNota nota={t.instrumento} /> —{" "}
                {semisInstrumento === 0 ? "sin transposición" : `+${semisInstrumento} semitonos`}
              </p>

              {tonalidadInstrumento ? (
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-[var(--radio)] bg-azul px-4 py-3 text-sobre-color">
                  <span className="etiqueta opacity-85">Tonalidad transpuesta</span>
                  <span className="text-2xl font-extrabold">
                    <NombreTonalidad tonalidad={tonalidadInstrumento} />
                  </span>
                </div>
              ) : (
                <p className="text-sm text-tinta-suave italic">Elige la tónica junto a los acordes para ver en qué tonalidad te queda.</p>
              )}

              {!t.tonica && (
                <div className="flex gap-2">
                  <Chip tono="azul" seleccionado={t.preferencia === "bemoles"} onClick={() => cambiar({ preferencia: "bemoles" })}>
                    Bemoles
                  </Chip>
                  <Chip tono="azul" seleccionado={t.preferencia === "sostenidos"} onClick={() => cambiar({ preferencia: "sostenidos" })}>
                    Sostenidos
                  </Chip>
                </div>
              )}

              {controles("instrumento", 0.18, semisTonalidad + semisInstrumento, tonalidadInstrumento)}
              <SalidaAcordes
                {...comunes}
                texto={t.acordes}
                semitonos={semisTonalidad + semisInstrumento}
                tonalidadSalida={tonalidadInstrumento}
                tamano={t.tamanos.instrumento}
                vacio="Los acordes para el instrumento aparecerán aquí…"
              />
            </div>
          </Bloque>
        )}
      </div>

      <HojaCanciones
        abierta={hoja === "canciones"}
        onCerrar={() => setHoja(null)}
        onAbrir={(c) => {
          almacenTrabajo.guardar(abrirCancion(c));
          setHoja(null);
        }}
      />
      <HojaCirculo abierta={hoja === "circulo"} onCerrar={() => setHoja(null)} />
      <HojaDiccionario abierta={hoja === "diccionario"} onCerrar={() => setHoja(null)} />
      <HojaAyuda abierta={hoja === "ayuda"} onCerrar={() => setHoja(null)} />
    </div>
  );
}

function BotonPanel({ abierto, color, onClick, children }: {
  abierto: boolean;
  color: "amarillo" | "azul";
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-expanded={abierto}
      onClick={onClick}
      className={cx(
        "flex min-h-14 items-center justify-center gap-2 border-2 px-2 py-2 text-center text-sm leading-tight font-semibold transition-colors active:translate-y-px",
        abierto
          ? color === "amarillo"
            ? "border-amarillo bg-amarillo text-sobre-amarillo"
            : "border-azul bg-azul text-sobre-color"
          : color === "amarillo"
            ? "border-amarillo bg-superficie text-tinta"
            : "border-azul bg-superficie text-tinta",
      )}
    >
      <span aria-hidden className="text-xs">{abierto ? "▲" : "▼"}</span>
      {children}
    </button>
  );
}

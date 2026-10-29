"use client";

import { useState } from "react";
import {
  alturasAcorde,
  alturasTonalidad,
  gradoAcorde,
  notasFuera,
  preferenciaDeTonalidad,
  separarLinea,
  tonalidadDeAltura,
  transponerAcorde,
  transponerTexto,
  type Acorde,
} from "@/lib/teoria/acordes";
import { claseDeAltura, nombreSimple, type Preferencia } from "@/lib/teoria/notas";
import { useAviso } from "@/ui/Aviso";
import { Chip } from "@/ui/Chip";
import { cx } from "@/ui/cx";
import { IconoCopiar } from "@/ui/Iconos";
import { NombreNota } from "@/ui/NombreNota";

interface Props {
  texto: string;
  semitonos: number;
  /** Tónica de la canción (concierto): colores y grados. */
  tonica: string;
  /** Tonalidad en que quedan los acordes: decide ♯ o ♭. Vacía = usar `preferencia`. */
  tonalidadSalida: string;
  preferencia: Preferencia;
  verGrados: boolean;
  tamano: number;
  vacio: string;
}

/** Color de cada acorde según cuántas notas quedan fuera de la tonalidad. */
const COLOR_FUERA = [
  "border-transparent bg-hundido text-tinta",
  "border-transparent bg-amarillo text-sobre-amarillo",
  "border-rojo bg-transparent text-rojo",
  "border-transparent bg-rojo text-sobre-color",
];
const colorAcorde = (fuera: number | null) =>
  fuera === null ? "border-sutil bg-transparent text-tinta" : COLOR_FUERA[Math.min(fuera, 3)];

/** Acorde con ♭ y ♯ dibujados. */
export function TextoAcorde({ acorde }: { acorde: Acorde }) {
  return (
    <>
      <NombreNota nota={acorde.raiz} />
      {acorde.calidad}
      {acorde.bajo && (
        <>
          /<NombreNota nota={acorde.bajo} />
        </>
      )}
    </>
  );
}

export function SalidaAcordes({ texto, semitonos, tonica, tonalidadSalida, preferencia, verGrados, tamano, vacio }: Props) {
  const [tocado, setTocado] = useState<string | null>(null);
  const pref = tonalidadSalida ? preferenciaDeTonalidad(tonalidadSalida) : preferencia;

  if (!texto.trim()) return <p className="py-2 text-sm text-tinta-suave italic">{vacio}</p>;

  const lineas = texto.split("\n").map((linea) => separarLinea(linea));
  const [lt, pt] = tocado?.split(":").map(Number) ?? [];
  const piezaTocada = tocado ? lineas[lt]?.[pt] : undefined;

  return (
    <div>
      <div className="font-semibold" style={{ fontSize: `${tamano}rem` }}>
        {lineas.map((piezas, l) =>
          piezas.length === 0 ? (
            <div key={l} className="h-3" />
          ) : (
            <div key={l} className="flex flex-wrap items-end gap-y-1.5 py-0.5 leading-tight whitespace-pre-wrap">
              {piezas.map((p, i) => {
                if (p.tipo !== "acorde") return <span key={i} className="text-tinta-suave">{p.texto}</span>;
                const t = transponerAcorde(p.texto, semitonos, pref);
                if (!t) return <span key={i}>{p.texto + p.final}</span>;
                const id = `${l}:${i}`;
                return (
                  <span key={i} className="inline-flex items-end">
                    <button
                      type="button"
                      onClick={() => setTocado(tocado === id ? null : id)}
                      className={cx(
                        "inline-flex flex-col items-center rounded-md border-2 px-[0.35em] py-[0.08em] transition-transform active:translate-y-px",
                        colorAcorde(tonica ? notasFuera(p.texto, tonica) : null),
                        tocado === id && "outline-2 outline-offset-1 outline-tinta",
                      )}
                    >
                      {verGrados && tonica && (
                        <span className="text-[0.55em] leading-none font-bold tracking-wide opacity-75">
                          {gradoAcorde(p.texto, tonica)}
                        </span>
                      )}
                      <span>
                        <TextoAcorde acorde={t} />
                      </span>
                    </button>
                    {p.final && <span className="text-tinta-suave">{p.final}</span>}
                  </span>
                );
              })}
            </div>
          ),
        )}
      </div>
      {piezaTocada?.tipo === "acorde" && (
        <NotasDelAcorde texto={piezaTocada.texto} semitonos={semitonos} tonica={tonica} pref={pref} />
      )}
    </div>
  );
}

function NotasDelAcorde({ texto, semitonos, tonica, pref }: { texto: string; semitonos: number; tonica: string; pref: Preferencia }) {
  const acorde = transponerAcorde(texto, semitonos, pref);
  const alturas = alturasAcorde(texto, semitonos);
  // La tonalidad también se mueve: una nota está "en tonalidad" igual antes y después de transponer.
  const escala = tonica ? alturasTonalidad(tonalidadDeAltura(claseDeAltura(tonica) + semitonos)) : null;
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 border-t-2 border-sutil pt-2.5 text-sm">
      <span className="font-bold">{acorde && <TextoAcorde acorde={acorde} />}</span>
      <span className="text-tinta-suave">·</span>
      {alturas ? (
        alturas.map((a) => (
          <NombreNota
            key={a}
            nota={nombreSimple(a, pref)}
            className={cx("font-semibold", escala && !escala.has(a) ? "text-rojo" : "text-tinta")}
          />
        ))
      ) : (
        <span className="text-tinta-suave italic">calidad no reconocida</span>
      )}
      {escala && <span className="etiqueta ml-auto text-tinta-suave">rojo = fuera de la tonalidad</span>}
    </div>
  );
}

interface PropsControles {
  verGrados: boolean;
  puedeVerGrados: boolean;
  onGrados: () => void;
  onTamano: (cambio: number) => void;
  textoCopiar: () => string;
}

/** Grados, tamaño de letra y copiar. */
export function ControlesSalida({ verGrados, puedeVerGrados, onGrados, onTamano, textoCopiar }: PropsControles) {
  const avisar = useAviso();
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(textoCopiar());
      avisar({ texto: "Acordes copiados.", duracionMs: 1800 });
    } catch {
      avisar({ texto: "No se pudo copiar." });
    }
  };
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Chip
        tono="azul"
        seleccionado={verGrados && puedeVerGrados}
        disabled={!puedeVerGrados}
        onClick={onGrados}
        title={puedeVerGrados ? "Mostrar grados" : "Elige la tónica para ver los grados"}
        className="disabled:opacity-40"
      >
        I ii
      </Chip>
      <Chip tono="hundido" onClick={() => onTamano(-1)} aria-label="Letra más chica">
        A−
      </Chip>
      <Chip tono="hundido" onClick={() => onTamano(1)} aria-label="Letra más grande">
        A+
      </Chip>
      <Chip tono="rojo" onClick={() => void copiar()} aria-label="Copiar" className="ml-auto">
        <IconoCopiar tamano={16} />
      </Chip>
    </div>
  );
}

/** Texto plano transpuesto, con la misma escritura que se ve. */
export function textoParaCopiar(texto: string, semitonos: number, tonalidadSalida: string, preferencia: Preferencia) {
  return transponerTexto(texto, semitonos, tonalidadSalida ? preferenciaDeTonalidad(tonalidadSalida) : preferencia);
}

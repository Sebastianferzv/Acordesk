"use client";

import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { crearAlmacenLocal } from "@/lib/almacenLocal";
import { fechaLocal } from "@/lib/fechas";
import { INSTRUMENTOS } from "@/lib/teoria/notas";
import { useAviso } from "@/ui/Aviso";
import { Bloque } from "@/ui/Bloque";
import { Boton } from "@/ui/Boton";
import { EntradaRapida } from "@/ui/Campos";
import { Chip } from "@/ui/Chip";
import { cx } from "@/ui/cx";
import { Encabezado } from "@/ui/Encabezado";
import { IconoCerrar, IconoFlecha } from "@/ui/Iconos";
import { NombreNota } from "@/ui/NombreNota";
import { guardarTema, useTema, type Tema } from "@/ui/tema";
import { cargarDatosDeEjemplo } from "../datos/ejemplo";
import { pedirPersistencia } from "../datos/persistencia";
import { diasDesdeUltimoRespaldo, ErrorRespaldo, exportarRespaldo, importarRespaldo } from "../datos/respaldo";
import { guardarAjustes, useAjustes } from "./ajustes";

const TEMAS: { valor: Tema; etiqueta: string }[] = [
  { valor: "claro", etiqueta: "Crema" },
  { valor: "oscuro", etiqueta: "Oscuro" },
  { valor: "sistema", etiqueta: "Sistema" },
];

/** Modo demo: muestra el botón de datos de ejemplo fuera de desarrollo (localStorage "bitacora.demo" = true). */
const almacenDemo = crearAlmacenLocal<boolean>("bitacora.demo", false);

function Segmentado<T extends string>({
  etiqueta,
  opciones,
  valor,
  onCambiar,
}: {
  etiqueta: string;
  opciones: { valor: T; etiqueta: ReactNode }[];
  valor: T;
  onCambiar: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={etiqueta} className="grid border-2 border-linea" style={{ gridTemplateColumns: `repeat(${opciones.length}, 1fr)` }}>
      {opciones.map((o) => (
        <button
          key={o.valor}
          type="button"
          role="radio"
          aria-checked={valor === o.valor}
          onClick={() => onCambiar(o.valor)}
          className={cx(
            "h-11 border-r-2 border-linea text-sm font-semibold last:border-r-0",
            valor === o.valor ? "bg-tinta text-fondo" : "bg-superficie",
          )}
        >
          {o.etiqueta}
        </button>
      ))}
    </div>
  );
}

export function PantallaAjustes() {
  const avisar = useAviso();
  const tema = useTema();
  const ajustes = useAjustes();
  const demo = almacenDemo.useAlmacen();
  const diasDesdeRespaldo = useLiveQuery(() => diasDesdeUltimoRespaldo(), []);
  const almacenamiento = useLiveQuery(async () => {
    const persistente = (await navigator.storage?.persisted?.()) ?? false;
    const estimado = await navigator.storage?.estimate?.();
    return { persistente, usoMb: estimado?.usage ? estimado.usage / 1_048_576 : null };
  }, []);
  const archivo = useRef<HTMLInputElement>(null);
  const [ocupado, setOcupado] = useState(false);

  const importar = async (f: File) => {
    setOcupado(true);
    try {
      const { guardados } = await importarRespaldo(f);
      avisar({ texto: guardados ? `Listo: ${guardados} registros importados o actualizados.` : "No había nada nuevo en el respaldo." });
    } catch (e) {
      avisar({ texto: e instanceof ErrorRespaldo ? e.message : "No se pudo importar el archivo." });
    } finally {
      setOcupado(false);
    }
  };


  return (
    <>
      <Encabezado titulo="Ajustes" volverA="/bitacora" />
      <div className="space-y-5 px-4 pt-5">
        <Bloque titulo="Instrumento" acento={{ forma: "circulo", color: "rojo" }}>
          <div className="space-y-2 p-4">
            {INSTRUMENTOS.map((i) => (
              <button
                key={i.clave}
                type="button"
                aria-pressed={ajustes.instrumento === i.clave}
                onClick={() => guardarAjustes({ instrumento: i.clave })}
                className={cx(
                  "flex w-full items-center gap-3 border-2 border-linea p-3 text-left",
                  ajustes.instrumento === i.clave ? "bg-tinta text-fondo" : "bg-superficie",
                )}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-current text-sm font-bold">
                  <NombreNota nota={i.clave} notacion={ajustes.notacion} />
                </span>
                <span>
                  <span className="block font-semibold">{i.nombre}</span>
                  <span className={cx("block text-xs", ajustes.instrumento === i.clave ? "opacity-80" : "text-tinta-suave")}>{i.detalle}</span>
                </span>
              </button>
            ))}
            <p className="pt-1 text-xs text-tinta-suave">Las escalas y tonalidades se muestran también escritas para este instrumento.</p>
          </div>
        </Bloque>

        <Bloque titulo="Notas" acento={{ forma: "cuadrado", color: "azul" }}>
          <div className="space-y-3 p-4">
            <Segmentado
              etiqueta="Notación"
              valor={ajustes.notacion}
              onCambiar={(notacion) => guardarAjustes({ notacion })}
              opciones={[
                { valor: "letras", etiqueta: "C D E" },
                { valor: "solfeo", etiqueta: "Do Re Mi" },
              ]}
            />
            <Segmentado
              etiqueta="Alteraciones preferidas"
              valor={ajustes.alteraciones}
              onCambiar={(alteraciones) => guardarAjustes({ alteraciones })}
              opciones={[
                { valor: "bemoles", etiqueta: <>Bemoles (<NombreNota nota="Db" notacion={ajustes.notacion} />)</> },
                { valor: "sostenidos", etiqueta: <>Sostenidos (<NombreNota nota="C#" notacion={ajustes.notacion} />)</> },
              ]}
            />
            <p className="text-xs text-tinta-suave">La preferencia solo decide los empates, como F♯ o G♭ mayor.</p>
          </div>
        </Bloque>

        <Bloque titulo="Etiquetas rápidas" acento={{ forma: "triangulo", color: "amarillo" }}>
          <div className="space-y-3 p-4">
            <div className="flex flex-wrap gap-2">
              {ajustes.etiquetasRapidas.map((e) => (
                <Chip
                  key={e}
                  aria-label={`Quitar ${e}`}
                  onClick={() => guardarAjustes({ etiquetasRapidas: ajustes.etiquetasRapidas.filter((x) => x !== e) })}
                >
                  {e} <IconoCerrar tamano={10} />
                </Chip>
              ))}
            </div>
            <EntradaRapida
              placeholder="Nueva etiqueta (ej. Ensayo general)"
              onAgregar={(t) =>
                guardarAjustes({ etiquetasRapidas: [...new Set([...ajustes.etiquetasRapidas, t])] })
              }
            />
          </div>
        </Bloque>

        <Bloque titulo="Tema" acento={{ forma: "circulo", color: "amarillo" }}>
          <div className="p-4">
            <Segmentado etiqueta="Tema" valor={tema} onCambiar={guardarTema} opciones={TEMAS} />
          </div>
        </Bloque>

        <Bloque titulo="Respaldo" acento={{ forma: "cuadrado", color: "azul" }}>
          <div className="space-y-3 p-4">
            <p className="text-sm leading-snug">
              Tus datos viven solo en este dispositivo. Exporta un respaldo de vez en cuando, y úsalo para pasar
              tus datos a otro equipo: al importar se combinan, sin duplicar.
            </p>
            <p className="etiqueta text-tinta-suave">
              {diasDesdeRespaldo === undefined
                ? ""
                : diasDesdeRespaldo === null
                ? "Nunca has hecho un respaldo"
                : diasDesdeRespaldo === 0
                  ? "Último respaldo: hoy"
                  : `Último respaldo: hace ${diasDesdeRespaldo} ${diasDesdeRespaldo === 1 ? "día" : "días"}`}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Boton variante="azul" onClick={() => void exportarRespaldo().catch(() => avisar({ texto: "No se pudo exportar." }))}>
                Exportar
              </Boton>
              <Boton variante="secundario" disabled={ocupado} onClick={() => archivo.current?.click()}>
                Importar
              </Boton>
            </div>
            <input
              ref={archivo}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void importar(f);
                e.target.value = "";
              }}
            />
            <p className="text-xs text-tinta-suave">El respaldo no incluye el audio de las grabaciones; esas se comparten una por una.</p>
          </div>
        </Bloque>

        <Bloque titulo="Almacenamiento" acento={{ forma: "semicirculo", color: "rojo" }}>
          <div className="space-y-2 p-4 text-sm">
            <p>
              {almacenamiento?.persistente
                ? "Protegido: el navegador no borrará tus datos."
                : "Sin protección: si el dispositivo se queda sin espacio, el navegador podría borrar datos."}
              {almacenamiento?.usoMb != null && ` Uso: ${almacenamiento.usoMb.toFixed(1)} MB.`}
            </p>
            {!almacenamiento?.persistente && (
              <Boton
                variante="secundario"
                onClick={async () => {
                  const ok = await pedirPersistencia();
                  avisar({ texto: ok ? "Datos protegidos." : "El navegador no lo permitió todavía. Instalar la app ayuda." });
                }}
              >
                Pedir protección
              </Boton>
            )}
          </div>
        </Bloque>

        <Bloque titulo="Más" acento={{ forma: "barras", color: "tinta" }}>
          <Link href="/bitacora/grabaciones" className="flex items-center justify-between gap-3 border-b-[3px] border-linea p-4 font-medium">
            Todas las grabaciones <IconoFlecha />
          </Link>
          <Link href="/bitacora/muestrario" className="flex items-center justify-between gap-3 p-4 font-medium">
            Muestrario de diseño <IconoFlecha />
          </Link>
          {(process.env.NODE_ENV === "development" || demo) && (
            <button
              type="button"
              onClick={async () => {
                await cargarDatosDeEjemplo(fechaLocal());
                avisar({ texto: "Datos de ejemplo cargados." });
              }}
              className="flex w-full items-center justify-between gap-3 border-t-[3px] border-linea p-4 text-left font-medium text-rojo"
            >
              Cargar datos de ejemplo <IconoFlecha />
            </button>
          )}
        </Bloque>

        <p className="etiqueta pb-2 text-tinta-suave">Bitácora de viaje · v1.0</p>
      </div>
    </>
  );
}

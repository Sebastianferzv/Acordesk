"use client";

import { useEffect, useEffectEvent, useRef, useState, type ReactNode } from "react";
import { cx } from "./cx";
import { IconoMas } from "./Iconos";

export const clasesEntrada =
  "w-full border-2 border-sutil bg-superficie px-3.5 text-base text-tinta placeholder:text-tinta-suave/70 focus-visible:border-transparent focus-visible:outline-offset-0";

/** Etiqueta + contenido. */
export function Campo({ etiqueta, children, className }: { etiqueta: string; children: ReactNode; className?: string }) {
  return (
    <label className={cx("block", className)}>
      <span className="etiqueta mb-1.5 block text-tinta-suave">{etiqueta}</span>
      {children}
    </label>
  );
}

interface PropsCampoTexto {
  valor: string | undefined;
  /** Se llama al dejar de escribir (con una pausa) y al salir del campo. */
  onGuardar: (texto: string) => void;
  multilinea?: boolean;
  placeholder?: string;
  className?: string;
  etiquetaAccesible?: string;
}

/**
 * Texto que se guarda solo. Mantiene su propio estado mientras se escribe, así la
 * escritura no se ve interrumpida por las actualizaciones de la base de datos.
 * Para cambiar de registro, el padre debe cambiar la `key`.
 */
export function CampoTexto({ valor, onGuardar, multilinea, placeholder, className, etiquetaAccesible }: PropsCampoTexto) {
  const [texto, setTexto] = useState(valor ?? "");
  const pendiente = useRef(false);
  const guardarAhora = () => {
    if (!pendiente.current) return;
    pendiente.current = false;
    onGuardar(texto.trim());
  };
  const guardar = useEffectEvent(guardarAhora);

  useEffect(() => {
    if (!pendiente.current) return;
    const t = setTimeout(guardar, 600);
    return () => clearTimeout(t);
  }, [texto]);

  // Al desmontar (por ejemplo, al navegar) se guarda lo pendiente.
  useEffect(() => () => guardar(), []);

  const comunes = {
    value: texto,
    placeholder,
    "aria-label": etiquetaAccesible,
    onChange: (e: { target: { value: string } }) => {
      pendiente.current = true;
      setTexto(e.target.value);
    },
    onBlur: guardarAhora,
  };

  return multilinea ? (
    <textarea {...comunes} rows={4} className={cx(clasesEntrada, "min-h-28 resize-y py-2.5 leading-snug", className)} />
  ) : (
    <input {...comunes} type="text" className={cx(clasesEntrada, "h-12", className)} />
  );
}

interface PropsEntradaRapida {
  placeholder: string;
  onAgregar: (texto: string) => void | Promise<void>;
  etiquetaBoton?: string;
  /** Avisa el texto mientras se escribe (por ejemplo, para filtrar). */
  onEscribir?: (texto: string) => void;
  tipo?: "text" | "url";
}

/** Campo de una línea con botón "+": agrega con Enter o tocando el botón. */
export function EntradaRapida({ placeholder, onAgregar, etiquetaBoton = "Agregar", onEscribir, tipo = "text" }: PropsEntradaRapida) {
  const [texto, setTexto] = useState("");
  const agregar = async () => {
    const limpio = texto.trim();
    if (!limpio) return;
    await onAgregar(limpio);
    setTexto("");
    onEscribir?.("");
  };
  return (
    <div className="flex">
      <input
        type={tipo}
        inputMode={tipo === "url" ? "url" : undefined}
        value={texto}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => {
          setTexto(e.target.value);
          onEscribir?.(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            void agregar();
          }
        }}
        className={cx(clasesEntrada, "h-12 min-w-0 flex-1 rounded-r-none border-r-0")}
      />
      <button
        type="button"
        onClick={() => void agregar()}
        aria-label={etiquetaBoton}
        className="inline-flex size-12 shrink-0 items-center justify-center rounded-l-none border-2 border-sutil bg-hundido text-tinta active:translate-y-px"
      >
        <IconoMas tamano={18} />
      </button>
    </div>
  );
}

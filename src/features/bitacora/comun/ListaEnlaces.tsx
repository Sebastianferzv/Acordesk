"use client";

import { useState } from "react";
import { analizarEnlace } from "@/lib/enlaces";
import { uuid } from "@/lib/uuid";
import { useAviso } from "@/ui/Aviso";
import { EntradaRapida } from "@/ui/Campos";
import { Forma } from "@/ui/Forma";
import { IconoCerrar, IconoFlecha } from "@/ui/Iconos";
import type { Enlace } from "../datos/tipos";

interface Props {
  enlaces: Enlace[];
  onCambiar: (enlaces: Enlace[]) => void;
}

/** Links de YouTube (se ven dentro de la app), Instagram y páginas web. */
export function ListaEnlaces({ enlaces, onCambiar }: Props) {
  const avisar = useAviso();

  const agregar = (texto: string) => {
    const a = analizarEnlace(texto);
    if (!a) {
      avisar({ texto: "Ese link no parece válido." });
      return;
    }
    onCambiar([...enlaces, { id: uuid(), url: a.url, inicioSeg: a.inicioSeg }]);
  };

  return (
    <div className="space-y-3">
      {enlaces.map((e) => (
        <TarjetaEnlace
          key={e.id}
          enlace={e}
          onQuitar={() => {
            onCambiar(enlaces.filter((x) => x.id !== e.id));
            avisar({ texto: "Link quitado.", accion: { etiqueta: "Deshacer", alHacer: () => onCambiar(enlaces) } });
          }}
        />
      ))}
      <EntradaRapida tipo="url" placeholder="Pega un link (YouTube, Instagram, web)" onAgregar={agregar} etiquetaBoton="Agregar link" />
    </div>
  );
}

function BotonQuitar({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Quitar link"
      className="inline-flex size-10 shrink-0 items-center justify-center text-tinta-suave"
    >
      <IconoCerrar tamano={14} />
    </button>
  );
}

function TarjetaEnlace({ enlace, onQuitar }: { enlace: Enlace; onQuitar: () => void }) {
  const [reproduciendo, setReproduciendo] = useState(false);
  const a = analizarEnlace(enlace.url);
  if (!a) return null;

  if (a.tipo === "youtube" && a.youtubeId) {
    const params = new URLSearchParams({ playsinline: "1", rel: "0", autoplay: "1" });
    if (enlace.inicioSeg) params.set("start", String(enlace.inicioSeg));
    return (
      <div className="border-[3px] border-linea bg-superficie">
        <div className="relative aspect-video bg-tinta">
          {reproduciendo ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${a.youtubeId}?${params}`}
              title={enlace.titulo ?? "Video de YouTube"}
              referrerPolicy="strict-origin-when-cross-origin"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 size-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setReproduciendo(true)}
              aria-label="Reproducir video"
              className="group absolute inset-0 size-full"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- miniatura externa de YouTube */}
              <img
                src={`https://i.ytimg.com/vi/${a.youtubeId}/hqdefault.jpg`}
                alt=""
                className="size-full object-cover"
                loading="lazy"
              />
              <span className="absolute inset-0 m-auto flex size-16 items-center justify-center rounded-full border-[3px] border-linea bg-rojo text-sobre-color">
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
                  <polygon points="7,3 21,12 7,21" fill="currentColor" />
                </svg>
              </span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 border-t-[3px] border-linea pl-3">
          <span className="etiqueta flex-1 truncate py-2 text-tinta-suave">
            YouTube{enlace.inicioSeg ? ` · desde ${Math.floor(enlace.inicioSeg / 60)}:${String(enlace.inicioSeg % 60).padStart(2, "0")}` : ""}
          </span>
          <a href={a.url} target="_blank" rel="noopener noreferrer" className="etiqueta px-2 py-2" aria-label="Abrir en YouTube">
            Abrir
          </a>
          <BotonQuitar onClick={onQuitar} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center border-[3px] border-linea bg-superficie">
      <a href={a.url} target="_blank" rel="noopener noreferrer" className="flex min-w-0 flex-1 items-center gap-3 p-3">
        <Forma
          tipo={a.tipo === "instagram" ? "circulo" : "cuadrado"}
          relleno={a.tipo === "instagram" ? "rojo" : "azul"}
          trazo="ninguno"
          tamano={20}
          className="shrink-0"
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium">{enlace.titulo ?? (a.tipo === "instagram" ? "Instagram" : a.dominio)}</span>
          <span className="block truncate text-xs text-tinta-suave">{a.url.replace(/^https?:\/\/(www\.)?/, "")}</span>
        </span>
        <IconoFlecha tamano={16} className="shrink-0" />
      </a>
      <BotonQuitar onClick={onQuitar} />
    </div>
  );
}

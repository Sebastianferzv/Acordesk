"use client";

import { useEffect } from "react";
import { crearAlmacenLocal } from "@/lib/almacenLocal";
import { CLAVE_TEMA, COLOR_BARRA } from "./temaScript";

export type Tema = "claro" | "oscuro" | "sistema";

const almacenTema = crearAlmacenLocal<Tema>(CLAVE_TEMA, "claro", (v) =>
  v === "oscuro" || v === "sistema" ? v : "claro",
);

// Debe coincidir con la lógica de SCRIPT_TEMA.
function resolverOscuro(tema: Tema): boolean {
  return tema === "oscuro" || (tema === "sistema" && window.matchMedia("(prefers-color-scheme: dark)").matches);
}

function sincronizarBarraDelSistema() {
  const oscuro = document.documentElement.getAttribute("data-theme") === "dark";
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", oscuro ? COLOR_BARRA.oscuro : COLOR_BARRA.claro);
}

function aplicarTema(tema: Tema) {
  if (resolverOscuro(tema)) document.documentElement.setAttribute("data-theme", "dark");
  else document.documentElement.removeAttribute("data-theme");
  sincronizarBarraDelSistema();
}

export const useTema = () => almacenTema.useAlmacen();

export function guardarTema(tema: Tema) {
  almacenTema.guardar(tema);
  aplicarTema(tema);
}

/**
 * Mantiene el tema al día mientras la app está abierta. El tema inicial ya lo aplicó
 * SCRIPT_TEMA, así que aquí solo se sincroniza la barra del sistema y se sigue
 * al sistema operativo cuando el tema es "sistema".
 */
export function useSeguirTema() {
  const tema = useTema();
  useEffect(() => {
    sincronizarBarraDelSistema();
    if (tema !== "sistema") return;
    const consulta = window.matchMedia("(prefers-color-scheme: dark)");
    const alCambiar = () => aplicarTema("sistema");
    consulta.addEventListener("change", alCambiar);
    return () => consulta.removeEventListener("change", alCambiar);
  }, [tema]);
}

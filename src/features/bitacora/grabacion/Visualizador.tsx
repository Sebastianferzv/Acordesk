"use client";

import { useEffect, useRef } from "react";

/** Visualizador geométrico: barras de bloques que siguen el volumen del micrófono. */
export function Visualizador({ analizador }: { analizador: AnalyserNode }) {
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = lienzo.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const estilos = getComputedStyle(document.documentElement);
    const colores = ["--azul", "--rojo", "--amarillo"].map((v) => estilos.getPropertyValue(v).trim());
    const datos = new Uint8Array(analizador.frequencyBinCount);
    const barras = 16;
    let cuadro = 0;

    const dibujar = () => {
      const { width, height } = canvas;
      analizador.getByteFrequencyData(datos);
      ctx.clearRect(0, 0, width, height);
      const ancho = width / barras;
      for (let i = 0; i < barras; i++) {
        const nivel = datos[Math.min(datos.length - 1, i + 1)] / 255;
        const alto = Math.max(4, nivel * height);
        ctx.fillStyle = colores[i % 3];
        ctx.fillRect(i * ancho + 2, height - alto, ancho - 4, alto);
      }
      cuadro = requestAnimationFrame(dibujar);
    };
    dibujar();
    return () => cancelAnimationFrame(cuadro);
  }, [analizador]);

  return <canvas ref={lienzo} width={320} height={72} className="h-[72px] w-full" aria-hidden />;
}

"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";

export type EstadoGrabador = "listo" | "pidiendo" | "grabando" | "error";

interface Resultado {
  blob: Blob;
  tipoMime: string;
  duracionSeg: number;
}

// mp4 primero: se reproduce en todos lados (incluido iOS); si no, webm/opus.
const TIPOS = ["audio/mp4", "audio/webm;codecs=opus", "audio/webm"];

/**
 * Graba audio con MediaRecorder. Desactiva el procesamiento "de llamada" del micrófono
 * (cancelación de eco, supresión de ruido, ganancia automática), que deforma el sonido del saxo.
 */
export function useGrabador(alTerminar: (r: Resultado) => void | Promise<void>) {
  const [estado, setEstado] = useState<EstadoGrabador>("listo");
  const [inicio, setInicio] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analizador, setAnalizador] = useState<AnalyserNode | null>(null);
  const grabador = useRef<MediaRecorder | null>(null);
  const limpiar = useRef<() => void>(() => {});
  // Última versión del callback, para llamarlo desde el evento `stop` del grabador.
  const alTerminarActual = useRef(alTerminar);
  useEffect(() => {
    alTerminarActual.current = alTerminar;
  });

  const detener = () => {
    if (grabador.current?.state === "recording") grabador.current.stop();
  };
  const detenerDesdeEfecto = useEffectEvent(detener);

  // iOS corta el micrófono si la app pasa a segundo plano: se detiene y se guarda lo grabado.
  useEffect(() => {
    const alOcultar = () => {
      if (document.visibilityState === "hidden") detenerDesdeEfecto();
    };
    document.addEventListener("visibilitychange", alOcultar);
    return () => {
      document.removeEventListener("visibilitychange", alOcultar);
      detenerDesdeEfecto();
      limpiar.current();
    };
  }, []);

  /** Debe llamarse desde un toque (iOS exige un gesto para el micrófono y el audio). */
  const iniciar = async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setEstado("error");
      setError("Este navegador no permite grabar. Abre la app con HTTPS o desde la app instalada.");
      return;
    }
    // El AudioContext se crea en el mismo toque, antes de cualquier await.
    const contexto = new AudioContext();
    setEstado("pidiendo");
    let flujo: MediaStream;
    try {
      flujo = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
    } catch {
      void contexto.close();
      setEstado("error");
      setError("No hay permiso para usar el micrófono.");
      return;
    }

    const tipo = TIPOS.find((t) => MediaRecorder.isTypeSupported(t));
    const rec = new MediaRecorder(flujo, { ...(tipo ? { mimeType: tipo } : {}), audioBitsPerSecond: 96_000 });
    const partes: Blob[] = [];
    const comienzo = Date.now();

    const analyser = contexto.createAnalyser();
    analyser.fftSize = 64;
    contexto.createMediaStreamSource(flujo).connect(analyser); // no se conecta a los parlantes
    void contexto.resume();

    let candado: WakeLockSentinel | null = null;
    navigator.wakeLock
      ?.request("screen")
      .then((c) => (candado = c))
      .catch(() => {});

    limpiar.current = () => {
      flujo.getTracks().forEach((t) => t.stop());
      void contexto.close().catch(() => {});
      void candado?.release().catch(() => {});
      limpiar.current = () => {};
    };

    rec.ondataavailable = (e) => {
      if (e.data.size > 0) partes.push(e.data);
    };
    rec.onstop = () => {
      limpiar.current();
      grabador.current = null;
      setAnalizador(null);
      setInicio(null);
      setEstado("listo");
      const tipoMime = rec.mimeType || tipo || "audio/webm";
      const blob = new Blob(partes, { type: tipoMime });
      if (blob.size > 0) void alTerminarActual.current({ blob, tipoMime, duracionSeg: Math.max(1, Math.round((Date.now() - comienzo) / 1000)) });
    };

    grabador.current = rec;
    rec.start(1000);
    setAnalizador(analyser);
    setInicio(comienzo);
    setEstado("grabando");
  };

  return { estado, error, inicio, analizador, iniciar, detener };
}

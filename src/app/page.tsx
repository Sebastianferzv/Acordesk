"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { APPS, almacenUltimaApp, almacenUltimaRuta } from "@/features/apps/apps";

/** Inicio: abre la última pantalla de la última app usada. */
export default function Inicio() {
  const router = useRouter();
  useEffect(() => {
    const app = APPS.find((a) => a.id === almacenUltimaApp.leer()) ?? APPS[0];
    router.replace(almacenUltimaRuta.leer()[app.id] ?? app.raiz);
  }, [router]);
  return null;
}

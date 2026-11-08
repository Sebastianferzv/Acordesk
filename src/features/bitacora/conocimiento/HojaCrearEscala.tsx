"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Boton } from "@/ui/Boton";
import { clasesEntrada } from "@/ui/Campos";
import { cx } from "@/ui/cx";
import { Hoja } from "@/ui/Hoja";
import { escalas } from "../datos/repositorio";
import { EditorGrados } from "./EditorGrados";

/** Crear una escala propia: nombre y grados. */
export function HojaCrearEscala({ abierta, onCerrar }: { abierta: boolean; onCerrar: () => void }) {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [grados, setGrados] = useState<string[]>(["1"]);

  const crear = async () => {
    const escala = await escalas.crear({ nombre: nombre.trim() || "Mi escala", grados });
    setNombre("");
    setGrados(["1"]);
    onCerrar();
    router.push(`/bitacora/escala?id=${escala.id}`);
  };

  return (
    <Hoja abierta={abierta} onCerrar={onCerrar} titulo="Crear escala">
      <div className="space-y-4 pb-2">
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de la escala"
          aria-label="Nombre de la escala"
          className={cx(clasesEntrada, "h-12")}
        />
        <EditorGrados grados={grados} onCambiar={setGrados} />
        <Boton anchoCompleto disabled={grados.length < 3} onClick={() => void crear()}>
          Crear
        </Boton>
      </div>
    </Hoja>
  );
}

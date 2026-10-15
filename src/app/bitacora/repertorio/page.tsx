import type { Metadata } from "next";
import { Proximamente } from "@/features/bitacora/comun/Proximamente";

export const metadata: Metadata = { title: "Repertorio" };

export default function Page() {
  return (
    <Proximamente titulo="Repertorio" forma={{ tipo: "triangulo", color: "amarillo" }} fase={1}>
      <p>Tus canciones con su estado (en progreso, pulir, sacada), las horas que les has dedicado y su historial.</p>
    </Proximamente>
  );
}

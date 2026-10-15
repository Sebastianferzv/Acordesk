import type { Metadata } from "next";
import { Proximamente } from "@/features/bitacora/comun/Proximamente";

export const metadata: Metadata = { title: "Estadísticas" };

export default function Page() {
  return (
    <Proximamente titulo="Estadísticas" forma={{ tipo: "barras", color: "multicolor" }} fase={3}>
      <p>Horas por semana y por mes, horas por canción, rachas, valoración en el tiempo y canciones sacadas.</p>
    </Proximamente>
  );
}

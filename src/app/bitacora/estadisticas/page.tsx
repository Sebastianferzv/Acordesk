import type { Metadata } from "next";
import { PantallaEstadisticas } from "@/features/bitacora/estadisticas/PantallaEstadisticas";

export const metadata: Metadata = { title: "Estadísticas" };

export default function Page() {
  return <PantallaEstadisticas />;
}

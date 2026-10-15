import type { Metadata } from "next";
import { PantallaEscala } from "@/features/bitacora/conocimiento/PantallaEscala";

export const metadata: Metadata = { title: "Escala" };

export default function Page() {
  return <PantallaEscala />;
}

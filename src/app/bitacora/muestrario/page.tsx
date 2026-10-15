import type { Metadata } from "next";
import { PantallaMuestrario } from "@/features/bitacora/muestrario/PantallaMuestrario";

export const metadata: Metadata = { title: "Muestrario" };

export default function Page() {
  return <PantallaMuestrario />;
}

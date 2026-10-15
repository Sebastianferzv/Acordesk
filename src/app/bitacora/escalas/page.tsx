import type { Metadata } from "next";
import { PantallaEscalas } from "@/features/bitacora/conocimiento/PantallaEscalas";

export const metadata: Metadata = { title: "Escalas" };

export default function Page() {
  return <PantallaEscalas />;
}

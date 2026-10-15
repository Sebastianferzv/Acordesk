import type { Metadata } from "next";
import { PantallaAjustes } from "@/features/bitacora/ajustes/PantallaAjustes";

export const metadata: Metadata = { title: "Ajustes" };

export default function Page() {
  return <PantallaAjustes />;
}

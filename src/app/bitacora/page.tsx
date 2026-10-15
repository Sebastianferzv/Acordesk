import type { Metadata } from "next";
import { PantallaEnsayos } from "@/features/bitacora/ensayos/PantallaEnsayos";

export const metadata: Metadata = { title: "Ensayos" };

export default function Page() {
  return <PantallaEnsayos />;
}

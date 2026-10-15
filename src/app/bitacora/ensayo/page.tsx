import type { Metadata } from "next";
import { PantallaEnsayo } from "@/features/bitacora/ensayos/PantallaEnsayo";

export const metadata: Metadata = { title: "Ensayo" };

export default function Page() {
  return <PantallaEnsayo />;
}

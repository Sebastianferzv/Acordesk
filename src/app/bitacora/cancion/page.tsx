import type { Metadata } from "next";
import { PantallaCancion } from "@/features/bitacora/repertorio/PantallaCancion";

export const metadata: Metadata = { title: "Canción" };

export default function Page() {
  return <PantallaCancion />;
}

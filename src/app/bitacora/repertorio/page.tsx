import type { Metadata } from "next";
import { PantallaRepertorio } from "@/features/bitacora/repertorio/PantallaRepertorio";

export const metadata: Metadata = { title: "Repertorio" };

export default function Page() {
  return <PantallaRepertorio />;
}

import type { Metadata } from "next";
import { PantallaGrabaciones } from "@/features/bitacora/grabacion/PantallaGrabaciones";

export const metadata: Metadata = { title: "Grabaciones" };

export default function Page() {
  return <PantallaGrabaciones />;
}

import type { Metadata } from "next";
import { PantallaCronometro } from "@/features/bitacora/cronometro/PantallaCronometro";

export const metadata: Metadata = { title: "Cronómetro" };

export default function Page() {
  return <PantallaCronometro />;
}

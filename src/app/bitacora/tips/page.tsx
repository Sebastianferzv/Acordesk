import type { Metadata } from "next";
import { PantallaTips } from "@/features/bitacora/conocimiento/PantallaTips";

export const metadata: Metadata = { title: "Tips" };

export default function Page() {
  return <PantallaTips />;
}

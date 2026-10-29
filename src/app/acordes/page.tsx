import type { Metadata } from "next";
import { PantallaAcordes } from "@/features/acordes/PantallaAcordes";

export const metadata: Metadata = { title: "Acordes" };

export default function Page() {
  return <PantallaAcordes />;
}

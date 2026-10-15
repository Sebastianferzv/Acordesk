import type { Metadata } from "next";
import { Proximamente } from "@/features/bitacora/comun/Proximamente";

export const metadata: Metadata = { title: "Conocimiento" };

export default function Page() {
  return (
    <Proximamente titulo="Conocimiento" forma={{ tipo: "semicirculo", color: "rojo" }} fase={2}>
      <p>Las escalas que has aprendido, en cualquier tonalidad y transpuestas para saxo alto, con teclado y tips.</p>
      <p>También los tips que vayas promoviendo desde tus ensayos.</p>
    </Proximamente>
  );
}

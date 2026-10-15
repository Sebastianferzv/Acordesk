import type { ReactNode } from "react";
import { Bloque } from "@/ui/Bloque";
import { Encabezado } from "@/ui/Encabezado";
import type { ColorBauhaus, TipoForma } from "@/ui/Forma";

interface Props {
  titulo: string;
  forma: { tipo: TipoForma; color: ColorBauhaus | "multicolor" };
  fase: number;
  children: ReactNode;
}

/** Pantalla provisoria para las secciones que llegan en fases siguientes. */
export function Proximamente({ titulo, forma, fase, children }: Props) {
  return (
    <>
      <Encabezado titulo={titulo} forma={forma} />
      <div className="px-4 pt-5">
        <Bloque titulo={`En construcción · fase ${fase}`} acento={{ forma: "triangulo", color: "amarillo" }}>
          <div className="space-y-2 p-4 text-[0.95rem] leading-snug">{children}</div>
        </Bloque>
      </div>
    </>
  );
}

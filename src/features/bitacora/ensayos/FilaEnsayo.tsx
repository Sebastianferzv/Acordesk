import Link from "next/link";
import { partesFecha } from "@/lib/fechas";
import { ValoracionFormas } from "@/ui/ValoracionFormas";
import type { Ensayo } from "../datos/tipos";
import { formatoDuracion } from "../estadisticas/calculos";
import { SelloEnsayo } from "./SelloEnsayo";

/** Una fila de la lista de ensayos: sello, fecha, resumen y duración. */
export function FilaEnsayo({ ensayo, href }: { ensayo: Ensayo; href?: string }) {
  const f = partesFecha(ensayo.fecha);
  const resumen = ensayo.titulo || ensayo.notas?.split("\n")[0] || "Ensayo sin notas";
  const detalles = [
    ensayo.etiquetas.join(" · "),
    ensayo.items.length > 0 && `${ensayo.items.length} ${ensayo.items.length === 1 ? "canción" : "canciones"}`,
    ensayo.aprendizajes.length > 0 &&
      `${ensayo.aprendizajes.length} ${ensayo.aprendizajes.length === 1 ? "aprendizaje" : "aprendizajes"}`,
  ].filter(Boolean);

  const contenido = (
    <>
      <SelloEnsayo
        semilla={ensayo.id}
        duracionMin={ensayo.duracionMin}
        valoracion={ensayo.valoracion}
        canciones={ensayo.items.length}
        conAprendizajes={ensayo.aprendizajes.length > 0}
        className="shrink-0"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="etiqueta">
            {f.diaSemana} {f.dia} {f.mes}
          </p>
          {ensayo.duracionMin ? (
            <p className="shrink-0 text-sm font-bold">{formatoDuracion(ensayo.duracionMin)}</p>
          ) : null}
        </div>
        <p className="mt-0.5 truncate text-[1.05rem] font-medium">{resumen}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-tinta-suave">
          {ensayo.valoracion ? <ValoracionFormas valor={ensayo.valoracion} tamano={11} /> : null}
          {detalles.length > 0 && <span className="truncate">{detalles.join(" · ")}</span>}
        </div>
      </div>
    </>
  );

  const clases = "flex items-center gap-3 border-b-[3px] border-linea bg-superficie p-3 last:border-b-0";
  return href ? (
    <Link href={href} className={clases}>
      {contenido}
    </Link>
  ) : (
    <div className={clases}>{contenido}</div>
  );
}

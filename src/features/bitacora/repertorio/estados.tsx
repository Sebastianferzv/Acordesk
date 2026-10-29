import { cx } from "@/ui/cx";
import { Forma, type ColorBauhaus } from "@/ui/Forma";
import type { Cancion, EstadoCancion } from "../datos/tipos";

export const ESTADOS: { valor: EstadoCancion; etiqueta: string; color: ColorBauhaus }[] = [
  { valor: "en_progreso", etiqueta: "En progreso", color: "azul" },
  { valor: "pulir", etiqueta: "Pulir", color: "amarillo" },
  { valor: "sacada", etiqueta: "Sacada", color: "rojo" },
];

export const datosEstado = (estado: EstadoCancion) => ESTADOS.find((e) => e.valor === estado) ?? ESTADOS[0];

/** Cambios a guardar al cambiar el estado: "sacada" registra el día. */
export function cambiosDeEstado(estado: EstadoCancion, hoy: string): Partial<Cancion> {
  return { estado, sacadaEn: estado === "sacada" ? hoy : undefined };
}

export function MarcaEstado({ estado, tamano = 18 }: { estado: EstadoCancion; tamano?: number }) {
  const e = datosEstado(estado);
  return <Forma tipo="triangulo" relleno={e.color} trazo="ninguno" tamano={tamano} titulo={e.etiqueta} />;
}

interface Props {
  estado: EstadoCancion;
  onCambiar: (estado: EstadoCancion) => void;
  compacto?: boolean;
}

/** Selector de estado de una canción (en progreso, pulir, sacada). */
export function SelectorEstado({ estado, onCambiar, compacto }: Props) {
  return (
    <div role="radiogroup" aria-label="Estado" className="grid grid-cols-3 border-2 border-sutil">
      {ESTADOS.map((e) => {
        const activo = e.valor === estado;
        return (
          <button
            key={e.valor}
            type="button"
            role="radio"
            aria-checked={activo}
            onClick={() => onCambiar(e.valor)}
            className={cx(
              "flex items-center justify-center gap-1.5 border-r-2 border-sutil font-medium last:border-r-0",
              compacto ? "h-9 text-xs" : "h-11 text-sm",
              activo ? "bg-tinta text-fondo" : "bg-superficie",
            )}
          >
            <Forma tipo="triangulo" relleno={e.color} trazo="ninguno" tamano={compacto ? 11 : 13} />
            {e.etiqueta}
          </button>
        );
      })}
    </div>
  );
}

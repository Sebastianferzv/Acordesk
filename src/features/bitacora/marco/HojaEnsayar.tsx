"use client";

import { useRouter } from "next/navigation";
import { fechaLocal } from "@/lib/fechas";
import { Forma, type ColorBauhaus, type TipoForma } from "@/ui/Forma";
import { Hoja } from "@/ui/Hoja";
import { IconoFlecha } from "@/ui/Iconos";
import { iniciarCronometro } from "../datos/cronometro";
import { pedirPersistencia } from "../datos/persistencia";
import { ensayos } from "../datos/repositorio";

interface Props {
  abierta: boolean;
  onCerrar: () => void;
}

/** Hoja del botón central: iniciar el cronómetro o registrar un ensayo. */
export function HojaEnsayar({ abierta, onCerrar }: Props) {
  const router = useRouter();

  // Los registros se crean en el toque (nunca en un efecto), para no duplicarlos.
  const iniciar = async () => {
    await iniciarCronometro(fechaLocal());
    onCerrar();
    router.push("/bitacora/cronometro");
    void pedirPersistencia();
  };

  const registrar = async () => {
    const ensayo = await ensayos.crear({ fecha: fechaLocal() });
    onCerrar();
    router.push(`/bitacora/ensayo?id=${ensayo.id}`);
    void pedirPersistencia();
  };

  return (
    <Hoja abierta={abierta} onCerrar={onCerrar} titulo="Ensayar">
      <div className="grid gap-3">
        <Opcion
          forma="circulo"
          color="rojo"
          titulo="Iniciar cronómetro"
          detalle="Mide el ensayo mientras tocas."
          onClick={() => void iniciar()}
        />
        <Opcion
          forma="cuadrado"
          color="azul"
          titulo="Registrar ensayo"
          detalle="Anota el de hoy o uno que ya hiciste."
          onClick={() => void registrar()}
        />
      </div>
    </Hoja>
  );
}

function Opcion({
  forma,
  color,
  titulo,
  detalle,
  onClick,
}: {
  forma: TipoForma;
  color: ColorBauhaus;
  titulo: string;
  detalle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-stretch border-[3px] border-linea bg-fondo text-left transition-transform active:translate-y-px"
    >
      <span className="flex w-20 shrink-0 items-center justify-center border-r-[3px] border-linea bg-superficie">
        <Forma tipo={forma} relleno={color} trazo="ninguno" tamano={40} />
      </span>
      <span className="flex flex-1 flex-col justify-center px-4 py-3">
        <span className="text-lg leading-tight font-bold uppercase">{titulo}</span>
        <span className="text-sm text-tinta-suave">{detalle}</span>
      </span>
      <span className="flex items-center pr-4">
        <IconoFlecha />
      </span>
    </button>
  );
}

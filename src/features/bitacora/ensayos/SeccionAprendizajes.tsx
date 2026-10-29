"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { uuid } from "@/lib/uuid";
import { useAviso } from "@/ui/Aviso";
import { Bloque } from "@/ui/Bloque";
import { EntradaRapida } from "@/ui/Campos";
import { Forma } from "@/ui/Forma";
import { IconoCerrar, IconoFlecha } from "@/ui/Iconos";
import { useTipsDeEnsayo } from "../datos/hooks";
import { ensayos, tips } from "../datos/repositorio";
import type { Aprendizaje, Ensayo } from "../datos/tipos";

export function SeccionAprendizajes({ ensayo }: { ensayo: Ensayo }) {
  const router = useRouter();
  const avisar = useAviso();
  const tipsDelEnsayo = useTipsDeEnsayo(ensayo.id) ?? [];
  const promovidos = new Set(tipsDelEnsayo.map((t) => t.origen?.aprendizajeId));

  const guardar = (aprendizajes: Aprendizaje[]) => void ensayos.actualizar(ensayo.id, { aprendizajes });

  const promover = async (a: Aprendizaje) => {
    await tips.crear({ texto: a.texto, origen: { ensayoId: ensayo.id, aprendizajeId: a.id } });
    avisar({
      texto: "Agregado a tu conocimiento.",
      accion: { etiqueta: "Ver", alHacer: () => router.push("/bitacora/tips") },
    });
  };

  const quitar = (a: Aprendizaje) => {
    const antes = ensayo.aprendizajes;
    guardar(antes.filter((x) => x.id !== a.id));
    avisar({ texto: "Aprendizaje quitado.", accion: { etiqueta: "Deshacer", alHacer: () => guardar(antes) } });
  };

  return (
    <Bloque titulo="Aprendizajes" acento={{ forma: "triangulo", color: "rojo" }}>
      <div className="space-y-2 p-4">
        {ensayo.aprendizajes.map((a) => (
          <div key={a.id} className="border-2 border-sutil bg-fondo">
            <div className="flex items-start gap-2 p-2.5">
              <Forma tipo="triangulo" relleno="amarillo" trazo="ninguno" tamano={14} className="mt-1 shrink-0" />
              <p className="flex-1 leading-snug">{a.texto}</p>
              <button
                type="button"
                onClick={() => quitar(a)}
                aria-label="Quitar aprendizaje"
                className="-m-1 inline-flex size-9 shrink-0 items-center justify-center text-tinta-suave"
              >
                <IconoCerrar tamano={13} />
              </button>
            </div>
            <div className="border-t-2 border-sutil">
              {promovidos.has(a.id) ? (
                <Link href="/bitacora/tips" className="etiqueta flex h-9 items-center justify-between px-2.5 text-tinta-suave">
                  ✓ Está en tu conocimiento <IconoFlecha tamano={14} />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => void promover(a)}
                  className="etiqueta flex h-9 w-full items-center justify-between bg-amarillo px-2.5 text-sobre-amarillo"
                >
                  Pasar a conocimiento <IconoFlecha tamano={14} />
                </button>
              )}
            </div>
          </div>
        ))}
        <EntradaRapida
          placeholder="Algo que aprendiste"
          etiquetaBoton="Agregar aprendizaje"
          onAgregar={(texto) => guardar([...ensayo.aprendizajes, { id: uuid(), texto }])}
        />
      </div>
    </Bloque>
  );
}

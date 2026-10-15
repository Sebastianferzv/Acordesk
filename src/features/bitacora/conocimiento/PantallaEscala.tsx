"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { escalaDelCatalogo } from "@/lib/teoria/catalogo";
import { useAviso } from "@/ui/Aviso";
import { Bloque } from "@/ui/Bloque";
import { Boton } from "@/ui/Boton";
import { Campo, CampoTexto } from "@/ui/Campos";
import { Encabezado } from "@/ui/Encabezado";
import { EstadoVacio } from "@/ui/EstadoVacio";
import { useEscala } from "../datos/hooks";
import { escalas } from "../datos/repositorio";
import type { Escala } from "../datos/tipos";
import { gradosEscala, nombreEscala } from "./comun";
import { EditorGrados } from "./EditorGrados";
import { TipsDe } from "./TipsDe";
import { VisorEscala } from "./VisorEscala";

export function PantallaEscala() {
  const id = useSearchParams().get("id");
  const escala = useEscala(id);
  if (escala === undefined) return null;
  if (escala === null) {
    return (
      <>
        <Encabezado titulo="Escala" volverA="/bitacora/escalas" />
        <EstadoVacio titulo="Esta escala no existe">
          <Link href="/bitacora/escalas" className="underline">Volver a tus escalas</Link>
        </EstadoVacio>
      </>
    );
  }
  return <FichaEscala key={escala.id} escala={escala} />;
}

function FichaEscala({ escala }: { escala: Escala }) {
  const router = useRouter();
  const avisar = useAviso();
  const catalogo = escalaDelCatalogo(escala.catalogoId);

  const eliminar = async () => {
    await escalas.borrar(escala.id);
    router.push("/bitacora/escalas");
    avisar({
      texto: `«${nombreEscala(escala)}» quitada de tus escalas.`,
      accion: { etiqueta: "Deshacer", alHacer: () => void escalas.restaurar(escala.id) },
    });
  };

  return (
    <>
      <Encabezado
        titulo={nombreEscala(escala)}
        forma={{ tipo: "semicirculo", color: catalogo ? "rojo" : "azul" }}
        volverA="/bitacora/escalas"
        subtitulo={catalogo?.familia ?? "Escala propia"}
      />
      <div className="space-y-5 px-4 pt-5">
        {catalogo && <p className="leading-snug">{catalogo.uso}</p>}

        <Bloque titulo="Visor" acento={{ forma: "circulo", color: "rojo" }}>
          <div className="p-4">
            <VisorEscala grados={gradosEscala(escala)} />
          </div>
        </Bloque>

        {!catalogo && (
          <Bloque titulo="Grados" acento={{ forma: "cuadrado", color: "azul" }}>
            <div className="space-y-4 p-4">
              <Campo etiqueta="Nombre">
                <CampoTexto valor={escala.nombre} onGuardar={(t) => t && void escalas.actualizar(escala.id, { nombre: t })} />
              </Campo>
              <EditorGrados
                grados={gradosEscala(escala)}
                onCambiar={(grados) => void escalas.actualizar(escala.id, { grados })}
              />
            </div>
          </Bloque>
        )}

        <Bloque titulo="Cómo la uso" acento={{ forma: "triangulo", color: "amarillo" }}>
          <div className="p-4">
            <CampoTexto
              valor={escala.comoUsarla}
              onGuardar={(t) => void escalas.actualizar(escala.id, { comoUsarla: t || undefined })}
              multilinea
              placeholder="Sobre qué acordes, en qué canciones, digitaciones que te sirven…"
              etiquetaAccesible="Cómo la uso"
            />
          </div>
        </Bloque>

        <TipsDe escalaId={escala.id} />

        <div className="flex justify-end pt-2">
          <Boton variante="secundario" onClick={() => void eliminar()}>
            Quitar de mis escalas
          </Boton>
        </div>
      </div>
    </>
  );
}

import { sumarDias } from "@/lib/fechas";
import { uuid } from "@/lib/uuid";
import { canciones, ensayos, escalas, tips } from "./repositorio";
import type { Valoracion } from "./tipos";

/** Carga datos ficticios para probar la app (solo se ofrece en desarrollo o con el modo demo). */
export async function cargarDatosDeEjemplo(hoy: string) {
  const nombres = [
    ["Blue Bossa", "Kenny Dorham", "sacada"],
    ["Autumn Leaves", "Standard", "pulir"],
    ["Take Five", "Paul Desmond", "en_progreso"],
    ["Careless Whisper", "George Michael", "sacada"],
    ["Summertime", "Gershwin", "en_progreso"],
  ] as const;
  const creadas = [];
  for (const [i, [nombre, artista, estado]] of nombres.entries()) {
    creadas.push(
      await canciones.crear({ nombre, artista, estado, sacadaEn: estado === "sacada" ? sumarDias(hoy, -20 * (i + 1)) : undefined }),
    );
  }

  let semilla = 7;
  const azar = () => ((semilla = (semilla * 9301 + 49297) % 233280) / 233280);
  for (let d = 70; d >= 0; d--) {
    if (azar() < 0.55 && d !== 0) continue;
    const items = creadas.filter(() => azar() < 0.35).slice(0, 3).map((c) => ({ cancionId: c.id }));
    await ensayos.crear({
      fecha: sumarDias(hoy, -d),
      duracionMin: [30, 45, 60, 60, 90, 120][Math.floor(azar() * 6)],
      valoracion: (Math.floor(azar() * 5) + 1) as Valoracion,
      etiquetas: azar() < 0.3 ? ["Banda"] : ["Solo"],
      items,
      notas: azar() < 0.5 ? "Escalas y repaso del repertorio." : undefined,
      aprendizajes: azar() < 0.3 ? [{ id: uuid(), texto: "Respirar antes de las frases largas." }] : [],
    });
  }

  const dorica = await escalas.crear({ catalogoId: "dorica", comoUsarla: "Sobre el ii de los ii–V; en Blue Bossa sobre Cm7." });
  await escalas.crear({ catalogoId: "blues-menor" });
  await escalas.crear({ catalogoId: "mayor" });
  await tips.crear({ texto: "La 6ª mayor es la nota que distingue a la dórica: apóyate en ella.", escalaId: dorica.id, categoria: "Improvisación" });
  await tips.crear({ texto: "Calentar con notas largas 5 minutos antes de tocar rápido.", categoria: "Sonido" });
  await tips.crear({ texto: "En Take Five, contar 3+2 con el pie para no perderse.", cancionId: creadas[2].id, categoria: "Repertorio" });
}

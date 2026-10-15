import type { Table, UpdateSpec } from "dexie";
import { uuid } from "@/lib/uuid";
import { db } from "./db";
import type { Cancion, Datos, Ensayo, Escala, Grabacion, Id, Registro, Tip } from "./tipos";

// Única puerta de entrada a los datos: la interfaz nunca usa Dexie directamente.
// Cuando llegue la sincronización, solo cambia esta capa.

export const estaVivo = (r: Registro) => r.borradoEn === null;

function nuevoRegistro(): Registro {
  const ahora = Date.now();
  return { id: uuid(), creadoEn: ahora, actualizadoEn: ahora, borradoEn: null };
}

function crearRepositorio<T extends Registro>(tabla: Table<T, Id>, porDefecto: () => Partial<Datos<T>>) {
  const actualizarCrudo = (id: Id, cambios: Partial<T>) => tabla.update(id, cambios as UpdateSpec<T>);

  return {
    async crear(datos: Partial<Datos<T>> = {}): Promise<T> {
      const registro = { ...porDefecto(), ...datos, ...nuevoRegistro() } as T;
      await tabla.add(registro);
      return registro;
    },
    /** El registro, o null si no existe o está borrado. */
    async obtener(id: Id): Promise<T | null> {
      const r = await tabla.get(id);
      return r && estaVivo(r) ? r : null;
    },
    async actualizar(id: Id, cambios: Partial<Datos<T>>) {
      await actualizarCrudo(id, { ...cambios, actualizadoEn: Date.now() } as Partial<T>);
    },
    /** Borrado suave: se puede deshacer con `restaurar`. */
    async borrar(id: Id) {
      const ahora = Date.now();
      await actualizarCrudo(id, { borradoEn: ahora, actualizadoEn: ahora } as Partial<T>);
    },
    async restaurar(id: Id) {
      await actualizarCrudo(id, { borradoEn: null, actualizadoEn: Date.now() } as Partial<T>);
    },
    async todos(): Promise<T[]> {
      return (await tabla.toArray()).filter(estaVivo);
    },
  };
}

const ensayosBase = crearRepositorio(db.ensayos, () => ({
  etiquetas: [],
  aprendizajes: [],
  items: [],
  links: [],
}));

export const ensayos = {
  ...ensayosBase,
  crear: (datos: Partial<Datos<Ensayo>> & { fecha: string }) => ensayosBase.crear(datos),
  /** Del más reciente al más antiguo. */
  async listar(): Promise<Ensayo[]> {
    const lista = await ensayosBase.todos();
    return lista.sort((a, b) => b.fecha.localeCompare(a.fecha) || b.creadoEn - a.creadoEn);
  },
};

const cancionesBase = crearRepositorio(db.canciones, () => ({ estado: "en_progreso" as const, links: [] }));

export const canciones = {
  ...cancionesBase,
  crear: (datos: Partial<Datos<Cancion>> & { nombre: string }) => cancionesBase.crear(datos),
  async listar(): Promise<Cancion[]> {
    const lista = await cancionesBase.todos();
    return lista.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  },
};

const recientesPrimero = <T extends Registro>(lista: T[]) => lista.sort((a, b) => b.creadoEn - a.creadoEn);

const escalasBase = crearRepositorio<Escala>(db.escalas, () => ({}));
export const escalas = {
  ...escalasBase,
  listar: async () => recientesPrimero(await escalasBase.todos()),
};

const tipsBase = crearRepositorio<Tip>(db.tips, () => ({ texto: "" }));
export const tips = {
  ...tipsBase,
  listar: async () => recientesPrimero(await tipsBase.todos()),
  /** Tips promovidos desde aprendizajes de un ensayo. */
  deEnsayo: async (ensayoId: Id) =>
    (await db.tips.where("origen.ensayoId").equals(ensayoId).toArray()).filter(estaVivo),
};

const grabacionesBase = crearRepositorio<Grabacion>(db.grabaciones, () => ({}));
export const grabaciones = {
  ...grabacionesBase,
  listar: async () => recientesPrimero(await grabacionesBase.todos()),
};

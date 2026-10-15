import Dexie, { type Table } from "dexie";
import type { Audio, Cancion, Cronometro, Ensayo, Escala, Grabacion, Meta, Tip } from "./tipos";

/**
 * Base local (IndexedDB). Para cambiar el esquema se agrega una nueva versión con
 * `this.version(n).stores(...).upgrade(...)`, nunca se edita una versión existente:
 * así no se pierden los datos que ya están en el celular.
 * Los id los genera siempre la app (UUID), por eso las tablas son `Table<T, string>`.
 */
export class BaseBitacora extends Dexie {
  ensayos!: Table<Ensayo, string>;
  canciones!: Table<Cancion, string>;
  escalas!: Table<Escala, string>;
  tips!: Table<Tip, string>;
  grabaciones!: Table<Grabacion, string>;
  audios!: Table<Audio, string>;
  cronometro!: Table<Cronometro, string>;
  meta!: Table<Meta, string>;

  constructor(nombre = "bitacora-de-viaje") {
    super(nombre);
    this.version(1).stores({
      ensayos: "id, fecha, actualizadoEn",
      canciones: "id, nombre, estado, actualizadoEn",
      escalas: "id, catalogoId, actualizadoEn",
      tips: "id, escalaId, cancionId, origen.ensayoId, actualizadoEn",
      grabaciones: "id, ensayoId, cancionId, actualizadoEn",
      audios: "id",
      cronometro: "id",
      meta: "clave",
    });
  }
}

export const db = new BaseBitacora();

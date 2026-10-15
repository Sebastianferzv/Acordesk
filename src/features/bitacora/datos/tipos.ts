export type Id = string;

/**
 * Campos comunes de todo registro sincronizable. Los tiempos van en milisegundos.
 * `borradoEn` marca el borrado suave (para poder deshacer y, más adelante, sincronizar).
 */
export interface Registro {
  id: Id;
  creadoEn: number;
  actualizadoEn: number;
  borradoEn: number | null;
}

/** Datos propios de un registro, sin los campos de control. */
export type Datos<T extends Registro> = Omit<T, keyof Registro>;

export interface Enlace {
  id: Id;
  url: string;
  titulo?: string;
  /** Segundo de inicio (YouTube). */
  inicioSeg?: number;
}

export interface Aprendizaje {
  id: Id;
  texto: string;
}

export interface ItemEnsayo {
  cancionId: Id;
  minutos?: number;
}

export type Valoracion = 1 | 2 | 3 | 4 | 5;

export interface Ensayo extends Registro {
  /** Día local del ensayo, 'YYYY-MM-DD'. */
  fecha: string;
  duracionMin?: number;
  titulo?: string;
  notas?: string;
  valoracion?: Valoracion;
  etiquetas: string[];
  aprendizajes: Aprendizaje[];
  items: ItemEnsayo[];
  links: Enlace[];
}

export type EstadoCancion = "en_progreso" | "pulir" | "sacada";

export interface Cancion extends Registro {
  nombre: string;
  artista?: string;
  estado: EstadoCancion;
  /** Día en que se marcó como sacada, 'YYYY-MM-DD'. */
  sacadaEn?: string;
  /** Siempre en tono de concierto. */
  tonalidad?: string;
  notas?: string;
  links: Enlace[];
}

/** Una escala "mía": del catálogo (catalogoId) o propia (nombre + grados). */
export interface Escala extends Registro {
  catalogoId?: string;
  nombre?: string;
  grados?: string[];
  comoUsarla?: string;
}

export interface Tip extends Registro {
  texto: string;
  categoria?: string;
  escalaId?: Id;
  cancionId?: Id;
  /** Aprendizaje de un ensayo desde el que se promovió este tip. */
  origen?: { ensayoId: Id; aprendizajeId: Id };
}

/** Metadatos de una grabación; el audio vive aparte, en la tabla local `audios`. */
export interface Grabacion extends Registro {
  nombre?: string;
  tipoMime: string;
  duracionSeg: number;
  ensayoId?: Id;
  cancionId?: Id;
}

// ── Tablas solo locales (no se sincronizan) ─────────────────────

export interface Audio {
  id: Id;
  blob: Blob;
}

export interface Cronometro {
  id: "actual";
  ensayoId: Id;
  /** Inicio del tramo en curso; null = en pausa. */
  tramoDesde: number | null;
  /** Tiempo acumulado de los tramos ya cerrados. */
  acumuladoMs: number;
}

export interface Meta {
  clave: string;
  valor: unknown;
}

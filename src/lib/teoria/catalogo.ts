export interface EscalaCatalogo {
  id: string;
  nombre: string;
  grados: string[];
  familia: Familia;
  /** Otra lista donde también aparece (la eólica es modo y es la menor natural). */
  tambienEn?: Familia;
  /** Qué es, comparada con una escala conocida. */
  descripcion: string;
  /** Para qué sirve, en una línea. */
  uso: string;
}

export const FAMILIAS = ["Modos", "Menores", "Pentatónicas y blues", "Jazz y simétricas"] as const;
export type Familia = (typeof FAMILIAS)[number];

// Los id son estables: se guardan en "mis escalas".
export const CATALOGO: EscalaCatalogo[] = [
  { id: "mayor", nombre: "Jónica (mayor)", grados: ["1", "2", "3", "4", "5", "6", "7"], familia: "Modos", descripcion: "La escala mayor de siempre: do re mi fa sol la si.", uso: "La base. Sobre acordes maj7 y en tonalidades mayores." },
  { id: "dorica", nombre: "Dórica", grados: ["1", "2", "b3", "4", "5", "6", "b7"], familia: "Modos", descripcion: "Escala menor, pero con la 6ta mayor.", uso: "Sobre m7: el sonido menor del jazz, el funk y el soul." },
  { id: "frigia", nombre: "Frigia", grados: ["1", "b2", "b3", "4", "5", "b6", "b7"], familia: "Modos", descripcion: "Escala menor, pero con la 2da menor.", uso: "Color español/flamenco; sobre m7 con b9 o acordes sus(b9)." },
  { id: "lidia", nombre: "Lidia", grados: ["1", "2", "3", "#4", "5", "6", "7"], familia: "Modos", descripcion: "Escala mayor, pero con la 4ta aumentada.", uso: "Mayor luminosa; sobre maj7(#11)." },
  { id: "mixolidia", nombre: "Mixolidia", grados: ["1", "2", "3", "4", "5", "6", "b7"], familia: "Modos", descripcion: "Escala mayor, pero con la 7ma menor.", uso: "Sobre acordes de séptima dominante (7), blues y rock." },
  { id: "eolica", nombre: "Eólica (menor)", grados: ["1", "2", "b3", "4", "5", "b6", "b7"], familia: "Modos", tambienEn: "Menores", descripcion: "La escala menor de siempre: mayor con 3ra, 6ta y 7ma menores.", uso: "La menor 'triste'; sobre m7 en tonalidad menor (vi grado)." },
  { id: "locria", nombre: "Locria", grados: ["1", "b2", "b3", "4", "b5", "b6", "b7"], familia: "Modos", descripcion: "Escala menor, pero con la 2da menor y la 5ta disminuida.", uso: "Sobre m7b5 (semidisminuido), el ii de los ii–V menores." },
  { id: "menor-armonica", nombre: "Menor armónica", grados: ["1", "2", "b3", "4", "5", "b6", "7"], familia: "Menores", descripcion: "Menor natural, pero con la 7ma mayor.", uso: "Su V7 da el color b9 de los ii–V menores." },
  { id: "menor-melodica", nombre: "Menor melódica", grados: ["1", "2", "b3", "4", "5", "6", "7"], familia: "Menores", descripcion: "Escala mayor, pero con la 3ra menor.", uso: "Sobre m(maj7) y m6; de ella salen la lidia dominante y la alterada." },
  { id: "pentatonica-mayor", nombre: "Pentatónica mayor", grados: ["1", "2", "3", "5", "6"], familia: "Pentatónicas y blues", descripcion: "Escala mayor sin la 4ta ni la 7ma: 5 notas.", uso: "Segura sobre acordes mayores; melódica y abierta." },
  { id: "pentatonica-menor", nombre: "Pentatónica menor", grados: ["1", "b3", "4", "5", "b7"], familia: "Pentatónicas y blues", descripcion: "Menor natural sin la 2da ni la 6ta: 5 notas.", uso: "La más usada para improvisar en blues, rock y funk." },
  { id: "blues-menor", nombre: "Blues", grados: ["1", "b3", "4", "#4", "5", "b7"], familia: "Pentatónicas y blues", descripcion: "Pentatónica menor más la 4ta aumentada (la 'blue note').", uso: "Sobre todo el blues." },
  { id: "blues-mayor", nombre: "Blues mayor", grados: ["1", "2", "b3", "3", "5", "6"], familia: "Pentatónicas y blues", descripcion: "Pentatónica mayor más la 3ra menor.", uso: "La b3 va de paso a la 3; sonido country/gospel." },
  { id: "bebop-dominante", nombre: "Bebop dominante", grados: ["1", "2", "3", "4", "5", "6", "b7", "7"], familia: "Jazz y simétricas", descripcion: "Mixolidia más la 7ma mayor de paso: 8 notas.", uso: "Las notas del acorde caen en tiempo." },
  { id: "disminuida-st", nombre: "Disminuida semitono-tono", grados: ["1", "b2", "#2", "3", "#4", "5", "6", "b7"], familia: "Jazz y simétricas", descripcion: "Alterna semitono y tono: 8 notas.", uso: "Sobre dominantes 7(b9, #9, 13)." },
  { id: "disminuida-ts", nombre: "Disminuida tono-semitono", grados: ["1", "2", "b3", "4", "b5", "#5", "6", "7"], familia: "Jazz y simétricas", descripcion: "Alterna tono y semitono: 8 notas.", uso: "Sobre acordes disminuidos (dim7)." },
  { id: "tonos-enteros", nombre: "Tonos enteros", grados: ["1", "2", "3", "#4", "#5", "b7"], familia: "Jazz y simétricas", descripcion: "Solo tonos enteros: 6 notas.", uso: "Sobre 7(#5) y 7(b5); sonido flotante." },
  { id: "alterada", nombre: "Alterada (superlocria)", grados: ["1", "b2", "#2", "3", "#4", "#5", "b7"], familia: "Jazz y simétricas", descripcion: "Dominante con todas las tensiones alteradas: b9, #9, #11 y b13.", uso: "Sobre 7alt: máxima tensión antes de resolver." },
];

export const escalasDeFamilia = (familia: Familia) =>
  CATALOGO.filter((e) => e.familia === familia || e.tambienEn === familia);

export const escalaDelCatalogo = (id: string | undefined) => CATALOGO.find((e) => e.id === id);

/** Grados que se pueden elegir al crear una escala propia. */
export const GRADOS_CROMATICOS = ["1", "b2", "2", "b3", "3", "4", "#4", "5", "b6", "6", "b7", "7"];

export const GRADOS_MAYOR = CATALOGO[0].grados;
export const GRADOS_MENOR = ["1", "2", "b3", "4", "5", "b6", "b7"];

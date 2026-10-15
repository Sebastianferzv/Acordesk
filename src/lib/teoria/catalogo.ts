export interface EscalaCatalogo {
  id: string;
  nombre: string;
  grados: string[];
  familia: "Mayor y modos" | "Menores" | "Pentatónicas y blues" | "Jazz y simétricas";
  /** Para qué sirve, en una línea. */
  uso: string;
}

// Los id son estables: se guardan en "mis escalas".
export const CATALOGO: EscalaCatalogo[] = [
  { id: "mayor", nombre: "Mayor (jónica)", grados: ["1", "2", "3", "4", "5", "6", "7"], familia: "Mayor y modos", uso: "La base. Sobre acordes maj7 y en tonalidades mayores." },
  { id: "dorica", nombre: "Dórica", grados: ["1", "2", "b3", "4", "5", "6", "b7"], familia: "Mayor y modos", uso: "Sobre m7: el sonido menor del jazz, el funk y el soul." },
  { id: "frigia", nombre: "Frigia", grados: ["1", "b2", "b3", "4", "5", "b6", "b7"], familia: "Mayor y modos", uso: "Color español/flamenco; sobre m7 con b9 o acordes sus(b9)." },
  { id: "lidia", nombre: "Lidia", grados: ["1", "2", "3", "#4", "5", "6", "7"], familia: "Mayor y modos", uso: "Mayor con #4 luminosa; sobre maj7(#11)." },
  { id: "mixolidia", nombre: "Mixolidia", grados: ["1", "2", "3", "4", "5", "6", "b7"], familia: "Mayor y modos", uso: "Sobre acordes de séptima dominante (7), blues y rock." },
  { id: "eolica", nombre: "Menor natural (eólica)", grados: ["1", "2", "b3", "4", "5", "b6", "b7"], familia: "Menores", uso: "La menor 'triste'; sobre m7 en tonalidad menor (vi grado)." },
  { id: "locria", nombre: "Locria", grados: ["1", "b2", "b3", "4", "b5", "b6", "b7"], familia: "Mayor y modos", uso: "Sobre m7b5 (semidisminuido), el ii de los ii–V menores." },
  { id: "menor-armonica", nombre: "Menor armónica", grados: ["1", "2", "b3", "4", "5", "b6", "7"], familia: "Menores", uso: "Menor con sensible; su V7 da el color b9 de los ii–V menores." },
  { id: "menor-melodica", nombre: "Menor melódica", grados: ["1", "2", "b3", "4", "5", "6", "7"], familia: "Menores", uso: "Sobre m(maj7) y m6; de ella salen la lidia dominante y la alterada." },
  { id: "pentatonica-mayor", nombre: "Pentatónica mayor", grados: ["1", "2", "3", "5", "6"], familia: "Pentatónicas y blues", uso: "Segura sobre acordes mayores; melódica y abierta." },
  { id: "pentatonica-menor", nombre: "Pentatónica menor", grados: ["1", "b3", "4", "5", "b7"], familia: "Pentatónicas y blues", uso: "La más usada para improvisar en blues, rock y funk." },
  { id: "blues-menor", nombre: "Blues", grados: ["1", "b3", "4", "#4", "5", "b7"], familia: "Pentatónicas y blues", uso: "Pentatónica menor con la 'blue note'; sobre todo el blues." },
  { id: "blues-mayor", nombre: "Blues mayor", grados: ["1", "2", "b3", "3", "5", "6"], familia: "Pentatónicas y blues", uso: "Pentatónica mayor con b3 de paso; sonido country/gospel." },
  { id: "bebop-dominante", nombre: "Bebop dominante", grados: ["1", "2", "3", "4", "5", "6", "b7", "7"], familia: "Jazz y simétricas", uso: "Mixolidia con 7 de paso: las notas del acorde caen en tiempo." },
  { id: "disminuida-st", nombre: "Disminuida semitono-tono", grados: ["1", "b2", "#2", "3", "#4", "5", "6", "b7"], familia: "Jazz y simétricas", uso: "Sobre dominantes 7(b9, #9, 13)." },
  { id: "disminuida-ts", nombre: "Disminuida tono-semitono", grados: ["1", "2", "b3", "4", "b5", "#5", "6", "7"], familia: "Jazz y simétricas", uso: "Sobre acordes disminuidos (dim7)." },
  { id: "tonos-enteros", nombre: "Tonos enteros", grados: ["1", "2", "3", "#4", "#5", "b7"], familia: "Jazz y simétricas", uso: "Sobre 7(#5) y 7(b5); sonido flotante." },
  { id: "alterada", nombre: "Alterada (superlocria)", grados: ["1", "b2", "#2", "3", "#4", "#5", "b7"], familia: "Jazz y simétricas", uso: "Sobre 7alt: máxima tensión antes de resolver." },
];

export const escalaDelCatalogo = (id: string | undefined) => CATALOGO.find((e) => e.id === id);

/** Grados que se pueden elegir al crear una escala propia. */
export const GRADOS_CROMATICOS = ["1", "b2", "2", "b3", "3", "4", "#4", "5", "b6", "6", "b7", "7"];

export const GRADOS_MAYOR = CATALOGO[0].grados;
export const GRADOS_MENOR = ["1", "2", "b3", "4", "5", "b6", "b7"];

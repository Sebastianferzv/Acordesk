import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { Forma, type ColorBauhaus, type TipoForma } from "@/ui/Forma";
import { Hoja } from "@/ui/Hoja";

// Cada sección toma una forma y un color, alternando los tres del Bauhaus.
const ACENTOS: { forma: TipoForma; color: ColorBauhaus }[] = [
  { forma: "circulo", color: "rojo" },
  { forma: "triangulo", color: "amarillo" },
  { forma: "cuadrado", color: "azul" },
];

/** Secciones de una hoja de ayuda, cada una con su acento de color. */
function Secciones({ children }: { children: ReactNode }) {
  return Children.toArray(children)
    .filter(isValidElement)
    .map((hijo, i) => (
      <SeccionConAcento key={i} {...(hijo as ReactElement<PropsSeccion>).props} acento={ACENTOS[i % 3]} />
    ));
}

interface PropsSeccion {
  titulo: string;
  children: ReactNode;
  acento?: (typeof ACENTOS)[number];
}

/** Marcador de sección: lo dibuja `Secciones`. */
function Seccion(props: PropsSeccion) {
  return <SeccionConAcento {...props} />;
}

function SeccionConAcento({ titulo, children, acento }: PropsSeccion) {
  return (
    <section className="border-b-2 border-sutil py-3.5 last:border-b-0">
      <h3 className="etiqueta mb-2 flex items-center gap-2">
        {acento && <Forma tipo={acento.forma} relleno={acento.color} trazo="ninguno" tamano={12} />}
        {titulo}
      </h3>
      <div className="space-y-2 text-sm leading-relaxed text-tinta-suave [&_b]:text-tinta [&_code]:rounded-md [&_code]:bg-amarillo [&_code]:px-1.5 [&_code]:font-semibold [&_code]:text-sobre-amarillo">
        {children}
      </div>
    </section>
  );
}

const Muestra = ({ clase, children }: { clase: string; children: ReactNode }) => (
  <span className={`inline-block border-2 px-2 py-0.5 text-xs font-semibold ${clase}`}>{children}</span>
);

export function HojaAyuda({ abierta, onCerrar }: { abierta: boolean; onCerrar: () => void }) {
  return (
    <Hoja abierta={abierta} onCerrar={onCerrar} titulo="Cómo usar">
      <Secciones>
      <Seccion titulo="¿Qué es AcorDesk?">
        <p>Traductor de acordes. Escribes los acordes de una canción en concert pitch y la app los transpone a cualquier tonalidad o instrumento.</p>
      </Seccion>
      <Seccion titulo="Tónica de la canción">
        <p>Elige la tónica junto a los acordes. Con ella se activan los colores, los grados y la escritura en <b>♯ o ♭</b> según la tonalidad.</p>
      </Seccion>
      <Seccion titulo="Colores de los acordes">
        <p>Según cuántas notas del acorde quedan fuera de la tonalidad:</p>
        <div className="flex flex-wrap gap-2">
          <Muestra clase="border-transparent bg-hundido text-tinta">Diatónico</Muestra>
          <Muestra clase="border-transparent bg-amarillo text-sobre-amarillo">1 fuera</Muestra>
          <Muestra clase="border-rojo text-rojo">2 fuera</Muestra>
          <Muestra clase="border-transparent bg-rojo text-sobre-color">3 o más</Muestra>
        </div>
        <p>Toca un acorde para ver sus notas; las que quedan fuera de la tonalidad salen en rojo.</p>
      </Seccion>
      <Seccion titulo="Sostenidos o bemoles">
        <p>Cada recuadro escribe según su tonalidad: <b>C G D A E B</b> en sostenidos y <b>F B♭ E♭ A♭ D♭ G♭</b> en bemoles. Los botones ♭/♯ aparecen solo cuando no hay tónica.</p>
      </Seccion>
      <Seccion titulo="Grados (I ii III…)">
        <p>El botón <code>I ii</code> muestra el grado romano sobre cada acorde. Mayúscula = mayor o dominante, minúscula = menor o disminuido. <code>b</code> indica grado cromático (ej: <code>bVII</code>).</p>
      </Seccion>
      <Seccion titulo="Cambiar tonalidad">
        <p>Abre <b>Cambiar tonalidad</b> y elige la nueva tónica. Los acordes se transponen ahí sin tocar la vista previa.</p>
      </Seccion>
      <Seccion titulo="Transponer a instrumento">
        <p>Abre <b>Transponer a instrumento</b> y elige tu instrumento. Verás los acordes escritos para él y la <b>tonalidad transpuesta</b>: la tonalidad en que te queda la canción.</p>
      </Seccion>
      <Seccion titulo="Círculo de quintas">
        <p>Toca una tonalidad (afuera mayor, adentro menor) para ver su escala y su armadura en el pentagrama.</p>
      </Seccion>
      <Seccion titulo="Guardar canciones">
        <p>Escribe el nombre y toca <b>Guardar</b>. Ábrelas desde <b>Canciones</b>. Lo que estés escribiendo se mantiene aunque cambies de pestaña.</p>
      </Seccion>
      </Secciones>
    </Hoja>
  );
}

const CALIDADES: [string, string, string, string][] = [
  ["Mayor", "(vacío)", "C, G, F", "1 3 5"],
  ["Menor", "m  min", "Am, Dm", "1 b3 5"],
  ["Quinta (power)", "5", "A5, E5", "1 5"],
  ["Sexta mayor", "6", "C6", "1 3 5 6"],
  ["Sexta menor", "m6", "Am6", "1 b3 5 6"],
  ["Dom. 7", "7", "G7, D7", "1 3 5 b7"],
  ["Mayor 7", "M7  maj7  Δ  Δ7", "Cmaj7, FΔ", "1 3 5 7"],
  ["Menor 7", "m7  min7", "Am7, Dm7", "1 b3 5 b7"],
  ["Menor-mayor 7", "mM7  mmaj7", "CmM7", "1 b3 5 7"],
  ["Semidisminuido", "m7b5  ø  ø7", "Bm7b5, Bø", "1 b3 b5 b7"],
  ["Disminuido", "°  dim", "B°, Bdim", "1 b3 b5"],
  ["Séptima disminuida", "°7  dim7", "B°7", "1 b3 b5 bb7"],
  ["Aumentado", "+  aug", "C+, Caug", "1 3 #5"],
  ["Aumentado 7", "+7  aug7", "C+7", "1 3 #5 b7"],
  ["Mayor aumentado 7", "+M7  augM7  M7#5", "C+M7", "1 3 #5 7"],
  ["Sus 4", "sus  sus4", "Csus4, Gsus", "1 4 5"],
  ["Sus 2", "sus2", "Dsus2", "1 2 5"],
  ["7 sus 4", "7sus  7sus4", "G7sus4", "1 4 5 b7"],
  ["7 sus 2", "7sus2", "D7sus2", "1 2 5 b7"],
  ["Novena dom.", "9", "G9", "1 3 5 b7 9"],
  ["Novena mayor", "M9  maj9", "Cmaj9", "1 3 5 7 9"],
  ["Novena menor", "m9  min9", "Am9", "1 b3 5 b7 9"],
  ["Add 9", "add9", "Cadd9", "1 3 5 9"],
  ["Add 2", "add2", "Cadd2", "1 2 3 5"],
  ["Oncena dom.", "11", "G11", "1 3 5 b7 9 11"],
  ["Oncena menor", "m11", "Am11", "1 b3 5 b7 9 11"],
  ["Trecena dom.", "13", "G13", "1 3 5 b7 9 11 13"],
  ["Trecena menor", "m13", "Am13", "1 b3 5 b7 9 11 13"],
  ["7 b5", "7b5", "G7b5", "1 3 b5 b7"],
  ["7 #5", "7#5", "G7#5", "1 3 #5 b7"],
  ["7 b9", "7b9", "G7b9", "1 3 5 b7 b9"],
  ["7 #9", "7#9", "G7#9", "1 3 5 b7 #9"],
  ["7 #11", "7#11", "G7#11", "1 3 5 b7 9 #11"],
];

export function HojaDiccionario({ abierta, onCerrar }: { abierta: boolean; onCerrar: () => void }) {
  return (
    <Hoja abierta={abierta} onCerrar={onCerrar} titulo="Diccionario">
      <Secciones>
      <Seccion titulo="Raíz del acorde">
        <p>Una letra de <code>A</code> a <code>G</code>, con <code>#</code> (sostenido) o <code>b</code> (bemol) si hace falta: <code>C</code> <code>D#</code> <code>Bb</code> <code>F#</code>.</p>
      </Seccion>
      <Seccion titulo="Bajo (slash chord)">
        <p>Agrega <code>/</code> y la nota del bajo: <code>C/E</code> <code>G/B</code> <code>Am/C</code> <code>D7/F#</code>.</p>
      </Seccion>
      <Seccion titulo="Calidades reconocidas">
        <div className="overflow-x-auto rounded-[var(--radio)]">
          <table className="w-full border-collapse text-left text-[0.8rem]">
            <thead>
              <tr className="etiqueta bg-azul text-sobre-color">
                <th className="px-2 py-2">Nombre</th>
                <th className="px-2 py-2">Símbolo</th>
                <th className="hidden px-2 py-2 sm:table-cell">Ejemplo</th>
                <th className="px-2 py-2">Grados</th>
              </tr>
            </thead>
            <tbody>
              {CALIDADES.map(([nombre, simbolos, ejemplo, grados]) => (
                <tr key={nombre} className="even:bg-hundido">
                  <td className="px-2 py-1.5 font-semibold text-tinta">{nombre}</td>
                  <td className="px-2 py-1.5">
                    {simbolos.split("  ").map((s) => (
                      <code key={s} className="mr-1 inline-block">{s}</code>
                    ))}
                  </td>
                  <td className="hidden px-2 py-1.5 text-tinta sm:table-cell">{ejemplo}</td>
                  <td className="px-2 py-1.5 font-semibold text-rojo">{grados}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Seccion>
      <Seccion titulo="Combinaciones">
        <p>Se reconoce cualquier calidad que empiece con uno de los símbolos de la tabla: <code>Dm7b5</code> <code>G7#9</code> <code>Cmaj9</code> <code>Fø7</code> <code>E7sus4</code> <code>Ab+M7</code>.</p>
      </Seccion>
      </Secciones>
    </Hoja>
  );
}

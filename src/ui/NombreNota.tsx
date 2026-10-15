import { Alteracion, type TipoAlteracion } from "./Alteracion";

const SOLFEO: Record<string, string> = { C: "Do", D: "Re", E: "Mi", F: "Fa", G: "Sol", A: "La", B: "Si" };

interface Props {
  /** Nota en notación anglosajona: "C", "Bb", "F#", "Ebb", "C##". */
  nota: string;
  notacion?: "letras" | "solfeo";
  className?: string;
}

/** Muestra una nota con su alteración dibujada (Si♭, F♯…). */
export function NombreNota({ nota, notacion = "letras", className }: Props) {
  const letra = nota.charAt(0).toUpperCase();
  const alteracion = nota.slice(1) as TipoAlteracion | "";
  return (
    <span className={className}>
      {notacion === "solfeo" ? (SOLFEO[letra] ?? letra) : letra}
      {alteracion && <Alteracion tipo={alteracion} className="ml-[0.04em]" />}
    </span>
  );
}

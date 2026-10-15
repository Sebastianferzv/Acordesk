import { describe, expect, it } from "vitest";
import { formatoDuracion, inicioSemana, rachaActual, resumenSemana } from "./calculos";

describe("rachaActual", () => {
  it("cuenta días seguidos hasta hoy", () => {
    expect(rachaActual(["2026-10-12", "2026-10-13", "2026-10-14"], "2026-10-14")).toBe(3);
  });

  it("sigue viva si el último ensayo fue ayer", () => {
    expect(rachaActual(["2026-10-12", "2026-10-13"], "2026-10-14")).toBe(2);
  });

  it("se corta si pasó un día sin ensayar", () => {
    expect(rachaActual(["2026-10-11", "2026-10-12"], "2026-10-14")).toBe(0);
    expect(rachaActual(["2026-10-10", "2026-10-12", "2026-10-13", "2026-10-14"], "2026-10-14")).toBe(3);
  });

  it("ignora ensayos repetidos el mismo día y cruza meses", () => {
    expect(rachaActual(["2026-09-30", "2026-10-01", "2026-10-01"], "2026-10-01")).toBe(2);
  });

  it("es cero sin ensayos", () => {
    expect(rachaActual([], "2026-10-14")).toBe(0);
  });
});

describe("semanas", () => {
  it("empiezan el lunes", () => {
    expect(inicioSemana("2026-10-14")).toBe("2026-10-12"); // miércoles → lunes
    expect(inicioSemana("2026-10-12")).toBe("2026-10-12"); // lunes
    expect(inicioSemana("2026-10-18")).toBe("2026-10-12"); // domingo
  });

  it("resume solo los ensayos de esta semana hasta hoy", () => {
    const ensayos = [
      { fecha: "2026-10-11", duracionMin: 90 }, // domingo anterior
      { fecha: "2026-10-12", duracionMin: 60 },
      { fecha: "2026-10-14", duracionMin: 45 },
      { fecha: "2026-10-14" }, // sin duración
    ];
    expect(resumenSemana(ensayos, "2026-10-14")).toEqual({ ensayos: 3, minutos: 105 });
  });
});

describe("formatoDuracion", () => {
  it("muestra minutos, horas y horas con minutos", () => {
    expect(formatoDuracion(0)).toBe("0 min");
    expect(formatoDuracion(45)).toBe("45 min");
    expect(formatoDuracion(60)).toBe("1 h");
    expect(formatoDuracion(125)).toBe("2 h 05");
  });
});

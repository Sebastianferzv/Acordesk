import { describe, expect, it } from "vitest";
import {
  formatoDuracion,
  inicioSemana,
  mejorRacha,
  minutosPorCancion,
  minutosPorMes,
  minutosPorSemana,
  rachaActual,
  resumenSemana,
  sacadasPorMes,
  valoracionPorMes,
} from "./calculos";

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

describe("mejorRacha", () => {
  it("encuentra la racha más larga", () => {
    expect(mejorRacha(["2026-01-01", "2026-01-02", "2026-01-05", "2026-01-06", "2026-01-07", "2026-01-07"])).toBe(3);
    expect(mejorRacha([])).toBe(0);
  });
});

describe("periodos", () => {
  const ensayos = [
    { fecha: "2026-10-14", duracionMin: 45, valoracion: 4 as const },
    { fecha: "2026-10-05", duracionMin: 60, valoracion: 2 as const },
    { fecha: "2026-09-30", duracionMin: 30 },
    { fecha: "2025-01-01", duracionMin: 999 }, // fuera del rango
  ];

  it("agrupa por semana", () => {
    const semanas = minutosPorSemana(ensayos, "2026-10-14", 3);
    expect(semanas).toEqual([
      { inicio: "2026-09-28", minutos: 30, ensayos: 1 },
      { inicio: "2026-10-05", minutos: 60, ensayos: 1 },
      { inicio: "2026-10-12", minutos: 45, ensayos: 1 },
    ]);
  });

  it("agrupa por mes cruzando el año", () => {
    const meses = minutosPorMes(ensayos, "2026-10-14", 12);
    expect(meses[0].inicio).toBe("2025-11");
    expect(meses.at(-1)).toEqual({ inicio: "2026-10", minutos: 105, ensayos: 2 });
    expect(meses.at(-2)).toEqual({ inicio: "2026-09", minutos: 30, ensayos: 1 });
  });

  it("promedia la valoración por mes", () => {
    const v = valoracionPorMes(ensayos, "2026-10-14", 2);
    expect(v).toEqual([
      { mes: "2026-09", promedio: null },
      { mes: "2026-10", promedio: 3 },
    ]);
  });

  it("cuenta canciones sacadas por mes", () => {
    const c = sacadasPorMes(
      [
        { estado: "sacada", sacadaEn: "2026-10-02" },
        { estado: "sacada", sacadaEn: "2026-10-09" },
        { estado: "pulir", sacadaEn: "2026-10-09" },
      ],
      "2026-10-14",
      1,
    );
    expect(c).toEqual([{ mes: "2026-10", cantidad: 2 }]);
  });
});

describe("minutosPorCancion", () => {
  it("suma explícitos y reparte el resto entre las canciones sin minutos", () => {
    const m = minutosPorCancion([
      { duracionMin: 60, items: [{ cancionId: "a", minutos: 30 }, { cancionId: "b" }, { cancionId: "c" }] },
      { duracionMin: 20, items: [{ cancionId: "a" }] },
      { items: [{ cancionId: "b" }] }, // sin duración: no suma
      { duracionMin: 10, items: [{ cancionId: "c", minutos: 25 }] }, // explícitos mayores que la duración
    ]);
    expect(Object.fromEntries(m)).toEqual({ a: 50, b: 15, c: 40 });
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

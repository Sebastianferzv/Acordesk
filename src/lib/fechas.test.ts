import { describe, expect, it } from "vitest";
import { aFecha, diasEntre, fechaLarga, fechaLocal, partesFecha, sumarDias } from "./fechas";

describe("fechas", () => {
  it("formatea la fecha local sin pasar por UTC", () => {
    expect(fechaLocal(new Date(2026, 9, 14, 23, 59))).toBe("2026-10-14");
    expect(fechaLocal(new Date(2026, 0, 5, 0, 1))).toBe("2026-01-05");
  });

  it("convierte de ida y vuelta", () => {
    expect(fechaLocal(aFecha("2026-02-28"))).toBe("2026-02-28");
  });

  it("suma días cruzando meses y años", () => {
    expect(sumarDias("2026-10-31", 1)).toBe("2026-11-01");
    expect(sumarDias("2026-01-01", -1)).toBe("2025-12-31");
    expect(sumarDias("2028-02-28", 1)).toBe("2028-02-29");
  });

  it("cuenta días de calendario aunque haya cambio de horario", () => {
    // En Chile el horario cambia en abril y septiembre.
    expect(diasEntre("2026-04-01", "2026-04-10")).toBe(9);
    expect(diasEntre("2026-09-01", "2026-09-10")).toBe(9);
    expect(diasEntre("2026-10-14", "2026-10-13")).toBe(-1);
  });

  it("entrega las partes en español", () => {
    expect(partesFecha("2026-10-14")).toEqual({
      diaSemana: "mié",
      diaSemanaLargo: "miércoles",
      dia: 14,
      mes: "oct",
      mesLargo: "octubre",
      anio: 2026,
    });
  });

  it("agrega el año solo si no es el actual", () => {
    expect(fechaLarga("2026-10-14", "2026-12-01")).toBe("miércoles 14 de octubre");
    expect(fechaLarga("2025-10-14", "2026-12-01")).toBe("martes 14 de octubre de 2025");
  });
});

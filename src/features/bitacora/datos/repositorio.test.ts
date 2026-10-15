import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { db } from "./db";
import { canciones, ensayos } from "./repositorio";

beforeEach(async () => {
  await db.delete();
  await db.open();
});

afterEach(() => vi.restoreAllMocks());

describe("repositorio", () => {
  it("crea registros con id, tiempos y valores por defecto", async () => {
    const e = await ensayos.crear({ fecha: "2026-10-14" });
    expect(e.id).toHaveLength(36);
    expect(e.creadoEn).toBe(e.actualizadoEn);
    expect(e.borradoEn).toBeNull();
    expect(e).toMatchObject({ etiquetas: [], aprendizajes: [], items: [], links: [] });
    expect(await ensayos.obtener(e.id)).toEqual(e);

    const c = await canciones.crear({ nombre: "Blue Bossa" });
    expect(c.estado).toBe("en_progreso");
  });

  it("actualizar cambia los datos y la marca de tiempo", async () => {
    const reloj = vi.spyOn(Date, "now").mockReturnValue(1_000);
    const e = await ensayos.crear({ fecha: "2026-10-14" });
    reloj.mockReturnValue(2_000);
    await ensayos.actualizar(e.id, { duracionMin: 45, valoracion: 4 });
    expect(await ensayos.obtener(e.id)).toMatchObject({ duracionMin: 45, valoracion: 4, creadoEn: 1_000, actualizadoEn: 2_000 });
  });

  it("borra de forma suave y permite deshacer", async () => {
    const e = await ensayos.crear({ fecha: "2026-10-14" });
    await ensayos.borrar(e.id);
    expect(await ensayos.listar()).toEqual([]);
    expect((await ensayos.obtener(e.id))?.borradoEn).not.toBeNull();

    await ensayos.restaurar(e.id);
    expect((await ensayos.listar()).map((x) => x.id)).toEqual([e.id]);
  });

  it("lista del ensayo más reciente al más antiguo", async () => {
    const reloj = vi.spyOn(Date, "now").mockReturnValue(1_000);
    const viejo = await ensayos.crear({ fecha: "2026-10-01" });
    const deHoyTemprano = await ensayos.crear({ fecha: "2026-10-14" });
    reloj.mockReturnValue(2_000);
    const deHoyTarde = await ensayos.crear({ fecha: "2026-10-14" });
    expect((await ensayos.listar()).map((x) => x.id)).toEqual([deHoyTarde.id, deHoyTemprano.id, viejo.id]);
  });
});

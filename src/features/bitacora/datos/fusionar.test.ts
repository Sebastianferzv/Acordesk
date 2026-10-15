import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { db } from "./db";
import { fusionar, registrosAGuardar } from "./fusionar";
import { crearRespaldo } from "./respaldo";
import { canciones, ensayos } from "./repositorio";

beforeEach(async () => {
  await db.delete();
  await db.open();
});

afterEach(() => vi.restoreAllMocks());

const r = (id: string, actualizadoEn: number) => ({ id, creadoEn: 0, actualizadoEn, borradoEn: null });

describe("registrosAGuardar", () => {
  it("toma los nuevos y los más recientes; ignora los más viejos o iguales", () => {
    const locales = [r("a", 10), r("b", 10), r("c", 10)];
    const entrantes = [r("a", 20), r("b", 5), r("c", 10), r("d", 1)];
    expect(registrosAGuardar(locales, entrantes).map((x) => x.id)).toEqual(["a", "d"]);
  });
});

describe("fusionar", () => {
  it("combina un respaldo con los datos locales sin duplicar", async () => {
    const reloj = vi.spyOn(Date, "now").mockReturnValue(1_000);
    const e = await ensayos.crear({ fecha: "2026-10-14", notas: "original" });
    await canciones.crear({ nombre: "Autumn Leaves" });
    const respaldo = await crearRespaldo();

    // En el otro dispositivo el ensayo se editó después y se borró la canción localmente.
    reloj.mockReturnValue(2_000);
    await ensayos.actualizar(e.id, { notas: "editado aquí" });
    const datos = structuredClone(respaldo.datos);
    datos.ensayos[0].notas = "editado allá";
    datos.ensayos[0].actualizadoEn = 3_000;
    datos.ensayos.push({ ...datos.ensayos[0], id: "otro", fecha: "2026-10-01" });

    const { guardados } = await fusionar(datos);
    expect(guardados).toBe(2);
    expect((await ensayos.obtener(e.id))?.notas).toBe("editado allá");
    expect(await ensayos.listar()).toHaveLength(2);
    expect(await canciones.listar()).toHaveLength(1);
  });

  it("también propaga los borrados", async () => {
    const reloj = vi.spyOn(Date, "now").mockReturnValue(1_000);
    const e = await ensayos.crear({ fecha: "2026-10-14" });
    const datos = structuredClone((await crearRespaldo()).datos);
    reloj.mockReturnValue(2_000);
    datos.ensayos[0] = { ...datos.ensayos[0], borradoEn: 2_000, actualizadoEn: 2_000 };
    await fusionar(datos);
    expect(await ensayos.obtener(e.id)).toBeNull();
  });
});

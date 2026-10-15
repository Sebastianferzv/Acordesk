import { afterEach, describe, expect, it, vi } from "vitest";
import { uuid } from "./uuid";

const FORMATO_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe("uuid", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("genera UUID v4 distintos", () => {
    const a = uuid();
    expect(a).toMatch(FORMATO_V4);
    expect(uuid()).not.toBe(a);
  });

  it("funciona sin crypto.randomUUID (contexto no seguro)", () => {
    vi.stubGlobal("crypto", { getRandomValues: globalThis.crypto.getRandomValues.bind(globalThis.crypto) });
    expect(uuid()).toMatch(FORMATO_V4);
  });
});

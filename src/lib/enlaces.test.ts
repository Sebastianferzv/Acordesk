import { describe, expect, it } from "vitest";
import { analizarEnlace, normalizarUrl } from "./enlaces";

describe("enlaces", () => {
  it("normaliza y rechaza lo que no es URL", () => {
    expect(normalizarUrl("youtube.com/watch?v=abc")).toBe("https://youtube.com/watch?v=abc");
    expect(normalizarUrl("hola mundo")).toBeNull();
    expect(normalizarUrl("hola")).toBeNull();
    expect(normalizarUrl("")).toBeNull();
  });

  it("reconoce los formatos de YouTube con su tiempo de inicio", () => {
    expect(analizarEnlace("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=90")).toMatchObject({
      tipo: "youtube",
      youtubeId: "dQw4w9WgXcQ",
      inicioSeg: 90,
    });
    expect(analizarEnlace("https://youtu.be/dQw4w9WgXcQ?t=1m30s")).toMatchObject({ youtubeId: "dQw4w9WgXcQ", inicioSeg: 90 });
    expect(analizarEnlace("m.youtube.com/shorts/dQw4w9WgXcQ")).toMatchObject({ tipo: "youtube", youtubeId: "dQw4w9WgXcQ" });
    expect(analizarEnlace("https://music.youtube.com/watch?v=dQw4w9WgXcQ")?.tipo).toBe("youtube");
  });

  it("un link de YouTube sin video es una web", () => {
    expect(analizarEnlace("https://www.youtube.com/@canal")?.tipo).toBe("web");
  });

  it("reconoce Instagram y el resto como web", () => {
    expect(analizarEnlace("https://www.instagram.com/reel/C123/")).toMatchObject({ tipo: "instagram", dominio: "instagram.com" });
    expect(analizarEnlace("https://www.songsterr.com/a/wsa/x")).toMatchObject({ tipo: "web", dominio: "songsterr.com" });
  });
});

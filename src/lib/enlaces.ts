export type TipoEnlace = "youtube" | "instagram" | "web";

export interface EnlaceAnalizado {
  url: string;
  tipo: TipoEnlace;
  dominio: string;
  youtubeId?: string;
  /** Segundo de inicio indicado en el link (t=90, t=1m30s). */
  inicioSeg?: number;
}

/** Agrega https:// si falta. Devuelve null si no parece una URL. */
export function normalizarUrl(texto: string): string | null {
  const limpio = texto.trim();
  if (!limpio || /\s/.test(limpio)) return null;
  const conEsquema = /^https?:\/\//i.test(limpio) ? limpio : `https://${limpio}`;
  try {
    const url = new URL(conEsquema);
    return url.hostname.includes(".") ? url.toString() : null;
  } catch {
    return null;
  }
}

function segundos(t: string | null): number | undefined {
  if (!t) return undefined;
  if (/^\d+$/.test(t)) return Number(t);
  const m = t.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (!m || !m[0]) return undefined;
  return Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
}

const ID_YOUTUBE = /^[\w-]{11}$/;

export function analizarEnlace(texto: string): EnlaceAnalizado | null {
  const normalizada = normalizarUrl(texto);
  if (!normalizada) return null;
  const url = new URL(normalizada);
  const host = url.hostname.replace(/^(www|m|music)\./, "");
  const base = { url: normalizada, dominio: host };

  if (host === "youtu.be" || host === "youtube.com" || host === "youtube-nocookie.com") {
    let id: string | undefined;
    if (host === "youtu.be") id = url.pathname.slice(1).split("/")[0];
    else if (url.pathname === "/watch") id = url.searchParams.get("v") ?? undefined;
    else {
      const m = url.pathname.match(/^\/(?:shorts|live|embed)\/([^/]+)/);
      id = m?.[1];
    }
    if (id && ID_YOUTUBE.test(id)) {
      return { ...base, tipo: "youtube", youtubeId: id, inicioSeg: segundos(url.searchParams.get("t") ?? url.searchParams.get("start")) };
    }
  }

  if (host === "instagram.com") return { ...base, tipo: "instagram" };
  return { ...base, tipo: "web" };
}

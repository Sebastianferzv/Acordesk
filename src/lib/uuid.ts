/**
 * UUID v4. Usa crypto.randomUUID cuando existe; si no (por ejemplo al abrir la app
 * por IP local sin HTTPS, donde randomUUID no está disponible), lo arma con
 * crypto.getRandomValues, que sí funciona en contextos no seguros.
 */
export function uuid(): string {
  const c = globalThis.crypto;
  if (typeof c?.randomUUID === "function") return c.randomUUID();

  const b = new Uint8Array(16);
  c.getRandomValues(b);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

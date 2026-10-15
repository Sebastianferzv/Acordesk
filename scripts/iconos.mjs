// Genera los íconos de la app a partir de una composición Bauhaus en SVG.
// Uso: npm run iconos  (los PNG resultantes se versionan; no hace falta correrlo en cada build).
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const C = { fondo: "#f1e9d8", tinta: "#16130f", rojo: "#cf3427", amarillo: "#f2b42c", azul: "#1e4fa3" };

function composicion({ escala = 1, lineas = true } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="${C.fondo}"/>
  <g transform="translate(256 256) scale(${escala}) translate(-256 -256)">
    <circle cx="214" cy="206" r="134" fill="${C.rojo}"/>
    <rect x="104" y="292" width="148" height="148" fill="${C.azul}"/>
    <polygon points="258,440 446,440 352,262" fill="${C.amarillo}"/>
    ${lineas ? `<rect x="66" y="452" width="380" height="20" fill="${C.tinta}"/><rect x="404" y="58" width="20" height="176" fill="${C.tinta}"/>` : ""}
  </g>
</svg>`;
}

async function png(svg, tamano, destino) {
  await sharp(Buffer.from(svg)).resize(tamano, tamano).png().toFile(destino);
  console.log("✓", destino);
}

await mkdir("public/icons", { recursive: true });

const completa = composicion();
await png(completa, 192, "public/icons/icon-192.png");
await png(completa, 512, "public/icons/icon-512.png");
// Maskable: la composición se achica para quedar dentro de la zona segura (círculo del 80%).
await png(composicion({ escala: 0.68 }), 512, "public/icons/maskable-512.png");
await png(completa, 180, "src/app/apple-icon.png");
// Favicon: sin líneas, para que se lea bien a 16 px.
await writeFile("src/app/icon.svg", composicion({ escala: 1.1, lineas: false }));
console.log("✓ src/app/icon.svg");

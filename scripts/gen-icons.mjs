// Generates a clean, square icon set from the (oversized, non-square) source eye.
// Run: node scripts/gen-icons.mjs
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const SRC = "asset/favicon.png";
const OUT = "public";
mkdirSync(OUT, { recursive: true });

// Pre-trim the eye once (transparent bg) at high res; we re-fit per target size.
const eyeTrimmed = await sharp(SRC)
  .trim({ threshold: 20 })
  .png()
  .toBuffer();

function plateSvg(size) {
  const r = Math.round(size * 0.22);
  const inset = Math.max(2, Math.round(size * 0.027));
  return Buffer.from(
    `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
       <defs>
         <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
           <stop offset="0%" stop-color="#1b2c63"/>
           <stop offset="100%" stop-color="#0a1138"/>
         </linearGradient>
       </defs>
       <rect width="${size}" height="${size}" rx="${r}" fill="url(#g)"/>
       <rect x="${inset}" y="${inset}" width="${size - inset * 2}" height="${size - inset * 2}"
             rx="${r - inset}" fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="${inset}"/>
     </svg>`
  );
}

async function makeIcon(name, size) {
  const pad = Math.round(size * 0.16);
  const eye = await sharp(eyeTrimmed)
    .resize(size - pad * 2, size - pad * 2, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();
  await sharp(plateSvg(size))
    .composite([{ input: eye, gravity: "center" }])
    .png()
    .toFile(`${OUT}/${name}`);
  console.log("wrote", `${OUT}/${name}`, `${size}x${size}`);
}

const targets = [
  ["icon-512.png", 512],
  ["icon-192.png", 192],
  ["apple-touch-icon.png", 180],
  ["favicon.png", 64],
];

for (const [name, size] of targets) await makeIcon(name, size);
console.log("done");

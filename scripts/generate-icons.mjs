// Regenerates every favicon/app icon from public/logo-black.svg.
// Run: node scripts/generate-icons.mjs
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const BG = "#b6dbe1"; // --color-sky (brand accent)
const MARK = "#15181a"; // --color-ink

const logo = readFileSync("public/logo-black.svg", "utf8");
const path = logo.match(/ d="([^"]+)"/)[1];
const viewBox = logo.match(/viewBox="([^"]+)"/)[1];

const icon = ({ radius, inset }) => `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64"${radius ? ` rx="${radius}" ry="${radius}"` : ""} fill="${BG}"/>
  <svg x="${inset}" y="${inset}" width="${64 - inset * 2}" height="${64 - inset * 2}" viewBox="${viewBox}">
    <path fill="${MARK}" d="${path}"/>
  </svg>
</svg>
`;

const rounded = icon({ radius: 14, inset: 10 });
// Square, with extra safe area: iOS and Android apply their own masks.
const square = icon({ radius: 0, inset: 12 });

writeFileSync("public/favicon.svg", rounded);
writeFileSync("src/app/icon.svg", rounded);

const png = (size, out) => sharp(Buffer.from(square), { density: 1200 }).resize(size, size).png().toFile(out);
await png(180, "src/app/apple-icon.png");
await png(192, "public/icon.png");
await png(512, "public/favicon-512.png");
console.log("Icons generated.");

import { mkdir, access, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'src/assets');
await mkdir(out, { recursive: true });
const headers = { 'user-agent': 'Mozilla/5.0 MafesurAssetBuilder/1.0' };

async function fetchOk(url) {
  const response = await fetch(url, { headers, cache: 'no-store' });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response;
}
async function text(url) { return (await fetchOk(url)).text(); }
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&#038;', '&');
function firstImage(html, words) {
  for (const tag of html.match(/<img\b[^>]*>/gi) || []) {
    const low = tag.toLowerCase();
    if (words.some(word => low.includes(word))) {
      const match = tag.match(/(?:src|data-src)=["']([^"']+)/i);
      if (match) return new URL(decode(match[1]), 'https://www.mafesur.es/').href;
    }
  }
}
function ogImage(html) {
  return html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i)?.[1]
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1];
}
async function optionalText(...urls) {
  for (const url of urls) {
    try { return await text(url); } catch {}
  }
  return '';
}
async function save(url, name, quality = 82) {
  const target = resolve(out, name);
  try { await access(target); return; } catch {}
  const bytes = Buffer.from(await (await fetchOk(url)).arrayBuffer());
  const image = await sharp(bytes).rotate().resize({ width: 1500, withoutEnlargement: true }).webp({ quality }).toBuffer();
  await writeFile(target, image);
  console.log(`asset ${name}`);
}

const home = await text('https://www.mafesur.es/');
const logo = firstImage(home, ['logo', 'automóviles mafesur', 'automoviles mafesur']);
const facadeCurrent = 'https://www.mafesur.es/wp-content/uploads/2026/02/grok_1767202287637.jpg';
const facade = 'https://www.mafesur.es/wp-content/uploads/2025/09/20200923_132714-1024x498.jpg';
const ford = [
  'https://www.mafesur.es/wp-content/uploads/2025/12/20260116_170104-416x234.jpg',
  'https://www.mafesur.es/wp-content/uploads/2025/12/20260116_170301-416x234.jpg',
  'https://www.mafesur.es/wp-content/uploads/2025/12/20260116_170126-416x234.jpg',
  'https://www.mafesur.es/wp-content/uploads/2025/12/20260116_170349-416x234.jpg',
  'https://www.mafesur.es/wp-content/uploads/2025/12/20260116_170418-416x234.jpg'
];
const catalogue = await optionalText('https://www.mafesur.es/venta-de-vehiculos-de-ocasion/', 'https://www.mafesur.es/venta-de-vehiculos/');
const productLinks = [...catalogue.matchAll(/href=["']([^"']+)/gi)].map(match => decode(match[1]));
let audiPage = productLinks.find(link => /\/producto\//i.test(link) && /(audi|q5)/i.test(link));
if (audiPage) audiPage = new URL(audiPage, 'https://www.mafesur.es/').href;
const audiHtml = audiPage ? await optionalText(audiPage) : '';
const audi = firstImage(audiHtml, ['audi', 'q5']) || ogImage(audiHtml) || facadeCurrent;
const rentalHtml = await optionalText('https://www.mafesur.es/alquiler-de-vehiculos/', 'https://www.mafesur.es/tarifas-de-alquiler/');
const motorhome = firstImage(rentalHtml, ['autocaravana', 'motorhome', 'caravana']) || ogImage(rentalHtml) || facade;

if (!logo) throw new Error('No se ha podido localizar el logotipo oficial de Mafesur.');
await save(logo, 'logo.webp', 88);
await save(facadeCurrent, 'facade-current.webp');
await save(facade, 'facade.webp');
await save(audi, 'audi-q5.webp');
await save(motorhome, 'motorhome.webp');
for (let i = 0; i < ford.length; i += 1) await save(ford[i], `ford-${i + 1}.webp`);

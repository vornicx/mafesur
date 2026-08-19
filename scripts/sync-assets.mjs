import { mkdir, access, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'src/assets');
await mkdir(out, { recursive: true });

const headers = {
  'user-agent': 'Mozilla/5.0 MafesurAssetBuilder/2.1',
  accept: 'text/html,application/xhtml+xml,application/json,image/avif,image/webp,image/apng,image/*,*/*;q=0.8'
};

async function fetchOk(url) {
  const response = await fetch(url, { headers, cache: 'no-store' });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response;
}

async function text(url) {
  return (await fetchOk(url)).text();
}

async function json(url) {
  return (await fetchOk(url)).json();
}

const decode = value => value
  .replaceAll('&amp;', '&')
  .replaceAll('&#038;', '&')
  .replaceAll('&#8211;', '–')
  .replaceAll('&#8217;', '’');

const normalise = value => decode(String(value || ''))
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/<[^>]+>/g, ' ')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

function firstImage(html, words = []) {
  const wanted = words.map(normalise);
  for (const tag of html.match(/<img\b[^>]*>/gi) || []) {
    const low = normalise(tag);
    if (!wanted.length || wanted.every(word => low.includes(word))) {
      const match = tag.match(/(?:src|data-src)=["']([^"']+)/i);
      if (match) return new URL(decode(match[1]), 'https://www.mafesur.es/').href;
    }
  }
}

function ogImage(html) {
  return html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i)?.[1]
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1];
}

function galleryImages(html) {
  const urls = [];
  const push = value => {
    if (!value) return;
    const href = new URL(decode(value), 'https://www.mafesur.es/').href;
    if (!/\/wp-content\/uploads\//i.test(href)) return;
    if (/logo|cropped|icon|avatar/i.test(href)) return;
    if (!urls.includes(href)) urls.push(href);
  };

  for (const match of html.matchAll(/data-large_image=["']([^"']+)["']/gi)) push(match[1]);
  for (const match of html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*data-rel=["'][^"']*prettyPhoto/gi)) push(match[1]);
  for (const match of html.matchAll(/<img\b[^>]*(?:wp-post-image|woocommerce-product-gallery__image)[^>]*>/gi)) {
    push(match[0].match(/(?:src|data-src)=["']([^"']+)/i)?.[1]);
  }
  push(ogImage(html));
  return urls;
}

async function optionalText(...urls) {
  for (const url of urls) {
    try { return await text(url); } catch {}
  }
  return '';
}

async function optionalJson(url) {
  try { return await json(url); } catch { return []; }
}

async function save(url, name, quality = 84) {
  const target = resolve(out, name);
  try { await access(target); return; } catch {}
  const bytes = Buffer.from(await (await fetchOk(url)).arrayBuffer());
  const image = await sharp(bytes)
    .rotate()
    .resize({ width: 1800, height: 1200, fit: 'inside', withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();
  await writeFile(target, image);
  console.log(`asset ${name}`);
}

const home = await text('https://www.mafesur.es/');
const catalogue = await optionalText(
  'https://www.mafesur.es/venta-de-vehiculos/',
  'https://www.mafesur.es/venta-de-vehiculos-de-ocasion/'
);

const logo = firstImage(home, ['logo'])
  || 'https://www.mafesur.es/wp-content/uploads/2025/08/cropped-LOGOS.PNG-1-scaled-1.png';
const facadeCurrent = 'https://www.mafesur.es/wp-content/uploads/2026/02/grok_1767202287637.jpg';
const facade = 'https://www.mafesur.es/wp-content/uploads/2025/09/20200923_132714-1024x498.jpg';

const rentalHtml = await optionalText(
  'https://www.mafesur.es/alquiler-de-vehiculos/',
  'https://www.mafesur.es/tarifas-de-alquiler/'
);
const motorhome = firstImage(rentalHtml, ['autocaravana'])
  || firstImage(rentalHtml, ['caravana'])
  || ogImage(rentalHtml)
  || facade;

await save(logo, 'logo.webp', 90);
await save(facadeCurrent, 'facade-current.webp', 86);
await save(facade, 'facade.webp', 86);
await save(motorhome, 'motorhome.webp', 86);

const anchors = [...catalogue.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].map(match => ({
  href: new URL(decode(match[1]), 'https://www.mafesur.es/').href,
  haystack: normalise(`${match[1]} ${match[2]}`)
}));

const vehicles = [
  { id: 'audi-q5', query: 'Audi Q5', words: ['audi', 'q5'] },
  { id: 'ford-transit', query: 'Ford Transit Custom', words: ['ford', 'transit'] },
  { id: 'citroen-berlingo', query: 'Citroen Berlingo', words: ['citroen', 'berlingo'] },
  { id: 'nissan-qashqai', query: 'Nissan Qashqai', words: ['nissan', 'qashqai'] },
  { id: 'peugeot-208', query: 'Peugeot 208', words: ['peugeot', '208'] },
  { id: 'vw-troc', query: 'Volkswagen T-Roc', words: ['volkswagen', 't roc'] },
  { id: 'vw-passat', query: 'Volkswagen Passat', words: ['volkswagen', 'passat'] },
  { id: 'peugeot-3008', query: 'Peugeot 3008', words: ['peugeot', '3008'] },
  { id: 'bmw-x4', query: 'BMW X4', words: ['bmw', 'x4'] }
];

async function storeImages(vehicle) {
  const endpoint = `https://www.mafesur.es/wp-json/wc/store/v1/products?search=${encodeURIComponent(vehicle.query)}&per_page=20`;
  const products = await optionalJson(endpoint);
  const wanted = vehicle.words.map(normalise);
  const product = Array.isArray(products)
    ? products.find(item => wanted.every(word => normalise(`${item.name} ${item.permalink || ''}`).includes(word))) || products[0]
    : null;
  if (!product) return [];
  const urls = (product.images || []).map(image => image.src || image.thumbnail || image.srcset?.split(' ')[0]).filter(Boolean);
  if (urls.length) console.log(`${vehicle.id}: WooCommerce Store API`);
  return urls;
}

async function scrapedImages(vehicle) {
  const wanted = vehicle.words.map(normalise);
  const match = anchors.find(anchor => /\/producto\//i.test(anchor.href) && wanted.every(word => anchor.haystack.includes(word)));
  if (!match) return [];
  const page = await optionalText(match.href);
  const found = galleryImages(page);
  if (found.length) console.log(`${vehicle.id}: official product page fallback`);
  return found;
}

for (const vehicle of vehicles) {
  let found = await storeImages(vehicle);
  if (!found.length) found = await scrapedImages(vehicle);

  if (!found.length) {
    console.warn(`${vehicle.id}: product imagery unavailable; using neutral local facility fallback`);
    found = [facadeCurrent];
  }

  const fallback = found[0];
  const images = [found[0] || fallback, found[1] || fallback, found[2] || fallback];
  await save(images[0], `${vehicle.id}.webp`, 87);
  await save(images[1], `${vehicle.id}-2.webp`, 85);
  await save(images[2], `${vehicle.id}-3.webp`, 85);
}

import { mkdir, access, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'src/assets');
const generatedCatalogue = resolve(root, 'src/js/catalog.generated.js');
await mkdir(out, { recursive: true });

const headers = {
  'user-agent': 'Mozilla/5.0 MafesurAssetBuilder/3.0',
  accept: 'text/html,application/xhtml+xml,application/json,image/avif,image/webp,image/apng,image/*,*/*;q=0.8'
};

async function fetchOk(url) {
  const response = await fetch(url, { headers, cache: 'no-store' });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response;
}

async function text(url) { return (await fetchOk(url)).text(); }
async function json(url) { return (await fetchOk(url)).json(); }
async function optionalText(...urls) {
  for (const url of urls) { try { return await text(url); } catch {} }
  return '';
}
async function optionalJson(url) { try { return await json(url); } catch { return []; } }

const decode = value => String(value || '')
  .replaceAll('&amp;', '&')
  .replaceAll('&#038;', '&')
  .replaceAll('&#8211;', '–')
  .replaceAll('&#8217;', '’')
  .replaceAll('&nbsp;', ' ');

const stripHtml = value => decode(value)
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const normalise = value => stripHtml(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
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

async function save(url, name, quality = 82, width = 1600) {
  const target = resolve(out, name);
  try { await access(target); return; } catch {}
  const bytes = Buffer.from(await (await fetchOk(url)).arrayBuffer());
  const image = await sharp(bytes)
    .rotate()
    .resize({ width, height: 1200, fit: 'inside', withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();
  await writeFile(target, image);
}

const home = await text('https://www.mafesur.es/');
const logo = firstImage(home, ['logo'])
  || 'https://www.mafesur.es/wp-content/uploads/2025/08/cropped-LOGOS.PNG-1-scaled-1.png';
const facadeCurrent = 'https://www.mafesur.es/wp-content/uploads/2026/02/grok_1767202287637.jpg';
const facade = 'https://www.mafesur.es/wp-content/uploads/2025/09/20200923_132714-1024x498.jpg';
const rentalHtml = await optionalText('https://www.mafesur.es/alquiler-de-vehiculos/', 'https://www.mafesur.es/tarifas-de-alquiler/');
const motorhome = firstImage(rentalHtml, ['autocaravana']) || firstImage(rentalHtml, ['caravana']) || ogImage(rentalHtml) || facade;

await save(logo, 'logo.webp', 90, 1200);
await save(facadeCurrent, 'facade-current.webp', 85, 1800);
await save(facade, 'facade.webp', 85, 1800);
await save(motorhome, 'motorhome.webp', 85, 1800);

// Stable hero/editorial assets. These remain named so the static art direction
// does not depend on whatever order the live catalogue returns.
const showcaseQueries = [
  ['audi-q5', 'Audi Q5'],
  ['ford-transit', 'Ford Transit Custom'],
  ['citroen-berlingo', 'Citroen Berlingo'],
  ['nissan-qashqai', 'Nissan Qashqai'],
  ['peugeot-208', 'Peugeot 208'],
  ['vw-troc', 'Volkswagen T-Roc'],
  ['vw-passat', 'Volkswagen Passat'],
  ['peugeot-3008', 'Peugeot 3008'],
  ['bmw-x4', 'BMW X4']
];

for (const [id, query] of showcaseQueries) {
  const products = await optionalJson(`https://www.mafesur.es/wp-json/wc/store/v1/products?search=${encodeURIComponent(query)}&per_page=20`);
  const product = Array.isArray(products) ? products.find(item => item.images?.length) : null;
  const urls = (product?.images || []).map(image => image.src || image.thumbnail).filter(Boolean);
  const safe = urls.length ? urls : [facadeCurrent];
  for (let index = 0; index < 3; index += 1) {
    await save(safe[index] || safe[0], `${id}${index ? `-${index + 1}` : ''}.webp`, index ? 80 : 84, index ? 1500 : 1700);
  }
}

// Build the public catalogue from the official WooCommerce Store API.
// The API currently exposes the products Mafesur itself publishes; runtime
// never calls it because the resulting data and photos are materialised here.
const apiUrl = 'https://www.mafesur.es/wp-json/wc/store/v1/products?per_page=100';
const rawProducts = await optionalJson(apiUrl);
if (!Array.isArray(rawProducts) || !rawProducts.length) throw new Error('Mafesur Store API returned no products.');

const minorPrice = product => {
  const unit = Number(product?.prices?.currency_minor_unit ?? 2);
  const value = Number(product?.prices?.price || 0);
  return Number.isFinite(value) && value > 0 ? value / (10 ** unit) : 0;
};
const regularPrice = product => {
  const unit = Number(product?.prices?.currency_minor_unit ?? 2);
  const value = Number(product?.prices?.regular_price || 0);
  return Number.isFinite(value) && value > 0 ? value / (10 ** unit) : 0;
};
const canonicalName = name => normalise(String(name || '').replace(/\s*\(copia\)\s*/gi, ''));
const productScore = product => (minorPrice(product) > 0 ? 10000 : 0) + (/\(copia\)/i.test(product.name || '') ? 0 : 2000) + ((product.images || []).length * 10);

const deduped = new Map();
for (const product of rawProducts) {
  const key = canonicalName(product.name);
  if (!key) continue;
  const previous = deduped.get(key);
  if (!previous || productScore(product) > productScore(previous)) deduped.set(key, product);
}
const products = [...deduped.values()];

const brands = ['Mercedes-Benz','Land Rover','Volkswagen','Citroën','Citroen','Peugeot','Renault','Nissan','Audi','BMW','Ford','Opel','SEAT','Seat','Škoda','Skoda','Toyota','Hyundai','Kia','Fiat','Volvo','Dacia','Jeep','Cupra','DS'];
function brandOf(name) {
  const normalizedName = normalise(name);
  return brands.find(brand => normalizedName.startsWith(normalise(brand))) || String(name || '').split(/\s+/)[0] || 'Mafesur';
}
function modelOf(name, brand) {
  const clean = String(name || '').replace(/\s*\(copia\)\s*/gi, '').trim();
  const pattern = new RegExp(`^${brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+`, 'i');
  return clean.replace(pattern, '').trim() || clean;
}
function yearOf(textValue) {
  const explicit = textValue.match(/(?:año|matriculaci[oó]n|fecha\s+de\s+matriculaci[oó]n)\D{0,20}(20(?:1\d|2[0-6]))/i)?.[1];
  return explicit ? Number(explicit) : null;
}
function kmsOf(textValue) {
  const match = textValue.match(/(\d{1,3}(?:[.\s]\d{3})+|\d{4,6})\s*(?:km|kms|kil[oó]metros)\b/i)?.[1];
  if (!match) return 'Consultar';
  const value = Number(match.replace(/[^0-9]/g, ''));
  return Number.isFinite(value) ? `${new Intl.NumberFormat('es-ES').format(value)} km` : 'Consultar';
}
function powerOf(name, textValue) {
  const match = `${name} ${textValue}`.match(/\b(\d{2,3})\s*(?:cv|c\.v\.)\b/i)?.[1];
  return match ? `${match} CV` : 'Consultar';
}
function gearOf(name, textValue) {
  const value = normalise(`${name} ${textValue}`);
  if (/automatic|s tronic|dsg|steptronic|edc|cambio auto/.test(value)) return 'Automático';
  if (/manual|cambio manual/.test(value)) return 'Manual';
  return 'Consultar';
}
function fuelOf(name, textValue) {
  const value = normalise(`${name} ${textValue}`);
  if (/electrico|electric|bev/.test(value)) return 'Eléctrico';
  if (/phev|hibrido enchufable/.test(value)) return 'Híbrido enchufable';
  if (/mhev|mild hybrid/.test(value) && /diesel|diesel|tdi|hdi|dci|tdci/.test(value)) return 'Diésel / MHEV';
  if (/mhev|mild hybrid|hibrido/.test(value)) return 'Híbrido';
  if (/diesel|tdi|bluehdi|hdi|dci|tdci|cdti/.test(value)) return 'Diésel';
  if (/gasolina|tsi|tfsi|puretech|ecoboost|mpi/.test(value)) return 'Gasolina';
  return 'Consultar';
}
function colorOf(textValue) {
  const match = textValue.match(/\bcolor\s*[:\-]?\s*([A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]{3,24})/i)?.[1]?.trim();
  if (!match) return 'Consultar';
  return match.split(/\s{2,}|\.|,|\||\//)[0].trim().slice(0, 22) || 'Consultar';
}
function detailsOf(description, fuel, gear, power) {
  const details = [];
  if (fuel !== 'Consultar') details.push(fuel);
  if (gear !== 'Consultar') details.push(gear);
  if (power !== 'Consultar') details.push(power);
  if (/garant[ií]a[\s\S]{0,40}(?:1|un)\s+año/i.test(description)) details.push('Garantía 1 año');
  if (/financ/i.test(description)) details.push('Opciones de financiación');
  if (details.length < 3) details.push('Vehículo revisado por Mafesur');
  return [...new Set(details)].slice(0, 5);
}

const pricedIds = [...products]
  .filter(product => minorPrice(product) > 0)
  .sort((a, b) => minorPrice(b) - minorPrice(a))
  .slice(0, 3)
  .map(product => product.id);

const generated = [];
for (const product of products) {
  const brand = brandOf(product.name);
  const model = modelOf(product.name, brand);
  const description = stripHtml(product.description || product.short_description || '');
  const fuel = fuelOf(product.name, description);
  const gear = gearOf(product.name, description);
  const power = powerOf(product.name, description);
  const sourceImages = (product.images || []).map(image => image.src || image.thumbnail).filter(Boolean);
  const images = sourceImages.length ? sourceImages : [facadeCurrent];
  const gallery = [];

  for (let index = 0; index < images.length; index += 1) {
    const file = `stock-${product.id}-${index + 1}.webp`;
    try {
      await save(images[index], file, index === 0 ? 83 : 78, index === 0 ? 1700 : 1450);
      gallery.push(`/assets/${file}`);
    } catch (error) {
      console.warn(`image ${product.id}/${index + 1}: ${error.message}`);
    }
  }
  if (!gallery.length) {
    const file = `stock-${product.id}-1.webp`;
    await save(facadeCurrent, file, 82, 1600);
    gallery.push(`/assets/${file}`);
  }

  const price = minorPrice(product);
  const before = regularPrice(product);
  const year = yearOf(description);
  const premium = /^(Audi|BMW|Mercedes-Benz|Land Rover|Volvo|DS)$/i.test(brand) || price >= 30000;

  generated.push({
    id: `stock-${product.id}`,
    sourceId: product.id,
    brand,
    model,
    year: year || 'Consultar',
    gear,
    fuel,
    power,
    color: colorOf(description),
    kms: kmsOf(description),
    price,
    before: before > price ? before : 0,
    featured: pricedIds.includes(product.id),
    image: gallery[0],
    gallery,
    summary: `Vehículo de ocasión disponible en la exposición de Mafesur. Consulta disponibilidad, condiciones y opciones de financiación.`,
    details: detailsOf(description, fuel, gear, power),
    label: premium ? 'Premium Selection' : 'Ocasión'
  });
}

generated.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || (b.price || 0) - (a.price || 0));
await writeFile(generatedCatalogue, `// Generated at build time from Mafesur public inventory.\nexport const generatedVehicles = ${JSON.stringify(generated, null, 2)};\n`);
console.log(`catalogue ${rawProducts.length} products → ${generated.length} unique vehicles · galleries localised`);

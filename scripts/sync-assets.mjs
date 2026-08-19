import { mkdir, access, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'src/assets');
const generatedCatalogue = resolve(root, 'src/js/catalog.generated.js');
await mkdir(out, { recursive: true });

const headers = {
  'user-agent': 'Mozilla/5.0 MafesurAssetBuilder/3.1',
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
  .replaceAll('&#38;', '&')
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

const showcaseQueries = [
  ['audi-q5', 'Audi Q5'], ['ford-transit', 'Ford Transit Custom'], ['citroen-berlingo', 'Citroen Berlingo'],
  ['nissan-qashqai', 'Nissan Qashqai'], ['peugeot-208', 'Peugeot 208'], ['vw-troc', 'Volkswagen T-Roc'],
  ['vw-passat', 'Volkswagen Passat'], ['peugeot-3008', 'Peugeot 3008'], ['bmw-x4', 'BMW X4']
];
for (const [id, query] of showcaseQueries) {
  const results = await optionalJson(`https://www.mafesur.es/wp-json/wc/store/v1/products?search=${encodeURIComponent(query)}&per_page=20`);
  const product = Array.isArray(results) ? results.find(item => item.images?.length) : null;
  const urls = (product?.images || []).map(image => image.src || image.thumbnail).filter(Boolean);
  const safe = urls.length ? urls : [facadeCurrent];
  await Promise.all([0, 1, 2].map(async index => {
    await save(safe[index] || safe[0], `${id}${index ? `-${index + 1}` : ''}.webp`, index ? 80 : 84, index ? 1500 : 1700);
  }));
}

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
const cleanName = value => decode(String(value || '')).replace(/\s*\(copia\)\s*/gi, '').replace(/\s+/g, ' ').trim();
const canonicalName = name => normalise(cleanName(name));
const productScore = product => (minorPrice(product) > 0 ? 10000 : 0) + (/\(copia\)/i.test(product.name || '') ? 0 : 2000) + ((product.images || []).length * 10);

const deduped = new Map();
for (const product of rawProducts) {
  const key = canonicalName(product.name);
  if (!key) continue;
  const previous = deduped.get(key);
  if (!previous || productScore(product) > productScore(previous)) deduped.set(key, product);
}
const products = [...deduped.values()];

const brandAliases = [
  [/^(mercedes(?:-benz)?|mercedes benz)\b/i, 'Mercedes-Benz'], [/^land rover\b/i, 'Land Rover'],
  [/^volkswagen\b/i, 'Volkswagen'], [/^(citroen|citroën)\b/i, 'Citroën'], [/^(peugeot|peigeot|peugeot|pei?geot)\b/i, 'Peugeot'],
  [/^renault\b/i, 'Renault'], [/^nissan\b/i, 'Nissan'], [/^audi\b/i, 'Audi'], [/^bmw\b/i, 'BMW'],
  [/^ford\b/i, 'Ford'], [/^opel\b/i, 'Opel'], [/^seat\b/i, 'SEAT'], [/^(skoda|škoda)\b/i, 'Škoda'],
  [/^toyota\b/i, 'Toyota'], [/^hyundai\b/i, 'Hyundai'], [/^kia\b/i, 'Kia'], [/^fiat\b/i, 'Fiat'],
  [/^volvo\b/i, 'Volvo'], [/^dacia\b/i, 'Dacia'], [/^jeep\b/i, 'Jeep'], [/^cupra\b/i, 'Cupra'],
  [/^ds\b/i, 'DS'], [/^mini\b/i, 'MINI'], [/^(chevrolet|cjevrolet)\b/i, 'Chevrolet']
];
function brandOf(name) {
  const value = cleanName(name);
  return brandAliases.find(([pattern]) => pattern.test(value))?.[1] || value.split(/\s+/)[0] || 'Mafesur';
}
function modelOf(name, brand) {
  let value = cleanName(name);
  for (const [pattern, canonical] of brandAliases) {
    if (canonical === brand && pattern.test(value)) {
      value = value.replace(pattern, '').trim();
      break;
    }
  }
  return value || cleanName(name);
}
function yearOf(textValue) {
  const explicit = textValue.match(/(?:año|matriculaci[oó]n|fecha\s+de\s+matriculaci[oó]n)\D{0,20}(20(?:0\d|1\d|2[0-6]))/i)?.[1];
  return explicit ? Number(explicit) : null;
}
function kmsOf(textValue) {
  const match = textValue.match(/(\d{1,3}(?:[.\s]\d{3})+|\d{4,6})\s*(?:km|kms|kil[oó]metros)\b/i)?.[1];
  if (!match) return 'Consultar';
  const value = Number(match.replace(/[^0-9]/g, ''));
  return Number.isFinite(value) ? `${new Intl.NumberFormat('es-ES').format(value)} km` : 'Consultar';
}
function powerOf(name, textValue) {
  const inName = cleanName(name).match(/\b(\d{2,3})\s*(?:cv|c\.v\.)\b/i)?.[1];
  const inText = textValue.match(/\b(\d{2,3})\s*(?:cv|c\.v\.)\b/i)?.[1];
  const match = inName || inText;
  return match ? `${match} CV` : 'Consultar';
}
function gearOf(name, textValue) {
  const title = normalise(cleanName(name));
  if (/automatic|s tronic|dsg|steptronic|edc|cambio auto| at\b/.test(title)) return 'Automático';
  if (/manual|cambio manual/.test(title)) return 'Manual';
  const explicit = normalise(textValue.match(/(?:cambio|transmisi[oó]n)\s*[:\-]?\s*(autom[aá]tic[oa]|manual)/i)?.[1] || '');
  if (explicit.includes('automatic')) return 'Automático';
  if (explicit.includes('manual')) return 'Manual';
  return 'Consultar';
}
function fuelOf(name, textValue) {
  const title = normalise(cleanName(name));
  const full = normalise(textValue);
  const diesel = /diesel|tdi|bluehdi|blue hdi|\bhdi\b|dci|tdci|cdti|svdt/.test(title);
  const hybrid = /mhev|mild hybrid|hybrid|hibrido/.test(title);
  if (diesel && hybrid) return 'Diésel / MHEV';
  if (diesel) return 'Diésel';
  if (/phev|hibrido enchufable/.test(title)) return 'Híbrido enchufable';
  if (hybrid) return 'Híbrido';
  if (/100 electrico|electrico|electric|\bbev\b/.test(title)) return 'Eléctrico';
  if (/gasolina|\btsi\b|tfsi|puretech|ecoboost|\bmpi\b/.test(title)) return 'Gasolina';

  if (/diesel|tdi|bluehdi|blue hdi|\bhdi\b|dci|tdci|cdti|svdt/.test(full)) return 'Diésel';
  if (/combustible\s*[:\-]?\s*(gasolina)/.test(full)) return 'Gasolina';
  if (/combustible\s*[:\-]?\s*(hibrido|hybrid)/.test(full)) return 'Híbrido';
  if (/combustible\s*[:\-]?\s*(electrico|electric)/.test(full)) return 'Eléctrico';
  return 'Consultar';
}
function colorOf(textValue) {
  const known = ['negro','blanco','gris','plata','azul','rojo','verde','beige','marrón','marron','amarillo','naranja'];
  const match = textValue.match(/\bcolor\s*[:\-]\s*([A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]{3,24})/i)?.[1]?.trim();
  if (!match) return 'Consultar';
  const normalized = normalise(match);
  const color = known.find(item => normalized.startsWith(normalise(item)));
  return color ? `${color[0].toUpperCase()}${color.slice(1)}` : 'Consultar';
}
function segmentOf(name) {
  const value = normalise(cleanName(name));
  if (/mclouis|mclouise|yearlin|autocaravana|motorhome/.test(value)) return 'Autocaravana';
  if (/transit|partner|berlingo|ducato|furgon|industrial/.test(value)) return 'Industrial';
  if (/q[357]|x[1345]|qashqai|t roc|touareg|evoque|xc[46]0|sportage|crossland|3008|5008|ds7|crossback/.test(value)) return 'SUV';
  if (/passat|arteon|508|607|605/.test(value)) return 'Berlina';
  return 'Ocasión';
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
function summaryOf(brand, model, segment) {
  if (segment === 'Autocaravana') return `${brand} ${model} disponible en Mafesur. Consulta condiciones, equipamiento y disponibilidad para tu próxima salida.`;
  if (segment === 'Industrial') return `${brand} ${model} disponible en Mafesur. Una opción orientada a trabajo y movilidad profesional; consulta condiciones y disponibilidad.`;
  return `${brand} ${model} disponible en la exposición de Mafesur. Consulta disponibilidad, condiciones y opciones de financiación.`;
}

const candidates = [...products]
  .filter(product => minorPrice(product) > 0 && segmentOf(product.name) !== 'Autocaravana')
  .sort((a, b) => minorPrice(b) - minorPrice(a));
const featuredIds = [];
const featuredBrands = new Set();
for (const product of candidates) {
  const brand = brandOf(product.name);
  if (featuredBrands.has(brand)) continue;
  featuredBrands.add(brand);
  featuredIds.push(product.id);
  if (featuredIds.length === 3) break;
}

const generated = [];
for (const product of products) {
  const brand = brandOf(product.name);
  const model = modelOf(product.name, brand);
  const description = stripHtml(product.description || product.short_description || '');
  const segment = segmentOf(product.name);
  const fuel = fuelOf(product.name, description);
  const gear = gearOf(product.name, description);
  const power = powerOf(product.name, description);
  const sourceImages = (product.images || []).map(image => image.src || image.thumbnail).filter(Boolean);
  const images = sourceImages.length ? sourceImages : [facadeCurrent];
  const gallery = new Array(images.length);

  await Promise.all(images.map(async (url, index) => {
    const file = `stock-${product.id}-${index + 1}.webp`;
    try {
      await save(url, file, index === 0 ? 83 : 78, index === 0 ? 1700 : 1450);
      gallery[index] = `/assets/${file}`;
    } catch (error) {
      console.warn(`image ${product.id}/${index + 1}: ${error.message}`);
    }
  }));
  const validGallery = gallery.filter(Boolean);
  if (!validGallery.length) {
    const file = `stock-${product.id}-1.webp`;
    await save(facadeCurrent, file, 82, 1600);
    validGallery.push(`/assets/${file}`);
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
    segment,
    year: year || 'Consultar',
    gear,
    fuel,
    power,
    color: colorOf(description),
    kms: kmsOf(description),
    price,
    before: before > price ? before : 0,
    featured: featuredIds.includes(product.id),
    image: validGallery[0],
    gallery: validGallery,
    summary: summaryOf(brand, model, segment),
    details: detailsOf(description, fuel, gear, power),
    label: premium ? 'Premium Selection' : segment
  });
}

generated.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || (b.price || 0) - (a.price || 0));
await writeFile(generatedCatalogue, `// Generated at build time from Mafesur public inventory.\nexport const generatedVehicles = ${JSON.stringify(generated, null, 2)};\n`);
console.log(`catalogue ${rawProducts.length} products → ${generated.length} unique vehicles · ${generated.reduce((sum, item) => sum + item.gallery.length, 0)} local gallery images`);

import { access, cp, mkdir, readFile, readdir, rm } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const src = resolve(root, 'src');
const dist = resolve(root, 'dist');

await import('./sync-assets.mjs');

const jsFiles = [
  'src/js/app.js',
  'src/js/data.js',
  'src/js/catalog.generated.js',
  'src/js/catalog-normalize.js',
  'src/js/site.js',
  'src/js/enhancements.js',
  'src/js/catalog-experience.js',
  'src/js/precision-v3.js',
  'src/js/workshop-v4.js',
  'src/js/rental-v4.js'
];

for (const file of jsFiles) {
  execFileSync(process.execPath, ['--check', resolve(root, file)], { stdio: 'inherit' });
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

const sourceFiles = (await walk(src)).filter(file => /\.(html|css|js)$/i.test(file));
const assetRefs = new Set();
const forbidden = [];

for (const file of sourceFiles) {
  const body = await readFile(file, 'utf8');
  for (const match of body.matchAll(/\/assets\/([a-z0-9._-]+\.(?:webp|png|jpe?g|svg))/gi)) assetRefs.add(match[1]);
  if (/https?:\/\/(?:www\.)?mafesur\.es\/wp-content|raw\.githubusercontent\.com|fonts\.googleapis\.com/i.test(body)) {
    forbidden.push(relative(root, file));
  }
}

if (forbidden.length) {
  throw new Error(`Runtime remote asset dependency detected in: ${forbidden.join(', ')}`);
}

for (const asset of assetRefs) {
  await access(resolve(src, 'assets', asset));
}

const catalogueModule = await readFile(resolve(src, 'js/catalog.generated.js'), 'utf8');
const catalogueEntries = (catalogueModule.match(/"sourceId"/g) || []).length;
if (catalogueEntries && catalogueEntries < 30) {
  throw new Error(`Catalogue completeness gate failed: only ${catalogueEntries} live vehicles generated.`);
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(src, dist, { recursive: true });

console.log(`Mafesur flagship built → dist/ · ${assetRefs.size} local assets verified · ${catalogueEntries || 'fallback'} catalogue vehicles · JS syntax OK`);

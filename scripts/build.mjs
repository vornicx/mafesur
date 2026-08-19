import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(resolve(root, 'src'), dist, { recursive: true });

// The repository stores the photographic library as a text-safe bundle so the
// deployment is fully self-contained. The build recreates proper binary WebP
// assets in /dist/assets; the live site never hotlinks another website.
const payloadRoot = resolve(root, 'asset-payloads');
const manifest = JSON.parse(await readFile(resolve(payloadRoot, 'manifest.json'), 'utf8'));
const parts = [];
for (let i = 0; i < manifest.chunks; i += 1) {
  parts.push(await readFile(resolve(payloadRoot, `chunk-${String(i).padStart(2, '0')}.txt`), 'utf8'));
}
const bundle = Buffer.from(parts.join(''), 'base64');
const assetDir = resolve(dist, 'assets');
await mkdir(assetDir, { recursive: true });
for (const [name, meta] of Object.entries(manifest.files)) {
  await writeFile(resolve(assetDir, name), bundle.subarray(meta.offset, meta.offset + meta.length));
}

console.log(`Mafesur flagship built → dist/ (${Object.keys(manifest.files).length} local assets)`);

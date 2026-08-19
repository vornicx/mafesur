import { cp, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');

// Assets are materialized into src/assets before packaging. The final site
// serves every image from its own /assets path; no image is hotlinked at runtime.
await import('./sync-assets.mjs');

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(resolve(root, 'src'), dist, { recursive: true });

console.log('Mafesur flagship built → dist/');

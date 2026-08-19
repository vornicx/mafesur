import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const useDist = process.argv.includes('--dist');
const root = resolve(import.meta.dirname, '..', useDist ? 'dist' : 'src');
const port = Number(process.env.PORT || 4173);
const mime = {
  '.html':'text/html; charset=utf-8',
  '.css':'text/css; charset=utf-8',
  '.js':'text/javascript; charset=utf-8',
  '.json':'application/json',
  '.png':'image/png',
  '.jpg':'image/jpeg',
  '.jpeg':'image/jpeg',
  '.webp':'image/webp',
  '.svg':'image/svg+xml'
};

async function getFile(urlPath){
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  let candidate = join(root, clean === '/' ? 'index.html' : clean);
  try {
    const s = await stat(candidate);
    if (s.isDirectory()) candidate = join(candidate, 'index.html');
  } catch {
    if (!extname(candidate)) candidate = join(candidate, 'index.html');
  }
  candidate = normalize(candidate);
  if (!candidate.startsWith(root)) return null;
  try { return { path:candidate, body:await readFile(candidate) }; }
  catch { return null; }
}

http.createServer(async (req,res)=>{
  const file = await getFile(req.url || '/');
  if (!file) {
    res.writeHead(404, {'content-type':'text/plain; charset=utf-8'});
    return res.end('404');
  }
  res.writeHead(200, {
    'content-type': mime[extname(file.path)] || 'application/octet-stream',
    'cache-control':'no-store'
  });
  res.end(file.body);
}).listen(port, ()=> console.log(`Mafesur running at http://localhost:${port}`));

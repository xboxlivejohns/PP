import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const review=path.join(project,'asset-review'), source=path.join(project,'source-photos');
const inventory=JSON.parse(await readFile(path.join(review,'inventory.json'),'utf8'));
const allowed=new Set(inventory.assets.map(a=>a.relativePath));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.mp4':'video/mp4','.csv':'text/csv; charset=utf-8'};
const port=Number(process.env.PORT||4177);

function sendError(res,code) {res.writeHead(code,{'Content-Type':'text/plain','Cache-Control':'no-store'});res.end(http.STATUS_CODES[code]);}
function safeInside(base,requestPath) { const target=path.resolve(base,requestPath); return target===base||target.startsWith(base+path.sep)?target:null; }
http.createServer(async(req,res)=>{
  try {
    const u=new URL(req.url,'http://localhost');
    let file;
    if(u.pathname.startsWith('/original/')) {
      const rel=decodeURIComponent(u.pathname.slice('/original/'.length));
      if(!allowed.has(rel)) return sendError(res,404);
      file=safeInside(source,rel);
    } else file=safeInside(review,decodeURIComponent(u.pathname==='/'?'index.html':u.pathname.slice(1)));
    if(!file) return sendError(res,403);
    const s=await stat(file); if(!s.isFile()) return sendError(res,404);
    const type=mime[path.extname(file).toLowerCase()]||'application/octet-stream';
    const headers={'Content-Type':type,'Cache-Control':'private, no-store','Accept-Ranges':'bytes','X-Content-Type-Options':'nosniff'};
    const range=req.headers.range?.match(/^bytes=(\d*)-(\d*)$/);
    if(range) {
      const start=range[1]?Number(range[1]):Math.max(0,s.size-Number(range[2]||0));
      const end=range[1]?Math.min(s.size-1,range[2]?Number(range[2]):s.size-1):s.size-1;
      if(start>=s.size||start>end) {res.writeHead(416,{'Content-Range':`bytes */${s.size}`}); return res.end();}
      res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${s.size}`,'Content-Length':end-start+1});
      createReadStream(file,{start,end}).pipe(res);
    } else {res.writeHead(200,{...headers,'Content-Length':s.size});createReadStream(file).pipe(res);}
  } catch {sendError(res,404);}
}).listen(port,'127.0.0.1',()=>console.log(`Private media catalogue: http://127.0.0.1:${port}/`));

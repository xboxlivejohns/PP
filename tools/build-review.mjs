import { readdir, mkdir, writeFile, stat, readFile } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import sharp from 'sharp';
import ffmpeg from '@ffmpeg-installer/ffmpeg';
import ffprobe from '@ffprobe-installer/ffprobe';

const exec = promisify(execFile);
const root = path.resolve('source-photos');
const out = path.resolve('asset-review');
const imageExt = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.heic', '.avif']);
const videoExt = new Set(['.mp4']);
const slash = p => p.split(path.sep).join('/');
const idFor = p => createHash('sha256').update(p).digest('hex').slice(0, 16);
const escapeXml = s => String(s).replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]));
const orientation = (w,h) => w > h ? 'landscape' : w < h ? 'portrait' : 'square';
const round = n => Math.round(n * 100) / 100;

async function walk(dir, files=[], folders=[]) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { folders.push(slash(path.relative(root, full))); await walk(full, files, folders); }
    else if (entry.isFile()) files.push(full);
  }
  return {files, folders};
}
async function sha256(file) {
  return new Promise((resolve,reject) => {
    const h=createHash('sha256'); const s=createReadStream(file);
    s.on('data',c=>h.update(c)); s.on('error',reject); s.on('end',()=>resolve(h.digest('hex')));
  });
}
async function dHash(file) {
  const {data}=await sharp(file).rotate().greyscale().resize(9,8,{fit:'fill'}).raw().toBuffer({resolveWithObject:true});
  let h=0n;
  for(let y=0;y<8;y++) for(let x=0;x<8;x++) h=(h<<1n)|BigInt(data[y*9+x]>data[y*9+x+1]?1:0);
  return h.toString(16).padStart(16,'0');
}
function distance(a,b) { let x=BigInt('0x'+a)^BigInt('0x'+b),n=0; while(x){x&=x-1n;n++;} return n; }
function captionSvg(label,w=260,h=36) { return Buffer.from(`<svg width="${w}" height="${h}"><rect width="100%" height="100%" fill="#172329"/><text x="9" y="24" fill="#f3f5f4" font-family="Arial,sans-serif" font-size="14">${escapeXml(label.slice(0,32))}</text></svg>`); }
async function probeVideo(file) {
  const {stdout}=await exec(ffprobe.path,['-v','error','-show_streams','-show_format','-of','json',file],{maxBuffer:4e6});
  const p=JSON.parse(stdout); const stream=p.streams.find(s=>s.codec_type==='video');
  if(!stream) throw new Error('No video stream');
  const rotation=Number(stream.tags?.rotate ?? stream.side_data_list?.find(x=>x.rotation!==undefined)?.rotation ?? 0);
  const swap=Math.abs(rotation)%180===90;
  const width=swap?stream.height:stream.width, height=swap?stream.width:stream.height;
  const [num,den]=(stream.avg_frame_rate||stream.r_frame_rate||'0/1').split('/').map(Number);
  return {width,height,orientation:orientation(width,height),duration:round(Number(p.format.duration||stream.duration||0)),frameRate:round(den?num/den:0),codec:stream.codec_name,rotation};
}
async function frame(file,at,dest) {
  await exec(ffmpeg.path,['-hide_banner','-loglevel','error','-ss',String(at),'-i',file,'-map','0:v:0','-frames:v','1','-vf','scale=640:-2','-y',dest],{maxBuffer:1e6});
}
async function videoFrames(file,asset) {
  const dir=path.join(out,'frames',asset.id); await mkdir(dir,{recursive:true});
  const times=[.2,.5,.8].map(f=>round(Math.max(.05,asset.duration*f)));
  const frames=[];
  for(let i=0;i<3;i++) {
    const dest=path.join(dir,`${i+1}.jpg`);
    await frame(file,times[i],dest); frames.push(slash(path.relative(out,dest)));
  }
  asset.sampleTimes=times; asset.frames=frames;
  asset.perceptualHashes=[];
  for(const f of frames) asset.perceptualHashes.push(await dHash(path.join(out,f)));
  await sharp(path.join(out,frames[1])).resize({width:480,withoutEnlargement:true}).webp({quality:76}).toFile(path.join(out,'thumbs',`${asset.id}.webp`));
  await makeSheet([frames.map((f,i)=>({image:path.join(out,f),label:`${times[i]}s`}))].flat(),path.join(out,'video-sheets',`${asset.id}.jpg`),3,250);
}
async function makeSheet(items,dest,cols=5,cell=240) {
  const labelH=36, imageH=Math.round(cell*.67), rows=Math.ceil(items.length/cols);
  const comps=[];
  for(let i=0;i<items.length;i++) {
    const x=(i%cols)*cell,y=Math.floor(i/cols)*(imageH+labelH);
    const image=await sharp(items[i].image).rotate().resize(cell,imageH,{fit:'contain',background:'#11191d'}).jpeg({quality:76}).toBuffer();
    comps.push({input:image,left:x,top:y},{input:captionSvg(items[i].label,cell,labelH),left:x,top:y+imageH});
  }
  await sharp({create:{width:cols*cell,height:Math.max(1,rows*(imageH+labelH)),channels:3,background:'#11191d'}}).composite(comps).jpeg({quality:84}).toFile(dest);
}
function csv(rows) {
  const keys=['type','filename','relativePath','folder','width','height','orientation','format','duration','frameRate','sizeBytes','sha256','perceptualHash','error'];
  return [keys.join(','),...rows.map(r=>keys.map(k=>'"'+String(r[k]??'').replaceAll('"','""')+'"').join(','))].join('\n')+'\n';
}
async function main() {
  const {files,folders}=await walk(root); files.sort((a,b)=>slash(a).localeCompare(slash(b)));
  for(const d of ['thumbs','frames','video-sheets','folder-sheets']) await mkdir(path.join(out,d),{recursive:true});
  const assets=[];
  for(let n=0;n<files.length;n++) {
    const file=files[n], ext=path.extname(file).toLowerCase();
    const type=imageExt.has(ext)?'photo':videoExt.has(ext)?'video':'other';
    const relativePath=slash(path.relative(root,file));
    const info=await stat(file);
    const a={id:idFor(relativePath),type,filename:path.basename(file),relativePath,folder:slash(path.dirname(relativePath)),sizeBytes:info.size,sha256:await sha256(file)};
    try {
      if(type==='photo') {
        const m=await sharp(file).metadata(); const swap=[5,6,7,8].includes(m.orientation);
        a.width=swap?m.height:m.width; a.height=swap?m.width:m.height;
        a.orientation=orientation(a.width,a.height); a.format=m.format; a.perceptualHash=await dHash(file);
        await sharp(file).rotate().resize({width:480,height:340,fit:'inside',withoutEnlargement:true}).webp({quality:76}).toFile(path.join(out,'thumbs',`${a.id}.webp`));
      } else if(type==='video') {
        Object.assign(a,await probeVideo(file)); a.format='mp4';
        await videoFrames(file,a);
      }
    } catch(e) { a.error=String(e.message||e); }
    assets.push(a);
    if((n+1)%20===0||n===files.length-1) console.log(`Processed ${n+1}/${files.length}`);
  }
  const groups=new Map();
  for(const a of assets) { const x=groups.get(a.sha256)||[]; x.push(a); groups.set(a.sha256,x); }
  const exact=[...groups.values()].filter(x=>x.length>1).map(x=>({sha256:x[0].sha256,files:x.map(a=>a.relativePath)}));
  const similarPhotos=[],similarVideos=[];
  for(let i=0;i<assets.length;i++) for(let j=i+1;j<assets.length;j++) {
    const a=assets[i],b=assets[j]; if(a.type!==b.type||a.sha256===b.sha256) continue;
    if(a.type==='photo'&&a.perceptualHash&&b.perceptualHash) {
      const d=distance(a.perceptualHash,b.perceptualHash);
      if(d<=7) similarPhotos.push({files:[a.relativePath,b.relativePath],distance:d});
    }
    if(a.type==='video'&&a.perceptualHashes?.length===3&&b.perceptualHashes?.length===3) {
      const ratio=Math.max(a.duration,b.duration)/Math.max(.01,Math.min(a.duration,b.duration));
      const distances=a.perceptualHashes.map((h,k)=>distance(h,b.perceptualHashes[k]));
      if(ratio<=1.15&&distances.filter(d=>d<=10).length>=2) similarVideos.push({files:[a.relativePath,b.relativePath],sampleDistances:distances,durationRatio:round(ratio)});
    }
  }
  const byFolder=Map.groupBy(assets.filter(a=>a.type!=='other'),a=>a.folder);
  const sheets=[];
  for(const [folder,list] of byFolder) {
    for(let start=0;start<list.length;start+=40) {
      const page=Math.floor(start/40)+1, name=`${idFor(folder)}-${page}.jpg`;
      const items=list.slice(start,start+40).filter(a=>!a.error).map(a=>({image:path.join(out,'thumbs',`${a.id}.webp`),label:`${a.type==='video'?'▶ ':''}${a.filename}`}));
      await makeSheet(items,path.join(out,'folder-sheets',name));
      sheets.push({folder,page,path:`folder-sheets/${name}`,count:items.length});
    }
  }
  const inventory={generatedAt:new Date().toISOString(),sourceRoot:'source-photos',folders,assets,sheets};
  const duplicates={exact,similarPhotos,similarVideos,method:'Exact: SHA-256 of original files. Photos: 64-bit dHash distance <=7; these are review candidates, not confirmed duplicates. Videos: 20%, 50%, 80% frame dHashes; two aligned samples <=10 bits and duration within 15%; edits, crops, and shifted timing may be missed.'};
  await writeFile(path.join(out,'inventory.json'),JSON.stringify(inventory,null,2));
  await writeFile(path.join(out,'inventory.csv'),csv(assets));
  await writeFile(path.join(out,'duplicate-report.json'),JSON.stringify(duplicates,null,2));
  await writeFile(path.join(out,'index.html'),await readFile(new URL('../review-ui/index.html',import.meta.url)));
  await writeFile(path.join(out,'app.css'),await readFile(new URL('../review-ui/app.css',import.meta.url)));
  await writeFile(path.join(out,'app.js'),await readFile(new URL('../review-ui/app.js',import.meta.url)));
  console.log(JSON.stringify({photos:assets.filter(a=>a.type==='photo').length,videos:assets.filter(a=>a.type==='video').length,exact:exact.length,similarPhotos:similarPhotos.length,similarVideos:similarVideos.length,errors:assets.filter(a=>a.error).length,sheets:sheets.length},null,2));
}
await main();

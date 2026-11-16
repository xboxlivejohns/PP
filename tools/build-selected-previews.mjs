import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import ffmpeg from '@ffmpeg-installer/ffmpeg';
const exec=promisify(execFile);
const inventory=JSON.parse(await readFile('asset-review/inventory.json','utf8'));
const shortlist=JSON.parse(await readFile('asset-review/shortlist.json','utf8'));
const out=path.resolve('asset-review/previews');await mkdir(out,{recursive:true});
const manifest={};
for(const pick of shortlist.videoPreviews) {
  const a=inventory.assets.find(x=>x.relativePath===pick.relativePath&&x.type==='video');
  if(!a||pick.start<0||pick.end>a.duration||pick.end<=pick.start) throw new Error(`Invalid range: ${pick.relativePath}`);
  const input=path.resolve('source-photos',a.relativePath),dest=path.join(out,`${a.id}.mp4`);
  await exec(ffmpeg.path,['-hide_banner','-loglevel','error','-ss',String(pick.start),'-i',input,'-t',String(pick.end-pick.start),'-an','-vf',"scale='min(640,iw)':-2",'-c:v','libx264','-preset','fast','-crf','30','-pix_fmt','yuv420p','-movflags','+faststart','-y',dest],{maxBuffer:2e6});
  manifest[a.id]={path:`previews/${a.id}.mp4`,start:pick.start,end:pick.end};
  console.log(`Preview: ${a.filename} ${pick.start}-${pick.end}s`);
}
await writeFile('asset-review/preview-manifest.json',JSON.stringify(manifest,null,2));

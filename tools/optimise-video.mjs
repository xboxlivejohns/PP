import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import ffmpeg from '@ffmpeg-installer/ffmpeg';
const exec=promisify(execFile);
// npm run optimise:video -- "folder/file.mp4" 2.5 8.5
const [relative,startArg,endArg]=process.argv.slice(2);
const start=Number(startArg),end=Number(endArg);
if(!relative||!Number.isFinite(start)||!Number.isFinite(end)||start<0||end<=start||end-start>15) throw new Error('Pass one video path and a reviewed start/end range up to 15 seconds.');
const inventory=JSON.parse(await readFile('asset-review/inventory.json','utf8'));
const asset=inventory.assets.find(a=>a.type==='video'&&a.relativePath===relative.replaceAll('\\','/'));
if(!asset||end>asset.duration) throw new Error('Video or time range is not in inventory');
const root=path.resolve('source-photos'),input=path.resolve(root,relative);
if(!input.startsWith(root+path.sep)) throw new Error('Path must stay inside source-photos');
const dir=path.resolve('website-assets',asset.id);await mkdir(dir,{recursive:true});
for(const [label,width] of [['desktop',1280],['mobile',640]]) {
  const scale=`scale='min(${width},iw)':-2:flags=lanczos`;
  await exec(ffmpeg.path,['-hide_banner','-loglevel','error','-ss',String(start),'-i',input,'-t',String(end-start),'-an','-vf',scale,'-c:v','libx264','-preset','medium','-crf','25','-pix_fmt','yuv420p','-movflags','+faststart','-y',path.join(dir,`${label}.mp4`)],{maxBuffer:2e6});
  await exec(ffmpeg.path,['-hide_banner','-loglevel','error','-ss',String(start),'-i',input,'-t',String(end-start),'-an','-vf',scale,'-c:v','libvpx-vp9','-b:v','0','-crf','34','-y',path.join(dir,`${label}.webm`)],{maxBuffer:2e6});
}
await exec(ffmpeg.path,['-hide_banner','-loglevel','error','-ss',String((start+end)/2),'-i',input,'-frames:v','1','-vf','scale=1280:-2','-y',path.join(dir,'poster.jpg')],{maxBuffer:2e6});
await writeFile(path.join(dir,'manifest.json'),JSON.stringify({source:asset.relativePath,start,end,muted:true,loop:true,notes:'Full source frame retained; no grading, masking, or defect removal.'},null,2));
console.log(`Created selected video derivatives in ${dir}`);

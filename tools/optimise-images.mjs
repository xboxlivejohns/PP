import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// Explicit selection only: npm run optimise -- "folder/file.jpg"
const relative=process.argv[2];
if(!relative) throw new Error('Pass one source-photos-relative image path. No batch default is provided.');
const root=path.resolve('source-photos'), target=path.resolve(root,relative), outRoot=path.resolve('website-assets');
if(!target.startsWith(root+path.sep)) throw new Error('Path must stay inside source-photos');
const inventory=JSON.parse(await readFile('asset-review/inventory.json','utf8'));
const asset=inventory.assets.find(a=>a.type==='photo'&&a.relativePath===relative.replaceAll('\\','/'));
if(!asset) throw new Error('Photo must be present in inventory');
const dir=path.join(outRoot,asset.id); await mkdir(dir,{recursive:true});
const widths=[480,960,1440,1920].filter(w=>w<=asset.width);
if(!widths.length) widths.push(asset.width);
const outputs=[];
for(const width of widths) for(const format of ['webp','avif']) {
  const name=`${width}.${format}`;
  await sharp(target).rotate().resize({width,withoutEnlargement:true,fit:'inside'}).toFormat(format,format==='webp'?{quality:82,effort:5}:{quality:62,effort:5}).toFile(path.join(dir,name));
  outputs.push(`${asset.id}/${name}`);
}
await sharp(target).rotate().resize({width:480,height:340,fit:'inside',withoutEnlargement:true}).webp({quality:74}).toFile(path.join(dir,'thumbnail.webp'));
await writeFile(path.join(dir,'manifest.json'),JSON.stringify({source:asset.relativePath,outputs,notes:'No crop or retouching; dimensions preserve the full source frame.'},null,2));
console.log(`Created ${outputs.length} responsive derivatives and thumbnail in ${dir}`);

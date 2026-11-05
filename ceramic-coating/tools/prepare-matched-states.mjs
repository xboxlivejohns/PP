// Convert complete generated photographs; never extract or composite water droplets.
// Usage: node tools/prepare-matched-states.mjs <unprepared.png> <beading.png>
import sharp from 'sharp';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const inputs=process.argv.slice(2);
if(inputs.length!==2)throw Error('Provide the full unprepared and beading image paths.');
for(const [i,name] of ['paint-unprepared','paint-beading'].entries()){
  await sharp(inputs[i]).resize(1672,941,{fit:'fill'}).removeAlpha().webp({quality:95}).toFile(root+`assets/${name}.webp`);
  console.log(`${name}: complete opaque 1672 × 941 photograph`);
}

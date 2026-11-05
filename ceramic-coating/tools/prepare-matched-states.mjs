// Encode user-supplied references and four complete generated condition edits.
// Usage: node tools/prepare-matched-states.mjs <clean.png> <polished.png> <protected.png> <hydrophobic.png>
import sharp from 'sharp';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const inputs=process.argv.slice(2);
if(inputs.length!==4)throw Error('Provide clean, polished, protected and hydrophobic full-image paths.');
const sources=[
 ['reference-vehicle',root+'assets/Emerald Coupe in Dramatic Studio Light.png'],
 ['reference-before',root+'assets/Emerald Paint Before Ceramic Coating.png'],
 ['reference-clay',root+'assets/Clay Detailing on Emerald Green Paint.png'],
 ...['clean','polished','protected','hydrophobic'].map((name,i)=>['reference-'+name,inputs[i]])
];
for(const [name,path] of sources){
 await sharp(path).resize(1672,941,{fit:'fill'}).removeAlpha().webp({quality:96}).toFile(root+`assets/${name}.webp`);
 console.log(`${name}: complete opaque photograph`);
}

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
const api='http://127.0.0.1:8188';
const base='C:/ComfyUI';
const workflow=JSON.parse(await readFile(base+'/workflows/sdxl_emerald_paint.json','utf8'));
workflow['5'].inputs.text='Professional luxury automotive advertising photograph, deep emerald green metallic elegant grand touring sports coupe, complete vehicle fully visible, front three quarter view pointing toward the left, low camera angle, long sculpted bonnet, beautifully detailed pristine gloss paintwork, silver alloy wheels, crisp white stripbox studio reflections tracing curved body panels, dark black architectural studio, deep black floor with subtle reflection, atmospheric cinematic lighting, realistic automotive photography, wide horizontal composition, vehicle occupies middle two thirds of frame, no text, no logos';
workflow['6'].inputs.text='text, logo, watermark, letters, badge, people, extra wheels, deformed wheels, distorted vehicle, multiple cars, cropped car, cartoon, illustration, plastic, oversaturated, bright background, scratches, dust';
workflow['7'].inputs={width:1152,height:640,batch_size:1};
Object.assign(workflow['3'].inputs,{seed:760682914,steps:24,cfg:6.5,sampler_name:'euler',scheduler:'normal'});
workflow['9'].inputs.filename_prefix='pp_ceramic_cinematic_vehicle';
await mkdir(base+'/workflows',{recursive:true});
await writeFile(base+'/workflows/pp_ceramic_cinematic_vehicle.api.json',JSON.stringify(workflow,null,2));
const response=await fetch(api+'/prompt',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:workflow,client_id:'pp-cinematic-assets'})});
const queued=await response.json();if(!response.ok)throw Error(JSON.stringify(queued));
console.log('Queued local SDXL:',queued.prompt_id);
const started=Date.now();
while(Date.now()-started<900000){
  await new Promise(r=>setTimeout(r,5000));
  const history=await(await fetch(api+'/history')).json();const item=history[queued.prompt_id];
  if(!item)continue;
  if(item.status?.status_str==='error')throw Error(JSON.stringify(item.status));
  if(item.status?.completed){
    const img=item.outputs['9'].images[0];
    const raw=path.join(base,'outputs/raw',img.subfolder,img.filename);
    await mkdir('assets',{recursive:true});
    await writeFile('.cache-vehicle-path.json',JSON.stringify({raw,workflow:base+'/workflows/pp_ceramic_cinematic_vehicle.api.json',seconds:(Date.now()-started)/1000,status:item.status},null,2));
    console.log('Saved raw vehicle:',raw);console.log('Elapsed seconds:',(Date.now()-started)/1000);break;
  }
}

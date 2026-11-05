// Full photographic frames: supplied reference images and condition-only edits.
export const clamp=x=>Math.max(0,Math.min(1,x));
export const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t);};
const mix=(a,b,t)=>a+(b-a)*t;
export const paintStates=['reference-before','reference-clay','reference-clean','reference-polished','reference-protected','reference-hydrophobic'];
export const transitions=[[.27,.32],[.37,.42],[.50,.55],[.63,.68],[.77,.82]];
export class PaintSurface {
 constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:false});if(!this.ctx)throw Error('Canvas unavailable');this.images={};}
 async load(){await Promise.all(['reference-vehicle',...paintStates].map(async name=>{const img=new Image();img.src=`assets/${name}.webp`;await img.decode();this.images[name]=img;}));this.resize();}
 resize(){this.w=this.canvas.clientWidth;this.h=this.canvas.clientHeight;const dpr=Math.min(devicePixelRatio,1.5,1600/this.w);this.canvas.width=Math.round(this.w*dpr);this.canvas.height=Math.round(this.h*dpr);this.ctx.setTransform(dpr,0,0,dpr,0,0);}
 drawPhoto(name,alpha=1){
  if(alpha<=0)return;
  const {ctx,w,h}=this,portrait=w/h<.85;
  // Keep the supplied composition legible on phones instead of magnifying a narrow slice.
  const boxH=portrait?Math.min(h*.60,w*941/1672*1.15):h,boxY=portrait?h*.16:0;
  const scale=Math.max(w/1672,boxH/941),dw=1672*scale,dh=941*scale;
  ctx.save();ctx.globalAlpha=alpha;ctx.beginPath();ctx.rect(0,boxY,w,boxH);ctx.clip();
  ctx.drawImage(this.images[name],(w-dw)/2,boxY+(boxH-dh)/2,dw,dh);ctx.restore();
 }
 draw(p){
  if(!this.images['reference-vehicle'])return;
  const {ctx,w,h}=this,zoom=smooth(.035,.18,p)*(1-smooth(.94,1,p));
  const macro=smooth(.085,.18,p)*(1-smooth(.94,.985,p));
  ctx.globalAlpha=1;ctx.fillStyle='#030706';ctx.fillRect(0,0,w,h);ctx.imageSmoothingQuality='high';
  const scale=Math.min(w/1672,h/941)*Math.pow(4.4,zoom);
  ctx.drawImage(this.images['reference-vehicle'],w/2-mix(836,1080,zoom)*scale,h/2-mix(470.5,398,zoom)*scale,1672*scale,941*scale);
  if(macro>0){
   // Optical dissolve from the moving car to the supplied, separately photographed macro.
   ctx.globalAlpha=macro;ctx.fillStyle='#030706';ctx.fillRect(0,0,w,h);ctx.globalAlpha=1;
   let index=0;for(let i=0;i<transitions.length;i++)if(p>=transitions[i][1])index=i+1;
   this.drawPhoto(paintStates[index],macro);
   if(index<transitions.length){const [a,b]=transitions[index];this.drawPhoto(paintStates[index+1],macro*smooth(a,b,p));}
  }
  this.canvas.dataset.zoom=zoom.toFixed(5);
 }
}

// One camera, five complete photographs. No tools, procedural marks or droplet layers.
export const clamp = x => Math.max(0, Math.min(1, x));
export const smooth = (a,b,x) => { const t=clamp((x-a)/(b-a)); return t*t*(3-2*t); };
const mix=(a,b,t)=>a+(b-a)*t;
export const paintStates=['paint-unprepared','paint-before','paint-corrected','paint-coated','paint-beading'];
export const transitions=[[.30,.35],[.46,.51],[.62,.67],[.78,.83]];

export class PaintSurface {
  constructor(canvas) {
    this.canvas=canvas;
    this.ctx=canvas.getContext('2d',{alpha:false});
    if(!this.ctx) throw Error('Canvas 2D unavailable');
    this.images={};
  }
  async load() {
    await Promise.all(['master-vehicle',...paintStates].map(async name=>{
      const img=new Image();img.src=`assets/${name}.webp`;await img.decode();this.images[name]=img;
    }));
    this.resize();
  }
  resize() {
    this.w=this.canvas.clientWidth;this.h=this.canvas.clientHeight;
    const dpr=Math.min(devicePixelRatio,1.5,1600/this.w);
    this.canvas.width=Math.round(this.w*dpr);this.canvas.height=Math.round(this.h*dpr);
    this.ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  drawMacro(name,alpha=1) {
    if(alpha<=0)return;
    const {ctx,camera:{left,top,scale}}=this;
    ctx.globalAlpha=alpha;
    // Every full-frame paint plate maps to exactly the same bonnet crop in the hero.
    ctx.drawImage(this.images[name],left+915*scale,top+305*scale,330*scale,186*scale);
    ctx.globalAlpha=1;
  }
  draw(p) {
    if(!this.images['master-vehicle'])return;
    const {ctx,w,h}=this;
    const zoom=smooth(.045,.18,p)*(1-smooth(.94,1,p));
    const initial=Math.min(w/1672,h/941),final=Math.max(w/330,h/186);
    const scale=initial*Math.pow(final/initial,zoom);
    const cx=mix(836,1080,zoom),cy=mix(470.5,398,zoom);
    const left=w/2-cx*scale,top=h/2-cy*scale;
    this.camera={left,top,scale};
    ctx.fillStyle='#030706';ctx.fillRect(0,0,w,h);ctx.imageSmoothingQuality='high';
    ctx.drawImage(this.images['master-vehicle'],left,top,1672*scale,941*scale);
    const macro=smooth(.72,1,zoom);
    if(p>=.94){this.drawMacro('paint-coated',macro);}
    else {
      this.drawMacro(paintStates[0],macro);
      transitions.forEach(([a,b],i)=>this.drawMacro(paintStates[i+1],macro*smooth(a,b,p)));
      // Let the rain clear before the camera returns to the dry hero photograph.
      this.drawMacro('paint-coated',macro*smooth(.915,.94,p));
    }
    this.canvas.dataset.zoom=zoom.toFixed(5);
  }
}

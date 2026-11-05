// One scroll state controls every camera, surface and droplet movement.
// No autonomous film: the entire visual can be scrubbed backwards.
const stage=document.querySelector('#cinema');
const canvas=document.querySelector('#surface');
const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
const chapters=[
 ['Deep gloss.','A highly reflective, mirror-like finish.'],
 ['Paintwork.','The final result depends on the condition of the paintwork.'],
 ['Decontamination.','Full exterior decontamination included.'],
 ['Machine polishing.','Single-stage machine paint enhancement included.'],
 ['Ceramic coating.','Panel wipe and coating preparation. Autosmart Matrix Blue.'],
 ['Water beading.','Hydrophobic protection and easier maintenance.'],
 ['The finished vehicle.','Exterior glass and wheel faces included.']
];
const stops=[0,.23,.36,.48,.61,.76,.97];
let trigger,lenis,gl,program,uniforms,current=0,reduced=motionQuery.matches,renderPending=false;
let lastChapter=-1;
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t);};
const vertex=`attribute vec2 position;varying vec2 vUv;void main(){vUv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
const fragment=`precision highp float;
varying vec2 vUv;
uniform sampler2D uCar;uniform sampler2D uPaint;uniform vec2 uRes;uniform float uP;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float ss(float a,float b,float x){return smoothstep(a,b,x);}
vec3 paint(vec2 uv){
 vec2 tex=uv*.63+vec2(.23,.10);vec3 c=texture2D(uPaint,tex).rgb;
 c=mix(c,vec3(.009,.11,.055),.16);
 float flake=pow(hash(floor(uv*uRes*.8)),24.);c+=vec3(.13,.20,.13)*flake;
 float light=exp(-pow((uv.x*.72+uv.y*.32-.55)*11.,2.));
 c+=vec3(.07,.13,.09)*light;return c;
}
void main(){
 vec2 uv=vec2(vUv.x,1.-vUv.y);float asp=uRes.x/uRes.y;float p=uP;
 float push=ss(.04,.265,p)*(1.-ss(.87,1.,p));float zoom=(asp<1.?1.14:1.)+push*13.;
 vec2 carUV=uv;
 if(asp<1.8){carUV.y=(uv.y-.60)*(1.8/asp)+.58;}
 else{carUV.y=(uv.y-.5)*(1.8/asp)+.5;}
 carUV=(carUV-.5)/zoom+mix(vec2(.50,.5),vec2(.60,.64),push);
 vec3 car=texture2D(uCar,clamp(carUV,0.,1.)).rgb;
 float bounds=step(0.,carUV.y)*step(carUV.y,1.);
 car*=bounds;car*=vec3(.72,.79,.75);
 vec2 space=vec2((uv.x-.5)*asp,uv.y-.5);
 float macro=ss(.22,.31,p)*(1.-ss(.86,.98,p));
 vec2 surfUV=uv+vec2((p-.3)*.055,(p-.3)*.025);
 vec3 surface=paint(surfUV);
 // Dirt is removed by a moving cleaning front, not a cross-faded photograph.
 vec2 grid=surfUV*vec2(60.*asp,60.);vec2 cell=floor(grid);vec2 local=fract(grid)-.5;
 float dirty=1.-ss(.31,.43,p);
 float wipe=ss((p-.31)*11.-.2,(p-.31)*11.+.05,uv.x);
 float spot=(1.-ss(.035,.11,length(local)))*step(.89,hash(cell));
 surface=mix(surface,vec3(.075,.052,.019),spot*dirty*wipe*.72);
 // Fine curved surface marks disappear behind the polishing path.
 float radius=length(space-vec2(.1,-.05));
 float swirl=pow(max(0.,sin(radius*390.+hash(floor(space*25.))*3.)),45.);
 float polishFront=(p-.42)*9.;
 float scratch=swirl*.16*ss(polishFront-.12,polishFront+.12,uv.x)*ss(.28,.34,p);
 surface+=vec3(.36,.44,.38)*scratch;
 float polish=ss(.42,.48,p)*(1.-ss(.51,.57,p));
 float sweep=exp(-pow((uv.x-(p-.42)*8.)*14.,2.));surface+=vec3(.12,.20,.13)*sweep*polish;
 // A travelling interference edge illustrates application of the coating.
 float coat=ss(.55,.68,p);float edge=uv.x*.7+uv.y*.3;
 float film=1.-ss(coat*1.6-.12,coat*1.6+.02,edge);
 float filmVisible=ss(.55,.59,p)*(1.-ss(.69,.73,p));
 float line=exp(-pow((edge-coat*1.6)*85.,2.));
 surface+=vec3(.025,.09,.11)*film*filmVisible+vec3(.25,.55,.52)*line*filmVisible;
 // Lens-shaped beads refract the same underlying paint texture.
 float wet=ss(.68,.73,p)*(1.-ss(.84,.89,p));
 vec2 dropletUV=space*5.4+vec2(-.32*(p-.7),-(p-.7)*5.5);
 vec2 id=floor(dropletUV);vec2 f=fract(dropletUV)-.5;
 f-=vec2(hash(id)-.5,hash(id+7.)-.5)*.35;
 float r=mix(.09,.29,hash(id+31.))*mix(.12,1.,sqrt(wet));float d=length(f/vec2(1.,.88));
 float mask=(1.-ss(r-.012,r+.008,d))*step(.18,hash(id+53.))*wet;
 vec2 normal=f/r;float z=sqrt(max(0.,1.-dot(normal,normal)));
 vec3 refracted=paint(surfUV+normal*.04*z);
 float rim=pow(clamp(d/r,0.,1.),7.);
 float highlight=exp(-length((f-vec2(-r*.28,-r*.36))/r)*20.);
 float strip=exp(-pow((f.x+f.y*.4+r*.27)/r*17.,2.))*ss(0.,.5,-normal.y);
 float caustic=exp(-pow(length(f-vec2(r*.14,r*.10))/r-.75,2.)*160.)*ss(0.,.6,normal.y);
 vec3 water=refracted*.68+vec3(.83,.97,.91)*(rim*.17+highlight*3.5+strip*.9+caustic*.36);
 float shadow=(1.-ss(r,r+.05,length(f-vec2(.015,.03))))*(1.-mask)*wet*step(.18,hash(id+53.));
 surface*=1.-shadow*.12;
 surface=mix(surface,water,mask);
 vec3 color=mix(car,surface,macro);
 float vignette=clamp(1.-dot(space*vec2(.45,.55),space*vec2(.45,.55))*.6,.45,1.);
 color*=vignette;gl_FragColor=vec4(color,1.);
}`;
function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
async function initGraphics(){
 gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power',preserveDrawingBuffer:true});
 if(!gl)return false;
 program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
 const attr=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,2,gl.FLOAT,false,0,0);
 uniforms={p:gl.getUniformLocation(program,'uP'),res:gl.getUniformLocation(program,'uRes')};
 for(const [index,name,url] of [[0,'uCar','assets/vehicle.webp'],[1,'uPaint','assets/paint.webp']]){
  const image=new Image();image.src=url;await image.decode();gl.activeTexture(gl.TEXTURE0+index);const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);gl.uniform1i(gl.getUniformLocation(program,name),index);
 }
 stage.classList.add('has-webgl');resize();return true;
}
function resize(){if(!gl)return;const dpr=Math.min(devicePixelRatio,matchMedia('(max-width:760px)').matches?1.25:1.5);canvas.width=Math.round(stage.clientWidth*dpr);canvas.height=Math.round(stage.clientHeight*dpr);gl.viewport(0,0,canvas.width,canvas.height);draw();}
function draw(){if(!gl)return;gl.uniform1f(uniforms.p,reduced?0:current);gl.uniform2f(uniforms.res,canvas.width,canvas.height);gl.drawArrays(gl.TRIANGLES,0,6);}
function render(p){
 current=p;stage.dataset.progress=p.toFixed(4);
 let index=0;for(let i=0;i<stops.length;i++)if(p>=stops[i]-.025)index=i;
 if(index!==lastChapter){lastChapter=index;document.querySelector('.chapter-heading').textContent=chapters[index][0];document.querySelector('.chapter-detail').textContent=chapters[index][1];document.querySelector('.chapter-number').textContent=`0${index+1} / 07`;document.querySelectorAll('[data-chapter]').forEach((b,i)=>i===index?b.setAttribute('aria-current','step'):b.removeAttribute('aria-current'));}
 gsap.set('.intro-copy',{opacity:1-smooth(.025,.14,p),y:-40*smooth(.025,.14,p)});
 gsap.set('.chapter-copy',{opacity:smooth(.11,.2,p)});
 const polish=smooth(.42,.46,p)*(1-smooth(.52,.56,p));
 gsap.set('.polisher',{opacity:polish,x:stage.clientWidth*((p-.42)*8),y:stage.clientHeight*Math.sin(p*18)*.09,rotation:-22+(p-.43)*3600});
 const coatPass=smooth(.55,.58,p)*(1-smooth(.65,.69,p));
 gsap.set('.applicator',{opacity:coatPass,x:stage.clientWidth*((p-.55)*9),y:stage.clientHeight*(p-.55)*2.3});
 gsap.set('.surface-label',{opacity:smooth(.25,.3,p)*(1-smooth(.8,.86,p))});
 const real=p>.30&&p<.88;gsap.set('.real-callout',{autoAlpha:real?1:0});
 document.querySelector('.scroll-hint').style.opacity=1-smooth(0,.07,p);
 if(!renderPending){renderPending=true;requestAnimationFrame(()=>{draw();renderPending=false;});}
}
function configureMotion(){
 trigger?.kill(true);trigger=null;lenis?.destroy();lenis=null;
 document.body.classList.toggle('reduced-motion',reduced);document.querySelector('.motion-toggle').setAttribute('aria-pressed',String(reduced));document.querySelector('.motion-toggle').textContent=reduced?'Enable scroll story':'Reduce motion';
 if(reduced){current=0;gsap.set('.intro-copy',{opacity:1,y:0});gsap.set('.chapter-copy,.surface-label,.polisher,.applicator,.real-callout',{autoAlpha:0});draw();return;}
 lenis=new Lenis({duration:1.1,smoothWheel:true,syncTouch:false,anchors:false});lenis.on('scroll',ScrollTrigger.update);
 trigger=ScrollTrigger.create({trigger:'.ceramic-story',pin:stage,start:()=>`top ${document.querySelector('.site-header').offsetHeight}px`,end:()=>'+='+Math.max(innerHeight*5.5,3200),scrub:true,invalidateOnRefresh:true,onUpdate:self=>render(self.progress)});
 render(trigger.progress);
}
function scrollToTarget(target,offset=0){if(lenis)lenis.scrollTo(target,{offset,duration:1.1});else if(typeof target==='number')window.scrollTo({top:target,behavior:'instant'});else target.scrollIntoView({behavior:reduced?'instant':'smooth'});}
function bindInteractions(){
 document.querySelectorAll('a[href="#real-results"]').forEach(a=>a.addEventListener('click',event=>{event.preventDefault();const gallery=document.querySelector('#real-results');if(lenis)lenis.scrollTo(gallery,{offset:-110,duration:1.1,onComplete:()=>{gallery.focus({preventScroll:true});history.replaceState(null,'','#real-results');}});else{gallery.scrollIntoView();gallery.focus({preventScroll:true});history.replaceState(null,'','#real-results');}}));
 document.querySelectorAll('[data-chapter]').forEach(b=>b.addEventListener('click',()=>{if(trigger)scrollToTarget(trigger.start+(trigger.end-trigger.start)*stops[Number(b.dataset.chapter)]);}));
 document.querySelector('.motion-toggle').addEventListener('click',()=>{reduced=!reduced;configureMotion();ScrollTrigger.refresh();resize();});
 motionQuery.addEventListener('change',e=>{reduced=e.matches;configureMotion();ScrollTrigger.refresh();resize();});
 const photos={process:['iron-fallout-removal','Iron fallout removal','The purple reaction shows embedded iron contamination being safely dissolved.'],porsche:['blue-porsche','Gloss and protection','Premium paintwork presented with a deep, even gloss.'],gle:['black-gle-shiney','Paint enhancement','Clarity and reflection brought back to a black Mercedes GLE.'],exterior:['finished-car','Exterior detailing','A clean, refined finish across the full vehicle.']};
 const dialog=document.querySelector('.photo-dialog');let previous;
 document.querySelectorAll('[data-photo]').forEach(b=>b.addEventListener('click',()=>{previous=b;const item=photos[b.dataset.photo];const img=dialog.querySelector('img');img.src=`assets/${item[0]}.webp`;img.alt=item[2];dialog.querySelector('h2').textContent=item[1];dialog.querySelector('.photo-caption').textContent=item[2];lenis?.stop();dialog.showModal();}));
 dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});dialog.addEventListener('close',()=>{lenis?.start();previous?.focus({preventScroll:true});});
 // Free React Bits SpotlightCard pattern, isolated as a small vanilla pointer effect.
 document.querySelectorAll('.result-card').forEach(card=>card.addEventListener('pointermove',e=>{if(reduced||e.pointerType==='touch')return;const r=card.getBoundingClientRect();card.style.setProperty('--mx',`${e.clientX-r.left}px`);card.style.setProperty('--my',`${e.clientY-r.top}px`);}));
 // Local pointer-parallax adaptation of the MIT Motion Primitives Tilt pattern
 // listed by 21st.dev; no hosted generation or credits are involved.
 if(matchMedia('(hover:hover) and (pointer:fine)').matches)document.querySelectorAll('.result-card').forEach(card=>{
  card.addEventListener('pointermove',e=>{if(reduced)return;const r=card.getBoundingClientRect();card.style.transform=`perspective(1000px) rotateX(${-(e.clientY-r.top-r.height/2)/r.height*3}deg) rotateY(${(e.clientX-r.left-r.width/2)/r.width*3}deg)`;});
  card.addEventListener('pointerleave',()=>{card.style.transform='';});
 });
}
async function main(){
 if(!window.gsap||!window.ScrollTrigger||!window.Lenis){document.body.classList.add('reduced-motion');return;}
 gsap.registerPlugin(ScrollTrigger);gsap.ticker.lagSmoothing(0);gsap.ticker.add(time=>lenis?.raf(time*1000));
 try{const available=await initGraphics();if(!available)reduced=true;}catch(error){console.warn('Static visual fallback:',error);reduced=true;gl=null;}
 configureMotion();bindInteractions();window.addEventListener('resize',resize,{passive:true});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();reduced=true;stage.classList.remove('has-webgl');gl=null;configureMotion();});
 if(location.hash==='#real-results')requestAnimationFrame(()=>document.querySelector('#real-results').scrollIntoView());
}
main();

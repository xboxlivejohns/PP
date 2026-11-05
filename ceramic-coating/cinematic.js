import {PaintSurface, smooth, transitions} from './surface.js';
const stage=document.querySelector('#cinema');
const canvas=document.querySelector('#surface');
const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
const chapters=[
 ['The finished vehicle.','A closer look at the preparation behind the gloss.'],
 ['Before preparation.','Fine wash swirls scatter the light. Small bonded contaminants interrupt the emerald finish.'],
 ['Clean. Still swirled.','Washing, chemical decontamination and clay remove bonded contamination. Clay does not remove swirl marks.'],
 ['Clarity, restored.','Machine polishing reduces light swirls and sharpens reflections. Deeper defects may remain.'],
 ['Prepared. Protected.','After a panel wipe, Autosmart Matrix Blue is applied and levelled. Rich gloss, on properly prepared paint.'],
 ['Water beads. Gloss stays.','After curing, water gathers into tight beads on the hydrophobic surface. Protection that makes maintenance easier.'],
 ['The finished vehicle.','Three-year Autosmart Matrix Blue ceramic coating. From £250.']
];
const boundaries=[0,.16,.325,.485,.645,.805,.95];
const stops=[0,.24,.40,.56,.72,.87,1];
const labels=['THE FINISHED VEHICLE','A / BEFORE PREPARATION','B / AFTER DECONTAMINATION & CLAY','C / AFTER MACHINE POLISHING','D / AFTER CERAMIC COATING','E / HYDROPHOBIC RESULT','THE FINISHED VEHICLE'];
let trigger,lenis,timeline,surface,current=0,reduced=motionQuery.matches,lastChapter=-1;
const playhead={p:0};
function render(p){
 current=p;stage.dataset.progress=p.toFixed(5);
 let index=0;for(let i=0;i<boundaries.length;i++)if(p>=boundaries[i]-1e-6)index=i;
 if(index!==lastChapter){
  lastChapter=index;document.querySelector('.chapter-heading').textContent=chapters[index][0];
  document.querySelector('.chapter-detail').textContent=chapters[index][1];
  document.querySelector('.chapter-number').textContent=labels[index];
  document.querySelectorAll('.chapter-rail [data-chapter]').forEach((b,i)=>i===index?b.setAttribute('aria-current','step'):b.removeAttribute('aria-current'));
 }
 stage.dataset.chapter=String(index+1);
 gsap.set('.intro-copy',{opacity:1-smooth(.025,.075,p),y:-15*smooth(.025,.075,p)});
 // Briefly fade the caption at each photographic dissolve, avoiding a hard text cut.
 let copyAlpha=smooth(.13,.18,p);
 for(const [a,b] of [...transitions,[.93,.97]]){
  if(p>=a&&p<=b){const mid=(a+b)/2;copyAlpha*=p<mid?1-smooth(a,mid,p):smooth(mid,b,p);}
 }
 gsap.set('.chapter-copy',{opacity:copyAlpha});
 gsap.set('.real-callout',{autoAlpha:index===2?1:0});
 document.querySelector('.scroll-hint').style.opacity=1-smooth(0,.04,p);
 const status=document.querySelector('.surface-status');
 status.textContent=index>0&&index<6?'ONE SURFACE / FIVE STATES':'';
 stage.style.setProperty('--story-progress',p);
 surface?.draw(reduced?0:p);
}
function resize(){surface?.resize();surface?.draw(reduced?0:current);}
function configureMotion(){
 if(!surface||!window.gsap||!window.ScrollTrigger||!window.Lenis)return;
 trigger?.kill(true);trigger=null;timeline?.kill();timeline=null;lenis?.destroy();lenis=null;
 document.body.classList.toggle('reduced-motion',reduced);
 document.body.classList.toggle('motion-enabled',!reduced);
 document.querySelector('.motion-toggle').setAttribute('aria-pressed',String(reduced));
 document.querySelector('.motion-toggle').textContent=reduced?'Enable scroll story':'Reduce motion';
 playhead.p=0;lastChapter=-1;
 if(reduced){render(0);gsap.set('.chapter-copy,.real-callout',{autoAlpha:0});return;}
 gsap.set('.chapter-copy',{visibility:'visible'});
 // Native touch scrolling; one ticker synchronises desktop wheel interpolation with ScrollTrigger.
 lenis=new Lenis({duration:.85,smoothWheel:true,syncTouch:false,anchors:false});
 lenis.on('scroll',ScrollTrigger.update);
 timeline=gsap.timeline({paused:true,onUpdate:()=>render(playhead.p)});
 timeline.to(playhead,{p:1,duration:1,ease:'none'},0);
 trigger=ScrollTrigger.create({id:'ceramic-story',trigger:'.ceramic-story',pin:stage,animation:timeline,
  start:()=> 'top '+document.querySelector('.site-header').offsetHeight+'px',
  end:()=>'+='+Math.max(innerHeight*6,4200),scrub:true,invalidateOnRefresh:true});
 timeline.progress(trigger.progress);render(playhead.p);
 lenis.resize();
}
function scrollToTarget(target,offset=0){if(lenis)lenis.scrollTo(target,{offset,duration:.85});else if(typeof target==='number')window.scrollTo({top:target,behavior:'instant'});else target.scrollIntoView({behavior:reduced?'instant':'smooth'});}
function bindInteractions(){
 document.querySelectorAll('a[href="#real-results"]').forEach(a=>a.addEventListener('click',event=>{event.preventDefault();const gallery=document.querySelector('#real-results');const top=gallery.getBoundingClientRect().top+scrollY-110;lenis?.resize();if(lenis)lenis.scrollTo(top,{immediate:true});else window.scrollTo({top,behavior:'instant'});gallery.focus({preventScroll:true});history.replaceState(null,'','#real-results');}));
 document.querySelectorAll('.chapter-rail [data-chapter]').forEach(b=>b.addEventListener('click',()=>{if(trigger)scrollToTarget(trigger.start+(trigger.end-trigger.start)*stops[Number(b.dataset.chapter)]);}));
 document.querySelector('.motion-toggle').addEventListener('click',()=>{reduced=!reduced;configureMotion();window.ScrollTrigger?.refresh();resize();});
 motionQuery.addEventListener('change',e=>{reduced=e.matches;configureMotion();window.ScrollTrigger?.refresh();resize();});
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
 bindInteractions();
 if(!window.gsap||!window.ScrollTrigger||!window.Lenis){document.body.classList.add('reduced-motion');return;}
 gsap.registerPlugin(ScrollTrigger);gsap.ticker.lagSmoothing(0);gsap.ticker.add(time=>lenis?.raf(time*1000));
 ScrollTrigger.addEventListener('refresh',()=>lenis?.resize());
 try{surface=new PaintSurface(canvas);await surface.load();stage.classList.add('has-surface');}
 catch(error){surface=null;console.warn('Static visual fallback:',error);document.body.classList.add('reduced-motion');document.querySelector('.motion-toggle').hidden=true;return;}
 document.querySelector('.motion-toggle').hidden=false;
 configureMotion();
 let timer;window.addEventListener('resize',()=>{clearTimeout(timer);timer=setTimeout(()=>{resize();ScrollTrigger.refresh();},150);},{passive:true});
 new ResizeObserver(()=>resize()).observe(stage);
 if(location.hash==='#real-results')requestAnimationFrame(()=>document.querySelector('#real-results').scrollIntoView());
}
main();
export {surface, lenis, trigger};

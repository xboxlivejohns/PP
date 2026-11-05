import {chromium} from 'playwright';
import sharp from 'sharp';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
process.chdir(fileURLToPath(new URL('../',import.meta.url)));
const url='http://127.0.0.1:4173/ceramic-coating/';
await mkdir('qa/matched',{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const report={viewports:{},errors:[],forbiddenRequests:[]};
const states=[['hero',0],['zoom',.12],['before',.24],['clay-treatment',.345],['clay',.46],['polish-dissolve',.525],['polished',.59],['coating-dissolve',.655],['coated',.72],['water-dissolve',.795],['beading',.87],['return',1]];
function observe(page,label){
 page.on('pageerror',e=>report.errors.push(label+': '+e.message));
 page.on('response',r=>{if(r.status()>=400&&r.url().startsWith('http://127.0.0.1'))report.errors.push(`${label}: ${r.status()} ${r.url()}`);});
 page.on('request',r=>{if(/\/(clay|polisher|applicator|microfibre|surface-marring)\.webp/.test(r.url()))report.forbiddenRequests.push(r.url());});
}
async function seek(page,p){
 await page.evaluate(p=>{const t=ScrollTrigger.getById('ceramic-story');window.scrollTo({top:t.start+(t.end-t.start)*p,behavior:'instant'});ScrollTrigger.update();},p);
 await page.waitForTimeout(80);
 const actual=Number(await page.locator('#cinema').getAttribute('data-progress'));
 assert(Math.abs(actual-p)<.001,`scroll progress ${actual} != ${p}`);
}
async function gallery(page){
 await page.locator('.results-shortcut').click();await page.waitForTimeout(150);
 const position=await page.locator('#real-results').evaluate(el=>({top:el.getBoundingClientRect().top,focused:document.activeElement===el}));
 assert(position.focused&&position.top>=75&&position.top<=150,JSON.stringify(position));
 await page.locator('[data-photo="porsche"]').click();assert(await page.locator('dialog').evaluate(d=>d.open));
 await page.keyboard.press('Escape');assert(await page.locator('dialog').evaluate(d=>!d.open));
 assert(await page.locator('[data-photo="porsche"]').evaluate(el=>el===document.activeElement));
 return position;
}
try {
 for(const [name,width,height] of [['desktop',1440,1000],['tablet',820,1180],['mobile',390,844],['landscape',844,390]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name!=='desktop'});observe(page,name);
  await page.goto(url,{waitUntil:'networkidle'});await page.waitForSelector('.has-surface');
  const result={frames:[],reverse:[],overflow:false};report.viewports[name]=result;
  for(const [label,p] of states){
   await seek(page,p);const path=`qa/matched/${name}-${label}.png`;await page.screenshot({path});result.frames.push(path);
   result.overflow ||=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  }
  for(const p of [.24,.295,.345,.395,.46,.525,.59,.655,.72,.795,.87]){
   await seek(page,p);const before=await page.locator('#surface').evaluate(c=>c.toDataURL());
   await seek(page,Math.min(1,p+.1));await seek(page,p);result.reverse.push(before===await page.locator('#surface').evaluate(c=>c.toDataURL()));
  }
  await seek(page,0);const hero=await page.locator('#surface').evaluate(c=>c.toDataURL());await seek(page,1);
  result.exactReturn=hero===await page.locator('#surface').evaluate(c=>c.toDataURL());
  assert(result.exactReturn&&result.reverse.every(Boolean)&&!result.overflow,name+' camera/overflow');
  await seek(page,0);await page.locator('[data-chapter="6"]').click();await page.waitForTimeout(1100);
  assert.equal(await page.locator('#cinema').getAttribute('data-chapter'),'7');
  result.copy=await page.locator('.chapter-number').textContent();
  result.contactBarClear=await page.locator('.story-bottom').evaluate(el=>{const bar=document.querySelector('.contact-bar');return getComputedStyle(bar).display==='none'||el.getBoundingClientRect().bottom<=bar.getBoundingClientRect().top;});
  assert(result.contactBarClear,name+' contact bar');
  assert(await page.locator('.story-bottom').evaluate(el=>el.getBoundingClientRect().bottom<=innerHeight),name+' viewport bottom');
  result.gallery=await gallery(page);
  const tiles=[];
  for(const [i,path] of result.frames.entries())tiles.push({input:await sharp(path).resize(480,340,{fit:'contain',background:'#09100c'}).png().toBuffer(),left:(i%3)*480,top:Math.floor(i/3)*340});
  await sharp({create:{width:1440,height:1360,channels:3,background:'#09100c'}}).composite(tiles).png().toFile(`qa/matched/${name}-sheet.png`);
  if(name==='desktop'){
   // Exercise actual smooth wheel input and measure rendering cost across the full sequence.
   await seek(page,.2);await page.mouse.wheel(0,900);await page.waitForTimeout(1200);
   result.wheelProgress=Number(await page.locator('#cinema').getAttribute('data-progress'));assert(result.wheelProgress>.2);
   result.drawMs=await page.evaluate(async()=>{const {surface}=await import('./cinematic.js');const times=[];for(let i=0;i<120;i++){const t=performance.now();surface.draw(i/119);times.push(performance.now()-t);}times.sort((a,b)=>a-b);return {median:times[60],p95:times[114]};});
   await seek(page,.56);await page.locator('.motion-toggle').click();
   assert.equal(await page.evaluate(()=>ScrollTrigger.getAll().length),0);assert(await page.locator('.motion-summary').isVisible());
   await page.locator('.motion-toggle').click();assert.equal(await page.evaluate(()=>ScrollTrigger.getAll().length),1);
  }
  await page.close();
 }
 const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});observe(reduced,'reduced');
 await reduced.goto(url,{waitUntil:'networkidle'});await reduced.waitForSelector('.has-surface');
 report.reduced={pins:await reduced.evaluate(()=>ScrollTrigger.getAll().length),images:await reduced.locator('.static-stages img').count()};
 assert.equal(report.reduced.pins,0);assert.equal(report.reduced.images,6);assert(await reduced.locator('.motion-summary').isVisible());
 await reduced.locator('.static-stages li:last-child').scrollIntoViewIfNeeded();await reduced.screenshot({path:'qa/matched/reduced-beading.png'});
 await reduced.emulateMedia({reducedMotion:'no-preference'});await reduced.waitForFunction(()=>ScrollTrigger.getAll().length===1);
 await reduced.emulateMedia({reducedMotion:'reduce'});await reduced.waitForFunction(()=>ScrollTrigger.getAll().length===0);
 const nojs=await browser.newPage({viewport:{width:390,height:844},javaScriptEnabled:false});observe(nojs,'nojs');await nojs.goto(url);
 assert(await nojs.locator('.motion-summary').isVisible());assert.equal(await nojs.locator('.static-stages img').count(),6);
 await nojs.locator('.results-shortcut').click();report.nojsSkip=await nojs.locator('#real-results').evaluate(el=>el.getBoundingClientRect().top);
 assert(report.nojsSkip>=75&&report.nojsSkip<150,'no-JS shortcut');
 const fallback=await browser.newPage({viewport:{width:390,height:844}});
 await fallback.route('**/reference-hydrophobic.webp',r=>r.abort());await fallback.goto(url,{waitUntil:'networkidle'});
 assert(await fallback.locator('.motion-summary').isVisible());await gallery(fallback);report.assetFailureFallback=true;
 const noLibs=await browser.newPage({viewport:{width:390,height:844}});
 await noLibs.route('**/vendor/*.js',r=>r.abort());await noLibs.goto(url,{waitUntil:'networkidle'});
 assert(await noLibs.locator('.motion-summary').isVisible());await gallery(noLibs);report.libraryFailureFallback=true;
 report.navigation={};
 const pages=[
  {path:'/',current:'Home'},
  {path:'/services/',current:'Services'},
  {path:'/gallery/',current:'Gallery'},
  {path:'/booking/',current:'Get a Quote'},
  {path:'/ceramic-coating/',current:'Ceramic Coating'}
 ];
 const expectedNav=[['Home','/'],['Services','/services/'],['Gallery','/gallery/'],['Ceramic Coating','/ceramic-coating/'],['Get a Quote','/booking/']];
 for(const viewport of [{name:'desktop',width:1440},{name:'mobile',width:390}]){
  const result=report.navigation[viewport.name]={};
  for(const route of pages){
   const navPage=await browser.newPage({viewport:{width:viewport.width,height:844}});observe(navPage,`nav-${viewport.name}-${route.path}`);
   await navPage.goto(new URL(route.path,url).href,{waitUntil:'networkidle'});
   if(viewport.name==='mobile')await navPage.locator('.menu-toggle').click();
   const links=await navPage.locator('.nav-menu a').evaluateAll(as=>as.map(a=>[a.textContent.trim().replace(/\s+/g,' '),new URL(a.href).pathname]));
   assert.deepEqual(links,expectedNav,`${viewport.name} nav mismatch on ${route.path}`);
   const current=await navPage.locator('.nav-menu a[aria-current="page"]').allTextContents();
   assert.deepEqual(current,[route.current],`${viewport.name} current-page marker on ${route.path}`);
   if(viewport.name==='mobile'){
    assert.equal(await navPage.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
    await navPage.locator('.nav-menu a[href="/ceramic-coating/"]').click();
    await navPage.waitForURL('**/ceramic-coating/');
   }
   result[route.path]={links:links.length,current:route.current};await navPage.close();
  }
 }
 report.assets={};for(const name of ['reference-before','reference-clay','reference-clean','reference-polished','reference-protected','reference-hydrophobic']){
  const m=await sharp(`assets/${name}.webp`).metadata();assert(m.width===1672&&m.height===941&&!m.hasAlpha,name+' full opaque image');report.assets[name]={width:m.width,height:m.height,alpha:m.hasAlpha};
 }
 assert.equal(report.forbiddenRequests.length,0,'tool assets requested');assert.equal(report.errors.length,0,'browser errors');
} finally {await writeFile('qa/matched/report.json',JSON.stringify(report,null,2));await browser.close();}
console.log(JSON.stringify(report,null,2));

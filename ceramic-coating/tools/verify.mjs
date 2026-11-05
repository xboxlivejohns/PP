import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('qa',{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const report={};
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&r.url().startsWith('http://127.0.0.1:4173/'))errors.push(`${r.status()} ${r.url()}`);});
 await page.goto('http://127.0.0.1:4173/ceramic-coating/',{waitUntil:'networkidle'});await page.waitForSelector('.has-webgl');
 await page.screenshot({path:'qa/desktop-intro.png'});
 async function progress(p){await page.evaluate(p=>{const t=ScrollTrigger.getAll().find(t=>t.pin);window.scrollTo(0,t.start+(t.end-t.start)*p);ScrollTrigger.update();},p);await page.waitForTimeout(350);return page.locator('#cinema').getAttribute('data-progress');}
 report.forward=[];
 for(const [name,p] of [['macro',.3],['clean',.38],['polishing',.48],['coating',.63],['beading',.77],['reveal',.99]]){const actual=await progress(p);await page.screenshot({path:`qa/desktop-${name}.png`});report.forward.push({name,target:p,actual});}
 await progress(.77);const first=await page.locator('#surface').evaluate(c=>c.toDataURL());await progress(.35);await progress(.77);const second=await page.locator('#surface').evaluate(c=>c.toDataURL());report.reverseIdentical=first===second;
 await progress(0);await page.locator('.results-shortcut').click();await page.waitForTimeout(1600);report.skip=await page.locator('#real-results').evaluate(el=>({top:el.getBoundingClientRect().top,focused:document.activeElement===el}));
 await page.screenshot({path:'qa/desktop-results.png'});await page.locator('[data-photo="porsche"]').click();report.dialog=await page.locator('dialog').evaluate(el=>el.open);await page.screenshot({path:'qa/desktop-photo.png'});await page.keyboard.press('Escape');report.escapeCloses=await page.locator('dialog').evaluate(el=>!el.open);
 report.desktopOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);report.errors=errors;
 const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});await mobile.goto('http://127.0.0.1:4173/ceramic-coating/',{waitUntil:'networkidle'});await mobile.waitForSelector('.has-webgl');await mobile.screenshot({path:'qa/mobile-intro.png'});
 report.mobileOverflow=await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
 report.mobileDisclosureVisible=await mobile.locator('.visual-disclosure').evaluate(el=>{const r=el.getBoundingClientRect();const b=document.querySelector('.contact-bar').getBoundingClientRect();return r.bottom<b.top;});
 await mobile.locator('.menu-toggle').click();report.mobileMenu=await mobile.locator('.menu-toggle').getAttribute('aria-expanded');await mobile.locator('.menu-toggle').click();
 await mobile.locator('[data-chapter="5"]').click();await mobile.waitForTimeout(1500);await mobile.screenshot({path:'qa/mobile-beading.png'});
 await mobile.locator('.results-shortcut').click();await mobile.waitForTimeout(1500);report.mobileSkip=await mobile.locator('#real-results').evaluate(el=>el.getBoundingClientRect().top);await mobile.screenshot({path:'qa/mobile-results.png'});
 const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await reduced.goto('http://127.0.0.1:4173/ceramic-coating/',{waitUntil:'networkidle'});await reduced.waitForSelector('.reduced-motion');report.reducedMotion=await reduced.evaluate(()=>({pinned:ScrollTrigger.getAll().some(t=>!!t.pin),summary:getComputedStyle(document.querySelector('.motion-summary')).display}));
 const nojs=await browser.newPage({viewport:{width:390,height:844},javaScriptEnabled:false});await nojs.goto('http://127.0.0.1:4173/ceramic-coating/');await nojs.locator('.results-shortcut').click();report.noJsSkip=await nojs.locator('#real-results').evaluate(el=>el.getBoundingClientRect().top);
 report.navigation={};for(const route of ['/','/services/','/gallery/','/booking/'])report.navigation[route]=(await page.request.get('http://127.0.0.1:4173'+route)).status();
 await writeFile('qa/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 if(errors.length||!report.reverseIdentical||report.desktopOverflow||report.mobileOverflow||!report.dialog||!report.escapeCloses||!report.mobileDisclosureVisible||Object.values(report.navigation).some(s=>s!==200))process.exitCode=1;
}finally{await browser.close();}

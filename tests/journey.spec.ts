import {test,expect} from '@playwright/test';
import {chooseLocale} from './navigation-helper.ts';
test.use({reducedMotion:'no-preference'});
test.beforeEach(async({page})=>{await page.addInitScript(()=>sessionStorage.setItem('atlas-entry-seen','1'));});
const settle=async(page:import('@playwright/test').Page)=>{await page.waitForTimeout(650);};

test('first catalogue arrival prepares card opacity before the intro fade and never resets it on open',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'no-preference'});const page=await context.newPage();
 await page.addInitScript(()=>{const proof:{values:number[];done:boolean}={values:[],done:false};(window as unknown as {handoff:typeof proof}).handoff=proof;function sample(){const entry=(window as unknown as {__atlasEntry?:{opened:number}}).__atlasEntry,card=document.querySelector<HTMLElement>('[data-reveal="sidereal"]');if(card&&getComputedStyle(document.querySelector('#site-content')!).visibility==='visible')proof.values.push(Number(getComputedStyle(card).opacity));if(entry?.opened&&performance.now()-entry.opened>650){proof.done=true;return;}requestAnimationFrame(sample);}requestAnimationFrame(sample);});
 try{await page.goto('/#catalog');await page.waitForFunction(()=>(window as unknown as {handoff:{done:boolean}}).handoff.done);const values=await page.evaluate(()=>(window as unknown as {handoff:{values:number[]}}).handoff.values);expect(values.length).toBeGreaterThan(10);expect(values.at(-1)).toBe(1);expect(Math.max(...values.slice(1).map((v,i)=>values[i]-v))).toBeLessThan(.025);await expect(page.locator('[data-reveal="sidereal"]')).toHaveAttribute('data-revealed','true');}finally{await context.close();}
});

test('measured whole-card animations use 22px/500ms with an 80ms pair stagger only once',async({page})=>{
 await page.addInitScript(()=>{const calls:{id:string;duration:number;delay:number;first:Keyframe}[]=[];(window as unknown as {reveals:typeof calls}).reveals=calls;const original=Element.prototype.animate;Element.prototype.animate=function(frames,options){const id=(this as HTMLElement).dataset.reveal;if(id&&typeof options==='object')calls.push({id,duration:Number(options.duration),delay:Number(options.delay),first:(frames as Keyframe[])[0]});return original.call(this,frames,options);};});
 await page.goto('/');await page.locator('[data-reveal="orbit"]').scrollIntoViewIfNeeded();await settle(page);
 const calls=await page.evaluate(()=>(window as unknown as {reveals:{id:string;duration:number;delay:number;first:Keyframe}[]}).reveals);
 const orbit=calls.find(x=>x.id==='orbit')!,iter=calls.find(x=>x.id==='iter')!;expect(orbit.duration).toBe(500);expect(orbit.first.transform).toBe('translateY(22px)');expect(orbit.delay).toBe(0);expect(iter.delay).toBe(80);
 await page.locator('.project-closing').scrollIntoViewIfNeeded();await settle(page);await page.locator('[data-reveal="orbit"]').scrollIntoViewIfNeeded();await settle(page);expect(await page.evaluate(()=>(window as unknown as {reveals:{id:string}[]}).reveals.filter(x=>x.id==='orbit').length)).toBe(1);
});

test('catalogue reveals whole cards once, staggers the actual row and preserves close/Escape scroll',async({page})=>{
 await page.goto('/#catalog');await settle(page);const orbit=page.locator('[data-reveal="orbit"]');await orbit.scrollIntoViewIfNeeded();
 await expect(orbit).toHaveAttribute('data-revealed','true');await settle(page);
 const y=await page.evaluate(()=>scrollY);await page.locator('[data-catalog="orbit"]').click();await expect(page).toHaveURL(/projects\/orbit.html$/);
 await page.locator('[data-close-case]').click();await expect(page).toHaveURL(/#catalog$/);await expect(page.locator('[data-catalog="orbit"]')).toBeFocused();
 expect(Math.abs(await page.evaluate(()=>scrollY)-y)).toBeLessThan(3);await expect(orbit).toHaveAttribute('data-revealed','true');
 expect(await orbit.evaluate(el=>el.getAnimations().length)).toBe(0);
 await page.keyboard.press('Enter');await expect(page.locator('body')).toHaveAttribute('data-project','orbit');await expect(page.locator('html')).toHaveClass(/enhanced/);await page.keyboard.press('Escape');await expect(page).toHaveURL(/#catalog$/);await expect.poll(async()=>Math.abs(await page.evaluate(()=>scrollY)-y)).toBeLessThan(3);
});
test('native history and language keep the catalogue origin without replaying revealed cards',async({page})=>{
 await page.goto('/en/#catalog');await page.locator('[data-catalog="perch"]').scrollIntoViewIfNeeded();await settle(page);const y=await page.evaluate(()=>scrollY);
 await page.locator('[data-catalog="perch"]').click();await page.goBack();await expect(page).toHaveURL(/\/en\/#catalog$/);expect(Math.abs(await page.evaluate(()=>scrollY)-y)).toBeLessThan(3);
 await page.goForward();await expect(page).toHaveURL(/en\/projects\/perch.html$/);await chooseLocale(page,'kk');await expect(page).toHaveURL(/kk\/projects\/perch.html$/);await page.keyboard.press('Escape');await expect(page).toHaveURL(/\/kk\/#catalog$/);await expect(page.locator('[data-catalog="perch"]')).toBeFocused();
});
test('real poster and native video share the same geometry through hover and bounded tilt',async({page})=>{
 await page.goto('/#catalog');const visual=page.locator('.project-featured .project-visual');await visual.scrollIntoViewIfNeeded();await settle(page);const box=(await visual.boundingBox())!;
 await page.mouse.move(box.x+box.width*.8,box.y+box.height*.3);await expect(visual).toHaveClass(/demo-playing/);await settle(page);
 const state=await visual.evaluate(el=>{const img=el.querySelector('img')!,video=el.querySelector('video')!;return{img:getComputedStyle(img).transform,video:getComputedStyle(video).transform,x:el.style.getPropertyValue('--tilt-x'),y:el.style.getPropertyValue('--tilt-y'),before:img.getBoundingClientRect().toJSON(),after:video.getBoundingClientRect().toJSON()};});
 expect(state.img).toBe(state.video);expect(Math.abs(parseFloat(state.x))).toBeLessThanOrEqual(1.5);expect(Math.abs(parseFloat(state.y))).toBeLessThanOrEqual(1.5);
 expect(Math.abs(state.before.width-state.after.width)).toBeLessThan(2);expect(Math.abs(state.before.height-state.after.height)).toBeLessThan(2);
 await page.mouse.move(5,80);await settle(page);await expect(visual).not.toHaveClass(/demo-playing/);
});
for(const locale of ['ru','en','kk'])test(`case graphemes reserve layout and expose one complete accessible paragraph: ${locale}`,async({page})=>{
 await page.goto(`${locale==='ru'?'':'/'+locale}/projects/ayqyn.html`);const p=page.locator('.case-summary');const initial=(await p.boundingBox())!;
 const a=await p.evaluate(el=>({text:el.querySelector('.sr-only')!.textContent,visible:el.querySelector('[aria-hidden]')!.textContent,opacities:[...el.querySelectorAll('.case-glyph')].map(x=>+getComputedStyle(x).opacity),delays:[...el.querySelectorAll('.case-glyph')].map(x=>parseFloat(getComputedStyle(x).animationDelay))}));
 expect(a.text).toBe(a.visible);expect(a.opacities.some(x=>x<1)).toBe(true);expect(Math.max(...a.delays)-Math.min(...a.delays)).toBeCloseTo(1.65,2);
 await expect(page.locator('.case-actions a').first()).toBeEnabled();await page.waitForTimeout(2400);expect((await p.boundingBox())!.height).toBe(initial.height);
 expect(await p.locator('.case-glyph').evaluateAll(els=>els.every(x=>getComputedStyle(x).opacity==='1'))).toBe(true);await expect(p.locator('.typing-indicator')).toHaveCSS('opacity','0');
 await page.locator('.case-decisions').scrollIntoViewIfNeeded();await page.waitForTimeout(900);expect(await page.locator('.case-decisions .line-word').count()).toBeGreaterThan(4);
});
test('reduced motion, runtime pause and no JavaScript retain the whole useful case',async({page,browser})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/kk/projects/iter.html');expect(await page.locator('.case-glyph').evaluateAll(e=>e.every(x=>getComputedStyle(x).opacity==='1'))).toBe(true);
 await page.emulateMedia({reducedMotion:'no-preference'});await page.reload();await page.locator('.motion').click();expect(await page.locator('.case-glyph').evaluateAll(e=>e.every(x=>getComputedStyle(x).opacity==='1'))).toBe(true);
 const context=await browser.newContext({javaScriptEnabled:false});const staticPage=await context.newPage();await staticPage.goto('/en/projects/iter.html');await expect(staticPage.locator('.case-actions a').first()).toBeVisible();expect((await staticPage.locator('.case-summary [aria-hidden]').innerText()).length).toBeGreaterThan(40);await context.close();
});
test('touch has reveal/tap but no persistent scale or tilt, and quick next/Escape keeps the last route',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'no-preference'});const page=await context.newPage();await page.addInitScript(()=>sessionStorage.setItem('atlas-entry-seen','1'));await page.goto('/#catalog');
 await page.locator('[data-catalog="iter"]').scrollIntoViewIfNeeded();await page.locator('[data-catalog="iter"]').tap();await expect(page).toHaveURL(/projects\/iter.html$/);await page.locator('.next-project').click();await expect(page).toHaveURL(/projects\/ayqyn.html$/);await page.keyboard.press('Escape');await expect(page).toHaveURL(/#catalog$/);
 expect(await page.locator('.project-visual').evaluateAll(els=>els.every(el=>!el.style.getPropertyValue('--tilt-x')&&getComputedStyle(el).getPropertyValue('--preview-scale').trim()!=='1.025'))).toBe(true);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await context.close();
});
test('exact catalogue origin, malformed optional storage and new-tab navigation stay isolated',async({page,context})=>{
 await page.addInitScript(()=>{if(!sessionStorage.getItem('bad-tested')){sessionStorage.setItem('atlas-return',JSON.stringify({y:1,seen:"bad",focus:'"]',path:'/'}));sessionStorage.setItem('bad-tested','1');}});await page.goto('/?flat#atlas/iter');await page.locator('[data-catalog="forme"]').scrollIntoViewIfNeeded();await settle(page);const y=await page.evaluate(()=>scrollY);await page.locator('[data-catalog="forme"]').click();await expect(page.locator('body')).toHaveAttribute('data-project','forme');await page.locator('[data-close-case]').click();await expect(page).toHaveURL(/\?flat#atlas\/iter$/);await expect.poll(async()=>Math.abs(await page.evaluate(()=>scrollY)-y)).toBeLessThan(3);
 const popup=await context.newPage();await popup.addInitScript(()=>sessionStorage.setItem('atlas-entry-seen','1'));await popup.goto('/projects/orbit.html');await popup.keyboard.press('Escape');await expect(popup).toHaveURL(/#atlas\/orbit$/);await popup.close();
});

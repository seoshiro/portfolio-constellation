import {test,expect} from '@playwright/test';
import {observeAudio,audioState,soundToggle,emulateHidden} from './audio-probe.ts';
import {chooseLocale} from './navigation-helper.ts';
test.use({reducedMotion:'no-preference'});
test.beforeEach(async({page})=>{await page.addInitScript(()=>sessionStorage.setItem('atlas-entry-seen','1'));});

test('integrated seventy-pixel header is sticky; four anchors and active section remain distinct',async({page})=>{
 await page.goto('/');const h=await page.locator('.header').boundingBox(),hero=await page.locator('.hero').boundingBox();expect(h!.height).toBe(70);expect(hero!.y).toBe(0);await expect(page.locator('.header-nav a')).toHaveCount(4);
 await page.emulateMedia({reducedMotion:'reduce'});for(const id of ['catalog','about','contact']){await page.locator(`[data-nav="${id}"]`).click();await expect(page).toHaveURL(new RegExp('#'+id+'$'));await expect.poll(()=>page.locator('#'+id).evaluate(el=>el.getBoundingClientRect().top)).toBeGreaterThanOrEqual(70);await expect(page.locator(`[data-nav="${id}"]`)).toHaveAttribute('aria-current','location');expect((await page.locator('.header').boundingBox())!.y).toBe(0);}
 await page.locator('[data-nav="atlas"]').click();await expect(page).toHaveURL(/#atlas$/);await expect(page.locator('.atlas-heading')).toBeVisible();expect((await page.locator('.atlas-heading').boundingBox())!.y).toBeGreaterThan(70);expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
});
test('mobile menu traps focus, Escape returns it and does not clear the selected project',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/#atlas/iter');await page.locator('.menu-open').click();await expect(page.locator('.mobile-menu')).toBeVisible();await expect(page.locator('.menu-close')).toBeFocused();
 for(let i=0;i<12;i++){await page.keyboard.press('Tab');expect(await page.evaluate(()=>!!document.activeElement?.closest('.mobile-menu'))).toBe(true);}
 await page.keyboard.press('Escape');await expect(page.locator('.menu-open')).toBeFocused();await expect(page).toHaveURL(/#atlas\/iter$/);
 for(let i=0;i<3;i++){await page.locator('.menu-open').click();await page.locator('.menu-close').click();}await page.locator('.menu-open').click();await expect(page.locator('html')).toHaveClass(/menu-visible/);await page.setViewportSize({width:1440,height:1000});await expect(page.locator('.mobile-menu')).not.toBeVisible();await expect(page.locator('.header-nav')).toBeVisible();await expect(page.locator('html')).not.toHaveClass(/menu-visible/);
});
test('mobile language disclosure preserves case/section and every new control is translated',async({page})=>{
 await page.setViewportSize({width:360,height:844});await page.goto('/#about');await chooseLocale(page,'kk');await expect(page).toHaveURL(/\/kk\/#about$/);await expect(page.locator('.menu-open')).toHaveText(/Мәзір/);await expect(page.locator('.sound-controls summary')).toHaveAttribute('aria-label','Дыбыс өшірулі');
 await page.goto('/kk/projects/iter.html');await chooseLocale(page,'en');await expect(page).toHaveURL(/\/en\/projects\/iter.html$/);await expect(page.locator('.menu-open')).toHaveText(/Menu/);await expect(page.locator('.sound-controls summary')).toHaveAttribute('aria-label','Sound off');expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
});
test('catalogue order, title-row miniatures and genuine about fragments keep screenshots unobstructed',async({page})=>{
 await page.goto('/#catalog');expect(await page.locator('.project-heading h3').allTextContents()).toEqual(['SIDEREAL','ORBIT','ITER','AYQYN','FORME','PERCH']);await expect(page.locator('.project-visual .catalog-constellation')).toHaveCount(0);await expect(page.locator('.project-heading .catalog-constellation')).toHaveCount(6);
 for(const svg of await page.locator('.project-heading .catalog-constellation').all())expect((await svg.boundingBox())!.width).toBe(32);
 const text=await page.locator('.project-closing .project-copy').boundingBox(),preview=await page.locator('.project-closing .project-visual').boundingBox();expect(text!.x).toBeLessThan(preview!.x);await page.locator('[data-nav="about"]').click();await expect(page.locator('.about-examples li')).toHaveCount(3);
 for(const img of await page.locator('.about-examples img').all())await expect.poll(()=>img.evaluate(el=>(el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
 expect(await page.locator('.about-examples a.example-image').evaluateAll(a=>a.map(el=>el.getAttribute('href')))).toEqual(['/projects/sidereal.html','/projects/iter.html','/projects/ayqyn.html']);
});
test('first entry, project selection and opening sound settings never create audio or download the score',async({page})=>{
 await observeAudio(page);const requests:string[]=[];page.on('request',r=>{if(r.url().includes('/audio/'))requests.push(r.url());});await page.addInitScript(()=>sessionStorage.removeItem('atlas-entry-seen'));await page.goto('/');await page.locator('.entry-skip').click();await page.locator('[data-select="iter"]').click();await page.locator('.sound-controls summary').click();await page.keyboard.press('Escape');await page.waitForTimeout(250);expect((await audioState(page)).contexts).toBe(0);expect(requests).toEqual([]);await expect(page.locator('body')).toHaveAttribute('data-sound','off');
});
test('explicit sound enable creates one real loop and a quiet post-master signal',async({page})=>{
 await observeAudio(page);await page.goto('/');await soundToggle(page);await expect(page.locator('body')).toHaveAttribute('data-sound','on');await expect.poll(async()=>(await audioState(page)).loops).toBe(1);await page.waitForTimeout(1900);const state=await audioState(page);expect(state.contexts).toBe(1);expect(state.state).toBe('running');expect(state.rms).toBeGreaterThan(.0005);expect(state.rms).toBeLessThan(.12);await soundToggle(page);await expect.poll(async()=>(await audioState(page)).state).toBe('suspended');
});
test('six project motifs begin with the selection; rapid switches cancel their predecessors',async({page})=>{
 await observeAudio(page);await page.goto('/');await soundToggle(page);await expect.poll(async()=>(await audioState(page)).loops).toBe(1);const signatures:string[]=[];
 for(const [index,id]of ['sidereal','orbit','iter','ayqyn','forme','perch'].entries()){const before=await audioState(page);await page.locator(index?`[data-target="${id}"]`:`[data-select="${id}"]`).click();await expect(page.locator('.project-preview h2')).toHaveText(id.toUpperCase());const after=await audioState(page),notes=after.notes.slice(before.notes.length);expect(notes).toHaveLength(3);expect(Math.abs(notes[0].time-after.clickTime)).toBeLessThan(.05);signatures.push(notes.map(n=>Math.round(n.frequency)).join(','));}
 expect(new Set(signatures).size).toBe(6);await page.keyboard.press('Escape');expect((await audioState(page)).notes.at(-1)!.frequency).toBeCloseTo(329.63,1);await page.waitForTimeout(1900);expect((await audioState(page)).rms).toBeLessThan(.16);await soundToggle(page);
});
test('volume controls both layers; sound and scene pause remain independent',async({page})=>{
 await observeAudio(page);await page.goto('/');await soundToggle(page);await expect.poll(async()=>(await audioState(page)).loops).toBe(1);await page.locator('.motion').click();await expect(page.locator('html')).toHaveClass(/reduced/);expect((await audioState(page)).state).toBe('running');await expect(page.locator('body')).toHaveAttribute('data-sound','on');
 await page.locator('.sound-controls summary').click();await page.locator('.volume').focus();await page.keyboard.press('Home');await page.locator('[data-select="sidereal"]').click();await page.waitForTimeout(1900);expect((await audioState(page)).rms).toBeLessThan(.001);await page.locator('.motion').click();await expect(page.locator('html')).not.toHaveClass(/reduced/);await soundToggle(page);await expect.poll(async()=>(await audioState(page)).state).toBe('suspended');await expect(page.locator('html')).not.toHaveClass(/reduced/);
});
test('controlled hidden/return pauses the actual context and never resumes an off preference',async({page})=>{
 await observeAudio(page);await page.goto('/');await soundToggle(page);await expect.poll(async()=>(await audioState(page)).loops).toBe(1);await emulateHidden(page,true);await expect.poll(async()=>(await audioState(page)).state).toBe('suspended');await emulateHidden(page,false);await expect.poll(async()=>(await audioState(page)).state).toBe('running');await soundToggle(page);await expect.poll(async()=>(await audioState(page)).state).toBe('suspended');await emulateHidden(page,true);await emulateHidden(page,false);await page.waitForTimeout(250);expect((await audioState(page)).state).toBe('suspended');await expect(page.locator('body')).toHaveAttribute('data-sound','off');
});
test('audio request/unsupported context failures fall back to silent useful navigation',async({page})=>{
 await page.route('**/audio/atlas-atmosphere.wav',r=>r.abort());await page.goto('/');await soundToggle(page);await expect(page.locator('.sound-status')).toHaveText(/недоступен/);await expect(page.locator('body')).toHaveAttribute('data-sound','off');await page.locator('[data-select="iter"]').click();await expect(page.locator('.project-preview h2')).toHaveText('ITER');
 await page.addInitScript(()=>{window.AudioContext=class{constructor(){throw new Error('Audio unavailable');}} as unknown as typeof AudioContext;});await page.goto('/');await soundToggle(page);await expect(page.locator('.sound-status')).toHaveText(/недоступен/);await expect(page.locator('body')).toHaveAttribute('data-sound','off');await page.locator('[data-nav="catalog"]').click();await expect(page).toHaveURL(/#catalog$/);
});

test('a stale visibility resume rejection cannot override a newer explicit sound choice',async({page})=>{
 await observeAudio(page);await page.goto('/');await soundToggle(page);await expect.poll(async()=>(await audioState(page)).loops).toBe(1);await emulateHidden(page,true);
 await page.evaluate(()=>{const context=window.__audio.contexts[0],resume=context.resume.bind(context);context.resume=()=>{context.resume=resume;return new Promise((_,reject)=>setTimeout(()=>reject(new Error('Old resume rejected')),300));};});
 await emulateHidden(page,false);await soundToggle(page);await soundToggle(page);await page.waitForTimeout(500);await expect(page.locator('body')).toHaveAttribute('data-sound','on');await expect(page.locator('.sound-status')).toHaveText('');expect((await audioState(page)).state).toBe('running');expect((await audioState(page)).loops).toBe(1);
});

test('disposing during a real score decode leaves the context closed and cannot restart a loop',async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));await observeAudio(page);
 await page.addInitScript(()=>{const decode=AudioContext.prototype.decodeAudioData;AudioContext.prototype.decodeAudioData=function(bytes:ArrayBuffer){document.body.dataset.decoding='true';return decode.call(this,bytes).then(buffer=>new Promise<AudioBuffer>(resolve=>setTimeout(()=>resolve(buffer),650)));};});
 await page.goto('/');await soundToggle(page);await expect(page.locator('body')).toHaveAttribute('data-decoding','true');await page.evaluate(()=>dispatchEvent(new PageTransitionEvent('pagehide',{persisted:false})));await page.waitForTimeout(850);const state=await audioState(page);expect(state.state).toBe('closed');expect(state.loops).toBe(0);expect(errors).toEqual([]);
});

test('a slow score stays silent through hidden/show and volume changes, then fades from its real loop onset',async({page})=>{
 await observeAudio(page);let release=()=>{};const held=new Promise<void>(resolve=>{release=resolve;});await page.route('**/audio/atlas-atmosphere.wav',async route=>{await held;await route.continue();});await page.goto('/');await soundToggle(page);await page.waitForTimeout(1600);expect((await audioState(page)).gain).toBe(0);await emulateHidden(page,true);await emulateHidden(page,false);await page.locator('.volume').focus();await page.keyboard.press('End');await page.waitForTimeout(250);expect((await audioState(page)).gain).toBe(0);expect((await audioState(page)).loops).toBe(0);release();await expect.poll(async()=>(await audioState(page)).loops).toBe(1);const onset=await audioState(page);expect(Math.abs(onset.gain-(1-Math.exp(-(onset.time-onset.loopStart)/.36)))).toBeLessThan(.07);await page.waitForTimeout(1700);expect((await audioState(page)).gain).toBeGreaterThan(.95);await soundToggle(page);
});

import {test,expect} from '@playwright/test';
import {observeAudio,audioState,soundToggle,emulateHidden} from './audio-probe.ts';
import AxeBuilder from '@axe-core/playwright';
test.use({reducedMotion:'no-preference'});
test.beforeEach(async({page})=>{await page.addInitScript(()=>sessionStorage.setItem('atlas-entry-seen','1'));});
test('native scroll reverses every route state and reload settles at the saved position',async({page})=>{
 await page.goto('/');
 const seek=async(p:number)=>{await page.locator('#signal-route').evaluate((el,p)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top+(el.getBoundingClientRect().height-window.innerHeight)*p,behavior:'instant'}),p);await expect.poll(async()=>Number(await page.locator('#signal-route').getAttribute('data-progress'))).toBeCloseTo(p,1);};
 for(const p of [0,.2,.5,.8,1,.5,.2,0])await seek(p);
 await seek(.5);await page.reload();await expect.poll(async()=>Number(await page.locator('#signal-route').getAttribute('data-progress'))).toBeCloseTo(.5,1);await expect(page.locator('.route-station.is-current')).toHaveAttribute('data-station','1');
 await page.keyboard.press('End');await expect(page.locator('footer')).toBeInViewport();await expect.poll(()=>page.evaluate(()=>scrollY+innerHeight>=document.documentElement.scrollHeight-2)).toBe(true);await page.keyboard.press('Home');await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(0);await expect(page.locator('h1')).toBeInViewport();
});
test('collection cannot duplicate; culmination persists; reset cancels and removes progress',async({page})=>{
 await page.goto('/');const fragment=page.locator('[data-fragment="tone"]');await fragment.click();await fragment.click({clickCount:4});await expect(page.locator('[data-quest-count]')).toHaveText('1 / 3');
 await page.locator('[data-fragment="path"]').click();await page.locator('[data-fragment="form"]').click();await expect(page.locator('[data-activate]')).toBeEnabled();await page.locator('[data-activate]').click();await expect(page.locator('.signal-receiver')).toHaveAttribute('data-activation','charging');await expect(page.locator('[data-activate]')).toBeDisabled();await expect(page.locator('.signal-receiver')).toHaveAttribute('data-activation','settled');
 await page.reload();await expect(page.locator('.signal-receiver')).toHaveAttribute('data-activation','settled');await expect(page.locator('[data-quest-count]')).toHaveText('3 / 3');await page.locator('[data-reset]').click();await expect(page.locator('[data-quest-count]')).toHaveText('0 / 3');await expect(page.locator('[data-activate]')).toBeDisabled();await page.reload();await expect(page.locator('[data-quest-count]')).toHaveText('0 / 3');
});
test('keyboard collection, reset while charging and storage-denied fallback keep projects usable',async({page})=>{
 await page.addInitScript(()=>{Storage.prototype.setItem=function(){throw new Error('storage denied');};});await page.goto('/');
 for(const id of ['tone','path','form']){await page.locator(`[data-fragment="${id}"]`).focus();await page.keyboard.press('Enter');}
 await page.locator('[data-activate]').click();await page.locator('[data-reset]').click();await page.waitForTimeout(1800);await expect(page.locator('.signal-receiver')).toHaveAttribute('data-activation','idle');await expect(page.locator('[data-quest-count]')).toHaveText('0 / 3');
 await page.locator('.route-station a').first().click();await expect(page.locator('h1')).toHaveText('SIDEREAL');await page.keyboard.press('Escape');await expect(page.locator('.hero')).toBeVisible();
});
test('one opt-in context, bounded SFX, actual scroll wind, ducking and hidden-tab resume',async({page})=>{
 await observeAudio(page);await page.goto('/');expect((await audioState(page)).contexts).toBe(0);await page.locator('[data-sound-opt]').click();await expect.poll(async()=>(await audioState(page)).loops).toBe(1);
 await expect.poll(async()=>(await audioState(page)).rms).toBeGreaterThan(0);
 await page.locator('#signal-route').scrollIntoViewIfNeeded();await page.waitForTimeout(1800);const idle=(await audioState(page)).windGain!;await page.mouse.wheel(0,550);await expect.poll(async()=>(await audioState(page)).windGain!).toBeGreaterThan(idle+.005);
 for(const id of ['tone','path','form'])await page.locator(`[data-fragment="${id}"]`).click();expect(Number(await page.locator('body').getAttribute('data-audio-voices'))).toBeLessThanOrEqual(4);
 await page.locator('[data-activate]').click();await expect.poll(async()=>(await audioState(page)).musicGain!).toBeLessThan(.5);await expect(page.locator('.signal-receiver')).toHaveAttribute('data-activation','settled');await expect.poll(async()=>(await audioState(page)).musicGain!).toBeGreaterThan(.8);await emulateHidden(page,true);await expect.poll(async()=>(await audioState(page)).state).toBe('suspended');await emulateHidden(page,false);await expect.poll(async()=>(await audioState(page)).state).toBe('running');
 for(let i=0;i<4;i++)await soundToggle(page);expect((await audioState(page)).contexts).toBe(1);expect((await audioState(page)).loops).toBe(1);await page.locator('.motion').click();await expect(page.locator('body')).toHaveAttribute('data-sound','on');
});
for(const width of [320,360,390,768,1440])for(const locale of ['ru','en','kk'])test(`${width}px ${locale}: readable scenes, links, resize and no overflow`,async({page})=>{
 await page.setViewportSize({width,height:844});await page.goto(locale==='ru'?'/':`/${locale}/`);await expect(page.locator('html')).toHaveAttribute('lang',locale);await expect(page.locator('.route-station')).toHaveCount(3);await expect(page.locator('.project-heading h3')).toHaveCount(6);
 for(const id of ['signal-route','signal-archive','catalog','about','contact']){await page.locator('#'+id).scrollIntoViewIfNeeded();expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);}
 if(width<901)expect(await page.locator('.route-sticky').evaluate(el=>getComputedStyle(el).position)).toBe('relative');
 await page.setViewportSize({width:844,height:width});expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
 await page.emulateMedia({reducedMotion:'reduce'});expect(await page.locator('.route-sticky').evaluate(el=>getComputedStyle(el).position)).toBe('relative');await page.locator('.route-station a').first().click();await expect(page.locator('h1')).toHaveText('SIDEREAL');await page.goBack();await expect(page.locator('.route-station')).toHaveCount(3);
});
test('new route and receiver controls pass automated WCAG checks',async({page})=>{
 await page.goto('/');await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#signal-route').scrollIntoViewIfNeeded();const result=await new AxeBuilder({page:page as unknown as ConstructorParameters<typeof AxeBuilder>[0]['page']}).include('#signal-route').include('#signal-archive').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))).toEqual([]);
});

import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {projects,locales,caseHref} from '../src/data/projects.ts';

test('rapid selections, reload, history, case Escape and focus return',async({page})=>{
  await page.goto('/');
  for(const id of ['sidereal','iter','orbit','ayqyn','forme','perch','sidereal'])await page.locator(`[data-select="${id}"]`).click();
  await expect(page).toHaveURL(/#atlas\/sidereal$/);await expect(page.locator('.project-preview h2')).toHaveText('SIDEREAL');
  await page.reload();await expect(page.locator('.project-preview')).toBeVisible();
  await page.goBack();await expect(page.locator('.project-preview h2')).toHaveText('PERCH');await page.goForward();
  await page.locator('.project-preview [data-case]').click();await expect(page).toHaveURL(/projects\/sidereal.html$/);
  await page.reload();await expect(page.locator('h1')).toHaveText('SIDEREAL');
  await page.keyboard.press('Escape');await expect(page).toHaveURL(/#atlas\/sidereal$/);await expect(page.locator('[data-select="sidereal"]')).toBeFocused();
  await page.keyboard.press('Escape');await expect(page.locator('.hero-intro')).toBeVisible();await expect(page.locator('[data-select="sidereal"]')).toBeFocused();
  await page.locator('.wordmark').first().click();await expect(page.locator('h1')).toHaveText('BeibarsIleskhan✧');
});

test('language keeps the selection, section, case and preference',async({page})=>{
  await page.goto('/#atlas/iter');await page.locator('[data-locale="kk"]').click();await expect(page).toHaveURL(/\/kk\/#atlas\/iter$/);await expect(page.locator('html')).toHaveAttribute('lang','kk');
  await page.locator('.project-preview [data-case]').click();await page.locator('[data-locale="en"]').click();await expect(page).toHaveURL(/\/en\/projects\/iter.html$/);
  await page.goto('/');await expect(page).toHaveURL(/\/en\/$/);
  await page.goto('/en/#about');await page.locator('[data-locale="ru"]').click();await expect(page).toHaveURL(/\/#about$/);
});

test('keyboard selection works and every case has static complete content',async({page,request})=>{
  await page.goto('/');await page.locator('[data-select="sidereal"]').focus();await page.keyboard.press('Enter');await expect(page.locator('.project-preview')).toBeVisible();
  for(const locale of locales)for(const p of projects){const response=await request.get(caseHref(p.id,locale));expect(response.status()).toBe(200);const html=await response.text();expect(html).toContain('<main');expect(html).toContain(p.source);expect(html).toContain(p.live);expect(html).toContain('case-decisions');expect(html).toContain('case-details');}
});

test('HTML and real project links remain useful without JavaScript',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const page=await context.newPage();await page.goto('http://127.0.0.1:5318/');
  await expect(page.locator('h1')).toBeVisible();await expect(page.locator('#catalog .project')).toHaveCount(6);
  await page.locator('[data-select="iter"]').click();await expect(page.locator('h1')).toHaveText('ITER');await expect(page.locator('.case-actions a')).toHaveCount(2);await context.close();
});

test('fallback, denied storage and image failure preserve navigation',async({page})=>{
  await page.addInitScript(()=>{for(const key of ['localStorage','sessionStorage'])Object.defineProperty(window,key,{get(){throw new Error('Storage denied');}});});
  await page.route('**/assets/sidereal.webp',route=>route.abort());await page.goto('/?flat#atlas/sidereal');await expect(page.locator('.space-canvas')).not.toHaveClass(/ready/);await expect(page.locator('.image-error').first()).toBeVisible();await page.locator('.project-preview [data-case]').click();await expect(page.locator('h1')).toHaveText('SIDEREAL');await expect(page.locator('.case-actions a').first()).toBeVisible();
});

for(const width of [360,390,768,1440,1920])test(`layout and touch at ${width}px in three languages`,async({browser})=>{
  const context=await browser.newContext({viewport:{width,height:width<800?900:1080},hasTouch:width<800,reducedMotion:'reduce'});const page=await context.newPage();
  for(const locale of locales){const prefix=locale==='ru'?'':locale+'/';await page.goto(`http://127.0.0.1:5318/${prefix}`);await expect(page.locator('.constellation')).toHaveCount(6);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    if(width<800)await page.locator('[data-select="ayqyn"]').tap();else await page.locator('[data-select="ayqyn"]').click();await expect(page.locator('.project-preview h2')).toHaveText('AYQYN');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.locator('.project-preview [data-case]').click();await expect(page.locator('h1')).toHaveText('AYQYN');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.goto(`http://127.0.0.1:5318/${prefix}projects/archiveguard.html`);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }await context.close();
});

test('WCAG A/AA automated checks on map, selected state and case',async({page})=>{
  for(const url of ['/','/#atlas/sidereal','/projects/iter.html','/kk/projects/ayqyn.html']){await page.goto(url);await page.evaluate(()=>document.fonts.ready);const report=await new AxeBuilder({page:page as unknown as ConstructorParameters<typeof AxeBuilder>[0]['page']}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(report.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);}
});

test('renderer sleeps when idle/offscreen; text stays still; context loss falls back',async({page})=>{
  await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/');await page.waitForTimeout(1200);
  const name=await page.locator('h1').boundingBox();await page.mouse.move(1200,400);await page.waitForTimeout(800);expect(await page.locator('h1').boundingBox()).toEqual(name);
  const canvas=page.locator('.space-canvas');const frames=await canvas.getAttribute('data-frames');await page.waitForTimeout(800);expect(await canvas.getAttribute('data-frames')).toEqual(frames);
  await page.locator('#about').scrollIntoViewIfNeeded();await page.waitForTimeout(400);const offscreen=await canvas.getAttribute('data-frames');await page.waitForTimeout(400);expect(await canvas.getAttribute('data-frames')).toEqual(offscreen);
  await page.goto('/');const extension=await canvas.evaluateHandle(el=>(el as HTMLCanvasElement).getContext('webgl')?.getExtension('WEBGL_lose_context'));expect(await extension.evaluate(ext=>!!ext)).toBe(true);await extension.evaluate(ext=>ext!.loseContext());await expect(canvas).not.toHaveClass(/ready/);await page.locator('[data-select="iter"]').click();await expect(page.locator('.project-preview h2')).toHaveText('ITER');
  await extension.evaluate(ext=>ext!.restoreContext());await expect(canvas).toHaveClass(/ready/);await extension.dispose();
});

test('reduced motion creates no continuous animation or meteor',async({page})=>{
  await page.clock.install();await page.goto('/');await page.clock.fastForward(60000);await expect(page.locator('.meteors i')).toHaveCount(0);await expect(page.locator('.motion')).toBeDisabled();
});

test('intermediate tablet widths keep all constellation labels selectable',async({page})=>{
  test.setTimeout(60000);
  for(const width of [600,601,640,800,801,900,1024,1100]){await page.setViewportSize({width,height:1024});await page.goto('/#atlas/sidereal');
    for(const id of ['sidereal','orbit','iter','ayqyn','forme','perch']){const label=page.locator(`[data-select="${id}"]>span`);await label.scrollIntoViewIfNeeded();const reachable=await label.evaluate(el=>{const r=el.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('[data-select]')?.getAttribute('data-select');});expect(reachable,`${id} at ${width}`).toBe(id);await label.click();await expect(page.locator('.project-preview h2')).toHaveText(id.toUpperCase());}
  }
});

test('secondary case Escape returns focus to catalogue and legacy work anchor resolves',async({page})=>{
  await page.goto('/projects/reson.html');await page.keyboard.press('Escape');await expect(page).toHaveURL(/#catalog$/);await expect(page.locator('[data-catalog="reson"]')).toBeFocused();
  await page.goto('/#work');await expect(page).toHaveURL(/#catalog$/);
});

test('credits remain localized with JS, query redirect and static fallback',async({page,browser})=>{
  await page.goto('/en/credits.html');await page.locator('[data-locale="kk"]').click();await expect(page).toHaveURL(/\/kk\/credits.html$/);
  await page.goto('/en/credits.html?lang=ru');await expect(page).toHaveURL(/\/credits.html$/);await expect(page.locator('html')).toHaveAttribute('lang','ru');
  const context=await browser.newContext({javaScriptEnabled:false});const fallback=await context.newPage();await fallback.goto('http://127.0.0.1:5318/en/credits.html');await fallback.locator('[data-locale="kk"]').click();await expect(fallback).toHaveURL(/\/kk\/credits.html$/);await context.close();
});

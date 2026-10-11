import {test,expect,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.use({reducedMotion:'no-preference'});
const opened=async(page:Page)=>expect(page.locator('html')).not.toHaveClass(/intro-pending/,{timeout:6500});
const absent=async(page:Page)=>{await expect(page.locator('.entry-intro')).not.toBeVisible();expect(await page.evaluate(()=>!!window.__atlasEntry)).toBe(false);};

test('first entry lasts 3.5s, releases focus and starts the first visible meteor afterwards',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');await expect(page.locator('.entry-intro')).toBeVisible();
  await expect(page.locator('#site-content')).toHaveAttribute('inert');
  await expect(page.locator('.entry-skip')).toBeFocused();
  await page.keyboard.press('Tab');await expect(page.locator('.entry-skip')).toBeFocused();
  await expect(page.locator('.meteor')).toHaveCount(0);
  const axe=await new AxeBuilder({page:page as unknown as ConstructorParameters<typeof AxeBuilder>[0]['page']}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  await opened(page);
  const timing=await page.evaluate(()=>window.__atlasEntry!.opened-window.__atlasEntry!.started);
  expect(timing).toBeGreaterThanOrEqual(3450);expect(timing).toBeLessThan(4200);
  await expect(page.locator('#site-content')).not.toHaveAttribute('inert');
  await expect(page.locator('#main')).toBeFocused();await expect(page.locator('h1')).toBeVisible();
  const delay=await page.evaluate(()=>new Promise<number>(resolve=>{
    const hero=document.querySelector('.hero')!;
    const observer=new MutationObserver(()=>{if(hero.querySelector('.meteor')){observer.disconnect();resolve(performance.now()-window.__atlasEntry!.opened);}});
    observer.observe(hero,{subtree:true,childList:true});
  }));expect(delay).toBeGreaterThanOrEqual(2250);expect(delay).toBeLessThan(4000);expect(errors).toEqual([]);
});

for(const width of [360,390])test(`entry is composed for ${width}px touch screens`,async({page})=>{
  await page.setViewportSize({width,height:844});await page.goto('/');
  await expect(page.locator('.entry-intro')).toBeVisible();
  const bounds=await page.locator('.entry-core').boundingBox();expect(bounds!.x).toBeGreaterThanOrEqual(20);expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(width-20);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await opened(page);await page.locator('[data-select="orbit"]').click();await expect(page.locator('.hero')).toHaveAttribute('data-camera','idle');
  await expect(page.locator('.project-preview h2')).toHaveText('ORBIT');
});

for(const locale of ['ru','en','kk'] as const)test(`direct ${locale} case, reload, languages, logo and history do not replay entry`,async({page})=>{
  const prefix=locale==='ru'?'':locale+'/';const url='/'+prefix+'projects/iter.html';
  await page.goto(url);await expect(page.locator('.entry-intro')).toBeVisible();
  await expect(page.locator('.entry-skip')).toHaveText({ru:'Перейти к портфолио↗',en:'Enter portfolio↗',kk:'Портфолиоға өту↗'}[locale]!);
  await opened(page);await expect(page).toHaveURL(new RegExp(url.replaceAll('/','\\/')+'$'));await expect(page.locator('html')).toHaveAttribute('lang',locale);await expect(page.locator('h1')).toHaveText('ITER');
  await page.reload();await absent(page);await expect(page.locator('h1')).toHaveText('ITER');
  await page.locator('[data-locale="kk"]').click();await absent(page);await expect(page).toHaveURL(/\/kk\/projects\/iter.html$/);
  await page.keyboard.press('Escape');await expect(page).toHaveURL(/\/kk\/#atlas\/iter$/);await absent(page);await expect(page.locator('[data-select="iter"]')).toBeFocused();
  await page.locator('.wordmark').first().click();await absent(page);await page.goBack();await absent(page);await page.goForward();await absent(page);
  await page.locator('[data-select="orbit"]').click();await expect(page.locator('.hero')).toHaveAttribute('data-camera','idle');await page.locator('.project-preview [data-case]').click();await absent(page);await expect(page.locator('h1')).toHaveText('ORBIT');
});

test('reduced motion is static, keeps the duration and Escape skips without leaving a direct case',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/kk/#atlas/ayqyn');
  await expect(page.locator('.entry-intro')).toBeVisible();
  expect(await page.locator('.entry-intro').evaluate(el=>el.getAnimations({subtree:true}).length)).toBe(0);
  await opened(page);expect(await page.evaluate(()=>window.__atlasEntry!.opened-window.__atlasEntry!.started)).toBeGreaterThanOrEqual(3450);
  await expect(page).toHaveURL(/\/kk\/#atlas\/ayqyn$/);await expect(page.locator('.project-preview h2')).toHaveText('AYQYN');await expect(page.locator('.meteor')).toHaveCount(0);
  await page.evaluate(()=>sessionStorage.removeItem('atlas-entry-seen'));await page.goto('/kk/projects/ayqyn.html');
  await expect(page.locator('.entry-intro')).toBeVisible();await page.keyboard.press('Escape');await opened(page);
  await expect(page).toHaveURL(/\/kk\/projects\/ayqyn.html$/);await expect(page.locator('h1')).toHaveText('AYQYN');await expect(page.locator('#main')).toBeFocused();
  expect(await page.evaluate(()=>window.__atlasEntry!.opened-window.__atlasEntry!.started)).toBeLessThan(2500);
});

test('a failed font/image does not hold the entry open and content downloads in parallel',async({page})=>{
  await page.route('**/fonts/**',route=>route.abort());await page.route('**/assets/sun.webp',route=>route.abort());
  await page.goto('/?flat');await expect(page.locator('.entry-intro')).toBeVisible();
  expect(await page.locator('.sun').evaluate(el=>(el as HTMLImageElement).complete)).toBe(true);
  await opened(page);expect(await page.evaluate(()=>window.__atlasEntry!.opened-window.__atlasEntry!.started)).toBeLessThan(4200);
  await page.locator('[data-select="iter"]').click();await expect(page.locator('.hero')).toHaveAttribute('data-camera','idle');await expect(page.locator('.project-preview h2')).toHaveText('ITER');
});

test('denied storage still shows entry once and same-origin internal documents bypass it',async({page})=>{
  await page.addInitScript(()=>{for(const key of ['localStorage','sessionStorage'])Object.defineProperty(window,key,{get(){throw new Error('Storage denied');}});});
  await page.goto('/?flat');await expect(page.locator('.entry-intro')).toBeVisible();await page.locator('.entry-skip').click();await opened(page);
  await page.reload();await absent(page);
  await page.locator('[data-select="iter"]').click();await expect(page.locator('.hero')).toHaveAttribute('data-camera','idle');await page.locator('.project-preview [data-case]').click();await absent(page);
  await page.locator('[data-locale="en"]').click();await absent(page);await page.locator('.wordmark').first().click();await absent(page);
});

test('missing application module fails open to static HTML after 4.5s',async({page})=>{
  await page.route('**/*',route=>route.request().resourceType()==='script'&&!route.request().url().endsWith('/entry-bootstrap.js')?route.abort():route.continue());
  await page.goto('/');await expect(page.locator('.entry-intro')).toBeVisible();await opened(page);
  const duration=await page.evaluate(()=>window.__atlasEntry!.opened-window.__atlasEntry!.started);expect(duration).toBeGreaterThanOrEqual(4450);expect(duration).toBeLessThan(5300);
  await expect(page.locator('#site-content')).not.toHaveAttribute('inert');await expect(page.locator('h1')).toBeVisible();
  await page.locator('[data-select="iter"]').click();await expect(page.locator('h1')).toHaveText('ITER');
});

test('query language redirect preserves the direct case and hash during entry',async({page})=>{
  await page.goto('/en/projects/iter.html?lang=kk#details');await expect(page).toHaveURL(/\/kk\/projects\/iter.html#details$/);
  await expect(page.locator('.entry-intro')).toBeVisible();await opened(page);await expect(page.locator('html')).toHaveAttribute('lang','kk');await expect(page.locator('h1')).toHaveText('ITER');
});

test('a saved language redirect does not consume the first introduction',async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('atlas-language','kk'));
  await page.goto('/');await expect(page).toHaveURL(/\/kk\/$/);await expect(page.locator('.entry-intro')).toBeVisible();
  await opened(page);await expect(page.locator('html')).toHaveAttribute('lang','kk');await expect(page.locator('h1')).toBeVisible();
});

test('an eight-second font download does not postpone the visible meteor countdown',async({page})=>{
  await page.route('**/fonts/Onest/*',async route=>{await new Promise(resolve=>setTimeout(resolve,8000));await route.continue();});
  await page.goto('/',{waitUntil:'domcontentloaded'});await opened(page);
  const proof=await page.evaluate(()=>new Promise<{delay:number;fontLoaded:boolean}>(resolve=>{
    const observer=new MutationObserver(()=>{if(document.querySelector('.meteor')){observer.disconnect();resolve({delay:performance.now()-window.__atlasEntry!.opened,fontLoaded:document.fonts.check('16px Onest')});}});
    observer.observe(document.querySelector('.meteors')!,{childList:true});
  }));expect(proof.delay).toBeGreaterThanOrEqual(2250);expect(proof.delay).toBeLessThan(4000);expect(proof.fontLoaded).toBe(false);
  await page.evaluate(()=>document.fonts.ready);
});

test('first query-language entry survives denied storage and removes its handoff parameter',async({page})=>{
  await page.addInitScript(()=>{for(const key of ['localStorage','sessionStorage'])Object.defineProperty(window,key,{get(){throw new Error('Storage denied');}});});
  await page.goto('/en/projects/iter.html?lang=kk#details');await expect(page).toHaveURL(/\/kk\/projects\/iter.html#details$/);
  await expect(page.locator('.entry-intro')).toBeVisible();await opened(page);await expect(page.locator('h1')).toHaveText('ITER');
});

test('first saved-language entry survives denied sessionStorage',async({page})=>{
  await page.addInitScript(()=>{localStorage.setItem('atlas-language','kk');Object.defineProperty(window,'sessionStorage',{get(){throw new Error('Session storage denied');}});});
  await page.goto('/');await expect(page).toHaveURL(/\/kk\/$/);await expect(page.locator('.entry-intro')).toBeVisible();await opened(page);
  await expect(page.locator('html')).toHaveAttribute('lang','kk');
});

test('a cached page resumed after leaving mid-intro reveals its scene without replaying the dialog',async({page})=>{
  await page.goto('/?flat');await expect(page.locator('.entry-intro')).toBeVisible();
  // Playwright disables Chrome BFCache by default; exercise its actual retained
  // page lifecycle handlers without claiming a physical browser cache test.
  await page.evaluate(()=>{window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));});
  await opened(page);await expect(page.locator('.entry-intro')).not.toBeVisible();await expect(page.locator('#site-content')).not.toHaveAttribute('inert');
  await page.waitForSelector('.meteor',{timeout:5000});await page.locator('[data-select="orbit"]').click();await expect(page.locator('.hero')).toHaveAttribute('data-camera','moving');await expect(page.locator('.hero')).toHaveAttribute('data-camera','idle');
  await expect(page.locator('.project-preview h2')).toHaveText('ORBIT');
});

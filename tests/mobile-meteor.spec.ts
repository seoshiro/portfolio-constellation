import {test,expect} from '@playwright/test';
test.use({reducedMotion:'no-preference'});
for(const width of [360,390])test(`first phone meteor clears real localized text at ${width}px after timed/skip entry and delayed body font`,async({browser})=>{
 for(const locale of ['ru','en','kk']){
  const context=await browser.newContext({viewport:{width,height:844},hasTouch:true,reducedMotion:'no-preference'}),page=await context.newPage();let delayed=false;try{
  if(locale==='kk')await page.route(/\/fonts\/Onest\/.*\.woff2/,async route=>{delayed=true;await new Promise(resolve=>setTimeout(resolve,8000));if(!page.isClosed())await route.continue();});
  await page.goto(locale==='ru'?'/':'/'+locale+'/',{waitUntil:'domcontentloaded'});await expect(page.locator('.entry-intro')).toBeVisible();await expect(page.locator('.meteor')).toHaveCount(0);if(locale!=='ru')await page.locator('.entry-skip').click();await expect(page.locator('html')).not.toHaveClass(/intro-pending/);
  const timing=await page.evaluate(()=>new Promise<{delay:number;clear:boolean}>(resolve=>{const hero=document.querySelector('.hero')!,observer=new MutationObserver(()=>{const meteor=hero.querySelector<HTMLElement>('.meteor');if(!meteor)return;observer.disconnect();const text=hero.querySelector('.hero-intro')!.getBoundingClientRect(),scene=hero.getBoundingClientRect(),origin=parseFloat(meteor.style.top)+14;resolve({delay:performance.now()-window.__atlasEntry!.opened,clear:scene.top+origin>text.bottom+12});});observer.observe(hero,{childList:true,subtree:true});}));expect(timing.delay).toBeGreaterThanOrEqual(2250);expect(timing.delay).toBeLessThan(4000);expect(timing.clear).toBe(true);if(locale==='kk')expect(delayed).toBe(true);
  }finally{await context.close();}
 }
});

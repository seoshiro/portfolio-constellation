import {test,expect} from '@playwright/test';
// Verify native readiness, not just the presence of a pagereveal event.
test.use({reducedMotion:'no-preference'});
test.beforeEach(async({page})=>{await page.addInitScript(()=>sessionStorage.setItem('atlas-entry-seen','1'));});
test('native image transition is real, lasts 500ms and cleans temporary source names',async({page})=>{
 await page.addInitScript(()=>{(window as unknown as {nativeReady:boolean}).nativeReady=false;addEventListener('pagereveal',event=>{const transition=(event as Event&{viewTransition?:{ready:Promise<void>}}).viewTransition;if(transition)void transition.ready.then(()=>{(window as unknown as {nativeReady:boolean}).nativeReady=true;},()=>{});});});
 await page.goto('/#catalog');await page.locator('[data-catalog="sidereal"]').click();await expect(page).toHaveURL(/projects\/sidereal.html$/);await expect.poll(()=>page.evaluate(()=>(window as unknown as {nativeReady:boolean}).nativeReady)).toBe(true);
 await expect(page.locator('html')).toHaveClass(/case-shared/);expect(await page.evaluate(()=>getComputedStyle(document.documentElement,'::view-transition-group(case-media)').animationDuration)).toBe('0.5s');
 await page.locator('[data-close-case]').click();await expect(page).toHaveURL(/#catalog$/);await expect(page.locator('[data-transition-image]')).toHaveCount(0);await expect(page.locator('[data-catalog="sidereal"]')).toBeFocused();
 // Browser-supported transition cancellation must restore the ordinary arrival.
 await page.addInitScript(()=>addEventListener('pagereveal',event=>{(event as Event&{viewTransition?:{skipTransition:()=>void}}).viewTransition?.skipTransition();}));
 await page.locator('[data-catalog="sidereal"]').press('Enter');await expect(page).toHaveURL(/projects\/sidereal.html$/);
 await expect(page.locator('html')).not.toHaveClass(/case-shared/);await expect(page.locator('html')).toHaveClass(/case-arrival/);
 expect(await page.locator('.case-hero').evaluate(el=>getComputedStyle(el).animationName)).toBe('case-title');
 expect(await page.locator('html').evaluate(el=>el.style.getPropertyValue('--case-delay'))).toBe('');
});

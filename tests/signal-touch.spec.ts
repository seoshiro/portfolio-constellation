import {test,expect} from '@playwright/test';
test.use({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'no-preference'});
test('touch collection, orientation, silent choice, case/back and reduced motion',async({page})=>{
 await page.goto('/');await page.locator('.entry-skip').tap();await page.locator('[data-select="orbit"]').tap();await expect(page.locator('.project-preview h2')).toHaveText('ORBIT');await page.keyboard.press('Escape');await expect(page.locator('.hero')).toHaveAttribute('data-camera','idle');
 const bounds=await page.locator('.sound-invitation').boundingBox(),stars=await page.locator('.constellation').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().bottom));expect(bounds!.y).toBeGreaterThan(Math.max(...stars));
 await page.locator('[data-sound-silent]').tap();await expect(page.locator('body')).toHaveAttribute('data-sound','off');await page.locator('.voyage-link').tap();
 for(const id of ['tone','path','form'])await page.locator(`[data-fragment="${id}"]`).tap();await expect(page.locator('[data-quest-count]')).toHaveText('3 / 3');
 await page.setViewportSize({width:844,height:390});await page.locator('[data-activate]').tap();await expect(page.locator('.signal-receiver')).toHaveAttribute('data-activation','settled');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.locator('.route-station a').first().tap();await expect(page.locator('h1')).toHaveText('SIDEREAL');await page.locator('[data-close-case]').tap();await expect(page.locator('[data-quest-count]')).toHaveText('3 / 3');await page.locator('[data-reset]').tap();await expect(page.locator('[data-quest-count]')).toHaveText('0 / 3');
});

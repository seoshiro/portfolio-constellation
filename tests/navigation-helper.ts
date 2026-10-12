import {expect,type Page} from '@playwright/test';
export async function chooseLocale(page:Page,locale:string){
 const languages=page.locator('.languages'),summary=languages.locator('summary'),menu=page.locator('.menu-open');
 // A new document may not have rendered either control yet. Wait before
 // deciding whether the language disclosure lives in the mobile menu.
 await expect.poll(async()=>await summary.isVisible()||await menu.isVisible()).toBe(true);
 if(!await summary.isVisible())await menu.click();
 if(!await languages.evaluate(el=>(el as HTMLDetailsElement).open))await languages.locator('summary').click();await page.locator(`[data-locale="${locale}"]`).click();
}

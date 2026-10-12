import type {Page} from '@playwright/test';
export async function chooseLocale(page:Page,locale:string){
 const languages=page.locator('.languages');if(!await languages.locator('summary').isVisible())await page.locator('.menu-open').click();
 if(!await languages.evaluate(el=>(el as HTMLDetailsElement).open))await languages.locator('summary').click();await page.locator(`[data-locale="${locale}"]`).click();
}

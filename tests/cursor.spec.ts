import {test,expect} from '@playwright/test';
test.use({reducedMotion:'no-preference'});
test.beforeEach(async({page})=>{await page.addInitScript(()=>sessionStorage.setItem('atlas-entry-seen','1'));});

test('new reticle has a precise three-pixel dot and four open corners with bounded finite drift',async({page})=>{
  await page.goto('/');
  await expect(page.locator('.cursor-core svg,.cursor-ring')).toHaveCount(0);
  await expect(page.locator('.cursor-frame path')).toHaveCount(4);
  const edgeX=await page.evaluate(()=>document.documentElement.clientWidth-1);
  for(const [x,y]of [[1100,600],[1300,800],[600,800],[1,1],[edgeX,1],[edgeX,999],[1,999]]){
    await page.mouse.move(x,y);
    const proof=await page.evaluate(()=>{const dot=document.querySelector('.cursor-core')!.getBoundingClientRect(),frame=document.querySelector('.cursor-frame')!.getBoundingClientRect();return{dot:[dot.x+dot.width/2,dot.y+dot.height/2],size:[dot.width,dot.height],frame:[frame.x+frame.width/2,frame.y+frame.height/2],overflow:document.documentElement.scrollWidth>innerWidth,pointerEvents:getComputedStyle(document.querySelector('.atlas-cursor')!).pointerEvents};});
    expect(proof.dot).toEqual([x,y]);expect(proof.size).toEqual([3,3]);expect(Math.hypot(proof.frame[0]-x,proof.frame[1]-y)).toBeLessThanOrEqual(6.05);expect(proof.overflow).toBe(false);expect(proof.pointerEvents).toBe('none');
  }
  await expect.poll(()=>page.locator('.cursor-frame').evaluate(el=>{const b=el.getBoundingClientRect();return Math.hypot(b.x+b.width/2-1,b.y+b.height/2-999);})).toBeLessThan(.2);
  const settled=await page.locator('.cursor-frame').getAttribute('style');await page.waitForTimeout(350);expect(await page.locator('.cursor-frame').getAttribute('style')).toBe(settled);
});

test('corners expand gently for links, never intercept clicks and have no visible HUD label',async({page})=>{
  await page.goto('/');await page.mouse.move(450,50);await expect(page.locator('.cursor-frame')).toHaveCSS('width','22px');
  await page.locator('[data-select="iter"]').hover();await expect(page.locator('.cursor-frame')).toHaveCSS('width','30px');await expect(page.locator('.cursor-caption')).not.toBeVisible();
  const hit=await page.locator('.cursor-core').evaluate(el=>{const b=el.getBoundingClientRect();return document.elementFromPoint(b.x+b.width/2,b.y+b.height/2)?.closest('.constellation')?.getAttribute('data-select');});expect(hit).toBe('iter');
  await page.mouse.down();await expect(page.locator('.atlas-cursor')).toHaveClass(/is-down/);await page.mouse.up();await expect(page).toHaveURL(/#atlas\/iter$/);
  await page.waitForTimeout(300);await expect(page.locator('.cursor-impulse')).toHaveCSS('opacity','0');
  await page.keyboard.press('Escape');await page.keyboard.press('Tab');await page.locator('[data-select="sidereal"]').focus();await expect(page.locator('[data-select="sidereal"]')).toBeFocused();await expect(page.locator('.atlas-cursor')).not.toBeVisible();
});

test('blur and leave restore native cursor, reduced motion snaps, touch never enables the reticle',async({page,browser,baseURL})=>{
  await page.goto('/');await page.mouse.move(1100,700);await expect(page.locator('.atlas-cursor')).toBeVisible();
  await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await expect(page.locator('.atlas-cursor')).not.toBeVisible();await expect(page.locator('html')).not.toHaveClass(/cursor-active/);
  await page.mouse.move(1110,700);await expect(page.locator('.atlas-cursor')).toBeVisible();await page.locator('body').dispatchEvent('pointerout',{pointerType:'mouse',relatedTarget:null});await expect(page.locator('.atlas-cursor')).not.toBeVisible();
  await page.emulateMedia({reducedMotion:'reduce'});await page.mouse.move(1100,700);await page.mouse.move(1280,720);
  const reduced=await page.evaluate(()=>{const dot=document.querySelector('.cursor-core')!.getBoundingClientRect(),frame=document.querySelector('.cursor-frame')!.getBoundingClientRect();return{distance:Math.hypot(dot.x+dot.width/2-frame.x-frame.width/2,dot.y+dot.height/2-frame.y-frame.height/2),transition:getComputedStyle(document.querySelector('.cursor-frame')!).transitionDuration};});expect(reduced.distance).toBe(0);expect(reduced.transition).toBe('0s');
  await page.mouse.down();await expect(page.locator('.atlas-cursor')).not.toHaveClass(/is-pulsing/);await page.mouse.up();
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'no-preference'});
  try{await context.addInitScript(()=>sessionStorage.setItem('atlas-entry-seen','1'));const phone=await context.newPage();await phone.goto(baseURL!);await phone.locator('[data-select="sidereal"]').tap();await expect(phone).toHaveURL(/#atlas\/sidereal$/);await expect(phone.locator('.atlas-cursor')).not.toBeVisible();await expect(phone.locator('html')).not.toHaveClass(/cursor-active/);}finally{await context.close();}
});

test('a text drag released in another document restores the cursor without an original pointerup',async({page})=>{
  await page.goto('/');await page.evaluate(()=>{(window as unknown as Window&{interruptedUps:number}).interruptedUps=0;document.addEventListener('pointerup',()=>{(window as unknown as Window&{interruptedUps:number}).interruptedUps++;});});
  const b=(await page.locator('.hero-description').boundingBox())!;await page.mouse.move(b.x+3,b.y+10);await page.mouse.down();await page.mouse.move(b.x+b.width-5,b.y+12,{steps:8});
  expect(await page.evaluate(()=>getSelection()?.toString().length)).toBeGreaterThan(5);await expect(page.locator('html')).toHaveClass(/cursor-text/);
  const away=await page.context().newPage();
  try{
    await away.goto('about:blank');await away.bringToFront();const remote=await page.context().newCDPSession(away);await remote.send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',buttons:0,x:450,y:50});
    await page.bringToFront();const original=await page.context().newCDPSession(page);await original.send('Input.dispatchMouseEvent',{type:'mouseMoved',buttons:0,x:450,y:50});
    expect(await page.evaluate(()=>(window as unknown as Window&{interruptedUps:number}).interruptedUps)).toBe(0);await expect(page.locator('html')).not.toHaveClass(/cursor-text/);await expect(page.locator('.atlas-cursor')).toBeVisible();
    const dot=await page.locator('.cursor-core').evaluate(el=>{const b=el.getBoundingClientRect();return[b.x+b.width/2,b.y+b.height/2];});expect(dot).toEqual([450,50]);
  }finally{await away.close();await page.mouse.up();}
});

import {test,expect} from '@playwright/test';

// The separate entry suite tests first arrival. Existing navigation/motion
// regressions run after the one-time title sequence has been seen.
test.beforeEach(async({page})=>{await page.addInitScript(()=>{try{sessionStorage.setItem('atlas-entry-seen','1');}catch{/* denied-storage coverage uses the referrer fallback */}});});

test.use({reducedMotion:'no-preference'});
const ids=['sidereal','orbit','iter','ayqyn','forme','perch'];
const idle=async(page:import('@playwright/test').Page)=>expect(page.locator('.hero')).toHaveAttribute('data-camera','idle',{timeout:10000});

test('camera geometry and late card reveal survive interrupted selection in flat fallback',async({page})=>{
  await page.goto('/?flat');await page.evaluate(()=>document.fonts.ready);
  const name=await page.locator('h1').boundingBox();
  // Observe inside the browser: software GPU/IPC latency must not turn a 200ms
  // test-side sleep into a measurement taken after the whole 1080ms flight.
  const proof=await page.evaluate(()=>new Promise<{samples:{elapsed:number;zoom:number;opacity:number}[];retarget:{before:number;after:number;elapsed:number}}>(resolve=>{
    const hero=document.querySelector<HTMLElement>('.hero')!,aside=hero.querySelector<HTMLElement>('.project-preview')!;
    const started=performance.now(),samples:{elapsed:number;zoom:number;opacity:number}[]=[];let retarget={before:0,after:0,elapsed:0};
    const observer=new MutationObserver(()=>{
      if(hero.dataset.camera==='moving'&&hero.dataset.cameraTarget==='orbit'){
        const sample={elapsed:performance.now()-started,zoom:Number(hero.dataset.zoom),opacity:Number(getComputedStyle(aside).opacity)};samples.push(sample);
        if(sample.zoom>=1.1){const before=sample.zoom;hero.querySelector<HTMLElement>('[data-target="iter"]')!.click();retarget={before,after:Number(hero.dataset.zoom),elapsed:sample.elapsed};}
      }
      if(hero.dataset.camera==='idle'&&hero.dataset.cameraTarget==='iter'){observer.disconnect();resolve({samples,retarget});}
    });observer.observe(hero,{attributes:true,subtree:true,attributeFilter:['style','data-zoom','data-camera']});
    hero.querySelector<HTMLElement>('[data-select="orbit"]')!.click();
  }));
  const early=proof.samples.filter(sample=>sample.elapsed<800);expect(early.length).toBeGreaterThan(0);expect(early.every(sample=>sample.opacity===0)).toBe(true);
  expect(proof.retarget.before).toBeGreaterThanOrEqual(1.1);expect(proof.retarget.before).toBeLessThan(1.8);expect(Math.abs(proof.retarget.after-proof.retarget.before)).toBeLessThan(.01);
  await idle(page);expect(Number(await page.locator('.hero').getAttribute('data-zoom'))).toBeGreaterThan(1.7);
  await expect(page.locator('.project-preview h2')).toHaveText('ITER');await expect(page.locator('.project-preview')).not.toHaveAttribute('inert');
  await page.keyboard.press('Escape');await idle(page);expect(Number(await page.locator('.hero').getAttribute('data-zoom'))).toBe(1);
  expect(await page.locator('h1').boundingBox()).toEqual(name);await expect(page.locator('[data-select="iter"]')).toBeFocused();
});

for(const width of [360,390,768,1440])test(`all six camera targets fit at ${width}px in RU EN KK`,async({page})=>{
  test.setTimeout(90000);await page.setViewportSize({width,height:width<600?900:1024});
  for(const locale of ['ru','en','kk']){
    await page.goto((locale==='ru'?'/':`/${locale}/`)+'#atlas/sidereal');await idle(page);
    for(const id of ids){await page.locator(`[data-target="${id}"]`).click();await idle(page);
      const bounds=await page.locator(`[data-select="${id}"]`).evaluate(el=>{
        const svg=el.querySelector('svg')!,b=svg.getBBox(),m=svg.getScreenCTM()!,a=svg.createSVGPoint();a.x=b.x;a.y=b.y;const p=a.matrixTransform(m);a.x=b.x+b.width;a.y=b.y+b.height;const q=a.matrixTransform(m);const label=el.querySelector('.constellation-label')!.getBoundingClientRect();
        return{left:Math.min(p.x,label.left),right:Math.max(q.x,label.right),top:Math.min(p.y,label.top),bottom:Math.max(q.y,label.bottom)};
      });expect(bounds.left).toBeGreaterThanOrEqual(-1);expect(bounds.right).toBeLessThanOrEqual(width+1);expect(bounds.top).toBeGreaterThanOrEqual(65);expect(bounds.bottom).toBeLessThanOrEqual(width<600?650:1024);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      await expect(page.locator('.project-preview h2')).toHaveText(id.toUpperCase());
    }
    await page.locator('.atlas-all').click();await expect(page).toHaveURL(/#catalog$/);
  }
});

test('meteors have a pointed fading tail, first cue and a sparse second cue; pause cancels them',async({page})=>{
  await page.goto('/');await page.evaluate(()=>document.fonts.ready);
  await page.waitForSelector('.meteor',{timeout:6000});
  const first=await page.locator('.meteor').evaluate(el=>({time:performance.now(),angle:el.style.getPropertyValue('--angle'),dx:el.style.getPropertyValue('--dx'),duration:el.style.getPropertyValue('--duration'),tail:!!el.querySelector('.meteor-tail'),head:!!el.querySelector('.meteor-head')}));
  expect(first.tail&&first.head).toBe(true);expect(parseFloat(first.dx)).toBeLessThan(0);expect(parseFloat(first.angle)).toBeGreaterThan(90);expect(parseFloat(first.duration)).toBeLessThan(1200);
  await expect(page.locator('.meteor')).toHaveCount(0,{timeout:2000});
  await expect(page.locator('.hero')).toHaveAttribute('data-meteors','2',{timeout:15000});
  const second=await page.evaluate(()=>performance.now());expect(second-first.time).toBeGreaterThanOrEqual(6900);expect(second-first.time).toBeLessThan(15500);
  await page.locator('.motion').click();await expect(page.locator('.meteor')).toHaveCount(0);await page.waitForTimeout(1800);await expect(page.locator('.hero')).toHaveAttribute('data-meteors','2');
});

test('pausing during flight finishes accessibly; reduced motion preserves scroll',async({page})=>{
  await page.goto('/');await page.locator('[data-select="orbit"]').click();await page.waitForTimeout(100);await page.locator('.motion').click();await idle(page);await expect(page.locator('.project-preview')).not.toHaveAttribute('inert');
  await page.locator('[data-target="forme"]').click();await idle(page);await expect(page.locator('.project-preview h2')).toHaveText('FORME');
  await page.evaluate(()=>scrollTo(0,120));const scroll=await page.evaluate(()=>scrollY);await page.keyboard.press('Escape');await idle(page);expect(await page.evaluate(()=>scrollY)).toBe(scroll);
  await page.emulateMedia({reducedMotion:'reduce'});await page.locator('[data-select="sidereal"]').focus();await page.keyboard.press('Enter');await idle(page);await expect(page.locator('.motion')).toBeDisabled();await expect(page.locator('.meteor')).toHaveCount(0);
});

test('browser uses packaged Onest for every Kazakh letter and Manrope for the name',async({page})=>{
  await page.goto('/kk/');await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(()=>{const p=document.createElement('p');p.id='kazakh-proof';p.textContent='Ә Ғ Қ Ң Ө Ұ Ү Һ І — ә ғ қ ң ө ұ ү һ і';document.body.append(p);});
  const cdp=await page.context().newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');const documentNode=await cdp.send('DOM.getDocument');
  for(const [selector,family]of [['#kazakh-proof','Onest'],['h1','Manrope']]){
    const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:documentNode.root.nodeId,selector});const {fonts}=await cdp.send('CSS.getPlatformFontsForNode',{nodeId});
    expect(fonts.length).toBeGreaterThan(0);
    if(family==='Onest')expect(fonts.every(font=>font.familyName.includes(family)&&font.isCustomFont),JSON.stringify(fonts)).toBe(true);
    else{expect(fonts.some(font=>font.familyName.includes(family)&&font.isCustomFont&&font.glyphCount>=14),JSON.stringify(fonts)).toBe(true);expect(fonts.filter(font=>!font.familyName.includes(family)).every(font=>font.glyphCount<=1),JSON.stringify(fonts)).toBe(true);}
  }await cdp.detach();
});

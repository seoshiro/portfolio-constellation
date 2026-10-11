import {test,expect,type Page} from '@playwright/test';
test.use({reducedMotion:'no-preference'});
test.beforeEach(async({page})=>{await page.addInitScript(()=>sessionStorage.setItem('atlas-entry-seen','1'));});
const points=async(page:Page)=>page.evaluate(()=>{const core=document.querySelector('.cursor-core')!.getBoundingClientRect(),ring=document.querySelector('.cursor-ring')!.getBoundingClientRect();return{core:[core.x+core.width/2,core.y+core.height/2],ring:[ring.x+ring.width/2,ring.y+ring.height/2]};});

test('cursor stays native during first entry and becomes precise with bounded ring lag',async({page})=>{
  await page.addInitScript(()=>sessionStorage.removeItem('atlas-entry-seen'));await page.goto('/');
  await page.mouse.move(1300,800);await expect(page.locator('html')).not.toHaveClass(/cursor-active/);await expect(page.locator('.atlas-cursor')).not.toBeVisible();
  await page.locator('.entry-skip').click();await expect(page.locator('html')).not.toHaveClass(/intro-pending/);
  await page.mouse.move(1250,500);await expect(page.locator('.atlas-cursor')).toBeVisible();await page.mouse.move(1100,450);
  const now=await points(page);expect(now.core[0]).toBe(1100);expect(now.core[1]).toBe(450);
  await expect.poll(async()=>{const p=await points(page);return Math.abs(p.ring[0]-1100)+Math.abs(p.ring[1]-450);}).toBeLessThan(.2);
  await page.mouse.move(8,8);await expect(page.locator('.cursor-core')).toBeVisible();const edge=await points(page);expect(edge.core).toEqual([8,8]);
});

test('text drag keeps native selection, click has one finite impulse, keyboard hides cursor',async({page})=>{
  await page.goto('/');await page.locator('.hero-description').hover();await expect(page.locator('html')).toHaveClass(/cursor-text/);await expect(page.locator('.atlas-cursor')).not.toBeVisible();
  const b=await page.locator('.hero-description').boundingBox();await page.mouse.move(b!.x+3,b!.y+10);await page.mouse.down();await page.mouse.move(b!.x+b!.width-5,b!.y+12,{steps:8});await page.mouse.up();expect(await page.evaluate(()=>getSelection()?.toString().length)).toBeGreaterThan(5);
  await page.mouse.move(1250,500);await page.mouse.down();await expect(page.locator('.atlas-cursor')).toHaveClass(/is-down/);await page.mouse.up();await page.waitForTimeout(500);expect(await page.locator('.cursor-impulse').evaluate(el=>+getComputedStyle(el).opacity)).toBe(0);
  await page.keyboard.press('Tab');await expect(page.locator('.atlas-cursor')).not.toBeVisible();
});

test('every hover card uses real imagery, stays within viewport and avoids neighbouring constellations',async({page})=>{
  for(const width of [1440,768]){await page.setViewportSize({width,height:1000});await page.goto('/');
  for(const id of ['sidereal','orbit','iter','ayqyn','forme','perch']){
    const link=page.locator(`[data-select="${id}"]`);await link.hover();const tip=page.locator('.observatory-preview');await expect(tip).toBeVisible();await expect(tip).toHaveAttribute('data-project',id);await expect(tip.locator('img')).toHaveAttribute('src',`/assets/${id}.webp`);
    const proof=await tip.evaluate(el=>{const b=el.getBoundingClientRect();return{inside:b.left>=0&&b.top>=0&&b.right<=innerWidth&&b.bottom<=innerHeight,hits:Array.from(document.querySelectorAll<HTMLElement>('.constellation,.atlas-footer,.cursor-caption')).filter(l=>getComputedStyle(l).visibility!=='hidden'&&getComputedStyle(l).display!=='none').filter(l=>{const a=l.getBoundingClientRect();return b.left<a.right&&b.right>a.left&&b.top<a.bottom&&b.bottom>a.top;}).length};});
    expect(proof).toEqual({inside:true,hits:0});await page.waitForTimeout(460);expect(await link.locator('.light-pulse').evaluate(el=>+getComputedStyle(el).opacity)).toBe(0);
  }}
  await page.mouse.move(8,8);await expect(page.locator('.observatory-preview')).not.toBeVisible();
  await page.keyboard.press('Tab');await page.locator('[data-select="iter"]').focus();await expect(page.locator('.observatory-preview')).toHaveAttribute('data-project','iter');await page.keyboard.press('Escape');await expect(page.locator('.observatory-preview')).not.toBeVisible();
});

test('rapid hover and project switches never accumulate cards and touch restores native cursor',async({page})=>{
  await page.goto('/');await page.evaluate(()=>document.fonts.ready);await expect(page.locator('.hero')).toHaveAttribute('data-camera','idle');await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  // Locator.hover can issue its own scroll-to-center during each movement.
  // This scenario isolates a genuine rapid mouse burst; scroll dismissal is
  // verified separately. The final hit-test proves the mouse stayed on ITER.
  const centers=await Promise.all(['orbit','iter'].map(async id=>{const b=(await page.locator(`[data-select="${id}"]`).boundingBox())!;return{x:b.x+b.width/2,y:b.y+b.height/2};}));
  for(let i=0;i<12;i++)await page.mouse.move(centers[i%2].x,centers[i%2].y);
  expect(await page.evaluate(({x,y})=>document.elementFromPoint(x,y)?.closest('.constellation')?.getAttribute('data-select'),centers[1])).toBe('iter');
  await expect(page.locator('.observatory-preview')).toHaveCount(1);await expect(page.locator('.constellation.observing')).toHaveCount(1);await expect(page.locator('.constellation.observing')).toHaveAttribute('data-select','iter');await expect(page.locator('.observatory-preview')).toBeVisible();await expect(page.locator('.observatory-preview')).toHaveAttribute('data-project','iter');
  await page.locator('[data-select="orbit"]').click();await expect(page.locator('.observatory-preview')).not.toBeVisible();await page.locator('[data-target="iter"]').click();await expect(page).toHaveURL(/#atlas\/iter$/);
  await expect(page.locator('.hero')).toHaveAttribute('data-camera','idle');
  await page.keyboard.press('Escape');await expect(page.locator('.hero')).toHaveClass(/camera-flight/);await page.keyboard.press('Tab');await page.locator('[data-select="sidereal"]').focus();await expect(page.locator('.observatory-preview')).toBeVisible();await expect(page.locator('.observatory-preview')).toHaveAttribute('data-project','sidereal');
  await page.locator('[data-select="sidereal"]').dispatchEvent('pointerdown',{pointerType:'touch',clientX:500,clientY:200});await expect(page.locator('.observatory-preview')).not.toBeVisible();await expect(page.locator('html')).not.toHaveClass(/cursor-active/);
});

test('cursor captions and card actions are localized in RU EN KK',async({page})=>{
  for(const [locale,explore,open]of [['ru','Исследовать','Открыть'],['en','Explore','Open'],['kk','Зерттеу','Ашу']]){
    await page.goto(`/${locale==='ru'?'':locale+'/'}?lang=${locale}`);await page.locator('[data-select="sidereal"]').hover();await expect(page.locator('.cursor-caption')).toHaveText(explore);await page.locator('[data-select="sidereal"]').click();await expect(page.locator('.project-preview')).toBeVisible();await page.waitForTimeout(1500);await page.locator('.preview-image').hover();await expect(page.locator('.cursor-caption')).toHaveText(open);
  }
});

test('catalogue shares all six map geometries and SIDEREAL occupies the wide lead row',async({page})=>{
  await page.goto('/#catalog');await expect(page.locator('.catalog-constellation')).toHaveCount(6);
  for(const id of ['sidereal','orbit','iter','ayqyn','forme','perch']){const attrs=async(selector:string)=>page.locator(selector+' line').evaluateAll(lines=>lines.map(l=>['x1','y1','x2','y2'].map(a=>l.getAttribute(a))));expect(await attrs(`[data-constellation="${id}"]`)).toEqual(await attrs(`[data-select="${id}"] .connections`));}
  const featured=await page.locator('.project-featured').boundingBox(),grid=await page.locator('.project-grid').boundingBox();expect(featured!.width).toBeCloseTo(grid!.width,0);await expect(page.locator('.project-featured h3')).toHaveText('SIDEREAL');
});

test('contact contour reveals, mouse reaction is subtle, motion pause leaves static stars',async({page})=>{
  await page.goto('/#contact');await expect(page.locator('.contact')).toHaveClass(/contact-revealed/);await page.waitForTimeout(850);expect(await page.locator('.contact-star path').evaluate(el=>parseFloat(getComputedStyle(el).strokeDashoffset))).toBe(0);
  const b=await page.locator('.contact').boundingBox();await page.mouse.move(b!.x+b!.width-15,b!.y+15);await page.waitForTimeout(500);
  const values=await page.locator('.contact-star').evaluate(el=>['--star-x','--star-y','--star-turn'].map(v=>parseFloat((el as HTMLElement).style.getPropertyValue(v))));expect(Math.abs(values[0])).toBeLessThanOrEqual(4);expect(Math.abs(values[1])).toBeLessThanOrEqual(4);expect(Math.abs(values[2])).toBeLessThanOrEqual(4.5);expect(Math.abs(values[0])).toBeGreaterThan(1);
  await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('.contact-star')).toHaveCSS('transform','none');await page.mouse.move(8,8);await expect.poll(async()=>{const p=await points(page);return Math.abs(p.core[0]-p.ring[0])+Math.abs(p.core[1]-p.ring[1]);}).toBe(0);await page.mouse.down();await expect(page.locator('.atlas-cursor')).not.toHaveClass(/is-pulsing/);await page.mouse.up();
});

test('two approved demos load only on hover, reset to poster on leave and stop on scroll',async({page})=>{
  const requests:string[]=[];page.on('request',r=>{if(r.url().endsWith('-demo.webm'))requests.push(r.url());});await page.goto('/#catalog');expect(requests).toEqual([]);await expect(page.locator('video.project-video')).toHaveCount(2);
  for(const id of ['sidereal','orbit']){const link=page.locator(`.project-visual:has(video[data-src="/assets/${id}-demo.webm"])`),video=link.locator('video');await link.scrollIntoViewIfNeeded();await page.waitForTimeout(150);await link.hover();await expect(link).toHaveClass(/demo-playing/);await expect.poll(()=>video.evaluate(v=>(v as HTMLVideoElement).currentTime)).toBeGreaterThan(.1);await page.mouse.move(4,4);await expect(link).not.toHaveClass(/demo-playing/);expect(await video.evaluate(v=>(v as HTMLVideoElement).paused)).toBe(true);expect(await video.evaluate(v=>(v as HTMLVideoElement).currentTime)).toBe(0);}
  expect(requests.length).toBe(2);const lead=page.locator('.project-featured .project-visual');await lead.scrollIntoViewIfNeeded();await page.waitForTimeout(150);await lead.hover();await expect(lead).toHaveClass(/demo-playing/);await page.keyboard.press('Shift');await page.waitForTimeout(350);await expect(lead).not.toHaveClass(/demo-playing/);expect(await lead.locator('video').evaluate(v=>(v as HTMLVideoElement).paused)).toBe(true);
  const b=await lead.boundingBox();await page.mouse.move(b!.x+b!.width/2+8,b!.y+b!.height/2);await expect(lead).toHaveClass(/demo-playing/);await page.mouse.wheel(0,1);await page.waitForTimeout(350);await expect(lead).not.toHaveClass(/demo-playing/);
});

test('rapid reentry while a demo is pending survives stale play completion; reduced motion downloads none',async({page})=>{
  await page.route('**/assets/sidereal-demo.webm',async route=>{await new Promise(resolve=>setTimeout(resolve,350));await route.continue();});await page.goto('/#catalog');const lead=page.locator('.project-featured .project-visual');await lead.scrollIntoViewIfNeeded();await page.waitForTimeout(150);await lead.hover();await page.mouse.move(4,4);await lead.hover();await expect(lead).toHaveClass(/demo-playing/);await expect.poll(()=>lead.locator('video').evaluate(v=>(v as HTMLVideoElement).currentTime)).toBeGreaterThan(.2);
  await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('html')).toHaveClass(/reduced/);await expect(lead).not.toHaveClass(/demo-playing/);await page.reload();await lead.hover();expect(await lead.locator('video').getAttribute('src')).toBeNull();await page.keyboard.press('Tab');await expect(page.locator('.atlas-cursor')).not.toBeVisible();
});

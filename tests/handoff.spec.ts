import {test,expect,chromium,type Page} from '@playwright/test';

test.use({reducedMotion:'no-preference'});
interface Sample{time:number;stars:number[];lines:number[];width:number;sceneWidth:number;nameX:number;nameY:number;nameWidth:number;nameHeight:number;scrollY:number}
interface Proof{samples:Sample[];done:boolean}

async function observe(page:Page,classicScrollbar=false){
  await page.addInitScript(classic=>{
    const proof:Proof={samples:[],done:false};
    (window as unknown as Window&{handoffProof:Proof}).handoffProof=proof;
    if(classic)document.addEventListener('DOMContentLoaded',()=>{
      // Playwright normally hides scrollbars. A real 17px scrollbar makes the
      // overflow:hidden -> scrolling handoff exercise Windows-style layout.
      const style=document.createElement('style');style.textContent='html::-webkit-scrollbar{width:17px}';document.head.append(style);
    },{once:true});
    function sample(){
      const root=document.documentElement,state=window.__atlasEntry,content=document.querySelector('#site-content');
      const overlay=document.querySelector('.entry-intro'),name=document.querySelector('.hero-intro h1');
      if(content&&overlay&&name&&getComputedStyle(content).visibility==='visible'&&(!root.classList.contains('intro-pending')||+getComputedStyle(overlay).opacity<.98)){
        const box=name.getBoundingClientRect();
        proof.samples.push({time:performance.now(),stars:Array.from(document.querySelectorAll('.constellation .stars'),el=>+getComputedStyle(el).opacity),lines:Array.from(document.querySelectorAll('.constellation .connections'),el=>+getComputedStyle(el.firstElementChild!).opacity),width:root.clientWidth,sceneWidth:document.querySelector('.hero')!.getBoundingClientRect().width,nameX:box.x,nameY:box.y,nameWidth:box.width,nameHeight:box.height,scrollY});
      }
      if(state?.opened&&performance.now()-state.opened>1450)proof.done=true;
      else requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  },classicScrollbar);
}

async function stable(page:Page){
  await page.waitForFunction(()=>(window as unknown as Window&{handoffProof:Proof}).handoffProof.done);
  const proof=await page.evaluate(()=>(window as unknown as Window&{handoffProof:Proof}).handoffProof);
  expect(proof.samples.length).toBeGreaterThan(15);
  // Once a star or line is visible, it must not disappear and draw a second
  // time when the temporary overlay finishes. This fails on the old release.
  for(let i=1;i<proof.samples.length;i++)for(const key of ['stars','lines']as const){
    const before=proof.samples[i-1][key],after=proof.samples[i][key];
    for(let n=0;n<before.length;n++)expect(after[n],`${key}[${n}] at ${proof.samples[i].time}`).toBeGreaterThanOrEqual(before[n]-.025);
  }
  // clientWidth changes when a real scrollbar becomes visible even if its
  // space was already reserved. Actual scene geometry is the visual contract.
  expect(new Set(proof.samples.map(row=>row.sceneWidth)).size).toBe(1);
  const first=proof.samples[0];
  for(const row of proof.samples){for(const key of ['nameX','nameY','nameWidth','nameHeight']as const)expect(row[key],key).toBeCloseTo(first[key],1);expect(row.scrollY).toBe(first.scrollY);}
  await expect(page.locator('#site-content')).not.toHaveAttribute('inert');
  await expect(page.locator('#main')).toBeFocused();
}

for(const width of [1440,390])for(const completion of ['timed','skipped'])test(`${width}px ${completion} intro reveals stars once without a visible reset`,async({page})=>{
  await page.setViewportSize({width,height:width===390?844:1000});await observe(page);
  await page.goto('/',{waitUntil:'domcontentloaded'});
  if(completion==='skipped')await page.locator('.entry-skip').click();
  await stable(page);
});

test('a classic scrollbar preserves the same scene width through timed and skipped entry',async({baseURL})=>{
  const browser=await chromium.launch({ignoreDefaultArgs:['--hide-scrollbars'],...(process.platform==='win32'?{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}:{})});
  try{
    for(const completion of ['timed','skipped']){
      const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
      try{
        const page=await context.newPage();await observe(page,true);await page.goto(baseURL!,{waitUntil:'domcontentloaded'});
        if(completion==='skipped')await page.locator('.entry-skip').click();
        await stable(page);
        expect(await page.evaluate(()=>innerWidth-document.documentElement.clientWidth)).toBe(17);
      }finally{await context.close();}
    }
  }finally{await browser.close();}
});

test('a fresh intro with warm fonts remains stable and the next reload does not replay it',async({page})=>{
  await observe(page);await page.goto('/',{waitUntil:'domcontentloaded'});await page.locator('.entry-skip').click();await stable(page);
  await page.evaluate(()=>sessionStorage.removeItem('atlas-entry-seen'));await page.reload({waitUntil:'domcontentloaded'});await stable(page);
  expect(await page.evaluate(()=>document.fonts.check('525 100px Manrope')&&document.fonts.check('400 16px Onest'))).toBe(true);
  await page.reload();await expect(page.locator('.entry-intro')).not.toBeVisible();expect(await page.evaluate(()=>window.__atlasEntry)).toBeUndefined();
});

for(const width of [360,390])test(`${width}px cold Manrope keeps every name glyph fixed after early Skip`,async({page})=>{
  await page.setViewportSize({width,height:844});await observe(page);
  let release!:()=>void,requested=false,received=false;
  const gate=new Promise<void>(resolve=>{release=resolve;});
  await page.route('**/fonts/Manrope/Manrope.woff2',async route=>{requested=true;await gate;await route.continue();});
  page.on('response',response=>{if(response.url().endsWith('/fonts/Manrope/Manrope.woff2'))received=true;});
  await page.addInitScript(()=>{
    type Glyphs={character:string;x:number;y:number;width:number;height:number}[];
    const proof:{samples:Glyphs[];done:boolean;fullLoaded:boolean}={samples:[],done:false,fullLoaded:false};
    (window as unknown as Window&{coldNameProof:typeof proof}).coldNameProof=proof;
    function sample(){
      const h=document.querySelector('.hero-intro h1'),content=document.querySelector('#site-content'),state=window.__atlasEntry;
      if(h&&content&&state?.opened&&getComputedStyle(content).visibility==='visible'){
        const glyphs:Glyphs=[];
        for(const node of h.childNodes)if(node.nodeType===Node.TEXT_NODE)for(let i=0;i<node.textContent!.length;i++){
          const range=document.createRange();range.setStart(node,i);range.setEnd(node,i+1);const box=range.getBoundingClientRect();
          glyphs.push({character:node.textContent![i],x:box.x,y:box.y,width:box.width,height:box.height});
        }
        proof.samples.push(glyphs);
      }
      if(state?.opened&&performance.now()-state.opened>1450)proof.done=true;else requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  });
  try{
    await page.goto('/',{waitUntil:'domcontentloaded'});
    // Start the existing full CSS face while its network request is held.
    // No font-ready wait may precede Skip or the first visible measurement.
    await page.evaluate(()=>{void document.fonts.load('525 54px Manrope','Beibars Ileskhan').then(()=>{(window as unknown as Window&{coldNameProof:{fullLoaded:boolean}}).coldNameProof.fullLoaded=true;});});
    expect(requested).toBe(true);expect(received).toBe(false);
    await page.locator('.entry-skip').click();
    await page.waitForFunction(()=>(window as unknown as Window&{coldNameProof:{samples:unknown[]}}).coldNameProof.samples.length>=6);
    expect(received).toBe(false);release();
    await page.waitForFunction(()=>(window as unknown as Window&{coldNameProof:{fullLoaded:boolean}}).coldNameProof.fullLoaded);
    expect(received).toBe(true);await stable(page);
    await page.waitForFunction(()=>(window as unknown as Window&{coldNameProof:{done:boolean}}).coldNameProof.done);
    const samples=await page.evaluate(()=>(window as unknown as Window&{coldNameProof:{samples:{character:string;x:number;y:number;width:number;height:number}[][]}}).coldNameProof.samples);
    expect(samples.length).toBeGreaterThan(15);expect(samples[0].map(glyph=>glyph.character).join('')).toBe('BeibarsIleskhan');
    expect(samples.every(sample=>sample.length===samples[0].length)).toBe(true);
    let maximumDeviation=0,worst='';
    for(const sample of samples)for(let i=0;i<sample.length;i++)for(const key of ['x','y','width','height']as const){
      const deviation=Math.abs(sample[i][key]-samples[0][i][key]);
      if(deviation>maximumDeviation){maximumDeviation=deviation;worst=`glyph ${i} ${key}`;}
    }
    // The same <.05px bound as precision-1 toBeCloseTo, applied to every
    // sample/glyph/axis without thousands of redundant reporter steps.
    expect(maximumDeviation,worst).toBeLessThan(.05);
  }finally{release();}
});

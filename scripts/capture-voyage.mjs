import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const phase=process.argv[2]||'final';await mkdir(`evidence/${phase}`,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report=[];
try{for(const width of [320,360,390,768,1440]){
 const page=await browser.newPage({viewport:{width,height:width>1000?1000:844},reducedMotion:'no-preference'});await page.addInitScript(()=>sessionStorage.setItem('atlas-entry-seen','1'));const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:5318/',{waitUntil:'networkidle'});await page.waitForTimeout(1100);await page.screenshot({path:`evidence/${phase}/hero-${width}.png`});if(width<400)await page.locator('.hero').screenshot({path:`evidence/${phase}/hero-full-${width}.png`});
 if(await page.locator('#signal-route').count()){
  for(const p of width===1440?[0,.33,.66,1]:[.5]){await page.locator('#signal-route').evaluate((el,p)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top+(el.getBoundingClientRect().height-window.innerHeight)*p,behavior:'instant'}),p);await page.waitForTimeout(750);await page.screenshot({path:`evidence/${phase}/route-${width}-${p}.png`});}
  if(width<901)await page.locator('#signal-route').screenshot({path:`evidence/${phase}/route-full-${width}.png`});
  await page.locator('#signal-archive').evaluate(el=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-70,behavior:'instant'}));await page.waitForTimeout(750);await page.screenshot({path:`evidence/${phase}/receiver-${width}.png`});if(width<400)await page.locator('#signal-archive').screenshot({path:`evidence/${phase}/receiver-full-${width}.png`});
 }
 await page.locator('#catalog').evaluate(el=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-70,behavior:'instant'}));await page.waitForTimeout(800);await page.screenshot({path:`evidence/${phase}/catalog-${width}.png`});report.push({width,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),errors});await page.close();
}await writeFile(`evidence/${phase}/capture.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report));}finally{await browser.close();}

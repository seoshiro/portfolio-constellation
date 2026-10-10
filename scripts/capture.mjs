import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import sharp from 'sharp';
const origin=process.env.CAPTURE_URL||'http://127.0.0.1:5318';
await mkdir('evidence/screenshots',{recursive:true});
const browser=await chromium.launch(process.platform==='win32'?{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}:{});
const report=[];
try{for(const [width,height]of[[360,900],[390,844],[768,1024],[1440,1000],[1920,1080]]){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});const errors=[];page.on('pageerror',error=>errors.push(error.message));
  for(const [name,path,fullPage]of[['hero','/',false],['selected','/#atlas/sidereal',false],['case','/projects/sidereal.html',true],['catalog','/#catalog',false],['about','/#about',false],['contact','/#contact',false]]){
    await page.goto(origin+path,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);if(path.includes('#')&&!path.includes('#atlas'))await page.locator(path.slice(path.indexOf('#'))).scrollIntoViewIfNeeded();
    if(fullPage){await page.locator('img').evaluateAll(imgs=>imgs.forEach(img=>img.loading='eager'));await page.evaluate(()=>Promise.all(Array.from(document.images).map(img=>img.decode().catch(()=>{}))));}
    const file=`evidence/screenshots/${name}-${width}.png`;await page.screenshot({path:file,fullPage});report.push({file,url:page.url(),width,height,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),errors:[...errors]});
    if(width===1440&&name==='hero'&&origin.includes('127.0.0.1'))await sharp(file).resize(1200,630,{fit:'cover'}).webp({quality:88}).toFile('public/assets/social.webp');
  }await page.close();
}await writeFile('evidence/capture.json',JSON.stringify(report,null,2));console.log(JSON.stringify({screenshots:report.length,errors:report.filter(r=>r.overflow||r.errors.length)},null,2));}finally{await browser.close();}

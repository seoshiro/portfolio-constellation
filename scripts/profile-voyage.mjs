import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000}});
await mkdir('evidence/final',{recursive:true});
try{await page.addInitScript(()=>sessionStorage.setItem('atlas-entry-seen','1'));await page.goto('http://127.0.0.1:5318/',{waitUntil:'networkidle'});await page.locator('#signal-route').scrollIntoViewIfNeeded();
 const result=await page.evaluate(()=>new Promise(resolve=>{const intervals=[],longTasks=[];let last=0,start=0;const observer=new window.PerformanceObserver(list=>longTasks.push(...list.getEntries().map(e=>e.duration)));observer.observe({type:'longtask'});
 function step(time){if(!start)start=time;if(last)intervals.push(time-last);last=time;const dt=time-start;window.scrollBy(0,Math.sin(dt/240)*38);if(dt<4000)window.requestAnimationFrame(step);else{observer.disconnect();intervals.sort((a,b)=>a-b);resolve({workload:'4s oscillating native scroll during pinned route; desktop Chrome headless, no screencast',frames:intervals.length,medianMs:intervals[Math.floor(intervals.length*.5)],p95Ms:intervals[Math.floor(intervals.length*.95)],longTasks,canvasPixels:[...document.querySelectorAll('.voyage-canvas')].map(c=>c.width*c.height)});}}window.requestAnimationFrame(step);
 }));await writeFile('evidence/final/performance.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));}finally{await browser.close();}

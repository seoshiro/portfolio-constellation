import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
await mkdir('evidence/reference',{recursive:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('https://datathon.com.kz/ru',{waitUntil:'networkidle',timeout:60000});
 await page.screenshot({path:'evidence/reference/01-arrival.png'});
 console.log(JSON.stringify(await page.locator('button').allTextContents()));
 const choices=page.getByRole('button',{name:/без звука|продолжить|начать|войти в мир/i});if(await choices.count())await choices.first().click();
 await page.waitForTimeout(4500);
 await page.screenshot({path:'evidence/reference/02-hero.png'});
 const steps=[];const height=await page.evaluate(()=>document.documentElement.scrollHeight);
 for(let y=650;y<height;y+=1100){await page.mouse.wheel(0,1100);await page.waitForTimeout(650);const state=await page.evaluate(()=>({y:window.scrollY,heading:[...document.querySelectorAll('h2')].filter(e=>{const r=e.getBoundingClientRect();return r.top<window.innerHeight&&r.bottom>0}).map(e=>e.textContent)}));steps.push(state);await page.screenshot({path:`evidence/reference/scroll-${Math.round(state.y)}.png`});}
 const faq=page.getByRole('button',{name:'Кому можно?',exact:true});if(await faq.count()){try{await faq.last().scrollIntoViewIfNeeded();await faq.last().click({timeout:2500});}catch(e){steps.push({interaction:'book',limitation:e.message.slice(0,300)});}await page.screenshot({path:'evidence/reference/book-interaction.png'});}
 await page.mouse.wheel(0,-4000);await page.waitForTimeout(800);await page.screenshot({path:'evidence/reference/reverse.png'});
 await writeFile('evidence/reference/observed.json',JSON.stringify({height,steps,errors,buttons:await page.locator('button').allTextContents(),scripts:await page.locator('script[src]').evaluateAll(es=>es.map(e=>e.src))},null,2));
 console.log(JSON.stringify({height,steps,errors}));
}finally{await browser.close();}

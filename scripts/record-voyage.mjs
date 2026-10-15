import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import {Buffer} from 'node:buffer';
import {observeAudio,audioState} from '../tests/audio-probe.ts';
await mkdir('evidence/final',{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'no-preference'});
await page.addInitScript(()=>sessionStorage.setItem('atlas-entry-seen','1'));await observeAudio(page);
const cdp=await page.context().newCDPSession(page);let pending=false,frames=0;const levels=[];
try{
 await page.goto('http://127.0.0.1:5318/',{waitUntil:'networkidle'});await page.locator('[data-sound-opt]').click();await page.waitForTimeout(1800);
 const initial=await audioState(page);if(initial.state!=='running'||!initial.loops)throw new Error('Actual master audio did not start');
 await page.evaluate(()=>{
  const canvas=document.createElement('canvas');canvas.width=1280;canvas.height=900;const ctx=canvas.getContext('2d');
  const stream=canvas.captureStream(24);for(const track of window.__audio.stream.getAudioTracks())stream.addTrack(track);
  const mime=window.MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')?'video/webm;codecs=vp9,opus':'video/webm';
  const recorder=new window.MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:1800000}),chunks=[];recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};window.__recording={canvas,ctx,recorder,chunks,mime};recorder.start(250);
 });
 cdp.on('Page.screencastFrame',async event=>{
  await cdp.send('Page.screencastFrameAck',{sessionId:event.sessionId});if(pending)return;pending=true;
  try{await page.evaluate(async data=>{const bytes=Uint8Array.from(window.atob(data),c=>c.charCodeAt(0)),bitmap=await window.createImageBitmap(new window.Blob([bytes],{type:'image/jpeg'}));const r=window.__recording;r.ctx.drawImage(bitmap,0,0,r.canvas.width,r.canvas.height);bitmap.close();},event.data);frames++;}catch{/* A navigation or final stop may discard the last frame. */}finally{pending=false;}
 });
 await cdp.send('Page.startScreencast',{format:'jpeg',quality:80,maxWidth:1280,maxHeight:900,everyNthFrame:2});
 await page.waitForTimeout(1200);await page.locator('.voyage-link').click();await page.waitForTimeout(1000);
 await page.locator('#signal-route').evaluate(el=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top,behavior:'instant'}));
 for(let i=0;i<26;i++){await page.mouse.wheel(0,47);await page.waitForTimeout(110);if(i%5===0)levels.push(await audioState(page));}
 for(let i=0;i<10;i++){await page.mouse.wheel(0,-55);await page.waitForTimeout(100);}
 for(const id of ['tone','path','form']){await page.locator(`[data-fragment="${id}"]`).click();await page.waitForTimeout(450);}
 await page.locator('#signal-archive').evaluate(el=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-70,behavior:'smooth'}));await page.waitForTimeout(1300);await page.locator('[data-activate]').click();await page.waitForTimeout(2000);await page.screenshot({path:'evidence/final/receiver-activated-1280.png'});
 await page.locator('.sound-controls summary').click();await page.locator('.sound-toggle').click();await page.waitForTimeout(750);await page.locator('.sound-toggle').click();await page.waitForTimeout(900);
 await cdp.send('Page.stopScreencast');
 const video=await page.evaluate(()=>new Promise(resolve=>{const r=window.__recording;r.recorder.onstop=async()=>{const blob=new window.Blob(r.chunks,{type:r.mime});resolve({bytes:Array.from(new Uint8Array(await blob.arrayBuffer())),type:r.mime,videoTracks:r.recorder.stream.getVideoTracks().length,audioTracks:r.recorder.stream.getAudioTracks().length});};r.recorder.stop();}));
 await writeFile('evidence/final/signal-journey-with-audio.webm',Buffer.from(video.bytes));
 const metadata={frames,bytes:video.bytes.length,mime:video.type,videoTracks:video.videoTracks,audioTracks:video.audioTracks,source:'Chrome CDP screen frames composited at 24fps + actual post-master Web Audio track. No synthetic replacement soundtrack.',levels:levels.map(s=>({rms:s.rms,windGain:s.windGain,musicGain:s.musicGain,contexts:s.contexts,loops:s.loops})),auditoryAssessment:'NOT TESTED'};
 await writeFile('evidence/final/recording.json',JSON.stringify(metadata,null,2));console.log(JSON.stringify(metadata));
}finally{await browser.close();}

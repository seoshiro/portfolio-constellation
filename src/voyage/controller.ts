import type {Locale} from '../data/projects.ts';
import {voyageCopy} from './copy.ts';
import {initialWorld,sampleScroll,routeProgress,collect,clamp,type Fragment,type WorldState} from './state.ts';
import {drawWorld,probePosition} from './draw.ts';
type Audio={update:(s:WorldState)=>void;event:(key:string)=>void;duck:(active:boolean)=>void;enable:()=>void;silence:()=>void;cancel:()=>void};
export function createVoyage(locale:Locale,allowed:()=>boolean,audio:Audio){
 const route=document.querySelector<HTMLElement>('.signal-route'),receiver=document.querySelector<HTMLElement>('.signal-receiver');if(!route||!receiver)return null;
 const c=voyageCopy[locale],controller=new AbortController(),options={signal:controller.signal};
 let raw:string|null=null;try{raw=localStorage.getItem('atlas-signal-v1');}catch{/* Optional progress. */}
 const state=initialWorld(raw);state.scroll=scrollY;if(state.quest.activated){state.activation='settled';state.charge=1;}
 const canvases=[...document.querySelectorAll<HTMLCanvasElement>('.voyage-canvas')];
 const surfaces=canvases.map(canvas=>({canvas,ctx:canvas.getContext('2d'),w:0,h:0,visible:false}));
 const stations=[...route.querySelectorAll<HTMLElement>('.route-station')],activate=receiver.querySelector<HTMLButtonElement>('[data-activate]')!,announcement=document.querySelector<HTMLElement>('.voyage-announcement')!;
 const debug=document.querySelector<HTMLOutputElement>('.voyage-debug')!,diagnostic=(import.meta as ImportMeta&{env:{DEV:boolean}}).env.DEV&&new URLSearchParams(location.search).has('telemetry');debug.hidden=!diagnostic;
 let frame=0,last=0,elapsed=0,dead=false,lastStep=-1,kick=0,kickVelocity=0,activationTime=0,released=false,settleUntil=0,lastDraw=0,keyFocus=false;
 const narrow=matchMedia('(max-width:900px)'),visible=new Set<HTMLElement>();
 function persist(){try{localStorage.setItem('atlas-signal-v1',JSON.stringify(state.quest));}catch{/* The site and quest still work in memory. */}}
 function refresh(message=''){
  for(const button of document.querySelectorAll<HTMLButtonElement>('[data-fragment]')){const yes=state.quest.fragments.includes(button.dataset.fragment as Fragment);button.setAttribute('aria-pressed',String(yes));button.classList.toggle('is-collected',yes);button.querySelector('span:last-child')!.textContent=yes?c.collected:c.collect;}
  for(const slot of receiver!.querySelectorAll<HTMLElement>('[data-slot]'))slot.classList.toggle('is-filled',state.quest.fragments.includes(slot.dataset.slot as Fragment));
  for(const count of document.querySelectorAll<HTMLElement>('[data-quest-count]'))count.textContent=`${state.quest.fragments.length} / 3`;
  const complete=state.quest.activated,busy=state.activation==='charging'||state.activation==='released';activate.disabled=state.quest.fragments.length<3||complete||busy;
  activate.firstChild!.textContent=complete?c.received:busy?c.charging:c.activate;
  receiver!.dataset.activation=state.activation;
  receiver!.querySelector('.quest-message')!.textContent=message||`${state.quest.fragments.length} / 3 — ${complete?c.complete:state.quest.fragments.length===3?c.ready:c.missing}`;
  receiver!.querySelector('#receiver-title')!.innerHTML=(complete?c.complete:c.endTitle).replaceAll('\n','<br>');
  receiver!.querySelector('.receiver-note')!.textContent=complete?c.completeNote:c.endNote;
 }
 function resize(){for(const surface of surfaces){const r=surface.canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.75);surface.w=r.width;surface.h=r.height;surface.canvas.width=Math.round(r.width*dpr);surface.canvas.height=Math.round(r.height*dpr);surface.ctx?.setTransform(dpr,0,0,dpr,0,0);}request();}
 const sizer=new ResizeObserver(resize);canvases.forEach(el=>sizer.observe(el));
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){const el=entry.target as HTMLElement;if(entry.isIntersecting)visible.add(el);else visible.delete(el);for(const surface of surfaces)if(surface.canvas===el)surface.visible=entry.isIntersecting;}request();},{rootMargin:'100px'});
 for(const el of [route,receiver,...canvases])observer.observe(el);
 function request(){if(!dead&&!frame&&!document.hidden)frame=requestAnimationFrame(draw);}
 function draw(now:number){
  frame=0;const actualDt=last?Math.max(.001,(now-last)/1000):1/60,dt=Math.min(.05,actualDt);last=now;elapsed+=dt;state.hidden=false;state.settings.motion=allowed();
  sampleScroll(state,scrollY,innerHeight,actualDt);state.journey=clamp(scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight));
  const r=route!.getBoundingClientRect();const pinned=!narrow.matches&&allowed();
  state.progress=pinned?routeProgress(r.top,r.height,innerHeight):clamp((innerHeight*.6-r.top)/Math.max(1,r.height-innerHeight*.2));
  state.active=r.top<innerHeight&&r.bottom>0?'signal-route':receiver!.getBoundingClientRect().top<innerHeight&&receiver!.getBoundingClientRect().bottom>0?'signal-archive':document.querySelector('#catalog')!.getBoundingClientRect().top>0?'atlas':document.querySelector('#about')!.getBoundingClientRect().top>innerHeight*.5?'catalog':'about';
  document.querySelector('.signal-thread')?.classList.toggle('is-visible',state.active==='catalog'||state.active==='about');
  const step=Math.min(2,Math.round(state.progress*2));
  if(step!==lastStep){for(const [i,station]of stations.entries()){station.classList.toggle('is-current',step===i);if(step===i)station.setAttribute('aria-current','step');else station.removeAttribute('aria-current');}if(lastStep>=0&&visible.has(route!)){kickVelocity=28;audio.event('arrival');}lastStep=step;}
  route!.style.setProperty('--route-progress',String(state.progress));route!.dataset.progress=state.progress.toFixed(3);route!.querySelector('.route-percent')!.textContent=`${String(Math.round(state.progress*100)).padStart(3,'0')}%`;
  const rr=receiver!.getBoundingClientRect();state.opening=clamp((innerHeight*.9-rr.top)/(innerHeight*.85));
  const surface=surfaces.find(x=>x.visible&&x.canvas.dataset.world!=='thread'),rect=surface?.canvas.getBoundingClientRect();
  if(keyFocus)state.proximity=.55;
  else if(rect&&state.pointer.active){const kind=surface!.canvas.dataset.world,point=kind==='hero'?{x:rect.width*.5,y:rect.height*.5}:kind==='receiver'?{x:rect.width*.51,y:rect.height*.51}:probePosition(state.progress,rect.width,rect.height);state.proximity=clamp(1-Math.hypot(state.pointer.x*innerWidth/2+innerWidth/2-rect.left-point.x,state.pointer.y*innerHeight/2+innerHeight/2-rect.top-point.y)/180);}else state.proximity=0;
  if(state.activation==='charging'||state.activation==='released'){
   activationTime+=dt;state.charge=clamp(activationTime/1.2);
   if(activationTime>=.7&&!released){released=true;state.activation='released';audio.event('activate');kickVelocity=65;refresh();}
   if(activationTime>=1.5){state.quest={...state.quest,activated:true};state.activation='settled';state.charge=1;audio.duck(false);persist();refresh();}
  }
  kickVelocity+=(-kick*70-kickVelocity*12)*dt;kick+=kickVelocity*dt;if(!allowed())kick=kickVelocity=0;
  audio.update(state);
  if(now-lastDraw>30||!allowed()){const visual=allowed()?state:{...state,progress:.5,opening:1};for(const surface of surfaces)if(surface.visible&&surface.ctx&&(surface.canvas.dataset.world!=='thread'||state.active==='catalog'||state.active==='about'))drawWorld(surface.ctx,surface.w,surface.h,visual,surface.canvas.dataset.world!,allowed()?elapsed:0,kick);lastDraw=now;}
  if(diagnostic)debug.textContent=`${state.active} / p ${state.progress.toFixed(3)} / v ${state.velocity.toFixed(2)} vh/s / ${state.activation}`;
  const busy=state.activation==='charging'||state.activation==='released';
  if(busy||Math.abs(state.velocity)>.001||now<settleUntil||allowed()&&visible.size>0)request();else last=0;
 }
 document.addEventListener('click',event=>{
  const target=event.target as HTMLElement,fragment=target.closest<HTMLButtonElement>('[data-fragment]');
  if(fragment){const next=collect(state.quest,fragment.dataset.fragment as Fragment);if(next!==state.quest){state.quest=next;persist();refresh();audio.event('collect');fragment.classList.add('just-collected');setTimeout(()=>fragment.classList.remove('just-collected'),500);announcement.textContent=`${c.collected}. ${state.quest.fragments.length} / 3`;kickVelocity=32;request();}}
  if(target.closest('[data-activate]')&&!activate.disabled){state.activation='charging';activationTime=0;released=false;audio.duck(true);refresh();request();}
  if(target.closest('[data-reset]')){state.quest={fragments:[],activated:false};state.activation='idle';state.charge=0;activationTime=0;released=false;audio.cancel();audio.duck(false);persist();refresh(c.resetDone);request();}
  if(target.closest('[data-sound-opt]'))audio.enable();
  if(target.closest('[data-sound-silent]')){audio.silence();document.querySelector('.sound-invitation')?.classList.add('is-dismissed');}
 },options);
 document.addEventListener('pointermove',event=>{if(event.pointerType!=='mouse')return;state.pointer={x:event.clientX/innerWidth*2-1,y:event.clientY/innerHeight*2-1,active:true};request();},{...options,passive:true});
 document.addEventListener('pointerout',event=>{if(!event.relatedTarget){state.pointer.active=false;state.proximity=0;}},options);
 document.addEventListener('focusin',event=>{keyFocus=!!(event.target as HTMLElement).closest('[data-fragment],[data-activate]')?.matches(':focus-visible');request();},options);
 document.addEventListener('focusout',()=>{keyFocus=false;request();},options);
 document.addEventListener('portfolio-sound-change',request,options);
 window.addEventListener('scroll',()=>{settleUntil=performance.now()+2600;request();},{...options,passive:true});
 document.addEventListener('visibilitychange',()=>{state.hidden=document.hidden;cancelAnimationFrame(frame);frame=0;last=0;state.velocity=0;state.scroll=scrollY;if(!document.hidden)request();},options);
 narrow.addEventListener('change',request,options);refresh();resize();
 return{state,motionChanged(){last=0;request();},dispose(){dead=true;controller.abort();observer.disconnect();sizer.disconnect();cancelAnimationFrame(frame);audio.duck(false);}};
}

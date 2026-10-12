import {rootHref,projectById,type Locale} from '../data/projects.ts';

interface Visit {y:number;seen:string[];focus:string;path:string;url:string}
const read=(key:string)=>{try{return JSON.parse(sessionStorage.getItem(key)||'null');}catch{return null;}};
const save=(key:string,value:unknown)=>{try{sessionStorage.setItem(key,JSON.stringify(value));}catch{/* Optional continuity only. */}};
function valid(value:unknown):Visit|null{
 if(!value||typeof value!=='object')return null;const v=value as Visit;
 if(!Number.isFinite(v.y)||v.y<0||!Array.isArray(v.seen)||!v.seen.every(k=>typeof k==='string'&&projectById(k))||typeof v.focus!=='string'||v.focus&&!projectById(v.focus))return null;
 try{const url=new URL(v.url,location.origin);return url.origin===location.origin&&['/','/en/','/kk/'].includes(url.pathname)&&url.pathname===v.path?v:null;}catch{return null;}
}

/** Finite, progressive motion. Native links remain the navigation authority. */
export function createJourney(locale:Locale,allowed:()=>boolean){
 const controller=new AbortController(),options={signal:controller.signal},fine=matchMedia('(hover:hover) and (pointer:fine)'),home=!!document.querySelector('.hero');
 const cards=[...document.querySelectorAll<HTMLElement>('[data-reveal]')],seen=new Set<string>();
 const running=new Set<Animation>(),waiting=new Set<HTMLElement>();let restore:Visit|null=null,tilted:HTMLElement|null=null,dead=false,lastFocus='',entryPrepared=!document.documentElement.classList.contains('intro-pending');
 const pending=valid(read('atlas-return'));let origin=valid(history.state?.atlasOrigin);
 if(home){restore=pending?.url===location.pathname+location.search+location.hash?pending:valid(history.state?.atlasVisit);if(restore===pending)save('atlas-return',null);for(const key of restore?.seen||[])seen.add(key);lastFocus=restore?.focus||'';}
 else{const trip=read('atlas-trip');if(trip?.to===location.pathname+location.search){save('atlas-trip',null);if(Date.now()-trip.at<30000&&document.referrer===location.origin+trip.from)origin=valid(trip.visit);}history.replaceState({...history.state,atlasOrigin:origin},'');}
 function finish(){for(const a of running)a.finish();running.clear();if(tilted){tilted.style.removeProperty('--tilt-x');tilted.style.removeProperty('--tilt-y');tilted=null;}document.documentElement.classList.remove('case-arrival');}
 function animate(el:HTMLElement,frames:Keyframe[],duration:number,delay=0){if(dead||document.hidden||!allowed())return;const a=el.animate(frames,{duration,delay,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});running.add(a);void a.finished.then(()=>running.delete(a),()=>running.delete(a));}
 function reveal(el:HTMLElement,delay=0){const key=el.dataset.reveal!;if(seen.has(key))return;seen.add(key);el.dataset.revealed='true';animate(el,[{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'none'}],500,delay);}
 function show(entering:HTMLElement[]){
  if(dead)return;entering.sort((a,b)=>a.offsetTop-b.offsetTop||a.offsetLeft-b.offsetLeft);
  for(const el of entering){observer.unobserve(el);if(el.dataset.reveal){const pair=entering.find(a=>a!==el&&Math.abs(a.offsetTop-el.offsetTop)<4&&a.offsetLeft<el.offsetLeft);reveal(el,pair?80:0);}else revealLines(el);}
 }
 const observer=new IntersectionObserver(entries=>{
  if(dead)return;const entering=entries.filter(e=>e.isIntersecting).map(e=>e.target as HTMLElement);
  if(!entryPrepared&&document.documentElement.classList.contains('intro-pending'))for(const el of entering)waiting.add(el);else show(entering);
 },{threshold:0,rootMargin:'0px 0px -20px'});
 function prepareReveal(){entryPrepared=true;show([...waiting]);waiting.clear();}
 for(const el of cards){if(seen.has(el.dataset.reveal!))el.dataset.revealed='true';else observer.observe(el);}
 function revealLines(p:HTMLElement){
  if(!allowed()||dead)return;const tops:number[]=[];
  for(const span of p.querySelectorAll<HTMLElement>('.line-word')){const y=Math.round(span.getBoundingClientRect().top);if(!tops.includes(y))tops.push(y);animate(span,[{opacity:0},{opacity:1}],400,Math.min(tops.indexOf(y)*70,420));}
 }
 for(const p of document.querySelectorAll<HTMLElement>('.case-io p:not(.eyebrow),.case-decisions li p,.case-details p:not(.eyebrow)'))observer.observe(p);
 function snapshot(focus=lastFocus){lastFocus=focus;const visit:Visit={y:scrollY,seen:[...seen],focus,path:location.pathname,url:location.pathname+location.search+location.hash};history.replaceState({...history.state,atlasVisit:visit},'');return visit;}
 function restorePosition(){if(!home||!restore)return false;scrollTo({top:restore.y,behavior:'instant'});document.querySelector<HTMLElement>(`[data-catalog="${restore.focus}"]`)?.focus({preventScroll:true});return true;}
 function close(){if(!origin)return false;const url=new URL(origin.url,location.origin);url.pathname=rootHref(locale);save('atlas-return',{...origin,path:url.pathname,url:url.pathname+url.search+url.hash});location.href=url.href;return true;}
 const eligible=(a:HTMLAnchorElement,event:MouseEvent)=>event.button===0&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey&&!a.target&&!a.download;
 document.addEventListener('click',event=>{
  const link=(event.target as HTMLElement).closest<HTMLAnchorElement>('a');if(!link||!eligible(link,event)||event.defaultPrevented)return;
  const url=new URL(link.href);if(url.origin!==location.origin)return;
  if(link.matches('[data-close-case]')&&origin){event.preventDefault();close();return;}
  if(/\/projects\/[^/]+\.html$/.test(url.pathname)&&home){
   const card=link.closest<HTMLElement>('[data-reveal]');save('atlas-trip',{to:url.pathname+url.search,from:location.pathname+location.search,at:Date.now(),visit:card?snapshot(card.dataset.reveal):null});
   const image=card?.querySelector<HTMLElement>('.project-visual,img')||document.querySelector<HTMLElement>('.project-preview:not([hidden]) .preview-image');
   document.querySelectorAll<HTMLElement>('[data-transition-image]').forEach(el=>{el.style.viewTransitionName='none';delete el.dataset.transitionImage;});
   if(image&&allowed()){image.style.viewTransitionName='case-media';image.dataset.transitionImage='true';}
  }else if(!home&&/\/projects\/[^/]+\.html$/.test(url.pathname))save('atlas-trip',{to:url.pathname+url.search,from:location.pathname+location.search,at:Date.now(),visit:origin});
  else if(home&&link.matches('[data-locale]'))save('atlas-return',{...snapshot(),path:url.pathname,url:url.pathname+url.search+url.hash});
 },{...options,capture:true});
 document.addEventListener('pointermove',event=>{
  if(event.pointerType!=='mouse'||!fine.matches||!allowed())return;const el=(event.target as HTMLElement).closest<HTMLElement>('.project-visual');
  if(tilted&&tilted!==el){tilted.style.removeProperty('--tilt-x');tilted.style.removeProperty('--tilt-y');}tilted=el;if(!el)return;
  const r=el.getBoundingClientRect(),clamp=(n:number)=>Math.max(-1.5,Math.min(1.5,n));el.style.setProperty('--tilt-x',`${clamp((0.5-(event.clientY-r.top)/r.height)*3)}deg`);el.style.setProperty('--tilt-y',`${clamp(((event.clientX-r.left)/r.width-0.5)*3)}deg`);
 },{...options,passive:true});
 document.addEventListener('pointerout',event=>{if(tilted&&!(event.relatedTarget instanceof Node&&tilted.contains(event.relatedTarget))){tilted.style.removeProperty('--tilt-x');tilted.style.removeProperty('--tilt-y');tilted=null;}},options);
 document.addEventListener('pointerdown',event=>{if(event.pointerType==='mouse')return;const card=(event.target as HTMLElement).closest<HTMLElement>('[data-reveal]');if(card)animate(card,[{opacity:1},{opacity:.78},{opacity:1}],180);},{...options,passive:true});
 document.addEventListener('focusin',event=>{const target=event.target as HTMLElement,card=target.closest<HTMLElement>('[data-reveal]');if(card){observer.unobserve(card);reveal(card);if(target.matches(':focus-visible'))for(const a of card.getAnimations())a.finish();}},options);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)finish();},options);
 window.addEventListener('pagehide',()=>{if(home)snapshot();finish();},options);
 window.addEventListener('pageshow',()=>{if(home)restore=valid(history.state?.atlasVisit)||restore;restorePosition();},options);
 // Native restoration runs around pageshow. One finite frame settles the
 // explicit close-link path too; no smooth scroll competes with restoration.
 if(restore){restorePosition();const image=document.querySelector<HTMLElement>(`[data-reveal="${restore.focus}"] .project-visual`);if(image&&allowed()){image.style.viewTransitionName='case-media';image.dataset.transitionImage='true';}requestAnimationFrame(()=>{if(!dead)restorePosition();});}
 const cover=document.querySelector<HTMLElement>('.case-cover img');if(cover&&allowed())cover.style.viewTransitionName='case-media';
 return{restoreFocus:restorePosition,close,prepareReveal,entryOpened:prepareReveal,motionChanged(){if(!allowed())finish();},dispose(){dead=true;finish();controller.abort();observer.disconnect();}};
}

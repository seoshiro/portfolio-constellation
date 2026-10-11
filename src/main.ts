import {copy} from './data/copy.ts';
import {caseHref,rootHref,validLocale,featuredIds,type Locale} from './data/projects.ts';
import {preview} from './ui/render.ts';
import {parseHash,selectionHash} from './state.ts';
import {createScene} from './scene/scene.ts';
import {createEntry} from './entry.ts';
import './style.css';
import './motion.css';
import './entry.css';
const locale=document.documentElement.lang as Locale,c=copy[locale];
const id=document.body.dataset.project||null;
const localePath=(l:Locale)=>id?caseHref(id,l):rootHref(l)+(location.pathname.endsWith('credits.html')?'credits.html':'');

const get=(key:string,session=false)=>{try{return (session?sessionStorage:localStorage).getItem(key);}catch{return null;}};
const set=(key:string,value:string,session=false)=>{try{(session?sessionStorage:localStorage).setItem(key,value);}catch{/* preference is optional */}};
const explicit=validLocale(new URLSearchParams(location.search).get('lang'));
const stored=validLocale(get('atlas-language'));
function replaceLocale(url:URL){if(document.documentElement.classList.contains('intro-pending'))url.searchParams.set('_atlas_entry','first');location.replace(url.href);}
if(explicit&&explicit!==locale){const url=new URL(localePath(explicit),location.origin);url.hash=location.hash;url.search=location.search;url.searchParams.delete('lang');replaceLocale(url);}
else if(location.pathname==='/'&&!explicit&&stored&&stored!=='ru'){replaceLocale(new URL(rootHref(stored)+location.search+location.hash,location.origin));}
set('atlas-language',locale);
document.documentElement.classList.add('enhanced');
const media=matchMedia('(prefers-reduced-motion: reduce)');
const saveData=(navigator as Navigator&{connection?:{saveData:boolean}}).connection?.saveData===true;
let paused=get('atlas-motion')==='off';
const allowed=()=>!media.matches&&!saveData&&!paused;
const hero=document.querySelector<HTMLElement>('.hero');
let scene:ReturnType<typeof createScene>|null=null;
const entry=createEntry(()=>{scene?.reveal();restoreFocus();});
scene=hero?createScene(hero,allowed,!entry.active):null;
const motion=document.querySelector<HTMLButtonElement>('.motion')!;
function updateMotion(){document.documentElement.classList.toggle('reduced',!allowed());motion.setAttribute('aria-pressed',String(!allowed()));motion.setAttribute('aria-label',allowed()?c.motionOn:c.motionOff);motion.querySelector('span')!.textContent=allowed()?'Ⅱ':'✧';motion.disabled=media.matches||saveData;scene?.motionChanged();}
motion.addEventListener('click',()=>{paused=!paused;set('atlas-motion',paused?'off':'on');updateMotion();});media.addEventListener('change',updateMotion);updateMotion();
function updateLanguages(){for(const a of document.querySelectorAll<HTMLAnchorElement>('[data-locale]')){const l=a.dataset.locale as Locale;const target=new URL(id?caseHref(id,l):rootHref(l)+(location.pathname.endsWith('credits.html')?'credits.html':''),location.origin);target.hash=location.hash;if(new URLSearchParams(location.search).has('flat'))target.search='?flat';a.href=target.href;}}
function applyState(){if(!hero)return;if(location.hash==='#work'){history.replaceState(null,'',location.pathname+location.search+'#catalog');document.querySelector('#catalog')?.scrollIntoView();}const state=parseHash(location.hash);hero.classList.toggle('exploring',state.exploring);hero.classList.toggle('has-selection',!!state.selected);
  const aside=hero.querySelector<HTMLElement>('.project-preview')!;
  if(state.selected)aside.hidden=false;else if(!scene)aside.hidden=true;if(state.selected&&aside.dataset.project!==state.selected){aside.innerHTML=preview(locale,state.selected);aside.dataset.project=state.selected;wireImages(aside);}
  const clear=hero.querySelector<HTMLElement>('.map-clear')!;clear.hidden=!state.exploring;
  for(const link of hero.querySelectorAll<HTMLElement>('[data-select]')){const selected=state.selected===link.dataset.select;link.classList.toggle('is-selected',selected);if(selected)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');}
  for(const button of hero.querySelectorAll<HTMLButtonElement>('[data-target]'))button.setAttribute('aria-pressed',String(button.dataset.target===state.selected));scene?.select(state.selected,state.exploring);
  hero.querySelector<HTMLElement>('.selection-announcement')!.textContent=state.selected?c.selected+': '+state.selected.toUpperCase():'';
  document.querySelector('[data-nav="atlas"]')?.classList.toggle('active',state.exploring);
}
function navigate(hash:string){history.pushState(null,'',hash||location.pathname+location.search);applyState();updateLanguages();}
document.addEventListener('click',event=>{const target=event.target as HTMLElement;const selection=target.closest<HTMLElement>('.constellation[data-select],.atlas-projects button[data-target]');if(selection&&hero){event.preventDefault();navigate(selectionHash(selection.dataset.select||selection.dataset.target!));return;}
  const explore=target.closest('[data-explore]');const atlasNav=target.closest<HTMLAnchorElement>('[data-nav="atlas"]');if(hero&&(explore||atlasNav)){event.preventDefault();navigate('#atlas');hero.scrollIntoView({behavior:allowed()?'smooth':'instant'});return;}
  if(target.closest('.map-clear')){const selected=parseHash(location.hash).selected;navigate('');if(selected)hero?.querySelector<HTMLElement>(`[data-select="${selected}"]`)?.focus({preventScroll:true});}
  const caseLink=target.closest<HTMLAnchorElement>('[data-case],[data-case-image]');if(caseLink)set('atlas-focus',(caseLink.dataset.case||caseLink.dataset.caseImage)!,true);
  const close=target.closest<HTMLAnchorElement>('[data-close-case]');if(close)set('atlas-focus',close.dataset.closeCase!,true);
  const lang=target.closest<HTMLAnchorElement>('[data-locale]');if(lang)set('atlas-language',lang.dataset.locale!);
});
document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;if(id){set('atlas-focus',id,true);location.href=rootHref(locale)+((featuredIds as readonly string[]).includes(id)?'#atlas/'+id:'#catalog');return;}const current=parseHash(location.hash);if(current.exploring){navigate('');if(current.selected)hero?.querySelector<HTMLElement>(`[data-select="${current.selected}"]`)?.focus({preventScroll:true});}});
window.addEventListener('popstate',()=>{applyState();updateLanguages();});window.addEventListener('hashchange',()=>{applyState();updateLanguages();});
window.addEventListener('pageshow',()=>{applyState();updateLanguages();if(!entry.active){scene?.reveal();if(document.documentElement.dataset.entryReason==='pagehide'){set('atlas-entry-seen','1',true);document.documentElement.dataset.entryReason='resumed';document.querySelector<HTMLElement>('#main')?.focus({preventScroll:true});}}});window.addEventListener('pagehide',event=>{if(!event.persisted)scene?.dispose();});
function wireImages(root:ParentNode){for(const img of root.querySelectorAll<HTMLImageElement>('img:not([alt=""])')){const fallback=()=>{img.classList.add('failed');if(!img.parentElement?.querySelector('.image-error')){const span=document.createElement('span');span.className='image-error';span.textContent=c.failed;img.insertAdjacentElement('afterend',span);}};img.addEventListener('error',fallback,{once:true});if(img.complete&&!img.naturalWidth)fallback();}}
wireImages(document);applyState();updateLanguages();
function restoreFocus(){const returnFocus=get('atlas-focus',true);if(hero&&returnFocus){if(parseHash(location.hash).selected===returnFocus){hero.querySelector<HTMLElement>(`[data-select="${returnFocus}"]`)?.focus({preventScroll:true});set('atlas-focus','',true);}else if(location.hash==='#catalog'){document.querySelector<HTMLElement>(`[data-catalog="${returnFocus}"]`)?.focus();set('atlas-focus','',true);}}}
window.addEventListener('pageshow',()=>requestAnimationFrame(restoreFocus));

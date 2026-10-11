interface EntryState{started:number;safety:ReturnType<typeof setTimeout>;opened:number}
declare global{interface Window{__atlasEntry?:EntryState}}

export function createEntry(onOpen:()=>void,onPrepare:()=>void){
  const root=document.documentElement,state=window.__atlasEntry;
  const overlay=document.querySelector<HTMLElement>('.entry-intro');
  const content=document.querySelector<HTMLElement>('#site-content');
  if(!state||!root.classList.contains('intro-pending')||!overlay||!content)return{active:false,dispose(){}};
  const skip=overlay.querySelector<HTMLButtonElement>('.entry-skip')!;
  const controller=new AbortController(),options={signal:controller.signal};
  let active=true,prepared=false;
  const prepare=()=>{if(!prepared){prepared=true;onPrepare();}};
  content.inert=true;content.setAttribute('aria-hidden','true');
  skip.focus({preventScroll:true});
  function finish(reason:string){
    if(!active)return;active=false;clearTimeout(leave);clearTimeout(end);clearTimeout(state!.safety);
    const leavingDocument=reason==='pagehide';
    if(!leavingDocument)prepare();
    controller.abort();root.classList.remove('intro-pending');root.dataset.entry='complete';root.dataset.entryReason=reason;overlay!.classList.remove('is-leaving');
    content!.inert=false;content!.removeAttribute('aria-hidden');state!.opened=performance.now();
    // An automatic locale redirect is not a completed introduction. Clean up
    // this document without consuming the first entry on its destination.
    if(!leavingDocument)try{sessionStorage.setItem('atlas-entry-seen','1');}catch{/* Internal same-origin entries also use their referrer when storage is denied. */}
    // Only transfer focus if it belongs to the temporary dialog. Never move the
    // user's scroll position or steal focus after a pagehide/failsafe cleanup.
    if(!leavingDocument&&overlay!.contains(document.activeElement))document.querySelector<HTMLElement>('#main')?.focus({preventScroll:true});
    if(!leavingDocument)onOpen();
  }
  const remaining=Math.max(0,3500-(performance.now()-state.started));
  // Start the scene before it becomes visible through the fading overlay.
  // Opening access at 3500ms must not reset already visible stars to opacity 0.
  const leave=setTimeout(()=>{prepare();overlay.classList.add('is-leaving');},Math.max(0,remaining-480));
  const end=setTimeout(()=>finish('timed'),remaining);
  skip.addEventListener('click',()=>finish('skipped'),options);
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();finish('skipped');}
    else if(event.key==='Tab'){event.preventDefault();skip.focus({preventScroll:true});}
  },{...options,capture:true});
  document.addEventListener('focusin',event=>{if(active&&!overlay.contains(event.target as Node))skip.focus({preventScroll:true});},options);
  window.addEventListener('atlas-entry-failsafe',()=>finish('failsafe'),options);
  window.addEventListener('pagehide',()=>finish('pagehide'),{...options,once:true});
  return{get active(){return active;},dispose(){finish('disposed');}};
}

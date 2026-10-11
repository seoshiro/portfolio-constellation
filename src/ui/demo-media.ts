// Only the two explicitly approved, clean application recordings are public.
export function createDemoMedia(motionAllowed:()=>boolean){
  const controller=new AbortController(),options={signal:controller.signal},fine=matchMedia('(hover: hover) and (pointer: fine)');
  const videos=new Set<HTMLVideoElement>(),versions=new WeakMap<HTMLVideoElement,number>();let playing:HTMLVideoElement|null=null;
  const observer=new IntersectionObserver(entries=>{for(const e of entries)if(!e.isIntersecting)stop(e.target as HTMLVideoElement);},{threshold:.01});
  function stop(video:HTMLVideoElement){versions.set(video,(versions.get(video)||0)+1);video.pause();try{video.currentTime=0;}catch{/* metadata has not loaded */}video.parentElement?.classList.remove('demo-playing');if(playing===video)playing=null;}
  function stopAll(){for(const video of videos)stop(video);}
  function refresh(root:ParentNode){
    for(const old of videos)if(!old.isConnected){stop(old);observer.unobserve(old);videos.delete(old);}
    for(const video of root.querySelectorAll<HTMLVideoElement>('.project-video'))if(!videos.has(video)){videos.add(video);video.muted=true;observer.observe(video);video.addEventListener('error',()=>stop(video),options);}
  }
  async function start(video:HTMLVideoElement){
    if(!fine.matches||!motionAllowed()||document.hidden||document.documentElement.classList.contains('intro-pending')||video.closest('[inert]')||playing===video)return;
    stopAll();playing=video;const version=(versions.get(video)||0)+1;versions.set(video,version);
    if(!video.src){video.src=video.dataset.src!;video.load();}
    try{await video.play();if(versions.get(video)===version&&playing===video&&motionAllowed()&&!document.hidden&&video.isConnected)video.parentElement?.classList.add('demo-playing');else if(playing!==video||!motionAllowed()||document.hidden||!video.isConnected)video.pause();}catch{if(versions.get(video)===version)stop(video);}
  }
  // A real mouse move is required: keyboard focus or layout scrolling under
  // a stationary pointer must never restart playback after it was stopped.
  document.addEventListener('pointermove',event=>{if(event.pointerType!=='mouse')return;const link=(event.target as HTMLElement).closest('.project-visual,.preview-image');const video=link?.querySelector<HTMLVideoElement>('.project-video');if(video)void start(video);},{...options,passive:true});
  document.addEventListener('pointerout',event=>{const link=(event.target as HTMLElement).closest('.project-visual,.preview-image');if(!link||event.relatedTarget instanceof HTMLElement&&link.contains(event.relatedTarget))return;const video=link.querySelector<HTMLVideoElement>('.project-video');if(video)stop(video);},options);
  document.addEventListener('pointerdown',event=>{if(event.pointerType!=='mouse')stopAll();},options);document.addEventListener('keydown',stopAll,options);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAll();},options);fine.addEventListener('change',stopAll,options);
  window.addEventListener('scroll',stopAll,{...options,passive:true});window.addEventListener('pagehide',stopAll,options);
  const aside=document.querySelector('.project-preview'),changes=aside?new MutationObserver(()=>refresh(aside)):null;changes?.observe(aside!,{childList:true,subtree:true});refresh(document);
  return{motionChanged:stopAll,dispose(){stopAll();controller.abort();observer.disconnect();changes?.disconnect();videos.clear();}};
}

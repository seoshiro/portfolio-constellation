// Kept readable here; the generator emits the small classic head script.
export const journeyBootstrap=`(function(){
 var root=document.documentElement;
 function allowed(){try{return !matchMedia('(prefers-reduced-motion:reduce)').matches&&localStorage.getItem('atlas-motion')!=='off'&&!navigator.connection?.saveData;}catch(e){return false;}}
 function clear(){document.querySelectorAll('[data-transition-image]').forEach(function(el){el.style.viewTransitionName='none';delete el.dataset.transitionImage;});}
 if(/\\/projects\\/[^/]+\\.html$/.test(location.pathname)&&allowed())root.classList.add('case-arrival');
 addEventListener('pagereveal',function(e){
  if(!e.viewTransition)return;
  if(!allowed()){e.viewTransition.skipTransition();return;}
  root.classList.add('case-shared');if(root.classList.contains('case-arrival'))root.style.setProperty('--case-delay','500ms');
  else{try{var visit=JSON.parse(sessionStorage.getItem('atlas-return')||'null')||history.state?.atlasVisit;var known=function(id){return typeof id==='string'&&!!document.querySelector('[data-reveal="'+CSS.escape(id)+'"]');};if(visit&&visit.path===location.pathname&&visit.url===location.pathname+location.search+location.hash&&Number.isFinite(visit.y)&&visit.y>=0&&Array.isArray(visit.seen)&&visit.seen.every(known)&&typeof visit.focus==='string'&&(!visit.focus||known(visit.focus))){scrollTo({top:visit.y,behavior:'instant'});var image=document.querySelector('[data-reveal="'+CSS.escape(visit.focus)+'"]')?.querySelector('.project-visual,img');if(image){image.style.viewTransitionName='case-media';image.dataset.transitionImage='true';}}}catch(error){}}
  e.viewTransition.ready.catch(function(){root.classList.remove('case-shared');root.style.removeProperty('--case-delay');});e.viewTransition.finished.then(clear);
 });
 addEventListener('pageswap',function(e){if(e.viewTransition){if(!allowed())e.viewTransition.skipTransition();e.viewTransition.ready.catch(function(){});e.viewTransition.finished.then(clear);}});
})();`;

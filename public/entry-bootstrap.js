(function(){
  var seen=false;
  try{seen=sessionStorage.getItem('atlas-entry-seen')==='1';}catch(e){
    var navigation=performance.getEntriesByType('navigation')[0];
    seen=!!navigation&&(navigation.type==='back_forward'||navigation.type==='reload');
    try{seen=seen||!!document.referrer&&new URL(document.referrer).origin===location.origin;}catch(e){}
  }
  // Automatic locale redirects can cross documents even when storage is
  // denied. This transient handoff is removed before the destination paints.
  var url=new URL(location.href);
  if(url.searchParams.get('_atlas_entry')==='first'){
    seen=false;url.searchParams.delete('_atlas_entry');history.replaceState(history.state,'',url.href);
  }
  if(seen)return;
  var root=document.documentElement;
  root.classList.add('intro-pending');root.dataset.entry='active';
  var state={started:performance.now(),safety:0,opened:0};
  // The application does not wait for fonts or images. If that application
  // never starts, this independent timer still releases the static content.
  state.safety=setTimeout(function(){
    root.classList.remove('intro-pending');root.dataset.entry='complete';state.opened=performance.now();
    var content=document.getElementById('site-content');
    if(content){content.inert=false;content.removeAttribute('aria-hidden');}
    try{sessionStorage.setItem('atlas-entry-seen','1');}catch(e){}
    window.dispatchEvent(new Event('atlas-entry-failsafe'));
  },4500);
  window.__atlasEntry=state;
})();

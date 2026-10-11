import {observatoryCopy} from '../data/observatory-copy.ts';
import type {Locale} from '../data/projects.ts';
import {starMark} from './star.ts';

export function createObservatory(locale:Locale,motionAllowed:()=>boolean){
  const copy=observatoryCopy[locale],controller=new AbortController(),options={signal:controller.signal};
  const fine=matchMedia('(hover: hover) and (pointer: fine)'),root=document.documentElement;
  const cursor=document.createElement('div');cursor.className='atlas-cursor';cursor.setAttribute('aria-hidden','true');
  cursor.innerHTML=`<span class="cursor-core">${starMark}</span><span class="cursor-ring"></span><span class="cursor-impulse"></span><span class="cursor-caption"></span>`;
  const tip=document.createElement('div');tip.className='observatory-preview';tip.setAttribute('aria-hidden','true');tip.hidden=true;
  document.body.append(cursor,tip);
  const core=cursor.querySelector<HTMLElement>('.cursor-core')!,ring=cursor.querySelector<HTMLElement>('.cursor-ring')!,caption=cursor.querySelector<HTMLElement>('.cursor-caption')!,impulse=cursor.querySelector<HTMLElement>('.cursor-impulse')!;
  const contact=document.querySelector<HTMLElement>('.contact'),contactStar=contact?.querySelector<HTMLElement>('.contact-star');
  let frame=0,fade=0,last=0,x=0,y=0,rx=0,ry=0,active=false,keyboard=false,selecting=false,contactVisible=false;
  let sx=0,sy=0,sa=0,tx=0,ty=0,ta=0,observing:HTMLElement|null=null;
  const request=()=>{if(!frame&&!document.hidden)frame=requestAnimationFrame(draw);};
  function draw(time:number){
    frame=0;const dt=last?Math.min(64,time-last):16;last=time;
    const smooth=motionAllowed()?1-Math.exp(-dt/65):1;
    rx+=(x-rx)*smooth;ry+=(y-ry)*smooth;sx+=(tx-sx)*smooth;sy+=(ty-sy)*smooth;sa+=(ta-sa)*smooth;
    ring.style.transform=`translate(${rx}px,${ry}px)`;
    contactStar?.style.setProperty('--star-x',sx.toFixed(2)+'px');contactStar?.style.setProperty('--star-y',sy.toFixed(2)+'px');contactStar?.style.setProperty('--star-turn',sa.toFixed(2)+'deg');
    const settling=(active?Math.abs(x-rx)+Math.abs(y-ry):0)+Math.abs(tx-sx)+Math.abs(ty-sy)+Math.abs(ta-sa);
    if(settling>.15)request();else last=0;
  }
  function hideCursor(){active=false;root.classList.remove('cursor-active','cursor-text');cursor.classList.remove('is-visible','is-down','is-link','is-pulsing');caption.textContent='';}
  function hideTip(){observing?.classList.remove('observing');observing=null;clearTimeout(fade);tip.classList.remove('is-shown');const finish=()=>{tip.hidden=true;tip.replaceChildren();};if(motionAllowed()&&!tip.hidden)fade=window.setTimeout(finish,160);else finish();}
  const intersects=(a:DOMRect|{left:number;top:number;right:number;bottom:number},b:DOMRect)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
  function placeTip(link:HTMLElement){
    tip.hidden=false;
    const anchor=link.querySelector<HTMLElement>('.constellation-label')!.getBoundingClientRect(),w=tip.offsetWidth,h=tip.offsetHeight,pad=12;
    const clamp=(n:number,max:number)=>Math.max(pad,Math.min(n,max-pad));
    const obstacles=Array.from(document.querySelectorAll<HTMLElement>('.hero-intro,.header,.atlas-heading,.project-preview,.atlas-projects,.constellation,.atlas-footer,.cursor-caption')).filter(el=>!el.hidden&&getComputedStyle(el).visibility!=='hidden'&&getComputedStyle(el).display!=='none'&&+getComputedStyle(el).opacity>.1).map(el=>el.getBoundingClientRect());
    const positions=[[anchor.left+(anchor.width-w)/2,anchor.bottom+10],[anchor.left+(anchor.width-w)/2,anchor.top-h-10],[anchor.right+12,anchor.top+(anchor.height-h)/2],[anchor.left-w-12,anchor.top+(anchor.height-h)/2]];
    // Search the boundaries of occupied space as well as the label's sides.
    // Include this drawing and the footer so a clamped card never covers them.
    const xs=[anchor.left+(anchor.width-w)/2,pad,innerWidth-w-pad],ys=[anchor.bottom+10,anchor.top-h-10,pad,innerHeight-h-pad];
    for(const o of obstacles){xs.push(o.left-w-10,o.right+10);ys.push(o.top-h-10,o.bottom+10);}
    for(const px of xs)for(const py of ys)positions.push([px,py]);
    for(const px of [pad,innerWidth-w-pad])for(const py of [pad,innerHeight-h-pad])positions.push([px,py]);
    let best:{x:number;y:number;score:number}|null=null;
    for(const [px,py] of positions){const cx=clamp(px,innerWidth-w),cy=clamp(py,innerHeight-h),box={left:cx,top:cy,right:cx+w,bottom:cy+h};
      const hits=obstacles.filter(o=>intersects(box,o));if(hits.length)continue;
      const score=Math.hypot(cx+w/2-anchor.left-anchor.width/2,cy+h/2-anchor.top-anchor.height/2);
      if(!best||score<best.score)best={x:cx,y:cy,score};
    }
    if(!best){tip.hidden=true;return;}tip.style.left=best.x+'px';tip.style.top=best.y+'px';tip.dataset.project=link.dataset.select!;
  }
  function showTip(link:HTMLElement|null){
    if(link===observing)return;hideTip();if(!link||link.classList.contains('is-selected')||link.closest('.camera-flight')||root.classList.contains('intro-pending'))return;
    clearTimeout(fade);observing=link;link.classList.add('observing');const template=link.querySelector<HTMLTemplateElement>('template[data-hover-card]');if(!template)return;
    tip.replaceChildren(template.content.cloneNode(true));tip.hidden=false;placeTip(link);tip.classList.add('is-shown');
  }
  function move(event:PointerEvent){
    if(root.classList.contains('intro-pending')){hideCursor();hideTip();return;}
    if(event.pointerType!=='mouse'||!fine.matches){hideCursor();if(!keyboard)hideTip();return;}
    keyboard=false;x=event.clientX;y=event.clientY;const target=event.target as HTMLElement;
    const text=target.closest('input,textarea,[contenteditable="true"],p,h1,h2,h3,figcaption,.project-summary,.case-context');
    const link=target.closest<HTMLElement>('a,button,summary,[role="button"]');
    const isText=selecting||!!text&&!link;
    root.classList.toggle('cursor-text',isText);
    if(isText){hideCursor();root.classList.add('cursor-text');}
    else{
      if(!active){rx=x;ry=y;}active=true;root.classList.add('cursor-active');cursor.classList.add('is-visible');cursor.classList.toggle('is-link',!!link);
      core.style.transform=`translate(${x}px,${y}px)`;
      const map=target.closest<HTMLElement>('.constellation');caption.textContent=map?copy.explore:target.closest('.project-preview a,.project-visual')?copy.open:'';
      caption.style.transform=`translate(${Math.min(x+22,innerWidth-124)}px,${Math.max(12,Math.min(y+18,innerHeight-30))}px)`;
      showTip(map);if(observing)placeTip(observing);
    }
    if(contactVisible&&contact?.contains(target)&&motionAllowed()){const b=contact.getBoundingClientRect();tx=((x-b.left)/b.width-.5)*8;ty=((y-b.top)/b.height-.5)*8;ta=((x-b.left)/b.width-.5)*9;}else tx=ty=ta=0;
    request();
  }
  document.addEventListener('pointermove',move,{...options,passive:true});
  document.addEventListener('pointerout',event=>{if(!event.relatedTarget){hideCursor();hideTip();tx=ty=ta=0;request();}},options);
  document.addEventListener('pointerdown',event=>{keyboard=false;if(event.pointerType!=='mouse'){hideCursor();hideTip();return;}if(!active)return;cursor.classList.add('is-down');if(motionAllowed()){impulse.style.left=(event.clientX-13)+'px';impulse.style.top=(event.clientY-13)+'px';cursor.classList.remove('is-pulsing');void cursor.offsetWidth;cursor.classList.add('is-pulsing');}},options);
  document.addEventListener('pointerup',()=>{selecting=false;cursor.classList.remove('is-down');},options);
  document.addEventListener('selectstart',()=>{selecting=true;hideCursor();root.classList.add('cursor-text');hideTip();},options);
  document.addEventListener('keydown',event=>{keyboard=true;hideCursor();if(event.key==='Escape')hideTip();},options);
  document.addEventListener('focusin',event=>{if(keyboard)showTip((event.target as HTMLElement).closest('.constellation'));},options);
  document.addEventListener('focusout',()=>{if(keyboard)hideTip();},options);
  document.addEventListener('pointerover',event=>{if(event.pointerType==='mouse'&&fine.matches&&!selecting)showTip((event.target as HTMLElement).closest('.constellation'));},options);
  document.addEventListener('click',hideTip,options);window.addEventListener('hashchange',hideTip,options);window.addEventListener('popstate',hideTip,options);
  window.addEventListener('scroll',()=>{hideTip();hideCursor();tx=ty=ta=0;request();},{...options,passive:true});window.addEventListener('resize',()=>{hideTip();hideCursor();},options);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;hideCursor();hideTip();}else request();},options);
  fine.addEventListener('change',()=>{hideCursor();hideTip();},options);
  const observer=contact?new IntersectionObserver(entries=>{contactVisible=entries[0].isIntersecting;if(contactVisible&&!root.classList.contains('intro-pending'))contact.classList.add('contact-revealed');if(!contactVisible){tx=ty=ta=0;request();}},{threshold:.15}):null;
  if(contact)observer?.observe(contact);
  return{entryOpened(){if(contactVisible)contact?.classList.add('contact-revealed');},motionChanged(){tx=ty=ta=0;if(!motionAllowed()){rx=x;ry=y;sx=sy=sa=0;cursor.classList.remove('is-pulsing');}request();},dispose(){controller.abort();observer?.disconnect();cancelAnimationFrame(frame);hideCursor();hideTip();clearTimeout(fade);cursor.remove();tip.remove();}};
}

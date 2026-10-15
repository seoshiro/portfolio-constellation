import {clamp,type WorldState} from './state.ts';
type Point={x:number;y:number};
const tau=Math.PI*2;
const stars=Array.from({length:110},(_,i)=>({x:((i*7919+187)%1009)/1009,y:((i*4447+91)%997)/997,z:1+i%3,r:i%9===0?1.4:.65}));
export function probePosition(progress:number,w:number,h:number):Point{return{x:w*(.16+.68*progress),y:h*(.63-Math.sin(progress*Math.PI)*.3)};}
/** Original vector diorama: front-lit titanium, amber optics and ink-blue panels. */
export function drawWorld(ctx:CanvasRenderingContext2D,w:number,h:number,s:WorldState,kind:string,time:number,kick:number){
 ctx.clearRect(0,0,w,h);const mobile=w<560,scale=Math.min(w/750,h/550),p=s.progress;
 if(kind==='hero'||kind==='thread'){const yy=kind==='thread'?h*(.18+s.journey*.64):h*.5;if(kind==='thread'){ctx.strokeStyle='#cfb77a50';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(w*.5,0);ctx.quadraticCurveTo(w*.5+s.velocity*2,yy*.5,w*.5,yy);ctx.stroke();}drawProbe(ctx,w*.5,yy,.38,s.settings.motion?s.velocity*.04:0);return;}
 const ox=s.settings.motion?s.pointer.x*7:0,oy=s.settings.motion?s.pointer.y*5:0;
 const fog=ctx.createRadialGradient(w*.58,h*.48,10,w*.58,h*.48,w*.65);fog.addColorStop(0,'#23363570');fog.addColorStop(.55,'#19273330');fog.addColorStop(1,'#070a1000');ctx.fillStyle=fog;ctx.fillRect(0,0,w,h);
 for(const star of stars){const shift=s.settings.motion?s.scroll*.006*star.z:0;const y=((star.y*h-shift)%(h+20)+h+20)%(h+20);ctx.fillStyle=star.z===3?'#b4d1d3':'#c5b68f';ctx.globalAlpha=.18+star.z*.15;ctx.fillRect(star.x*w+ox*star.z*.4,y+oy*star.z*.3,star.r,star.r);}ctx.globalAlpha=1;
 ctx.save();ctx.translate(ox,oy);
 if(kind==='receiver'){
  const x=w*.51,y=h*.51,r=Math.min(w,h)*.24;const open=s.opening;
  ctx.save();ctx.translate(x,y);ctx.rotate(-.14+(s.settings.motion?Math.sin(time*.2)*.025:0));
  const halo=ctx.createRadialGradient(0,0,0,0,0,r*2);halo.addColorStop(0,`rgba(208,167,92,${.14+s.charge*.3})`);halo.addColorStop(1,'#c9aa6400');ctx.fillStyle=halo;ctx.fillRect(-r*2,-r*2,r*4,r*4);
  ctx.strokeStyle='#b8a27c45';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,0,r*1.65,r*.7,-.2,0,tau);ctx.stroke();
  for(let i=0;i<6;i++){
   const angle=i*tau/6,dx=Math.cos(angle)*r*(.33+open*.62),dy=Math.sin(angle)*r*(.33+open*.62);
   ctx.save();ctx.translate(dx,dy);ctx.rotate(angle);polygon(ctx,[[0,-r*.36],[r*.65,-r*.21],[r*.8,0],[r*.65,r*.21],[0,r*.36],[-r*.13,0]],'#28323a','#8b8b7a');
   polygon(ctx,[[0,-r*.36],[r*.65,-r*.21],[r*.8,0],[0,0]],'#4b5659');ctx.strokeStyle='#bca66c';ctx.beginPath();ctx.moveTo(r*.12,-r*.15);ctx.lineTo(r*.55,-r*.1);ctx.stroke();
   for(let n=0;n<4;n++){ctx.fillStyle='#0c1720';ctx.fillRect(r*(.18+n*.1),r*.08,r*.05,r*.11);}ctx.restore();
  }
  const energy=s.quest.activated?1:s.charge;ctx.shadowColor='#e4bc79';ctx.shadowBlur=20+energy*30;polygon(ctx,[[0,-r*.35],[r*.3,-r*.16],[r*.3,r*.16],[0,r*.35],[-r*.3,r*.16],[-r*.3,-r*.16]],`rgba(239,204,141,${.4+energy*.6})`,'#ffe0a8');ctx.shadowBlur=0;
  for(let i=0;i<3;i++){ctx.strokeStyle=s.quest.fragments[i]?'#d7b778':'#35454e';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,r*1.25,i*tau/3+.12,(i+1)*tau/3-.12);ctx.stroke();}
  if(energy>0&&s.settings.motion){ctx.strokeStyle=`rgba(239,204,141,${energy*.6})`;ctx.lineWidth=1;for(let i=0;i<3;i++){const rr=r*(1.5+((s.charge*2+i*.3)%1)*1.4);ctx.beginPath();ctx.ellipse(0,0,rr,rr*.43,-.2,0,tau);ctx.stroke();}}
  ctx.restore();
  if(!s.quest.activated){ctx.globalAlpha=1-s.charge;drawProbe(ctx,w*(.12+open*.12),h*.7,Math.max(.45,scale*.65),s.settings.motion?-s.velocity*.02:0);ctx.globalAlpha=1;}
 }else{
  // A single tether visually links all stations; its sag reacts to measured velocity.
  const a=probePosition(0,w,h),b=probePosition(1,w,h),ship=probePosition(p,w,h);
  ctx.strokeStyle='#8a978d30';ctx.lineWidth=1;ctx.setLineDash([3,7]);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.bezierCurveTo(w*.33,h*.21,w*.67,h*.21,b.x,b.y);ctx.stroke();ctx.setLineDash([]);
  const trail=ctx.createLinearGradient(a.x,a.y,ship.x,ship.y);trail.addColorStop(0,'#caa15e00');trail.addColorStop(1,'#ebc888');ctx.strokeStyle=trail;ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.quadraticCurveTo((a.x+ship.x)/2,h*(.28+Math.abs(s.velocity)*.012),ship.x,ship.y);ctx.stroke();
  for(let i=0;i<3;i++){
   const q=probePosition(i/2,w,h),near=1-clamp(Math.abs(p-i/2)*3),r=(mobile?35:53)*Math.max(.65,scale),yy=q.y+75*scale;
   ctx.save();ctx.translate(q.x,yy+(s.settings.motion?Math.sin(time*.6+i)*3:0));
   // Small cut-rock platforms with a lit machined surface, not borrowed voxel assets.
   polygon(ctx,[[-r,-r*.16],[0,-r*.46],[r,-r*.15],[r*.7,r*.54],[0,r*.86],[-r*.66,r*.5]],'#18262d','#50605e');
   polygon(ctx,[[-r,-r*.16],[0,-r*.46],[r,-r*.15],[0,r*.18]],'#53605b','#9eaa94');
   polygon(ctx,[[0,r*.18],[r,-r*.15],[r*.7,r*.54],[0,r*.86]],'#293a40');
   for(let n=0;n<7;n++){ctx.fillStyle=n%2?'#6f766750':'#101d2855';ctx.fillRect((n%3-.8)*r*.48,r*(.25+Math.floor(n/3)*.13),r*.14,r*.07);}
   ctx.translate(0,-r*.2);
   if(i===0){ctx.strokeStyle='#d5b67a';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,-r*.4,r*.37,r*.47,-.25,0,tau);ctx.stroke();ctx.fillStyle='#eedcae';for(let n=0;n<4;n++)ctx.fillRect((n-1.5)*r*.17,-r*.5+Math.sin(n)*r*.14,3,3);}
   else if(i===1){ctx.strokeStyle='#b9c9c1';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-r*.5,0);ctx.lineTo(-r*.22,-r*.65);ctx.lineTo(r*.15,-r*.2);ctx.lineTo(r*.5,-r*.7);ctx.stroke();for(const [x,y]of[[-.5,0],[-.22,-.65],[.15,-.2],[.5,-.7]]){ctx.fillStyle='#e1c087';ctx.fillRect(x*r-3,y*r-3,6,6);}}
   else{polygon(ctx,[[0,-r],[r*.45,-r*.42],[0,0],[-r*.45,-r*.42]],'#384b58','#bbc7b9');polygon(ctx,[[0,-r],[r*.45,-r*.42],[0,-r*.28]],'#b6b5a0');}
   ctx.fillStyle=`rgba(230,193,126,${.15+near*.65})`;ctx.fillRect(-r*.6,r*.15,r*1.2,2);
   ctx.font=`${Math.max(9,11*scale)}px monospace`;ctx.textAlign='center';ctx.fillStyle='#b0b7ad';ctx.fillText(`0${i+1} / ${['SOUND','PATH','FORM'][i]}`,0,r*1.4);ctx.restore();
  }
  drawProbe(ctx,ship.x,ship.y+(s.settings.motion?kick:0),Math.max(.7,scale),s.settings.motion?-s.velocity*.045+Math.sin(time*.8)*.02:0);
  // Near-plane debris provides scale and faster parallax.
  for(let i=0;i<5;i++){const dx=w*((i*.237+.05)%1),dy=h*(.83+(i%2)*.12)-(s.settings.motion?s.scroll*.021*(1+i*.05)%70:0);ctx.save();ctx.translate(dx-ox*2,dy-oy);ctx.rotate(i*1.3);const r=(12+i*3)*scale;polygon(ctx,[[-r,-r*.3],[r*.2,-r],[r,r*.2],[-r*.4,r*.7]],i%2?'#1b2a31':'#263338','#46544d60');ctx.restore();}
 }
 ctx.restore();
}
function polygon(ctx:CanvasRenderingContext2D,points:number[][],fill:string,stroke?:string){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}}
function drawProbe(ctx:CanvasRenderingContext2D,x:number,y:number,s:number,turn:number){
 ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.rotate(turn);
 const glow=ctx.createRadialGradient(0,0,2,0,0,65);glow.addColorStop(0,'#f5d49e35');glow.addColorStop(1,'#f5d49e00');ctx.fillStyle=glow;ctx.fillRect(-65,-65,130,130);
 ctx.strokeStyle='#a89d7b';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-53,0);ctx.lineTo(53,0);ctx.stroke();
 for(const side of [-1,1]){ctx.save();ctx.scale(side,1);polygon(ctx,[[22,-17],[66,-25],[70,10],[25,20]],'#16303e','#6b8d92');for(let n=0;n<4;n++){ctx.strokeStyle='#74939770';ctx.beginPath();ctx.moveTo(28+n*10,-18-n*1.5);ctx.lineTo(30+n*10,17-n*1.8);ctx.stroke();}ctx.restore();}
 polygon(ctx,[[-19,-19],[5,-29],[23,-12],[19,18],[-5,28],[-23,10]],'#8d9385','#e4d8b8');polygon(ctx,[[-19,-19],[5,-29],[23,-12],[-3,-4]],'#d3cbb0');polygon(ctx,[[-3,-4],[23,-12],[19,18],[-5,28]],'#525f61');
 ctx.fillStyle='#0b1b26';ctx.beginPath();ctx.ellipse(-4,1,10,13,-.2,0,tau);ctx.fill();ctx.strokeStyle='#d6ba7f';ctx.stroke();ctx.fillStyle='#ffe0a6';ctx.shadowColor='#ffcd78';ctx.shadowBlur=12;ctx.fillRect(-7,-2,5,5);ctx.shadowBlur=0;
 ctx.strokeStyle='#c4bf9f';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(2,-26);ctx.lineTo(8,-52);ctx.stroke();ctx.fillStyle='#e4cb91';ctx.fillRect(6,-54,4,4);ctx.restore();
}

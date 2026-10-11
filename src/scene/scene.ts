import {vertex,fragment} from './space.ts';
import {quality} from './quality.ts';
import {destination,fittedZoom,project,rest,travel,type Pose} from './camera.ts';

interface Drawing{link:HTMLAnchorElement;svg:SVGSVGElement;x:number;y:number;w:number;h:number;cx:number;cy:number;gw:number;gh:number}
export function createScene(hero:HTMLElement,motionAllowed:()=>boolean,initiallyRevealed=true){
  const canvas=hero.querySelector<HTMLCanvasElement>('.space-canvas')!,sun=hero.querySelector<HTMLElement>('.sun')!,glow=hero.querySelector<HTMLElement>('.solar-glow')!;
  const meteors=hero.querySelector<HTMLElement>('.meteors')!,aside=hero.querySelector<HTMLElement>('.project-preview')!;
  const controller=new AbortController(),options={signal:controller.signal};
  let gl:WebGLRenderingContext|null=null,program:WebGLProgram|null=null,buffer:WebGLBuffer|null=null;
  let vs:WebGLShader|null=null,fs:WebGLShader|null=null;
  let frame=0,timer:ReturnType<typeof setTimeout>|undefined,entrance:ReturnType<typeof setTimeout>|undefined;
  let visible=true,dead=false,firstMeteor=true,ready=false,weak=false,slowFrames=0;
  let revealed=initiallyRevealed;
  let width=1,height=1,px=0,py=0,tx=0,ty=0,previousTime=0,frames=0;
  let pose:Pose={...rest},velocity:Pose={x:0,y:0,zoom:0,focus:0};
  let selected:string|null|undefined,exploring=false;
  let flight:{from:Pose;to:Pose;velocity:Pose;start:number;duration:number}|null=null;
  let drawings:Drawing[]=[];
  const request=()=>{if(!frame&&!dead&&visible&&!document.hidden)frame=requestAnimationFrame(draw);};
  function destroyGL(){if(gl){if(buffer)gl.deleteBuffer(buffer);if(program)gl.deleteProgram(program);if(vs)gl.deleteShader(vs);if(fs)gl.deleteShader(fs);}gl=null;program=null;buffer=null;vs=null;fs=null;}
  function initialize(){try{
    if(new URLSearchParams(location.search).has('flat'))return;
    gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});if(!gl)return;
    const compile=(type:number,code:string)=>{const shader=gl!.createShader(type)!;gl!.shaderSource(shader,code);gl!.compileShader(shader);if(!gl!.getShaderParameter(shader,gl!.COMPILE_STATUS)){gl!.deleteShader(shader);throw new Error('Shader unavailable');}return shader;};
    vs=compile(gl.VERTEX_SHADER,vertex);fs=compile(gl.FRAGMENT_SHADER,fragment);program=gl.createProgram()!;gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Scene unavailable');gl.useProgram(program);buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);const attribute=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(attribute);gl.vertexAttribPointer(attribute,2,gl.FLOAT,false,0,0);canvas.classList.add('ready');sizeCanvas();
  }catch{destroyGL();canvas.classList.remove('ready');}}
  function sizeCanvas(){const save=(navigator as Navigator&{connection?:{saveData:boolean}}).connection?.saveData;const q=quality(width,height,weak?.65:window.devicePixelRatio,save);canvas.width=q.width;canvas.height=q.height;gl?.viewport(0,0,q.width,q.height);}
  function measure(){
    const was=hero.classList.contains('exploring');hero.classList.remove('exploring');
    const r=hero.getBoundingClientRect();if(drawings.length&&r.width===width&&r.height===height){if(was)hero.classList.add('exploring');return;}width=r.width;height=r.height;
    drawings=Array.from(hero.querySelectorAll<HTMLAnchorElement>('.constellation')).map((link,index)=>{
      for(const name of ['left','top','width','height','transform'])link.style.removeProperty(name);
      const svg=link.querySelector<SVGSVGElement>('svg')!;
      let a=link.getBoundingClientRect();
      if(width<=600){const order=[0,1,2,3,5,4].indexOf(index),col=order%2,row=Math.floor(order/2);const w=(width-62)/2,h=151;
        link.style.setProperty('left',(22+col*(w+18))+'px','important');link.style.setProperty('top',(355+row*174)+'px','important');link.style.setProperty('width',w+'px','important');link.style.setProperty('height',h+'px','important');a=link.getBoundingClientRect();}
      const box=svg.getBBox(),matrix=svg.getScreenCTM()!,point=svg.createSVGPoint();point.x=box.x+box.width/2;point.y=box.y;const top=point.matrixTransform(matrix);point.y=box.y+box.height;const bottom=point.matrixTransform(matrix);const label=link.querySelector<HTMLElement>('.constellation-label')!.getBoundingClientRect();
      const lower=Math.max(bottom.y,label.bottom),upper=Math.min(top.y,label.top);
      const item={link,svg,x:a.x-r.x,y:a.y-r.y,w:a.width,h:a.height,cx:top.x-r.x,cy:(upper+lower)/2-r.y,gw:Math.max(box.width*matrix.a,label.width),gh:lower-upper};
      for(const [key,value]of Object.entries({left:item.x,top:item.y,width:item.w,height:item.h}))link.style.setProperty(key,value+'px','important');return item;
    });if(was)hero.classList.add('exploring');sizeCanvas();
    if(selected){pose=target(selected);aside.style.opacity='1';finish();}request();
  }
  function target(id:string):Pose{const item=drawings.find(d=>d.link.dataset.select===id)!;const mobile=width<=600,compact=width<=900;
    const zoom=fittedZoom(item.gw,item.gh,mobile?width-62:width*(compact?.46:.56),mobile?265:height*.78);
    const centerY=mobile?Math.max(340,Math.min(560,340-hero.getBoundingClientRect().top)):height*.47;
    const result=destination({x:item.cx,y:item.cy},{x:width*(mobile?.5:compact?.73:.69),y:centerY},zoom);
    if(mobile)hero.style.setProperty('--preview-top',(centerY+item.gh*zoom/2+25)+'px');return result;
  }
  function finish(){flight=null;hero.classList.remove('camera-flight');hero.dataset.camera='idle';aside.inert=false;if(!selected)aside.hidden=true;scheduleMeteor();}
  function draw(time:number){frame=0;if(dead||!visible||document.hidden)return;
    const dt=previousTime?Math.min(100,time-previousTime):16,blend=1-Math.exp(-dt/95);previousTime=time;px+=(tx-px)*blend;py+=(ty-py)*blend;if(Math.abs(tx-px)+Math.abs(ty-py)<.006){px=tx;py=ty;}
    if(flight){const before={...pose};pose=travel(flight.from,flight.to,flight.velocity,time-flight.start,flight.duration);for(const key of ['x','y','zoom','focus']as const)velocity[key]=(pose[key]-before[key])/dt;
      const u=Math.min(1,(time-flight.start)/flight.duration);aside.style.opacity=String(selected?Math.max(0,(u-.77)/.23):Math.max(0,1-u*5));aside.style.transform=`translateY(${selected?14*(1-Math.max(0,(u-.77)/.23)):0}px)`;
      if(u>=1){pose={...flight.to};velocity={x:0,y:0,zoom:0,focus:0};aside.style.opacity=selected?'1':'0';aside.style.transform='none';finish();}
    }
    if(gl&&program){gl.useProgram(program);gl.uniform2f(gl.getUniformLocation(program,'resolution'),canvas.width,canvas.height);gl.uniform2f(gl.getUniformLocation(program,'pointer'),px*17/width,py*17/height);gl.uniform3f(gl.getUniformLocation(program,'camera'),pose.x/width,pose.y/height,pose.zoom);gl.uniform1f(gl.getUniformLocation(program,'emphasis'),pose.focus);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);canvas.dataset.frames=String(++frames);}
    for(const d of drawings){const center={x:d.x+d.w/2,y:d.y+d.h/2},p=project(center,pose);d.link.style.transform=`translate(${p.x-center.x+px*9}px,${p.y-center.y+py*9}px) scale(${pose.zoom})`;d.link.style.setProperty('--label-scale',String(1/pose.zoom));d.svg.style.opacity=String(d.link.dataset.select===selected?1:1-pose.focus*.65);d.link.tabIndex=selected&&d.link.dataset.select!==selected?-1:0;}
    const solarScale=1+(pose.zoom-1)*.1;sun.style.transform=`translate(${pose.x*.075+px*3}px,${pose.y*.075+py*3}px) scale(${solarScale})`;sun.style.opacity=String(.98-pose.focus*.73);glow.style.opacity=String(1-pose.focus*.7);
    hero.style.setProperty('--focus',String(pose.focus));hero.dataset.zoom=pose.zoom.toFixed(3);
    if(dt>65&&flight&&!weak&&++slowFrames>3){weak=true;hero.classList.add('quiet-quality');sizeCanvas();}
    if(flight||Math.abs(tx-px)+Math.abs(ty-py)>.006){canvas.dataset.state='settling';request();}else{canvas.dataset.state='idle';previousTime=0;}
  }
  function meteor(){if(!revealed||!motionAllowed()||flight||!visible||document.hidden||dead)return;
    const r=hero.getBoundingClientRect(),obstacles=Array.from(hero.querySelectorAll<HTMLElement>('.hero-intro,.atlas-heading,.project-preview,.constellation-label,.atlas-projects')).filter(el=>!el.hidden&&getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden').map(el=>el.getBoundingClientRect());
    let path:{x:number;y:number;dx:number;dy:number}|undefined;
    for(let attempt=0;attempt<40&&!path;attempt++){const x=width*(.72+Math.random()*.24),y=height*(width<=600?.32+Math.random()*.07:.06+Math.random()*.28),dx=-Math.min(width*.32,470),dy=Math.min(height*.16,170);
      const clear=obstacles.every(o=>{for(let step=0;step<=12;step++){const sx=r.x+x+dx*step/12,sy=r.y+y+dy*step/12;if(sx>o.left-15&&sx<o.right+15&&sy>o.top-12&&sy<o.bottom+12)return false;}return true;});if(clear)path={x,y,dx,dy};}
    if(!path){scheduleMeteor();return;}const distant=!firstMeteor&&Math.random()<.42,length=(width<=600?125:190)+Math.random()*(distant?25:65),duration=850+Math.random()*230,angle=Math.atan2(path.dy,path.dx)*180/Math.PI;
    const item=document.createElement('i');item.className='meteor';item.style.cssText=`left:${path.x-length}px;top:${path.y-14}px;width:${length+8}px;--tail:${length}px;--angle:${angle}deg;--dx:${path.dx}px;--dy:${path.dy}px;--duration:${duration}ms;--light:${distant?.48:.92}`;
    item.innerHTML=`<svg viewBox="0 -14 ${length+8} 28" width="${length+8}" height="28"><defs><linearGradient id="trail-${frames}" x1="0" x2="1"><stop stop-color="#e6bd7c" stop-opacity="0"/><stop offset=".5" stop-color="#f4d8af" stop-opacity=".28"/><stop offset="1" stop-color="#fff8e8"/></linearGradient></defs><path class="meteor-tail" d="M0 0L${length} -1.15L${length} 1.15Z" fill="url(#trail-${frames})"/><circle class="meteor-head" cx="${length}" cy="0" r="${distant?1:1.65}" fill="#fffaf0"/></svg>`;
    meteors.replaceChildren(item);item.addEventListener('animationend',event=>{if(event.target===item)item.remove();},{once:true});firstMeteor=false;hero.dataset.meteors=String(Number(hero.dataset.meteors||0)+1);scheduleMeteor();
  }
  function scheduleMeteor(){clearTimeout(timer);if(!revealed||!ready||!motionAllowed()||flight||!visible||document.hidden||dead)return;timer=setTimeout(meteor,firstMeteor?2300+Math.random()*500:7000+Math.random()*7000);}
  function resetMotion(){tx=ty=0;if(!motionAllowed()){px=py=0;meteors.replaceChildren();hero.classList.remove('scene-enter');if(flight){pose={...flight.to};aside.style.opacity=selected?'1':'0';aside.style.transform='none';finish();}}request();scheduleMeteor();}
  hero.addEventListener('pointermove',event=>{if(!motionAllowed()||event.pointerType!=='mouse')return;const r=hero.getBoundingClientRect();tx=(event.clientX-r.left)/r.width*2-1;ty=(event.clientY-r.top)/r.height*2-1;request();},options);
  hero.addEventListener('pointerleave',()=>{tx=ty=0;request();},options);
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();canvas.classList.remove('ready');gl=null;program=null;request();},options);
  canvas.addEventListener('webglcontextrestored',()=>{initialize();request();},options);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;clearTimeout(timer);meteors.replaceChildren();}else{request();scheduleMeteor();}},options);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){request();scheduleMeteor();}else{cancelAnimationFrame(frame);frame=0;clearTimeout(timer);meteors.replaceChildren();}},{threshold:.01});observer.observe(hero);
  const resizer=new ResizeObserver(measure);resizer.observe(hero);measure();initialize();
  function enter(){if(dead||!revealed||!ready)return;if(motionAllowed()){hero.classList.add('scene-enter');entrance=setTimeout(()=>hero.classList.remove('scene-enter'),1050);}scheduleMeteor();}
  void document.fonts.ready.then(()=>{if(dead)return;ready=true;enter();});
  return{reveal(){if(revealed)return;revealed=true;enter();},motionChanged:resetMotion,select(id:string|null,isExploring:boolean){if(selected===id&&exploring===isExploring)return;selected=id;exploring=isExploring;clearTimeout(timer);meteors.replaceChildren();const to=id?target(id):{...rest};hero.dataset.cameraTarget=id||'map';
    if(revealed&&motionAllowed()&&(id||pose.focus>.001)){aside.inert=true;flight={from:{...pose},to,velocity:{...velocity},start:performance.now(),duration:1080};hero.classList.add('camera-flight');hero.dataset.camera='moving';if(id)aside.style.opacity='0';}
    else{pose=to;flight=null;aside.style.opacity=id?'1':'0';aside.style.transform='none';finish();}request();},dispose(){dead=true;controller.abort();observer.disconnect();resizer.disconnect();cancelAnimationFrame(frame);clearTimeout(timer);clearTimeout(entrance);destroyGL();meteors.replaceChildren();}};
}

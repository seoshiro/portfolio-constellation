import {vertex,fragment} from './space.ts';
import {quality} from './quality.ts';
export function createScene(hero:HTMLElement,motionAllowed:()=>boolean){
  const canvas=hero.querySelector<HTMLCanvasElement>('.space-canvas')!;
  const sky=hero.querySelector<HTMLElement>('.sky')!;
  const sun=hero.querySelector<HTMLElement>('.sun')!;
  const meteors=hero.querySelector<HTMLElement>('.meteors')!;
  const controller=new AbortController(),options={signal:controller.signal};
  let gl:WebGLRenderingContext|null=null,program:WebGLProgram|null=null,buffer:WebGLBuffer|null=null;
  let vertexShader:WebGLShader|null=null,fragmentShader:WebGLShader|null=null;
  let frame=0,timer:ReturnType<typeof setTimeout>|undefined,visible=true,dead=false;
  let px=0,py=0,tx=0,ty=0,focus:[number,number]=[-1,-1],frames=0,previousTime=0,motionStarted=0;
  const draw=(time:number)=>{frame=0;if(dead||!visible||document.hidden)return;
    const blend=1-Math.exp(-(previousTime?time-previousTime:16)/85);previousTime=time;
    if(time-motionStarted>=450){px=tx;py=ty;}else{px+=(tx-px)*blend;py+=(ty-py)*blend;}
    if(gl&&program){gl.useProgram(program);gl.uniform2f(gl.getUniformLocation(program,'resolution'),canvas.width,canvas.height);gl.uniform2f(gl.getUniformLocation(program,'pointer'),px,py);gl.uniform2f(gl.getUniformLocation(program,'focus'),...focus);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);frames++;canvas.dataset.frames=String(frames);}
    sky.style.setProperty('--px',`${px*6}px`);sky.style.setProperty('--py',`${-py*5}px`);sun.style.transform=`translate(${px*3}px,${-py*2}px)`;
    if(Math.abs(tx-px)+Math.abs(ty-py)>.008){canvas.dataset.state='settling';frame=requestAnimationFrame(draw);}else{canvas.dataset.state='idle';previousTime=0;}
  };
  const request=()=>{if(!frame&&!dead&&visible&&!document.hidden)frame=requestAnimationFrame(draw);};
  const resize=()=>{const b=hero.getBoundingClientRect();const q=quality(b.width,b.height,window.devicePixelRatio,(navigator as Navigator&{connection?:{saveData:boolean}}).connection?.saveData);canvas.width=q.width;canvas.height=q.height;gl?.viewport(0,0,q.width,q.height);request();};
  function destroyGL(){if(gl){if(buffer)gl.deleteBuffer(buffer);if(program)gl.deleteProgram(program);if(vertexShader)gl.deleteShader(vertexShader);if(fragmentShader)gl.deleteShader(fragmentShader);}gl=null;program=null;buffer=null;vertexShader=null;fragmentShader=null;}
  function initialize(){try{
      if(new URLSearchParams(location.search).has('flat'))return;
      gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});if(!gl)return;
      const compile=(type:number,code:string)=>{const s=gl!.createShader(type)!;gl!.shaderSource(s,code);gl!.compileShader(s);if(!gl!.getShaderParameter(s,gl!.COMPILE_STATUS)){gl!.deleteShader(s);throw new Error('Shader unavailable');}return s;};
      vertexShader=compile(gl.VERTEX_SHADER,vertex);fragmentShader=compile(gl.FRAGMENT_SHADER,fragment);program=gl.createProgram()!;gl.attachShader(program,vertexShader);gl.attachShader(program,fragmentShader);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Scene unavailable');gl.useProgram(program);buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);const attribute=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(attribute);gl.vertexAttribPointer(attribute,2,gl.FLOAT,false,0,0);canvas.classList.add('ready');resize();
    }catch{destroyGL();canvas.classList.remove('ready');}}
  const scheduleMeteor=()=>{clearTimeout(timer);if(!motionAllowed()||!visible||document.hidden||dead)return;timer=setTimeout(()=>{if(motionAllowed()&&visible&&!document.hidden){const meteor=document.createElement('i');meteor.style.left=(43+Math.random()*43)+'%';meteor.style.top=(8+Math.random()*27)+'%';meteors.replaceChildren(meteor);meteor.addEventListener('animationend',()=>meteor.remove(),{once:true});}scheduleMeteor();},28000+Math.random()*18000);};
  const resetMotion=()=>{tx=ty=0;motionStarted=performance.now();if(!motionAllowed()){px=py=0;meteors.replaceChildren();}request();scheduleMeteor();};
  hero.addEventListener('pointermove',event=>{if(!motionAllowed()||event.pointerType!=='mouse')return;const r=hero.getBoundingClientRect();tx=((event.clientX-r.left)/r.width-.5)*2;ty=(.5-(event.clientY-r.top)/r.height)*2;motionStarted=performance.now();request();},options);
  hero.addEventListener('pointerleave',()=>{tx=ty=0;motionStarted=performance.now();request();},options);
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();if(frame)cancelAnimationFrame(frame);frame=0;canvas.classList.remove('ready');gl=null;program=null;},options);
  canvas.addEventListener('webglcontextrestored',()=>{initialize();request();},options);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){if(frame)cancelAnimationFrame(frame);frame=0;clearTimeout(timer);meteors.replaceChildren();}else{request();scheduleMeteor();}},options);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){request();scheduleMeteor();}else{if(frame)cancelAnimationFrame(frame);frame=0;clearTimeout(timer);meteors.replaceChildren();}},{threshold:.01});observer.observe(hero);
  const resizer=new ResizeObserver(resize);resizer.observe(hero);initialize();scheduleMeteor();
  return {motionChanged:resetMotion,select(x:number,y:number){focus=x>0?[x,1-y]:[-1,-1];request();},dispose(){dead=true;controller.abort();observer.disconnect();resizer.disconnect();cancelAnimationFrame(frame);clearTimeout(timer);destroyGL();meteors.replaceChildren();}};
}

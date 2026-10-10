import {chromium} from '@playwright/test';
import sharp from 'sharp';
import {fragment,vertex} from '../src/scene/space.ts';
const browser=await chromium.launch({...(process.platform==='win32'?{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}:{})});
const page=await browser.newPage({viewport:{width:1920,height:1200}});
await page.setContent('<html><body style="margin:0"><canvas width="1920" height="1200"></canvas></body></html>');
await page.evaluate(({fragment,vertex})=>{const canvas=document.querySelector('canvas')!;const gl=canvas.getContext('webgl',{alpha:false,preserveDrawingBuffer:true})!;const shader=(type:number,code:string)=>{const s=gl.createShader(type)!;gl.shaderSource(s,code);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s)||'shader');return s;};const program=gl.createProgram()!;gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);gl.useProgram(program);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);const a=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);gl.uniform2f(gl.getUniformLocation(program,'resolution'),1920,1200);gl.uniform2f(gl.getUniformLocation(program,'pointer'),0,0);gl.uniform2f(gl.getUniformLocation(program,'focus'),-1,-1);gl.viewport(0,0,1920,1200);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);},{fragment,vertex});
await sharp(await page.screenshot()).webp({quality:88}).toFile('public/assets/space.webp');
// The released solar image and its provenance are packaged. Optional original input
// can be supplied explicitly; do not fetch a changing "latest" image during builds.
if(process.env.SOLAR_SOURCE)await sharp(process.env.SOLAR_SOURCE).extract({left:0,top:0,width:2048,height:1920}).resize(1280,1280,{fit:'cover'}).webp({quality:87}).toFile('public/assets/sun.webp');
await browser.close();console.log('Baked original space; retained packaged solar and social assets.');

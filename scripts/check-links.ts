import {writeFile,mkdir} from 'node:fs/promises';
import {projects} from '../src/data/projects.ts';
const urls=[...new Set(['https://github.com/seoshiro','https://sdo.gsfc.nasa.gov/gallery/copyright/',...projects.flatMap(p=>[p.live,p.source,p.evidence])])];
const results=[];
for(let i=0;i<urls.length;i+=3){results.push(...await Promise.all(urls.slice(i,i+3).map(async url=>{try{const response=await fetch(url,{signal:AbortSignal.timeout(30000),headers:{'User-Agent':'seoshiro-portfolio-verification'}});await response.body?.cancel();return {url,status:response.status,ok:response.ok};}catch(error){return {url,status:0,ok:false,error:String(error)};}})));}
await mkdir('evidence',{recursive:true});await writeFile('evidence/links.json',JSON.stringify({checkedAt:new Date().toISOString(),results},null,2));console.log(JSON.stringify(results,null,2));if(results.some(r=>!r.ok))process.exitCode=1;

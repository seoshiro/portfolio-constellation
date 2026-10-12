import {readdir,readFile,stat} from 'node:fs/promises';
import {join} from 'node:path';
const walk=async dir=>(await Promise.all((await readdir(dir)).map(async name=>{const path=join(dir,name);return(await stat(path)).isDirectory()?walk(path):[path];}))).flat();
const files=await walk('dist');const html=files.filter(p=>p.endsWith('.html'));const issues=[];
for(const path of html){const text=await readFile(path,'utf8');for(const [,url]of text.matchAll(/(?:href|src)="([^"]+)"/g)){if(!url.startsWith('/')||url.startsWith('//'))continue;let target=url.split('#')[0].split('?')[0];if(target.endsWith('/'))target+='index.html';try{await stat('dist'+target);}catch{issues.push({path,url,reason:'Missing internal artifact'});}}
 if(!text.includes('Content-Security-Policy')||!text.includes('portfolio-build'))issues.push({path,reason:'Missing release/security metadata'});
 if(text.includes('id="atlas"'))for(const id of ['sidereal','orbit','iter','ayqyn','forme','perch'])if(!text.includes(`<template id="preview-${id}">`))issues.push({path,reason:'Missing static preview template',id});
 if(/<script(?![^>]+src=)/.test(text)||/https?:\/\/[^"'<>\s]+\.(?:js|css)/.test(text))issues.push({path,reason:'Inline or remote executable code'});
 if(text.includes('AURA')||text.includes('�'))issues.push({path,reason:'Excluded content or encoding failure'});
}
const js=files.filter(p=>p.endsWith('.js'));const bytes=(await Promise.all(js.map(async p=>(await stat(p)).size))).reduce((a,b)=>a+b,0);if(bytes>125000)issues.push({reason:'JS budget exceeded',bytes});
console.log(JSON.stringify({htmlRoutes:html.length,javascriptBytes:bytes,budget:125000,issues},null,2));if(issues.length)process.exitCode=1;

import {readFile,writeFile,readdir,stat} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {join} from 'node:path';
const walk=async dir=>(await Promise.all((await readdir(dir)).map(async name=>{const p=join(dir,name);return (await stat(p)).isDirectory()?walk(p):[p];}))).flat();
const files=await walk('dist');
const paths=files.filter(p=>p.endsWith('.html'));
const commit=process.env.PORTFOLIO_COMMIT||execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const policy="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'";
for(const path of paths){let html=await readFile(path,'utf8');if(!html.includes('<h1>')||!html.includes('<main'))throw new Error('Static content missing: '+path);html=html.replace('<meta charset="UTF-8">',`<meta charset="UTF-8"><meta http-equiv="Content-Security-Policy" content="${policy}"><meta name="portfolio-build" content="${commit}">`);await writeFile(path,html);}
for(const name of ['assets/space.webp','assets/sun.webp','assets/social.webp','fonts/Onest/Onest.woff2','fonts/Manrope/Manrope.woff2'])await stat('dist/'+name);
await writeFile('dist/version.json',JSON.stringify({sourceRepository:'seoshiro/portfolio-constellation',sourceCommit:commit,concept:'Personal Atlas',builtAt:new Date().toISOString()}));
await writeFile('dist/.nojekyll','');
await writeFile('dist/robots.txt','User-agent: *\nAllow: /\nSitemap: https://seoshiro.github.io/sitemap.xml\n');
await writeFile('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.filter(p=>!p.endsWith('404.html')).map(p=>'<url><loc>https://seoshiro.github.io/'+p.replaceAll('\\','/').replace(/^dist\//,'').replace(/index\.html$/,'')+'</loc></url>').join('')+'</urlset>');
console.log('Verified '+paths.length+' static HTML artifacts; release '+commit);

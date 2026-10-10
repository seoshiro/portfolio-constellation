import {defineConfig} from 'vite';
import {resolve} from 'node:path';
import {projects,locales} from './src/data/projects.ts';
export default defineConfig({base:'/',build:{target:'es2022',rollupOptions:{input:Object.fromEntries([...locales.flatMap(l=>[null,...projects.map(p=>p.id)].map(id=>{const path=(l==='ru'?'':l+'/')+(id?'projects/'+id+'.html':'index.html');return [l+'-'+(id||'home'),resolve(path)];})),...locales.map(l=>[l+'-credits',resolve((l==='ru'?'':l+'/')+'credits.html')]),['404',resolve('404.html')]])}}});

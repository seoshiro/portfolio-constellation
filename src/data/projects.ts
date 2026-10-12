import legacy from '../../data/legacy.json' with {type:'json'};
import {newCopy} from './new-copy.ts';
export const locales = ['ru','en','kk'] as const;
export type Locale = typeof locales[number];
export const featuredIds = ['sidereal','orbit','iter','ayqyn','forme','perch'] as const;
export interface Project {id:string;name:string;stack:string[];live:string;source:string;evidence:string;width:number;height:number;detailWidth:number;detailHeight:number;featured:boolean}
export interface ProjectCopy {category:string;title:string;summary:string;alt:string;detailAlt:string;input:string;output:string;decisions:string[];limit:string;caption:string;context?:string}
const additional:Project[] = [
  {id:'sidereal',name:'SIDEREAL',stack:['TypeScript','SVG','Web Audio','LocalStorage'],live:'https://seoshiro.github.io/sidereal/',source:'https://github.com/seoshiro/sidereal',evidence:'https://github.com/seoshiro/sidereal/blob/main/docs/QA.md',width:1920,height:1080,detailWidth:390,detailHeight:844,featured:true},
  {id:'iter',name:'ITER',stack:['React','TypeScript','Three.js','SVG','Web Speech'],live:'https://iter-navigator.vercel.app/',source:'https://github.com/seoshiro/iter-navigator',evidence:'https://github.com/seoshiro/iter-navigator/blob/main/README.md',width:1440,height:1000,detailWidth:1440,detailHeight:1000,featured:true},
  {id:'ayqyn',name:'AYQYN',stack:['Electron','JavaScript','ONNX Runtime','MediaPipe'],live:'https://seoshiro.github.io/ayqyn-local/replay/',source:'https://github.com/seoshiro/ayqyn-local',evidence:'https://github.com/seoshiro/ayqyn-local/blob/main/docs/LOCALIZATION_QA.md',width:1800,height:1200,detailWidth:1800,detailHeight:1200,featured:true}
];
const inherited:Project[] = legacy.projects.map(p=>({...p,stack:[...p.stack],featured:(featuredIds as readonly string[]).includes(p.id),detailWidth:legacy.dimensions[p.id as keyof typeof legacy.dimensions].detail[0],detailHeight:legacy.dimensions[p.id as keyof typeof legacy.dimensions].detail[1]}));
export const projects:Project[] = [...additional,...inherited].sort((a,b)=>{const order=['sidereal','orbit','iter','ayqyn','forme','perch','reson','lumen','selvedge','guidecheck','archiveguard'];return order.indexOf(a.id)-order.indexOf(b.id);});
export const featured = projects.filter(p=>p.featured);
export function projectById(id:string|null){return projects.find(p=>p.id===id);}
export function projectCopy(locale:Locale,id:string):ProjectCopy {
  const modern = newCopy[locale] as Record<string,ProjectCopy>;
  const old = legacy.projectCopy[locale] as Record<string,ProjectCopy>;
  const value=modern[id]||old[id];
  if(!value)throw new Error('Unknown project: '+id);
  return value;
}
export function rootHref(locale:Locale){return locale==='ru'?'/':'/'+locale+'/';}
export function caseHref(id:string,locale:Locale){return rootHref(locale)+'projects/'+id+'.html';}
export function validLocale(value:string|null):Locale|null{return locales.includes(value as Locale)?value as Locale:null;}

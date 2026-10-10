import {validLocale,projectById,type Locale} from './data/projects.ts';
export interface AtlasState {exploring:boolean;selected:string|null}
export function parseHash(hash:string):AtlasState {const parts=hash.replace(/^#/,'').split('/');return {exploring:parts[0]==='atlas',selected:parts[0]==='atlas'&&projectById(parts[1])?.featured?parts[1]:null};}
export function selectionHash(id:string|null){return id&&projectById(id)?.featured?'#atlas/'+id:'#atlas';}
export function routeLocale(path:string,query:string):Locale {const explicit=validLocale(new URLSearchParams(query).get('lang'));return explicit||validLocale(path.split('/')[1])||'ru';}
export function readPreference(storage:Pick<Storage,'getItem'>,key:string){try{return storage.getItem(key);}catch{return null;}}
export function writePreference(storage:Pick<Storage,'setItem'>,key:string,value:string){try{storage.setItem(key,value);return true;}catch{return false;}}

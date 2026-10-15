export const fragmentIds=['tone','path','form'] as const;
export type Fragment=typeof fragmentIds[number];
export interface Quest{fragments:Fragment[];activated:boolean}
export type Activation='idle'|'charging'|'released'|'settled';
export interface WorldState{
 active:string;progress:number;journey:number;direction:number;velocity:number;scroll:number;
 pointer:{x:number;y:number;active:boolean};proximity:number;
 quest:Quest;activation:Activation;charge:number;opening:number;
 settings:{sound:boolean;volume:number;motion:boolean};hidden:boolean;
}
export const clamp=(n:number,min=0,max=1)=>Math.max(min,Math.min(max,n));
export const smooth=(from:number,to:number,dt:number,tau:number)=>from+(to-from)*(1-Math.exp(-dt/tau));
export function readQuest(raw:string|null):Quest{
 try{const q=JSON.parse(raw||'null');if(!q||!Array.isArray(q.fragments))return{fragments:[],activated:false};
 const fragments=fragmentIds.filter(id=>q.fragments.includes(id));return{fragments,activated:fragments.length===3&&q.activated===true};
 }catch{return{fragments:[],activated:false};}
}
export function collect(q:Quest,id:Fragment):Quest{return q.fragments.includes(id)?q:{fragments:[...q.fragments,id],activated:false};}
export function initialWorld(raw:string|null=null):WorldState{return{active:'atlas',progress:0,journey:0,direction:0,velocity:0,scroll:0,pointer:{x:0,y:0,active:false},proximity:0,quest:readQuest(raw),activation:'idle',charge:0,opening:0,settings:{sound:false,volume:.28,motion:true},hidden:false};}
/** Actual position delta, in viewport heights / second; time based at any refresh rate. */
export function sampleScroll(s:WorldState,y:number,height:number,dt:number){
 const speed=clamp((y-s.scroll)/Math.max(1,height)/Math.max(.001,dt),-4,4);s.scroll=y;
 s.direction=Math.abs(speed)>.01?Math.sign(speed):0;
 s.velocity=smooth(s.velocity,speed,dt,Math.abs(speed)>Math.abs(s.velocity)?.085:.38);
 if(Math.abs(s.velocity)<.001)s.velocity=0;
}
export function routeProgress(top:number,height:number,viewport:number){return clamp(-top/Math.max(1,height-viewport));}
/** Per-event cooldown; callers never queue delayed repetitions. */
export class EventGate{
 private last=new Map<string,number>();
 allow(key:string,now:number,cooldown=.7){const previous=this.last.get(key)??-Infinity;if(now-previous<cooldown)return false;this.last.set(key,now);return true;}
 reset(){this.last.clear();}
}

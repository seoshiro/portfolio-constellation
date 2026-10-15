import {audioCopy} from '../data/interface-copy.ts';
import type {Locale} from '../data/projects.ts';
import {EventGate,clamp,type WorldState} from '../voyage/state.ts';
const motifs:Record<string,number[]>={sidereal:[69,76,71],orbit:[72,67,76],iter:[74,76,69],ayqyn:[64,69,72],forme:[67,71,74],perch:[71,76,81]};
type Tone={gain:GainNode;nodes:OscillatorNode[]};
export function createAtmosphere(locale:Locale){
 const c=audioCopy[locale],panel=document.querySelector<HTMLDetailsElement>('.sound-controls')!,button=panel.querySelector<HTMLButtonElement>('.sound-toggle')!,summary=panel.querySelector<HTMLElement>('summary')!,label=panel.querySelector<HTMLElement>('.sound-state')!,status=panel.querySelector<HTMLElement>('.sound-status')!,slider=panel.querySelector<HTMLInputElement>('.volume')!,controller=new AbortController(),options={signal:controller.signal};
 let context:AudioContext|null=null,master:GainNode|null=null,loop:AudioBufferSourceNode|null=null,buffer:AudioBuffer|null=null,wanted=false,dead=false,generation=0,timer=0,request:AbortController|null=null,previous:string|null=null,tone:Tone|null=null;const tails:Tone[]=[];
 let music:GainNode|null=null,ambience:GainNode|null=null,sfx:GainNode|null=null,wind:AudioBufferSourceNode|null=null,windFilter:BiquadFilterNode|null=null,pan:StereoPannerNode|null=null;const gate=new EventGate(),voices=new Set<{node:OscillatorNode;envelope:GainNode}>();let ducked=false;
 try{const saved=localStorage.getItem('atlas-volume');if(saved!==null&&Number.isFinite(Number(saved)))slider.value=String(Math.max(0,Math.min(100,Number(saved))));}catch{/* Optional preference. */}
 const volume=()=>Number(slider.value)/100;
 const suspend=()=>{if(context&&context.state!=='closed')void context.suspend().catch(()=>{/* A concurrent close is already silent. */});};
 function ui(message=''){const text=wanted?c.soundOn:c.soundOff;button.textContent=text;button.setAttribute('aria-pressed',String(wanted));summary.setAttribute('aria-label',text);label.textContent=text;panel.classList.toggle('sound-enabled',wanted);status.textContent=message;document.body.dataset.sound=wanted?'on':'off';document.dispatchEvent(new Event('portfolio-sound-change'));}
 function fade(value:number){if(!context||!master)return;const t=context.currentTime;master.gain.cancelScheduledValues(t);master.gain.setTargetAtTime(value,t,.36);}
 function quiet(){if(context&&master){master.gain.cancelScheduledValues(context.currentTime);master.gain.value=0;}}
 function playLoop(){if(!context||!buffer)return false;if(loop)return true;quiet();loop=context.createBufferSource();loop.buffer=buffer;loop.loop=true;loop.connect(music!);loop.start();return true;}
 function current(revision:number){return !dead&&revision===generation&&wanted;}
 function failed(){wanted=false;cancelTone(true);quiet();suspend();ui(c.failed);}
 function cancelTone(immediate=false){if(!context)return;const t=context.currentTime;if(immediate){for(const group of [...tails,...(tone?[tone]:[])]){group.gain.disconnect();for(const node of group.nodes)try{node.stop(t);}catch{/* Already ended. */}}tails.length=0;tone=null;return;}if(!tone)return;const old=tone;tone=null;old.gain.gain.cancelScheduledValues(t);old.gain.gain.setTargetAtTime(0,t,.025);for(const node of old.nodes)try{node.stop(t+.14);}catch{/* Already ended. */}tails.push(old);while(tails.length>1){const older=tails.shift()!;older.gain.gain.cancelScheduledValues(t);older.gain.gain.setTargetAtTime(0,t,.005);for(const node of older.nodes)try{node.stop(t+.025);}catch{/* Already ended. */}}}
 async function toggle(){if(dead)return;wanted=!wanted;const revision=++generation;clearTimeout(timer);request?.abort();ui();if(!wanted){cancelTone();stopEffects(false);fade(0);timer=window.setTimeout(()=>{if(!wanted&&context?.state==='running')suspend();},1800);return;}
  try{
   if(!context){context=new AudioContext();master=context.createGain();master.gain.value=0;master.connect(context.destination);initLayers();}
   await context.resume();if(!current(revision))return;if(document.hidden){quiet();suspend();}else if(loop)fade(volume());
   if(!buffer){ui(c.loading);request=new AbortController();const response=await fetch('/audio/atlas-atmosphere.wav',{signal:request.signal});if(!response.ok)throw new Error('Audio unavailable');buffer=await context.decodeAudioData(await response.arrayBuffer());}
   if(!current(revision)||document.hidden)return;if(playLoop())fade(volume());ui();
  }catch(error){if(!current(revision)||(error as Error).name==='AbortError')return;failed();}
 }
 function initLayers(){
  if(!context||!master)return;music=context.createGain();ambience=context.createGain();sfx=context.createGain();music.connect(master);ambience.connect(master);sfx.connect(master);ambience.gain.value=0;music.gain.value=ducked?.22:1;sfx.gain.value=1;
  const noise=context.createBuffer(1,context.sampleRate*2,context.sampleRate),data=noise.getChannelData(0);let seed=4719;for(let i=0;i<data.length;i++){seed=(seed*16807)%2147483647;data[i]=(seed/2147483647*2-1)*.45;}
  wind=context.createBufferSource();wind.buffer=noise;wind.loop=true;windFilter=context.createBiquadFilter();windFilter.type='bandpass';windFilter.frequency.value=420;windFilter.Q.value=.35;pan=context.createStereoPanner();wind.connect(windFilter);windFilter.connect(pan);pan.connect(ambience);wind.start();
 }
 function stopEffects(immediate=true){for(const voice of voices){try{if(!immediate&&context){const now=context.currentTime;voice.envelope.gain.cancelScheduledValues(now);voice.envelope.gain.setTargetAtTime(.0001,now,.015);voice.node.stop(now+.08);}else{voice.node.stop();voice.node.disconnect();voice.envelope.disconnect();}}catch{/* Already finished. */}}if(immediate)voices.clear();}
 function effect(key:string){
  if(dead||!wanted||!context||context.state!=='running'||document.hidden||!sfx||!loop)return;
  const now=context.currentTime;if(!gate.allow(key,now,key==='collect'?.16:key==='activate'?2:.9))return;
  if(key==='activate')stopEffects();if(voices.size>=4)return;
  const notes=key==='collect'?[880,1320]:key==='activate'?[110,220,440]:key==='arrival'?[164.81]:[220];if(voices.size+notes.length>4)return;
  for(const [i,hz]of notes.entries()){
   const node=context.createOscillator(),envelope=context.createGain(),start=now+i*.045,duration=key==='activate'?1.25:key==='collect'?.34:.23,voice={node,envelope};
   node.type=key==='arrival'?'triangle':'sine';node.frequency.setValueAtTime(hz,start);if(key==='arrival')node.frequency.exponentialRampToValueAtTime(hz*.55,start+duration);
   envelope.gain.setValueAtTime(0,start);envelope.gain.linearRampToValueAtTime(key==='activate'?.075:.045,start+.018);envelope.gain.exponentialRampToValueAtTime(.0001,start+duration);node.connect(envelope);envelope.connect(sfx);voices.add(voice);node.start(start);node.stop(start+duration+.02);node.onended=()=>{voices.delete(voice);node.disconnect();envelope.disconnect();};
  }
 }
 button.addEventListener('click',()=>void toggle(),options);
 slider.addEventListener('input',()=>{try{localStorage.setItem('atlas-volume',slider.value);}catch{/* Optional preference. */}if(wanted&&loop&&!document.hidden)fade(volume());},options);
 function visibility(){if(dead)return;clearTimeout(timer);cancelTone(true);stopEffects();if(!context)return;if(document.hidden||!wanted){quiet();suspend();}else{const revision=generation;void context.resume().then(()=>{if(current(revision)&&!document.hidden){if(playLoop())fade(volume());ui(buffer?'':c.loading);}}).catch(()=>{if(current(revision)&&!document.hidden)failed();});}}
 document.addEventListener('visibilitychange',visibility,options);ui();
 return {enable(){if(!wanted)void toggle();},silence(){if(wanted)void toggle();},
 update(state:WorldState){state.settings.sound=wanted;state.settings.volume=volume();if(!context||!ambience||!pan||!windFilter)return;const now=context.currentTime,enabled=wanted&&!!loop&&!document.hidden&&context.state==='running',speed=clamp(Math.abs(state.velocity)/2.4);ambience.gain.setTargetAtTime(enabled?.015+speed*.16+state.proximity*.012:0,now,speed>.05?.09:.4);windFilter.frequency.setTargetAtTime(260+speed*1250+state.proximity*100,now,.16);pan.pan.setTargetAtTime(state.pointer.active?clamp(state.pointer.x,-1,1)*.22:0,now,.22);document.body.dataset.audioVoices=String(voices.size);document.body.dataset.audioContexts=context?'1':'0';},
 event:effect,cancel(){stopEffects(false);},duck(active:boolean){ducked=active;if(context&&music){const now=context.currentTime;music.gain.cancelScheduledValues(now);music.gain.setTargetAtTime(active?.22:1,now,active?.16:.6);}},
 select(id:string|null){if(dead||id===previous)return;previous=id;cancelTone();if(!wanted||!context||context.state!=='running'||document.hidden)return;const notes=id?motifs[id]:[64];if(!notes)return;const gain=context.createGain(),nodes:OscillatorNode[]=[],now=context.currentTime,group={gain,nodes};let remaining=notes.length;gain.connect(sfx!);tone=group;for(const [i,note]of notes.entries()){const oscillator=context.createOscillator(),envelope=context.createGain(),start=now+i*.28;oscillator.frequency.value=440*2**((note-69)/12);envelope.gain.setValueAtTime(0,start);envelope.gain.linearRampToValueAtTime(.055,start+.07);envelope.gain.exponentialRampToValueAtTime(.0001,start+1.55);oscillator.connect(envelope);envelope.connect(gain);oscillator.start(start);oscillator.stop(start+1.7);oscillator.onended=()=>{oscillator.disconnect();envelope.disconnect();if(!--remaining){gain.disconnect();if(tone===group)tone=null;const index=tails.indexOf(group);if(index>=0)tails.splice(index,1);}oscillator.onended=null;};nodes.push(oscillator);}},hide(){cancelTone(true);stopEffects();quiet();suspend();},resume:visibility,dispose(){dead=true;wanted=false;generation++;controller.abort();clearTimeout(timer);request?.abort();cancelTone(true);stopEffects();wind?.stop();wind?.disconnect();windFilter?.disconnect();pan?.disconnect();music?.disconnect();ambience?.disconnect();sfx?.disconnect();loop?.stop();loop?.disconnect();master?.disconnect();if(context)void context.close().catch(()=>{/* Already closed. */});}};
}

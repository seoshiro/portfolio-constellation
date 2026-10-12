// Original deterministic score and additive synthesis for this portfolio.
// No third-party recordings, samples, models or music services are used.
import {mkdir,writeFile} from 'node:fs/promises';
import {Buffer} from 'node:buffer';
import {createHash} from 'node:crypto';
const sampleRate=24000,seconds=48,count=sampleRate*seconds,left=new Float64Array(count),right=new Float64Array(count),tau=2*Math.PI;
const frequency=note=>Math.round(440*2**((note-69)/12)*seconds)/seconds;
const chords=[[45,52,55,59],[48,52,55,62],[50,57,60,64],[52,55,59,62]];
function pad(note,start,voice){const hz=frequency(note),pan=(voice-1.5)*.17,phase=voice*.73;
 for(let i=0;i<count;i++){const t=i/sampleRate,age=(t-start+seconds)%seconds;if(age>=20)continue;const envelope=Math.sin(Math.PI*age/20)**2,breath=.92+.08*Math.sin(tau*t/seconds+phase);const fundamental=Math.sin(tau*hz*t+phase),second=.11*Math.sin(tau*hz*2*t+phase),third=.025*Math.sin(tau*hz*3*t+.2);const signal=(fundamental+second+third)*envelope*breath*.042;left[i]+=signal*(1-pan)+.004*Math.sin(tau*(hz-1/seconds)*t+phase)*envelope;right[i]+=signal*(1+pan)+.004*Math.sin(tau*(hz+1/seconds)*t+phase)*envelope;}
}
for(const [bar,chord]of chords.entries())for(const [voice,note]of chord.entries())pad(note,bar*12,voice);
for(const [event,note]of [76,74,71,72].entries())for(const [echo,level]of [[0,1],[.37,.26],[.89,.12]]){const hz=frequency(note),start=event*12+7+echo;for(let i=0;i<count;i++){const t=i/sampleRate,age=(t-start+seconds)%seconds;if(age>=6)continue;const envelope=(1-Math.exp(-age/ .09))*Math.exp(-age/1.05)*(1-age/6)**2;const signal=(Math.sin(tau*hz*t)+.09*Math.sin(tau*hz*2*t))*.028*envelope*level;left[i]+=signal*(event%2?.6:1);right[i]+=signal*(event%2?1:.6);}}
let peak=0,sum=0;for(let i=0;i<count;i++)peak=Math.max(peak,Math.abs(left[i]),Math.abs(right[i]));const gain=.55/peak;
const wav=Buffer.alloc(44+count*4);wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(2,22);wav.writeUInt32LE(sampleRate,24);wav.writeUInt32LE(sampleRate*4,28);wav.writeUInt16LE(4,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(count*4,40);
for(let i=0;i<count;i++){const l=left[i]*gain,r=right[i]*gain;sum+=(l*l+r*r)/2;wav.writeInt16LE(Math.round(l*32767),44+i*4);wav.writeInt16LE(Math.round(r*32767),46+i*4);}
const step=Math.max(Math.abs(left[0]-left[count-1]),Math.abs(right[0]-right[count-1]))*gain;
await mkdir('public/audio',{recursive:true});await writeFile('public/audio/atlas-atmosphere.wav',wav);
const record={title:'Atlas / quiet orbit',origin:'Original deterministic composition and additive synthesis created for the seoshiro portfolio; no third-party samples or reference audio copied.',license:'CC0-1.0',sampleRate,seconds,channels:2,chords,midiNotes:[76,74,71,72],peak:.55,rms:Math.sqrt(sum/count),loopSampleStep:step,sha256:createHash('sha256').update(wav).digest('hex')};await writeFile('public/audio/score.json',JSON.stringify(record,null,2));console.log(JSON.stringify(record));

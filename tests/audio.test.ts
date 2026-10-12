import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
test('original PCM score has quiet bounded levels, matching provenance and a continuous cyclic boundary',()=>{
 const bytes=readFileSync('public/audio/atlas-atmosphere.wav'),score=JSON.parse(readFileSync('public/audio/score.json','utf8'));assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.readUInt16LE(20),1);assert.equal(bytes.readUInt16LE(22),2);assert.equal(bytes.readUInt16LE(34),16);assert.equal(bytes.length,44+score.seconds*score.sampleRate*4);assert.equal(createHash('sha256').update(bytes).digest('hex'),score.sha256);
 let peak=0,sum=0;const frames=(bytes.length-44)/4;for(let i=44;i<bytes.length;i+=2){const sample=bytes.readInt16LE(i)/32768;peak=Math.max(peak,Math.abs(sample));sum+=sample*sample;}assert.ok(peak<.56&&peak>.5);const rms=Math.sqrt(sum/(frames*2));assert.ok(rms>.05&&rms<.2);
 for(const channel of [0,1]){const value=(i:number)=>bytes.readInt16LE(44+((i+frames)%frames)*4+channel*2)/32768;const seam=value(0)-value(-1),neighbours=((value(1)-value(0))+(value(-1)-value(-2)))/2;assert.ok(Math.abs(seam-neighbours)<.0015,'Loop boundary follows the normal local waveform slope');}
 assert.equal(score.license,'CC0-1.0');assert.ok(readFileSync('public/licenses/Portfolio-Audio-CC0.txt','utf8').includes('CC0 1.0 Universal'));
});

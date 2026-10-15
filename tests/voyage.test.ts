import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initialWorld,readQuest,collect,sampleScroll,routeProgress,EventGate} from '../src/voyage/state.ts';
test('quest validates storage, deduplicates fragments and requires all three for persisted activation',()=>{
 assert.deepEqual(readQuest('{bad'),{fragments:[],activated:false});
 assert.deepEqual(readQuest('{"fragments":["tone","tone","wrong"],"activated":true}'),{fragments:['tone'],activated:false});
 let q=readQuest(null);q=collect(q,'tone');assert.equal(collect(q,'tone'),q);q=collect(collect(q,'path'),'form');assert.equal(q.fragments.length,3);assert.equal(readQuest(JSON.stringify({...q,activated:true})).activated,true);
});
test('reversible pin progress is clamped, deterministic and safe for short scenes',()=>{
 assert.equal(routeProgress(0,2600,1000),0);assert.equal(routeProgress(-800,2600,1000),.5);assert.equal(routeProgress(-1600,2600,1000),1);assert.equal(routeProgress(300,2600,1000),0);assert.equal(routeProgress(-9999,2600,1000),1);assert.equal(routeProgress(0,500,1000),0);
});
test('scroll audio derives from actual displacement with time-based smoothing and a slower release',()=>{
 const a=initialWorld(),b=initialWorld();for(let i=1;i<=60;i++)sampleScroll(a,i*1000/60,1000,1/60);for(let i=1;i<=120;i++)sampleScroll(b,i*1000/120,1000,1/120);
 assert.ok(Math.abs(a.velocity-b.velocity)<.001);assert.ok(a.velocity>.99);sampleScroll(a,980,1000,1/60);assert.equal(a.direction,-1);
 for(let i=0;i<180;i++)sampleScroll(a,980,1000,1/60);assert.equal(a.velocity,0);
 const spike=initialWorld();sampleScroll(spike,1e6,1000,1/60);assert.ok(spike.velocity<=4);
});
test('event cooldown suppresses threshold chatter without delaying or queuing old effects',()=>{
 const gate=new EventGate();assert.equal(gate.allow('arrival',1),true);assert.equal(gate.allow('arrival',1.02),false);assert.equal(gate.allow('collect',1.02,.15),true);assert.equal(gate.allow('arrival',1.8),true);gate.reset();assert.equal(gate.allow('arrival',1.81),true);
});

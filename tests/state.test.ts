import test from 'node:test';
import assert from 'node:assert/strict';
import {parseHash,selectionHash,routeLocale,readPreference,writePreference} from '../src/state.ts';
import {quality} from '../src/scene/quality.ts';
test('Atlas URLs survive invalid input and select only known featured projects',()=>{assert.deepEqual(parseHash('#atlas/sidereal'),{exploring:true,selected:'sidereal'});assert.deepEqual(parseHash('#atlas/not-a-project'),{exploring:true,selected:null});assert.deepEqual(parseHash('#about'),{exploring:false,selected:null});assert.equal(selectionHash('aura'),'#atlas');assert.equal(selectionHash('iter'),'#atlas/iter');});
test('Legacy language query and static language paths resolve correctly',()=>{assert.equal(routeLocale('/projects/orbit.html','?lang=kk'),'kk');assert.equal(routeLocale('/en/projects/iter.html',''),'en');assert.equal(routeLocale('/','?lang=bad'),'ru');});
test('Optional preferences tolerate denied storage',()=>{assert.equal(readPreference({getItem(){throw new Error('Denied');}},'x'),null);assert.equal(writePreference({setItem(){throw new Error('Denied');}},'x','y'),false);});
test('Rendering stays below its pixel budget at large screens and high DPR',()=>{for(const [w,h,d]of[[360,900,3],[1920,1080,2],[3840,2160,2]]){const q=quality(w,h,d);assert(q.width*q.height<=1600000);assert(q.ratio<=1.35);}assert(quality(390,844,3,true).ratio<=1);});

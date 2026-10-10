import {test} from 'node:test';
import assert from 'node:assert/strict';
import {destination,project,rest,travel,fittedZoom} from '../src/scene/camera.ts';
test('The camera projects the actual target center and respects fit limits',()=>{
  const center={x:1180,y:650},target={x:960,y:450};const zoom=fittedZoom(300,360,650,550);assert.ok(zoom>=1.5&&zoom<=2.4);assert.ok(300*zoom<=650&&360*zoom<=550);
  const pose=destination(center,target,zoom);assert.deepEqual(project(center,pose),target);
});
test('A rapid retarget starts at the visible pose; arrival has no overshoot',()=>{
  const first=destination({x:900,y:200},{x:990,y:450},2);const zero={x:0,y:0,zoom:0,focus:0};const visible=travel(rest,first,zero,360,1080);
  const second=destination({x:600,y:750},{x:990,y:450},2.15);const velocity={x:-.1,y:.05,zoom:.0004,focus:.0002};assert.deepEqual(travel(visible,second,velocity,0,1080),visible);assert.deepEqual(travel(visible,second,velocity,1080,1080),second);
  const almost=travel(visible,second,velocity,1079,1080);assert.ok(Math.abs(almost.x-second.x)<.01);assert.ok(Math.abs(almost.zoom-second.zoom)<.0001);
});
test('Foreground and distant stars have distinct projected motion',()=>{const point={x:300,y:200},pose={x:-220,y:80,zoom:2,focus:1};const far=project(point,pose,.28),near=project(point,pose,1.12);assert.ok(Math.abs(near.x-point.x)>Math.abs(far.x-point.x));assert.ok(Math.abs(near.y-point.y)>Math.abs(far.y-point.y));});

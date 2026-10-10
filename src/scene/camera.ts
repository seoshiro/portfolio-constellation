export interface Pose{x:number;y:number;zoom:number;focus:number}
export interface Point{x:number;y:number}
export const rest:Pose={x:0,y:0,zoom:1,focus:0};
export function destination(center:Point,target:Point,zoom:number):Pose{return {x:target.x-center.x*zoom,y:target.y-center.y*zoom,zoom,focus:1};}
// A continuous position and initial velocity survive a retarget; arrival has zero velocity.
export function travel(from:Pose,to:Pose,velocity:Pose,elapsed:number,duration:number):Pose{
  const u=Math.min(1,Math.max(0,elapsed/duration)),s=u*u*(3-2*u),carry=u*(1-u)*(1-u);
  const result={...from};for(const key of ['x','y','zoom','focus']as const){const distance=to[key]-from[key],limit=Math.abs(distance)*1.8/duration;const v=Math.max(-limit,Math.min(limit,velocity[key]));result[key]=from[key]+distance*s+v*duration*carry;}return result;
}
export function project(point:Point,pose:Pose,depth=1):Point{const scale=1+(pose.zoom-1)*depth;return{x:point.x*scale+pose.x*depth,y:point.y*scale+pose.y*depth};}
export function fittedZoom(width:number,height:number,availableWidth:number,availableHeight:number){return Math.max(1.1,Math.min(2.15,availableWidth/width,availableHeight/height));}

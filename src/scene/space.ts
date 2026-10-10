// Original procedural galactic dust and starfield. No time uniform: the sky rests.
export const vertex=`attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}`;
export const fragment=`precision highp float;
uniform vec2 resolution;uniform vec2 pointer;uniform vec2 focus;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=mat2(1.6,-1.2,1.2,1.6)*p+17.2;a*=.5;}return v;}
vec3 stars(vec2 uv,vec2 grid,float seed){vec2 q=uv*grid,cell=floor(q);float n=hash(cell+seed);vec2 center=vec2(hash(cell+seed+3.),hash(cell+seed+19.));float d=length((fract(q)-center)*vec2(1.,.9));float light=smoothstep(.986,1.,n);float point=exp(-d*d*150.)*.75+exp(-d*12.)*.12;return mix(vec3(.62,.72,.84),vec3(1.,.82,.57),hash(cell+37.))*point*light;}
void main(){vec2 uv=gl_FragCoord.xy/resolution;uv+=pointer*.009;float aspect=resolution.x/resolution.y;vec2 p=uv*vec2(aspect,1.);vec2 warp=vec2(fbm(p*3.),fbm(p*3.+29.));float grain=fbm(p*13.+warp*4.);float band=exp(-pow((uv.y-(.10+.68*uv.x)+.07*sin(uv.x*8.))*(6.+grain*2.),2.));float dust=pow(grain,2.6)*band;float ridges=pow(1.-abs(fbm(p*24.+warp*3.)*2.-1.),4.);float detail=fbm(p*66.);float shadow=pow(fbm(p*12.+7.),1.6);vec3 color=vec3(.018,.023,.03)+vec3(.20,.11,.052)*dust*ridges*(.5+detail)*1.6; color+=vec3(.025,.038,.052)*pow(fbm(p*5.+10.),3.);color*=.75+shadow*.5;color+=stars(uv,vec2(210.,135.),2.)+stars(uv,vec2(127.,83.),41.)*.7+stars(uv,vec2(67.,43.),83.)*.7;
float veil=1.-smoothstep(.0,.75,1.-uv.x);color+=vec3(.024,.014,.003)*veil;if(focus.x>0.){float glow=exp(-length((uv-focus)*vec2(aspect,1.))*9.);color+=vec3(.055,.024,.005)*glow;}gl_FragColor=vec4(color,1.);}`;

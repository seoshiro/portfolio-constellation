import type {Locale} from '../data/projects.ts';

const labels={
  ru:{title:'Созвездия проектов',hint:'Вступление завершится автоматически. Его можно пропустить.',skip:'Перейти к портфолио'},
  en:{title:'Project constellations',hint:'This introduction ends automatically. You can skip it.',skip:'Enter portfolio'},
  kk:{title:'Жоба шоқжұлдыздары',hint:'Кіріспе автоматты түрде аяқталады. Оны өткізіп жіберуге болады.',skip:'Портфолиоға өту'},
};

// A small local classic script runs before first paint under the existing CSP.
// No inline executable code or remote dependency is needed.
export const introBootstrap='<script src="/entry-bootstrap.js"></script>';

export function introMarkup(locale:Locale){
  const c=labels[locale];
  const points=[[27,119],[63,63],[126,43],[176,86],[152,155],[91,169]];
  const edges=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[1,5]];
  return `<div class="entry-intro" role="dialog" aria-modal="true" aria-labelledby="entry-brand" aria-describedby="entry-hint"><div class="entry-core"><svg class="entry-constellation" viewBox="0 0 210 210" aria-hidden="true" focusable="false"><defs><radialGradient id="entry-halo"><stop stop-color="#ffe9c5" stop-opacity=".6"/><stop offset="1" stop-color="#e7b97c" stop-opacity="0"/></radialGradient></defs><g class="entry-lines">${edges.map(([a,b],i)=>`<line pathLength="1" style="--order:${i}" x1="${points[a][0]}" y1="${points[a][1]}" x2="${points[b][0]}" y2="${points[b][1]}"/>`).join('')}</g>${points.slice(0,6).map(([x,y],i)=>`<g class="entry-star" style="--order:${i}" transform="translate(${x} ${y})"><circle fill="url(#entry-halo)" r="${i===2?18:12}"/><path d="M-5 0H5M0-5V5"/><circle class="entry-point" r="${i===2?1.8:1.15}"/></g>`).join('')}</svg><p class="entry-brand" id="entry-brand">seoshiro<span aria-hidden="true">.</span></p><p class="entry-caption">${c.title}</p></div><p class="sr-only" id="entry-hint">${c.hint}</p><button class="entry-skip" type="button">${c.skip}<span aria-hidden="true">↗</span></button></div>`;
}

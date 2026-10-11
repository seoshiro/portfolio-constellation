import {nameFont} from '../data/name-font.ts';

/** Install the original name glyphs before entry can reveal the hero. */
export function installNameFont(){
  const heading=document.querySelector<HTMLElement>('.hero-intro h1');
  if(!heading||typeof FontFace==='undefined')return;
  try{
    const bytes=Uint8Array.from(atob(nameFont),character=>character.charCodeAt(0));
    const face=new FontFace('Manrope Name',bytes.buffer,{weight:'200 800'});
    // Binary-backed faces load synchronously. Keep ordinary CSS fallback if
    // this browser cannot decode it; never wait on a font or delay the intro.
    if(face.status!=='loaded')return;
    document.fonts.add(face);
    heading.style.fontFamily='"Manrope Name", Manrope, Arial, sans-serif';
    // Preserve full-face warm-cache readiness as an independent background
    // download. It cannot replace the heading face or hold Skip/entry open.
    void document.fonts.load('525 100px Manrope','Beibars Ileskhan').catch(()=>{});
  }catch{/* The existing local CSS font and readable fallback remain usable. */}
}

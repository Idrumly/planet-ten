import * as T from './vendor/three-0.187.0.mjs';

// Small original painted textures, generated once per model. No remote assets.
export function botanicalTexture(kind='leaf'){
 const c=document.createElement('canvas');c.width=256;c.height=512;
 const ctx=c.getContext('2d'),g=ctx.createLinearGradient(0,0,0,512);
 const colors=kind==='petal'?['#fae2b5','#eb8b9c','#ad416c','#4d8c68']:['#a9c787','#5d9b72','#286c5b','#204b44'];
 colors.forEach((color,i)=>g.addColorStop(i/3,color));ctx.fillStyle=g;ctx.fillRect(0,0,256,512);
 let seed=19;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<1800;i++){const x=rand()*256,y=rand()*512;ctx.fillStyle=i%3?'rgba(255,241,193,.075)':'rgba(57,24,55,.13)';ctx.beginPath();ctx.ellipse(x,y,.5+rand()*1.4,1+rand()*3,0,0,Math.PI*2);ctx.fill();}
 ctx.lineWidth=1;ctx.strokeStyle=kind==='petal'?'rgba(116,42,70,.24)':'rgba(194,222,143,.25)';
 for(let i=-10;i<=10;i++){ctx.beginPath();ctx.moveTo(128+i*1.7,512);ctx.bezierCurveTo(128+i*6,320,128+i*12,170,128+i*14,0);ctx.stroke();}
 for(let y=100;y<500;y+=42)for(const sign of [-1,1]){ctx.beginPath();ctx.moveTo(128,y);ctx.quadraticCurveTo(128+sign*40,y-25,128+sign*115,y-65);ctx.stroke();}
 const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=2;return texture;
}

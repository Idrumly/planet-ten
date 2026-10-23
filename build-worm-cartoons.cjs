// Package generated drawings with one shared scale per act, preserving the whole scene.
const sharp=require('sharp'),fs=require('fs'),path=require('path');
const specs=require('./worm-cast-specs.json').characters;
const root='assets/rounding/worm-cartoons-v1';
async function build(spec){
 const dir=path.join(root,spec.id),source=path.join(dir,'source.png');if(!fs.existsSync(source))return;
 const atlas=path.join(dir,'atlas.webp');if(fs.existsSync(atlas)&&fs.statSync(atlas).mtimeMs>Math.max(fs.statSync(source).mtimeMs,fs.statSync(__filename).mtimeMs))return;
 const {data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const alpha=(x,y)=>data[(y*info.width+x)*4+3],rowCuts=[0];
 // Generated gutters can drift a few pixels; choose the emptiest line near each boundary.
 for(let r=1;r<4;r++){let best=Math.round(r*info.height/4),score=Infinity;for(let y=best-25;y<=r*info.height/4+25;y++){let s=0;for(let x=0;x<info.width;x++)s+=alpha(x,y);s+=Math.abs(y-r*info.height/4)*.1;if(s<score){score=s;best=y;}}rowCuts.push(best);}rowCuts.push(info.height);
 const bounds=[];
 for(let r=0;r<4;r++){const cuts=[0];for(let c=1;c<6;c++){let best=Math.round(c*info.width/6),score=Infinity;for(let x=best-24;x<=c*info.width/6+32;x++){let s=0;for(let y=rowCuts[r];y<rowCuts[r+1];y++)s+=alpha(x,y);s+=Math.abs(x-c*info.width/6)*.1;if(s<score){score=s;best=x;}}cuts.push(best);}cuts.push(info.width);
 for(let c=0;c<6;c++){const left=cuts[c],right=cuts[c+1],top=rowCuts[r],bottom=rowCuts[r+1];let x0=right,x1=left,y0=bottom,y1=top;for(let y=top;y<bottom;y++)for(let x=left;x<right;x++)if(alpha(x,y)>30){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}if(x1<x0)throw Error(spec.id+' empty frame '+bounds.length);bounds.push({left:x0,top:y0,width:x1-x0+1,height:y1-y0+1});}}
 const scale=236/Math.max(...bounds.flatMap(b=>[b.width,b.height])),tiles=[];
 for(let i=0;i<24;i++){const b=bounds[i],width=Math.max(1,Math.round(b.width*scale)),height=Math.max(1,Math.round(b.height*scale));const input=await sharp(source).extract(b).resize(width,height).png().toBuffer();const tile=await sharp({create:{width:256,height:256,channels:4,background:'#00000000'}}).composite([{input,left:Math.floor((256-width)/2),top:246-height}]).png().toBuffer();tiles.push({input:tile,left:i%6*256,top:Math.floor(i/6)*256});}
 await sharp({create:{width:1536,height:1024,channels:4,background:'#00000000'}}).composite(tiles).webp({quality:88,alphaQuality:100}).toFile(path.join(dir,'atlas.webp'));
 await sharp(source).extract(bounds[0]).webp({quality:90,alphaQuality:100}).toFile(path.join(dir,'idle.webp'));
 fs.writeFileSync(path.join(dir,'bounds.json'),JSON.stringify({scale,rowCuts,bounds},null,2));console.log(spec.name+': 24 poses packaged');
}
(async()=>{for(const spec of specs)await build(spec);
 const puff=path.join(root,'balloon');fs.mkdirSync(puff,{recursive:true});fs.copyFileSync('assets/rounding/puff-v1/puff-atlas.webp',path.join(puff,'atlas.webp'));await sharp('assets/rounding/puff-v1/frames/01.png').trim({threshold:10}).webp({quality:90}).toFile(path.join(puff,'idle.webp'));
 const records=[{id:'balloon',name:'Puff'},...specs.map(({id,name})=>({id,name}))];fs.writeFileSync('worm-cast.js',`'use strict';\nwindow.WormCast=Object.freeze(${JSON.stringify(records)});\n`);
})().catch(e=>{console.error(e);process.exitCode=1});

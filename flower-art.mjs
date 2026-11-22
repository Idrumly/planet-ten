// Original Planet Ten species, loosely inspired by remarkable Earth flowers.
// Shapes share the clue hit-area envelope, but have different bracts, lips and stems.
export const plants=[
 ['Puddlehopper','#ffbe68','pouch'],['Velvet Whisker','#ad86dc','bat'],
 ['Cloud Egret','#c6f5ed','egret'],['Ember Chalice','#f17f91','pitcher'],
 ['Cradle Moon','#bdc5fa','cradle'],['Jade Chimes','#56ddbf','jade'],
 ['Orbit Weaver','#e593ec','passion'],['Star Sail','#e8ae67','starfish'],
 ['Ghost Lantern','#c5edfa','ghost'],['Spiral Sprite','#f4c88b','spiral']
];
export const glyphs={sentence:'<path d="M5 6h22v15H15l-7 6v-6H5z"/><path d="M10 12h12m-12 4h8"/>',definition:'<path d="M16 8Q8 3 3 7v19q7-4 13 0 6-4 13 0V7q-5-4-13 1v18"/>',partOfSpeech:'<path d="M12 3h8v8h-8zm-9 20h8v7H3zm18 0h8v7h-8zM16 11v6H7v6m9-6h9v6"/>',wordHistory:'<path d="M16 2v13m0-5-8 5-4 8m12-8 9 3 4 8m-13-9-4 12m4-10 5 11M8 15l-6 1m23 2 5-5"/>',human:'<circle cx="16" cy="16" r="13"/><path d="m8 5 3 6-5 6 6 2 3 9m10-20-7 3-1 7 8 2M3 16h4"/>',show:'<path d="M2 16Q16-3 30 16 16 35 2 16Z"/><circle cx="16" cy="16" r="5"/>',test:'<circle cx="15" cy="18" r="11"/><circle cx="15" cy="18" r="5"/><path d="m15 18 13-15m-6 1 6-1v7"/>',hear:'<path d="M3 12h6l7-7v22l-7-7H3zm18-3q8 7 0 14m4-18q12 11 0 22"/>'};
export const icon=key=>`<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${glyphs[key]||glyphs.test}</svg>`;

const ring=(count,render)=>Array.from({length:count},(_,i)=>render(i,i*360/count)).join('');
export function flowerArt(index=0,context='garden'){
 const n=((index%plants.length)+plants.length)%plants.length;
 const [,color,shape]=plants[n],id='bloom'+context.replace(/[^a-z0-9-]/gi,'')+n;
 const fill='url(#'+id+')',inner='url(#'+id+'inner)',leaf='url(#'+id+'leaf)';
 const path=(d,f=fill,extra='')=>'<path d="'+d+'" fill="'+f+'" '+extra+'/>';
 const vein=(d,c='#e8ffe5',width=2)=>path(d,'none','stroke="'+c+'" stroke-width="'+width+'" stroke-linecap="round" opacity=".65"');
 const speckles=(count,radius)=>ring(count,(i,a)=>'<ellipse cx="'+(Math.sin(a*Math.PI/180)*radius).toFixed(1)+'" cy="'+(Math.cos(a*Math.PI/180)*radius).toFixed(1)+'" rx="'+(3+i%3)+'" ry="'+(2+i%4)+'" fill="#fff2ba" opacity=".8" transform="rotate('+a+' '+(Math.sin(a*Math.PI/180)*radius).toFixed(1)+' '+(Math.cos(a*Math.PI/180)*radius).toFixed(1)+')"/>');
 let bloom='';
 switch(shape){
 case 'pouch':
  bloom=path('M-20 25C-155 62-169-63-121-113Q-68-144-24-71Q-63-172 0-179Q72-167 30-71Q107-151 146-88C185-17 98 52 20 25')+
   path('M-86-12Q-146 34-90 108Q0 184 96 104C155 29 106-20 62-28Z',inner)+
   path('M-93 14Q0-38 99 13L83 49Q0 21-79 49Z','#fff3cf')+speckles(17,120)+vein('M-105-94Q-71-65-59-21M112-82Q77-62 60-24');break;
 case 'bat':
  bloom=path('M0 10Q-61-162-184-154L-151-74-181-35-115-26-99 36-48 11 0 70 48 11 99 36 115-26 181-35 151-74 184-154Q61-162 0 10')+
   ring(8,(i)=>{const x=(i-3.5)*21;return vein('M'+x+' 18Q'+(x*2)+' 91 '+(x*1.8)+' 174Q'+(x*1.5)+' 218 '+(x*1.2)+' 168',i%2?'#f4bada':'#a9f7d9',3);})+
   vein('M-13 1-156-128M13 1 156-128M-33-15-133-68M33-15 133-68')+path('M-64 10Q-100-37-62-78L0-38 62-78Q100-37 64 10Z',inner);break;
 case 'egret':
  bloom=ring(6,(_,a)=>'<g transform="rotate('+a+')">'+path('M-16 30Q-112-12-146-118L-108-91-121-147-82-116-77-163-49-131-32-173-12-122 12-152 20-97Q72-37 16 30',fill)+vein('M0 16Q-20-67-83-132')+'</g>');break;
 case 'pitcher':
  bloom=path('M-62-34Q-153-77-124-148Q-19-194 76-150Q119-119 69-85Z')+
   path('M-111-45Q-125 19-87 108Q0 182 87 108Q131 12 111-45Z',inner)+
   '<ellipse cy="-47" rx="127" ry="51" fill="'+fill+'" stroke="#ffd9a8" stroke-width="9"/><ellipse cy="-47" rx="101" ry="30" fill="#463354"/>'+
   ring(12,(_,a)=>{const x=Math.sin(a*Math.PI/180)*95;return vein('M'+x+' -21Q'+(x*1.1)+' 65 '+(x*.4)+' 115','#ffd3a9',3);})+
   path('M-98 43Q-164-17-168 65Q-124 111-83 84M98 43Q164-17 168 65Q124 111 83 84',fill);break;
 case 'cradle':
  bloom=path('M0 127Q-187 93-138-84Q-104-176-45-112Q-26-181 0-179Q26-181 45-112Q104-176 138-84Q187 93 0 127')+
   path('M0 113Q-139 21-85-106Q-44-93-10-27Q58-135 97-100Q139 21 0 113',inner)+
   vein('M-102-89Q-128 38 0 113M102-89Q124 38 0 113','#f8eee3',4)+
   path('M-89 60Q0 111 89 60Q67 143 0 149Q-67 143-89 60',fill);break;
 case 'jade':
  bloom=ring(6,(_,a)=>'<g transform="rotate('+a+')">'+vein('M0 0Q-28-92 0-151','#7cefc1',5)+path('M-4-38Q-92-80-57-159Q-8-156 16-115Q66-122 62-71Q38-34-4-38')+path('M-3-65Q-48-96-38-132Q-2-117 9-87Z',inner)+'</g>');break;
 case 'passion':
  bloom=ring(10,(_,a)=>'<g transform="rotate('+a+')">'+path('M0 20Q-77-60 0-173Q77-60 0 20')+vein('M0-30V-146')+'</g>')+
   ring(48,(i,a)=>'<g transform="rotate('+a+')">'+vein('M0-55Q'+(i%2?20:-20)+'-91 0-130',i%3?'#c6fff0':'#f9e3ac',4)+'</g>')+
   '<circle r="77" fill="'+inner+'" stroke="#f8d59f" stroke-width="6" stroke-dasharray="3 8"/>';break;
 case 'starfish':
  bloom=ring(5,(_,a)=>'<g transform="rotate('+a+')">'+path('M-59 24Q-74-52 0-181Q36-65 61 24Z')+ring(6,(i)=>'<path d="M-'+(12+i*6)+' '+(-135+i*23)+'Q0 '+(-120+i*23)+' '+(12+i*6)+' '+(-135+i*23)+'" fill="none" stroke="#924b65" stroke-width="5" opacity=".7"/>')+'</g>')+speckles(23,102)+'<circle r="72" fill="'+inner+'" stroke="#d59d69" stroke-width="12"/>';break;
 case 'ghost':
  bloom=path('M-106 49Q-164-8-122-110Q-63-172 0-167Q70-167 127-105Q161-31 108 49L84 109 48 80 18 126-19 93-58 117-81 72Z')+
   path('M-70-94Q-18-130 39-103Q-49-49-51 31Q-91 7-70-94','#f4fff8','opacity=".65"')+
   vein('M-97 41Q-112-55-48-118M96 46Q115-63 48-118','#e9ffff',3)+
   ring(7,(i)=>'<circle cx="'+(-81+i*27)+'" cy="'+(60+(i%2)*30)+'" r="5" fill="#dbfff6"/>');break;
 case 'spiral':
  bloom=ring(6,(_,a)=>'<g transform="rotate('+a+')">'+path('M0 33C-122-9-153-122-79-155C-17-182 51-123 16-73C-4-44-55-49-56-83Q-56-109-32-105Q-54-140-81-110C-106-74-50-26 0-10Z')+vein('M-5 11C-101-21-125-110-77-132Q-27-149 0-108','#fff3b5',3)+'</g>');break;
 }
 const stem=shape==='ghost'?'#adced7':shape==='bat'?'#6b526b':'#467c72';
 const leaves=shape==='ghost'?path('M207 425Q116 449 119 376Q180 366 207 425M212 387Q284 406 310 346Q235 342 212 387','#c9e5e0'):
  path('M205 432Q111 459 83 368L113 377 112 346Q182 350 205 432M209 393Q302 427 339 326L304 346 308 313Q237 328 209 393',leaf)+vein('M198 421 112 367M219 385 309 338','#c5f5c9',3);
 const face=shape==='pitcher'?'<ellipse cy="36" rx="53" ry="48" fill="'+fill+'"/>':path('M-56-31Q-32-61 0-46Q35-62 58-30L48 37Q0 76-48 37Z',inner);
 const eyes=shape==='ghost'?'#47647c':'#303347';
 return '<svg viewBox="0 0 420 500" aria-hidden="true" focusable="false" class="alien-bloom species-'+shape+'"><defs><radialGradient id="'+id+'" cx="32%" cy="20%" r="85%"><stop stop-color="#fff4d8"/><stop offset=".25" stop-color="'+color+'"/><stop offset=".65" stop-color="'+color+'"/><stop offset="1" stop-color="#49335e"/></radialGradient><radialGradient id="'+id+'inner" cx="40%" cy="25%" r="85%"><stop stop-color="#fff4ce"/><stop offset=".5" stop-color="'+color+'"/><stop offset="1" stop-color="#73517f"/></radialGradient><linearGradient id="'+id+'leaf" x2="1" y2="1"><stop stop-color="#aad798"/><stop offset=".5" stop-color="#4d9a88"/><stop offset="1" stop-color="#30595e"/></linearGradient></defs><ellipse cx="210" cy="471" rx="88" ry="16" fill="#122f38" opacity=".4"/>'+vein('M210 458Q155 366 210 235',stem,18)+vein('M209 450Q170 361 209 259','#b0d3a2',3)+leaves+'<g class="bloom-head" transform="translate(210 195)">'+bloom+'<g transform="translate(0 '+(shape==='pitcher'?15:0)+')">'+face+'<g fill="'+eyes+'"><ellipse cx="-23" cy="-5" rx="9" ry="14"/><ellipse cx="23" cy="-5" rx="9" ry="14"/></g><g fill="#fffdf2"><circle cx="-25" cy="-10" r="3.5"/><circle cx="21" cy="-10" r="3.5"/></g><path class="mouth" d="M-15 26Q0 40 15 26" fill="#a56683" stroke="'+eyes+'" stroke-width="3" stroke-linecap="round"/>'+vein('M-40 15l-7 5M40 15l7 5','#fff2ce',3)+'</g></g></svg>';
}

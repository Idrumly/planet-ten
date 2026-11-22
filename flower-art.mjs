// Original naturalistic Planet Ten species. A shared transparent atlas keeps all ten
// plants in one cacheable download. Nested SVG viewports isolate each grid cell.
export const plants=[
 ['Puddlehopper','#ffbe68','pouch'],['Velvet Whisker','#ad86dc','bat'],
 ['Cloud Egret','#c6f5ed','egret'],['Ember Chalice','#f17f91','pitcher'],
 ['Cradle Moon','#bdc5fa','cradle'],['Jade Chimes','#56ddbf','jade'],
 ['Orbit Weaver','#e593ec','passion'],['Star Sail','#e8ae67','starfish'],
 ['Ghost Lantern','#c5edfa','ghost'],['Spiral Sprite','#f4c88b','spiral']
];
// Curved vein-like glyphs: leaf speech, unfurling knowledge, branching grammar,
// roots, Earth, seed-eye, a growing challenge bud and sound ripples.
export const glyphs={
 sentence:'<path d="M7 25C-2 9 10 2 24 5Q31 13 22 21Q15 25 7 25L4 30M8 18Q14 11 24 10M11 20Q16 17 22 17"/>',
 definition:'<path d="M16 28C7 20 1 23 3 7Q12 5 16 14Q20 3 29 5C30 22 22 20 16 28ZM16 14V28M7 11Q11 12 13 17M25 10Q21 12 20 17"/>',
 partOfSpeech:'<path d="M16 30Q13 18 17 4M16 20Q4 21 3 11Q14 9 16 20M16 13Q26 15 29 5Q20 3 16 13M16 26Q26 28 29 19Q20 16 16 26"/>',
 wordHistory:'<path d="M17 2Q13 12 16 19M16 9Q8 10 5 5M16 14Q24 13 28 7M16 19Q5 19 3 28M16 19Q13 25 11 30M16 19Q24 20 29 29M20 21Q25 20 29 22M9 21Q6 19 3 21"/>',
 human:'<path d="M16 3C-1 3-1 29 16 29C33 29 33 3 16 3ZM11 4Q17 10 8 14Q5 19 13 20L17 28M26 7Q16 10 20 16L29 19M5 25Q14 30 25 23"/>',
 show:'<path d="M2 17Q15-2 30 15Q18 34 2 17ZM17 10C10 8 9 22 16 23C24 23 24 10 17 10ZM2 17Q4 8 9 5M30 15Q27 24 23 28"/>',
 test:'<path d="M16 30Q13 22 17 15M17 17Q3 17 4 5Q16 6 17 17Q29 11 27 2Q15 3 17 17M16 24Q24 26 29 20M15 27Q7 29 3 24"/>',
 hear:'<path d="M14 5Q1 6 5 18Q7 24 14 27Q21 21 14 5ZM19 9Q27 16 19 23M24 4Q37 16 24 28M9 10Q6 17 12 21"/>'
};
export const icon=key=>`<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${glyphs[key]||glyphs.test}</svg>`;

export function flowerArt(index=0,context='garden'){
 const n=((index%plants.length)+plants.length)%plants.length,x=(n%5)*420,y=Math.floor(n/5)*420;
 const plant='<svg x="0" y="30" width="420" height="420" viewBox="'+x+' '+y+' 420 420" overflow="hidden"><image href="assets/garden/organic-flowers.webp" width="2100" height="840" preserveAspectRatio="none"/></svg>';
 const id='tissue-'+context.replace(/[^a-z0-9-]/gi,'')+'-'+n;
 const sites=tattooSites[n],keys=['sentence','definition','partOfSpeech','wordHistory','human','show','hear','test'];
 const bud=sites[7];
 const grownBud='<g class="botanical-rune unavailable" data-kind="test"><path d="M210 355Q'+(bud[0]*4.2-25)+' '+(bud[1]*5+20)+' '+bud[0]*4.2+' '+bud[1]*5+'" fill="none" stroke="#758855" stroke-width="3"/><g transform="translate('+bud[0]*4.2+' '+bud[1]*5+')"><path d="M0 24Q-35-2-17-30Q7-25 27-38Q38 1 0 24Z" fill="#344e2e" stroke="#9aab69" stroke-width="1"/><svg x="-15" y="-17" width="30" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">'+glyphs.test+'</svg></g></g>';
 const runes=context==='encounter'?'<defs><mask id="'+id+'" maskUnits="userSpaceOnUse" x="0" y="0" width="420" height="500" style="mask-type:alpha">'+plant+'</mask></defs><g mask="url(#'+id+')">'+keys.slice(0,7).map((k,i)=>{const site=sites[i];return '<g class="botanical-rune'+(k==='test'?' unavailable':'')+'" data-kind="'+k+'" transform="translate('+site[0]*4.2+' '+site[1]*5+') rotate('+(i%2?18:-18)+') skewX(-10)"><path class="rune-vein" d="M-4-26Q-13-12-3 0T7 27M-4-14Q8-23 12-21M3 15Q-9 21-12 19"/><svg x="-15" y="-16" width="30" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+glyphs[k]+'</svg></g>';}).join('')+'</g>'+grownBud:'';
 return '<svg viewBox="0 0 420 500" aria-hidden="true" focusable="false" class="alien-bloom species-'+plants[n][2]+'"><ellipse cx="210" cy="459" rx="100" ry="14" fill="#102c32" opacity=".35"/>'+plant+runes+'</svg>';
}

// Positions follow broad petal and leaf surfaces; DOM hit areas remain at least 44px.
export const tattooSites=[[[48.2,19],[66.2,27.2],[68.1,50.8],[51.2,77.2],[33.8,61.4],[29.2,41.2],[50.2,59.2],[78.2,78.2]],[[31.2,24.2],[70.2,24.2],[64.1,63.6],[51.2,79.2],[29.8,74.6],[35.2,41.4],[51,56.8],[78,78]],[[33.7,28.6],[69.5,27.8],[71.8,74.6],[51.2,78.2],[38.7,62.4],[29,42],[51.7,58.6],[78,78]],[[35.2,22.6],[66.8,25.4],[71.5,57.2],[51.2,78.2],[31.7,68.6],[37.4,45.6],[50.2,59.2],[79.7,75.2]],[[34.2,24.2],[72.2,29.2],[74.4,61.2],[51.2,79.2],[37,64],[29.2,43.2],[48.8,58],[64.7,82.4]],[[34.2,22.6],[72.2,29.2],[70.2,58.2],[51.2,79.2],[31.2,66.2],[29.2,44.2],[50.2,59.2],[76.8,74.6]],[[32.2,27.2],[72.5,29.2],[66.7,56.6],[51.2,78.2],[29.2,65.2],[30.2,44.6],[51,58.6],[81.8,69.8]],[[32.5,23.2],[69.2,28.2],[69.5,66],[51.2,79.2],[30.2,65.2],[29.2,44.2],[50.2,58.6],[79.7,74]],[[43.2,22],[71.2,30.2],[70.4,65.8],[51.2,79.2],[29.5,68.4],[35.1,45.2],[44.5,60.4],[78,78]],[[33.2,24.6],[76,33.6],[70.2,69.6],[51.2,79.2],[29.2,65.2],[30.2,45.2],[50.2,59.2],[78,78]]];

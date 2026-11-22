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
 const n=((index%plants.length)+plants.length)%plants.length;
 const x=(n%5)*420,y=Math.floor(n/5)*420;
 return '<svg viewBox="0 0 420 500" aria-hidden="true" focusable="false" class="alien-bloom species-'+plants[n][2]+'"><ellipse cx="210" cy="459" rx="100" ry="14" fill="#102c32" opacity=".35"/><svg x="0" y="30" width="420" height="420" viewBox="'+x+' '+y+' 420 420" overflow="hidden"><image href="assets/garden/organic-flowers.webp" width="2100" height="840" preserveAspectRatio="none"/></svg></svg>';
}

// Positions follow broad petal and leaf surfaces; DOM hit areas remain at least 44px.
export const tattooSites=[
 [[48,19],[66,27],[70,59],[51,77],[30,66],[29,41]],
 [[31,24],[70,24],[66,67],[51,79],[31,66],[25,43]],
 [[32,23],[70,27],[68,63],[51,78],[32,64],[28,43]],
 [[35,23],[68,24],[72,57],[51,78],[30,63],[30,43]],
 [[34,24],[72,29],[72,64],[51,79],[31,65],[29,43]],
 [[34,22],[72,29],[70,58],[51,79],[31,66],[29,44]],
 [[32,27],[73,29],[70,60],[51,78],[29,65],[30,45]],
 [[33,23],[69,28],[70,61],[51,79],[30,65],[29,44]],
 [[43,22],[71,30],[73,62],[51,79],[30,67],[32,45]],
 [[33,25],[70,28],[70,61],[51,79],[29,65],[30,45]]
];

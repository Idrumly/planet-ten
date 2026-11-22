// Original naturalistic Planet Ten species. A shared transparent atlas keeps all ten
// plants in one cacheable download. Nested SVG viewports isolate each grid cell.
export const plants=[
 ['Puddlehopper','#ffbe68','pouch'],['Velvet Whisker','#ad86dc','bat'],
 ['Cloud Egret','#c6f5ed','egret'],['Ember Chalice','#f17f91','pitcher'],
 ['Cradle Moon','#bdc5fa','cradle'],['Jade Chimes','#56ddbf','jade'],
 ['Orbit Weaver','#e593ec','passion'],['Star Sail','#e8ae67','starfish'],
 ['Ghost Lantern','#c5edfa','ghost'],['Spiral Sprite','#f4c88b','spiral']
];
export const glyphs={sentence:'<path d="M5 6h22v15H15l-7 6v-6H5z"/><path d="M10 12h12m-12 4h8"/>',definition:'<path d="M16 8Q8 3 3 7v19q7-4 13 0 6-4 13 0V7q-5-4-13 1v18"/>',partOfSpeech:'<path d="M12 3h8v8h-8zm-9 20h8v7H3zm18 0h8v7h-8zM16 11v6H7v6m9-6h9v6"/>',wordHistory:'<path d="M16 2v13m0-5-8 5-4 8m12-8 9 3 4 8m-13-9-4 12m4-10 5 11M8 15l-6 1m23 2 5-5"/>',human:'<circle cx="16" cy="16" r="13"/><path d="m8 5 3 6-5 6 6 2 3 9m10-20-7 3-1 7 8 2M3 16h4"/>',show:'<path d="M2 16Q16-3 30 16 16 35 2 16Z"/><circle cx="16" cy="16" r="5"/>',test:'<circle cx="15" cy="18" r="11"/><circle cx="15" cy="18" r="5"/><path d="m15 18 13-15m-6 1 6-1v7"/>',hear:'<path d="M3 12h6l7-7v22l-7-7H3zm18-3q8 7 0 14m4-18q12 11 0 22"/>'};
export const icon=key=>`<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${glyphs[key]||glyphs.test}</svg>`;

export function flowerArt(index=0,context='garden'){
 const n=((index%plants.length)+plants.length)%plants.length;
 const x=(n%5)*420,y=Math.floor(n/5)*420;
 return '<svg viewBox="0 0 420 500" aria-hidden="true" focusable="false" class="alien-bloom species-'+plants[n][2]+'"><ellipse cx="210" cy="459" rx="100" ry="14" fill="#102c32" opacity=".35"/><svg x="0" y="30" width="420" height="420" viewBox="'+x+' '+y+' 420 420" overflow="hidden"><image href="assets/garden/organic-flowers.webp" width="2100" height="840" preserveAspectRatio="none"/></svg></svg>';
}

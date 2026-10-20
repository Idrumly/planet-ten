'use strict';
(function(root){
 const units=['ones','tens','hundreds','thousands','tenThousands'],names=['one','ten','hundred','thousand','ten thousand'];
 const value=s=>units.reduce((n,u,i)=>n+(s[u]||0)*10**i,0),count=s=>units.reduce((n,u)=>n+(s[u]||0),0);
 function exchange(s,tool,unit){if(!unit)unit=tool==='split'?'tens':'ones';const i=units.indexOf(unit),j=i+(tool==='split'?-1:1),need=tool==='split'?1:10,out={...s};if(i<0||j<0||j>=units.length||(s[unit]||0)<need)return out;out[unit]-=need;out[units[j]]=(out[units[j]]||0)+(tool==='split'?10:1);return out;}
 function describe(s){return units.map((k,i)=>s[k]?s[k]+' '+names[i]+(s[k]===1?'':'s'):'').reverse().filter(Boolean).join(' and ')||'0 ones';}
 const signature=s=>units.map(k=>s[k]||0).join(':');
 const api={value,count,exchange,describe,units,names,signature};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.GlowMath=api;
})(typeof globalThis!=='undefined'?globalThis:this);

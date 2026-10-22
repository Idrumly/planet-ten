'use strict';
const RoundingModel=(()=>{
 function details(n,unit=10){const low=Math.floor(n/unit)*unit,high=low+unit;return {n,low,high,mid:low+unit/2,answer:Math.floor((n+unit/2)/unit)*unit};}
 function questions(random=Math.random,unit=10){
  const pick=items=>items[Math.min(items.length-1,Math.floor(random()*items.length))];
  const pool=(unit===100?Array.from({length:799},(_,i)=>i+101):Array.from({length:88},(_,i)=>i+11)).filter(n=>n%unit!==0);
  return [pick(pool.filter(n=>n%unit<unit/2)),pick(pool.filter(n=>n%unit>unit/2)),pick(pool.filter(n=>n%unit===unit/2))].map(n=>details(n,unit));
 }
 function check(value,n,unit=10){return /^\d{1,3}$/.test(String(value))&&Number(value)===details(n,unit).answer;}
 function hintState(level){return {line:level>=1,benchmarks:level>=2,number:level>=3};}
 return {details,questions,check,hintState};
})();
if(typeof module!=='undefined')module.exports=RoundingModel;

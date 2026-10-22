'use strict';
const RoundingModel=(()=>{
 function details(n){const low=Math.floor(n/10)*10,high=low+10;return {n,low,high,mid:low+5,answer:Math.floor((n+5)/10)*10};}
 function questions(random=Math.random){
  const pick=items=>items[Math.min(items.length-1,Math.floor(random()*items.length))];
  const pool=Array.from({length:88},(_,i)=>i+11).filter(n=>n%10!==0);
  return [pick(pool.filter(n=>n%10<5)),pick(pool.filter(n=>n%10>5)),pick(pool.filter(n=>n%10===5))].map(details);
 }
 function check(value,n){return /^\d{1,3}$/.test(String(value))&&Number(value)===details(n).answer;}
 return {details,questions,check};
})();
if(typeof module!=='undefined')module.exports=RoundingModel;

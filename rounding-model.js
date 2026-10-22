'use strict';
const RoundingModel=(()=>{
 function scale(unit){return unit<1?100:1;}
 function details(n,unit=10){const factor=scale(unit),ticks=Math.round(n*factor),step=Math.round(unit*factor),lo=Math.floor(ticks/step)*step;return {n,low:lo/factor,high:(lo+step)/factor,mid:(lo+step/2)/factor,answer:Math.floor((ticks+step/2)/step)*step/factor};}
 function questions(random=Math.random,unit=10){
  const pick=(min,max)=>min+Math.min(max-min,Math.floor(random()*(max-min+1)));
  if(unit===10||unit===100){const pool=Array.from({length:unit===100?799:88},(_,i)=>i+(unit===100?101:11)).filter(n=>n%unit!==0);const from=items=>items[pick(0,items.length-1)];return [from(pool.filter(n=>n%unit<unit/2)),from(pool.filter(n=>n%unit>unit/2)),from(pool.filter(n=>n%unit===unit/2))].map(n=>details(n,unit));}
  const factor=scale(unit),step=Math.round(unit*factor),ranges=unit<1?[10,89]:[1,8];
  return [pick(1,step/2-1),pick(step/2+1,step-1),step/2].map(offset=>details((pick(...ranges)*step+offset)/factor,unit));
 }
 function check(value,n,unit=10){const valid=unit<1?/^\d{1,6}(?:\.\d{1,2})?$/:/^\d{1,6}$/;return valid.test(String(value))&&Number(value)===details(n,unit).answer;}
 function hintState(level){return {line:level>=1,benchmarks:level>=2,number:level>=3};}
 function digits(unit){return unit<1?['Ones','Tenths','Hundredths']:['Hundred-thousands','Ten-thousands','Thousands','Hundreds','Tens','Ones'].slice(-Math.max(3,String(unit*9).length));}
 function format(n,unit=10){return unit<1?Number(n).toFixed(2):String(n);}
 return {details,questions,check,hintState,digits,format};
})();
if(typeof module!=='undefined')module.exports=RoundingModel;

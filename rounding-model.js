'use strict';
const RoundingModel=(()=>{
 function precision(unit){return unit<1?Math.round(-Math.log10(unit))+1:0;}
 function scale(unit){return 10**precision(unit);}
 const places={100000:'hundred-thousand',10000:'ten-thousand',1000:'thousand',100:'hundred',10:'ten',1:'whole number',0.1:'tenth',0.01:'hundredth',0.001:'thousandth'};
 function details(n,unit=10){const decimals=(String(n).split('.')[1]||'').length,factor=10**Math.max(decimals,precision(unit)),ticks=Math.round(n*factor),step=Math.round(unit*factor),lo=Math.floor(ticks/step)*step;return {n,unit,place:places[unit],low:lo/factor,high:(lo+step)/factor,mid:(lo+step/2)/factor,answer:Math.floor((ticks+step/2)/step)*step/factor};}
 function questions(random=Math.random,unit=10){
  const pick=(min,max)=>min+Math.min(max-min,Math.floor(random()*(max-min+1)));
  if(unit===10||unit===100){const pool=Array.from({length:unit===100?799:88},(_,i)=>i+(unit===100?101:11)).filter(n=>n%unit!==0);const from=items=>items[pick(0,items.length-1)];return [from(pool.filter(n=>n%unit<unit/2)),from(pool.filter(n=>n%unit>unit/2)),from(pool.filter(n=>n%unit===unit/2))].map(n=>details(n,unit));}
  const factor=scale(unit),step=Math.round(unit*factor),ranges=unit<1?[factor/10,factor*9/10-1]:[1,8];
  return [pick(1,step/2-1),pick(step/2+1,step-1),step/2].map(offset=>details((pick(...ranges)*step+offset)/factor,unit));
 }
 function check(value,n,unit=10){const valid=unit<1?new RegExp('^\\d{1,7}(?:\\.\\d{1,'+precision(unit)+'})?$'):/^\d{1,7}$/;return valid.test(String(value))&&Number(value)===details(n,unit).answer;}
 function hintState(level){return {line:level>=1,benchmarks:level>=2,number:level>=3};}
 function digits(unit){return unit<1?['Ones','Tenths','Hundredths','Thousandths','Ten-thousandths'].slice(0,precision(unit)+1):['Hundred-thousands','Ten-thousands','Thousands','Hundreds','Tens','Ones'].slice(-Math.max(3,String(unit*9).length));}
 function format(n,unit=10){return unit<1?Number(n).toFixed(precision(unit)):String(n);}
 function shuffle(items,random){for(let i=items.length-1;i>0;i--){const j=Math.min(i,Math.floor(random()*(i+1)));[items[i],items[j]]=[items[j],items[i]];}return items;}
 function reviewQuestions(random=Math.random,level=1){
  const pick=(lo,hi)=>lo+Math.min(hi-lo,Math.floor(random()*(hi-lo+1)));
  // Every set includes mixed places, a true tie, a just-below-half case,
  // and a carry through 9. Integer source ticks preserve all trailing digits.
  const units=level===2?[1000,100,1,.01,.001]:[100,10,1,.1,.01];
  const result=units.map((unit,i)=>{
   const factor=10**Math.max(i===2?4:2,precision(unit)),step=Math.round(unit*factor);
   let base=unit>=1?pick(12,98)*step:pick(12,9876)*factor+pick(0,Math.round(1/unit)-1)*step;
   let remainder=pick(1,step-1);
   if(i===0&&remainder%factor===0)remainder++;
   if(i===1){base=pick(123,9876)*step;remainder=step/2;}
   if(i===2){base=pick(1234,98765)*step;remainder=step/2-1;}
   if(i===3){base=(pick(1000,9000)*10+9)*step;remainder=step-1;}
   return details((base+remainder)/factor,unit);
  });
  return shuffle(result,random);
 }
 function roomQuestions(room,random=Math.random){return room.review?reviewQuestions(random,room.review):room.id==='bee'?questions(random,room.unit):shuffle(questions(random,room.unit),random);}
 return {details,questions,check,hintState,digits,format,roomQuestions,reviewQuestions};
})();
if(typeof module!=='undefined')module.exports=RoundingModel;

'use strict';
(function(root){
 const units=['ones','tens','hundreds','thousands','tenThousands'];
 function regroup(inventory,collect,make,maxIndex=4){
  const fail=message=>({ok:false,message});
  for(const list of [inventory,collect,make]){
   if(Object.keys(list).some(u=>!units.includes(u)))return fail('That block type is unavailable.');
   if(units.some(u=>!Number.isSafeInteger(list[u]??0)||(list[u]??0)<0))return fail('Use whole numbers of blocks, starting at zero.');
  }
  if(units.some((u,i)=>i>maxIndex&&((collect[u]||0)||(make[u]||0))))return fail('That block type is unavailable in this assignment.');
  if(units.some(u=>(collect[u]||0)>(inventory[u]||0)))return fail('You cannot collect more blocks than you have.');
  const value=s=>units.reduce((n,u,i)=>n+(s[u]||0)*10**i,0);
  const count=s=>units.reduce((n,u)=>n+(s[u]||0),0);
  const input=value(collect),output=value(make);
  if(!Number.isSafeInteger(input)||!Number.isSafeInteger(output))return fail('Those numbers are too large.');
  if(!input)return fail('Choose some blocks to collect first.');
  if(input!==output)return fail(`Collected value: ${input.toLocaleString()}. Made value: ${output.toLocaleString()}. They must match.`);
  let carry=0;
  for(let i=0;i<units.length;i++){
   const difference=(collect[units[i]]||0)+carry-(make[units[i]]||0);
   if(difference<0||difference%10!==0)return fail('Combine smaller blocks into larger ones. Use the Discombobulator to split blocks.');
   carry=difference/10;
  }
  if(carry||count(make)>=count(collect))return fail('Combine at least ten matching blocks into a larger unit.');
  const state={...inventory};
  units.forEach(u=>{state[u]=(inventory[u]||0)-(collect[u]||0)+(make[u]||0);});
  if(!Number.isSafeInteger(value(state))||value(state)!==value(inventory))return fail('Those numbers are too large.');
  return {ok:true,state,value:input};
 }
 const api={regroup};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SuperMath=api;
})(globalThis);

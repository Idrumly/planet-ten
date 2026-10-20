'use strict';
(function(root){
 const P=typeof module!=='undefined'&&module.exports?require('./puzzle-contracts'):root.PowerContracts;
 const M=typeof module!=='undefined'&&module.exports?require('./workshop-model'):root.GlowMath;
 const seeds=[
  ['walnut','Wrinklewood Nursery',2,false,'Walnut kernel','https://www.forestresearch.gov.uk/tools-and-resources/seed-storage/juglans-regia/','Cloudbun'],
  ['castor','Marblemoon Garden',3,true,'Marbled castor seed','https://www.kew.org/read-and-watch/ants-constipation-murder-and-seeds-ricinus-communis','Slobber Slug'],
  ['cacao','Crumplecocoa Patch',3,false,'Dried cacao seed','https://www.kew.org/plants/cacao-tree','Pocket Puffalo'],
  ['heart','Heartshine Hollow',3,true,'Love-in-a-puff heart seed','https://shop.kew.org/adopt-a-seed-love-in-a-puff','Jellyjaw'],
  ['nutmeg','Knobbly Grove',4,false,'Nutmeg seed','https://www.nparks.gov.sg/docs/default-source/parks-docs/fort-canning-park/fort-canning-park-spice-garden-trail.pdf','Moonkit'],
  ['paradise','Sunplume Orchard',4,true,'Bird-of-paradise seed with orange aril','https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:798194-1/general-information','Mucus Mite'],
  ['date','Groovegrove',4,false,'Date seed','https://www.nparks.gov.sg/florafaunaweb/flora/3/4/3414','Tiny Star Otter']
 ];
 function canonical(n){const s={};for(let i=4;i>=0;i--){s[M.units[i]]=Math.floor(n/10**i);n%=10**i;}return s;}
 function generate(id,rng=Math.random,previous){
  const index=seeds.findIndex(s=>'farm-'+s[0]===id),seed=seeds[index];if(!seed)throw Error('Unknown farm bed');
  let value=index===0?1020+Math.floor(rng()*8)*1000+Math.floor(rng()*8):index===4?1024+Math.floor(rng()*8)*1000:
   10000*(index===6?3+Math.floor(rng()*5):1+Math.floor(rng()*7))+1000*(index===6?0:Math.floor(rng()*4))+100*Math.floor(rng()*3)+20+Math.floor(rng()*7);
  if(value===previous)value+=1;
  const start=canonical(value),keys=[];
  if(index>=4){for(let i=0;i<4;i++)keys.push({kind:'different',minPlaces:index-3,nonstandard:index===5,varyLargest:index===6});}
  else{
   const unit=index===0?'hundreds':'thousands';
   keys.push({kind:unit,amount:start[unit]+10});
   if(seed[2]===3)keys.push({kind:'blocks',amount:M.count(start)+18});
   keys.push({kind:'fewest'});
  }
  return {id,name:seed[1],value,start,keys,random:true,farm:true,hundreds:true,largest:10000,seedIndex:index};
 }
 const originalMatches=P.matches,originalInstruction=P.instruction,originalProgress=P.progress,originalRefresh=P.refresh;
 P.matches=(state,contract,index,records=[])=>{
  if(!contract.farm)return originalMatches(state,contract,index);
  if(M.units.some(k=>!Number.isSafeInteger(state[k]||0)||(state[k]||0)<0)||M.value(state)!==contract.value)return false;
  if(records.some(r=>r.signature===M.signature(state)))return false;
  const rule=contract.keys[index];if(!rule)return false;
  if(rule.kind==='different')return M.units.filter(k=>state[k]>0).length>=rule.minPlaces&&(!rule.nonstandard||M.units.some(k=>state[k]>=10))&&(!rule.varyLargest||!records.some(r=>Number(r.signature.split(':')[4])===(state.tenThousands||0)));
  return P.measure(state,rule.kind)===(rule.kind==='fewest'?P.minimum(contract.value,10000):rule.amount);
 };
 P.instruction=rule=>rule.kind==='different'?'Find a new representation.'+(rule.minPlaces>1?' Use at least '+rule.minPlaces+' place values.':'')+(rule.nonstandard?' Include a count of 10 or more.':'')+(rule.varyLargest?' Change the ten-thousand count each time.':''):
  rule.kind==='tenThousands'?`Use exactly ${rule.amount} ten thousands.`:originalInstruction(rule);
 P.progress=(state,rule)=>rule.kind==='different'?M.units.filter(k=>state[k]>0).length+' place values · Each answer must be new':originalProgress(state,rule);
 P.refresh=id=>{
  if(!id.startsWith('farm-'))return originalRefresh(id);
  const i=P.contracts.findIndex(c=>c.id===id);P.contracts[i]=generate(id,Math.random,P.contracts[i].value);return P.contracts[i];
 };
 for(const seed of seeds)P.contracts.push(generate('farm-'+seed[0]));
 const api={seeds,generate,canonical};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.FarmContracts=api;
})(typeof globalThis!=='undefined'?globalThis:this);

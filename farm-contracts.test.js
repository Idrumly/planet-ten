'use strict';
const assert=require('node:assert/strict'),M=require('./workshop-model'),F=require('./farm-contracts'),P=require('./puzzle-contracts');
let seed=7331;const rng=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
for(let index=0;index<F.seeds.length;index++){
 const spec=F.seeds[index],values=new Set();
 for(let trial=0;trial<100;trial++){
  const c=F.generate('farm-'+spec[0],rng);values.add(c.value);
  assert.equal(c.keys.length,[2,3,3,3,4,4,4][index]);assert.equal(M.value(c.start),c.value);
  const seen=new Map([[M.signature(c.start),c.start]]);let frontier=[c.start];
  for(let depth=0;depth<4;depth++){const next=[];for(const state of frontier)for(const unit of M.units.slice(1)){
   if(!state[unit])continue;const out=M.exchange(state,'split',unit);assert.equal(M.value(out),c.value);
   assert.deepEqual(M.exchange(out,'join',M.units[M.units.indexOf(unit)-1]),state);
   const sig=M.signature(out);if(!seen.has(sig)){seen.set(sig,out);next.push(out);}
  }frontier=next;}
  const records=[];
  for(let k=0;k<c.keys.length;k++){
   const solution=[...seen.values()].find(s=>P.matches(s,c,k,records));assert.ok(solution,'Solvable farm key '+index+'/'+k);
   records.push({signature:M.signature(solution)});
   assert.equal(P.matches({...solution},c,k,records),false,'Duplicate counts rejected');
   assert.equal(P.matches({...solution,ones:solution.ones+1},c,k,[]),false,'Changed total rejected');
  }
  assert.notEqual(F.generate(c.id,rng,c.value).value,c.value);
 }
 assert.ok(values.size>5);
}
const example=F.generate('farm-nutmeg',()=>0);
assert.equal(example.value,1024);
assert.ok(P.matches({thousands:1,ones:24},example,0));
assert.ok(P.matches({hundreds:10,tens:2,ones:4},example,1,[{signature:M.signature({thousands:1,ones:24})}]));
assert.equal(M.signature({ones:24,thousands:1}),M.signature({tenThousands:0,thousands:1,hundreds:0,tens:0,ones:24}));
assert.equal(M.value({tenThousands:1}),10000);
assert.deepEqual(M.exchange({tenThousands:1},'split','tenThousands'),{tenThousands:0,thousands:10});
assert.deepEqual(M.exchange({ones:1},'split','ones'),{ones:1});
assert.deepEqual(M.exchange({tenThousands:10},'join','tenThousands'),{tenThousands:10});
console.log('700 farm rounds: all keys solvable; distinct answers, five denominations, reversible exchanges and 1024 examples pass.');

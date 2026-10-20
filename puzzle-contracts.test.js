'use strict';
const assert=require('node:assert/strict'),P=require('./puzzle-contracts'),M=require('./workshop-model'),C=require('./block-celebrations');
for(const contract of P.contracts.filter(c=>!c.random)){
 assert.ok(contract.keys.length>=1&&contract.keys.length<=5);
 assert.equal(P.value(contract.start),contract.value);
 contract.keys.forEach((rule,index)=>{
  const solutions=[];
  for(let tens=0;tens<=Math.floor(contract.value/10);tens++){const state={tens,ones:contract.value-tens*10};if(P.matches(state,contract,index))solutions.push(state);}
  assert.equal(solutions.length,1,JSON.stringify(rule));
  const solution=solutions[0];if(rule.kind==='fewest'){assert.deepEqual(solution,{tens:4,ones:5});assert.equal(P.matches({tens:3,ones:15},contract,index),false);}else assert.equal(P.measure(solution,rule.kind),rule.amount);
  assert.equal(P.matches({...solution,ones:solution.ones+1},contract,index),false,'Must check total as well as constraint');
  for(const tool of ['split','join'])assert.equal(M.value(M.exchange(solution,tool)),contract.value);
 });
}
assert.equal(P.matches({tens:3,ones:34},P.contracts[2],0),true);
assert.equal(P.matches({tens:2,ones:34},P.contracts[2],0),false);
assert.equal(C.patterns.length,20);assert.equal(new Set(C.patterns.map(p=>p[0])).size,20);
for(const unit of ['ones','tens','hundreds'])assert.equal(new Set(Array.from({length:20},()=>C.next(unit))).size,20,'No repeat before each unit exhausts its bag');
console.log('Contracts: all seven fixed keys have a unique valid solution; value-preserving exchanges and 20-pattern shuffle bags pass.');

let seed=412;const rng=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
for(const [id,,keys] of P.machines){const values=new Set();for(let trial=0;trial<200;trial++){
 const c=P.generate(id,rng);values.add(c.value);assert.equal(c.keys.length,keys);assert.equal(M.value(c.start),c.value);
 for(let k=0;k<keys;k++){let found=0;for(let h=0;h<=Math.floor(c.value/100);h++)for(let t=0;t<=Math.floor((c.value-h*100)/10);t++){const state={hundreds:h,tens:t,ones:c.value-h*100-t*10};if(P.matches(state,c,k))found++;
 for(const unit of ['ones','tens','hundreds'])for(const tool of ['split','join']){if(tool==='join'&&unit==='hundreds'||tool==='split'&&unit==='ones')continue;const out=M.exchange(state,tool,unit);assert.equal(M.value(out),c.value);assert.ok(Object.values(out).every(n=>n>=0));}
 }assert.ok(found>0,'Generated key must be solvable');if(c.keys[k].kind==='fewest')assert.equal(found,1);}
 for(let k=1;k<c.keys.length;k++)for(let h=0;h<=Math.floor(c.value/100);h++)for(let t=0;t<=Math.floor((c.value-h*100)/10);t++){const state={hundreds:h,tens:t,ones:c.value-h*100-t*10};assert.equal(P.matches(state,c,k)&&P.matches(state,c,k-1),false,'Consecutive keys must require a new representation');}
 assert.notEqual(P.generate(id,rng,c.value).value,c.value);
 }assert.ok(values.size>50,'Numbers must vary');}
assert.deepEqual(M.exchange({hundreds:1,tens:0,ones:0},'split','hundreds'),{hundreds:0,tens:10,ones:0});
assert.deepEqual(M.exchange({hundreds:0,tens:10,ones:0},'join','tens'),{hundreds:1,tens:0,ones:0});
console.log('1,000 randomized rounds: every key solvable, correct key counts, varied values, minimum solutions unique, all exchanges preserve value.');

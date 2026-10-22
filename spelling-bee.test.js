const {test}=require('node:test');
const assert=require('node:assert/strict');
const B=require('./spelling-bee');
test('15 distinct words perform a question, exact spelling and verdict before looping',()=>{
 assert.equal(B.entries.length,15);assert.equal(new Set(B.entries.map(e=>e[0])).size,15);
 let state={index:0,phase:0};const words=[];
 for(let n=0;n<45;n++){
  const b=B.beat(state.index,state.phase),word=B.entries[state.index][0];
  assert.ok(b.text.length>0&&b.duration>=6500);
  assert.equal(b.judge,state.index%3);
  if(state.phase===0){words.push(word);assert.ok(b.text.includes(word.toUpperCase()));}
  if(state.phase===1)assert.ok(b.text.includes([...word.toUpperCase()].join(' · ')));
  state=B.next(state.index,state.phase);
 }
 assert.equal(new Set(words).size,15);assert.deepEqual(state,{index:0,phase:0});
});

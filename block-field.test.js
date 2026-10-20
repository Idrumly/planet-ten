const test=require('node:test'),assert=require('node:assert/strict'),{interleave}=require('./block-field');
test('ones occupy spaces between rods while preserving unit order and every block',()=>{
 const input=[...Array.from({length:6},(_,i)=>({unit:'tens',id:'t'+i})),...Array.from({length:4},(_,i)=>({unit:'ones',id:'o'+i}))];
 const result=interleave(input);assert.equal(result.length,10);assert.equal(new Set(result).size,10);assert.equal(result[1].unit,'ones');assert.ok(result.findIndex(x=>x.id==='o3')<result.findIndex(x=>x.id==='t5'));
 for(const unit of ['ones','tens'])assert.deepEqual(result.filter(x=>x.unit===unit),input.filter(x=>x.unit===unit));
});
test('mixed fields preserve value and selection indices through every representation of 64 and 248',()=>{
 for(const value of [64,248])for(let h=0;h<=Math.floor(value/100);h++)for(let t=0;t<=Math.floor((value-h*100)/10);t++){
  const counts={hundreds:h,tens:t,ones:value-h*100-t*10},input=Object.entries(counts).flatMap(([unit,n])=>Array.from({length:n},(_,id)=>({unit,id}))),result=interleave(input);
  assert.equal(result.reduce((sum,b)=>sum+({ones:1,tens:10,hundreds:100}[b.unit]),0),value);assert.equal(new Set(result).size,input.length);
  for(const unit of Object.keys(counts))assert.deepEqual(result.filter(b=>b.unit===unit),input.filter(b=>b.unit===unit));
 }
});

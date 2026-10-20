const {test}=require('node:test');
const assert=require('node:assert/strict');
const {regroup}=require('./super-model');
test('280 hundreds become 28 thousands, keeping unused inventory and original state',()=>{
 const original={hundreds:280,ones:7};
 const result=regroup(original,{hundreds:280},{thousands:28});
 assert.equal(result.ok,true);assert.equal(result.value,28000);
 assert.equal(result.state.thousands,28);assert.equal(result.state.hundreds,0);assert.equal(result.state.ones,7);
 assert.deepEqual(original,{hundreds:280,ones:7});
});
test('mixed denominations carry into a hundred',()=>{
 const result=regroup({ones:20,tens:18},{ones:20,tens:18},{hundreds:2},2);
 assert.equal(result.ok,true);assert.equal(result.state.hundreds,2);
});
test('partial collection leaves other blocks available',()=>{
 const result=regroup({tens:25},{tens:20},{hundreds:2},2);
 assert.equal(result.ok,true);assert.equal(result.state.tens,5);
});
test('rejects unavailable stock, unequal value, splitting, no-op and unavailable denominations',()=>{
 for(const [stock,collect,make,max] of [
  [{hundreds:2},{hundreds:20},{thousands:2},4],
  [{hundreds:280},{hundreds:280},{thousands:27},4],
  [{hundreds:1},{hundreds:1},{tens:10},4],
  [{hundreds:1},{hundreds:1},{hundreds:1},4],
  [{hundreds:10},{hundreds:10},{thousands:1},2],
  [{hundreds:10,ones:10},{hundreds:10,ones:10},{hundreds:9,tens:11},4],
  [{ones:10},{},{},4],
 ])assert.equal(regroup(stock,collect,make,max).ok,false);
});
test('rejects malformed numbers and unknown units',()=>{
 for(const amount of [-1,.5,NaN,Infinity,Number.MAX_SAFE_INTEGER+1,'10'])
  assert.equal(regroup({ones:20},{ones:amount},{tens:1}).ok,false);
 assert.equal(regroup({ones:10},{ones:10},{bananas:1}).ok,false);
});

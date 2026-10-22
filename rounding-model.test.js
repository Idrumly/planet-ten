const {test}=require('node:test'),assert=require('node:assert/strict'),M=require('./rounding-model');
test('every two-digit non-multiple selects the closest ten; ties choose larger',()=>{
 for(let n=11;n<=99;n++){const d=M.details(n);assert.equal(d.high-d.low,10);assert.equal(d.mid,d.low+5);assert.equal(d.answer,n-d.low<d.high-n?d.low:d.high);assert.ok(M.check(d.answer,n));assert.ok(!M.check(d.answer+10,n));}
 assert.equal(M.details(95).answer,100);assert.equal(M.check('',25),false);assert.equal(M.check('30.0',25),false);
});
test('rounds mix below, above and halfway without repeating questions',()=>{
 for(let i=0;i<1000;i++){const q=M.questions();assert.equal(new Set(q.map(x=>x.n)).size,3);assert.ok(q[0].n%10<5);assert.ok(q[1].n%10>5);assert.equal(q[2].n%10,5);assert.ok(q.every(x=>x.n>=11&&x.n<=98));}
});

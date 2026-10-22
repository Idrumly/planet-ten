const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),M=require('./rounding-model');
function rooms(){const scope={window:{},URLSearchParams,location:{search:''},sessionStorage:{getItem:()=>null}};vm.runInNewContext(fs.readFileSync('warehouse-rooms.js','utf8'),scope);return scope.window.WarehouseRooms;}
function seeded(seed){return ()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);}
// Independent decimal-string oracle: no floating-point rounding in expected values.
function expected(n,unit){const [whole,fraction='']=String(n).split('.'),factor=10n**BigInt(Math.max(4,fraction.length)),ticks=BigInt(whole)*factor+BigInt(fraction.padEnd(Number(String(factor).length-1),'0')),step=BigInt(Math.round(unit*Number(factor)));return Number(((ticks+step/2n)/step)*step)/Number(factor);}
test('mixed-place decimals retain all input precision, including just below halfway',()=>{
 for(const [n,u,a] of [[1245.65,100,1200],[1249.99,100,1200],[1250,100,1300],[1299.99,10,1300],[9.4999,1,9],[9.5,1,10],[785.9949,.01,785.99],[785.995,.01,786],[9876.9995,.001,9877]])assert.equal(M.details(n,u).answer,a);
});
test('every randomized room set guarantees a deciding 5 and correct answers',()=>{
 const {order,rooms:all}=rooms();
 for(const id of order.slice(1))for(const rng of [()=>0,()=>.999999,seeded(12),seeded(999)])for(let run=0;run<100;run++){
  const room=all[id],q=M.roomQuestions(room,rng);assert.equal(q.length,room.lockCount);
  assert.ok(q.some(x=>x.n===x.mid),id+' must contain a true halfway case');
  for(const x of q){assert.equal(x.answer,expected(x.n,x.unit));assert.ok(M.check(String(x.answer),x.n,x.unit));assert.ok(!M.check(String(x.answer+x.unit),x.n,x.unit));}
 }
});
test('final rooms each use five distinct mixed targets, carries, and long decimal numbers',()=>{
 const {rooms:all}=rooms();
 for(const id of ['coffee','butter'])for(let seed=1;seed<500;seed++){
  const q=M.roomQuestions(all[id],seeded(seed));assert.equal(new Set(q.map(x=>x.unit)).size,5);
  assert.ok(q.some(x=>x.unit>=100&&x.n>x.unit*10&&x.n%1!==0));
  assert.ok(q.some(x=>x.unit<1&&x.n>100));
  assert.ok(q.some(x=>x.n<x.mid&&Math.abs(x.n-x.mid)<=.010001));
 }
});
test('new codes vary numbers and halfway position rather than exposing a fixed answer pattern',()=>{
 const {rooms:all}=rooms();
 for(const id of ['band-aid','bull','coffee','butter']){
  const rng=seeded(42),sets=Array.from({length:30},()=>M.roomQuestions(all[id],rng));
  assert.ok(new Set(sets.map(q=>JSON.stringify(q.map(x=>x.n)))).size>25);
  assert.ok(new Set(sets.map(q=>q.findIndex(x=>x.n===x.mid))).size>1);
 }
});

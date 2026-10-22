const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),M=require('./rounding-model'),shows=require('./warehouse-shows');
test('new rounding ranges include below, above and halfway with usable digit fields',()=>{
 for(const unit of [1000,10000,100000,.1])for(let i=0;i<500;i++){
  const q=M.questions(Math.random,unit);assert.equal(new Set(q.map(x=>x.n)).size,3);
  q.forEach((x,k)=>{assert.ok(M.check(M.format(x.answer,unit),x.n,unit));assert.ok(!M.check(x.answer+unit,x.n,unit));assert.equal(x.answer,k===0?x.low:x.high);assert.equal(M.format(x.n,unit).replace('.','').length,M.digits(unit).length);});
 }
 for(const [n,u,a] of [[9500,1000,10000],[95000,10000,100000],[950000,100000,1000000],[1.15,.1,1.2],[1.14,.1,1.1],[8.95,.1,9]])assert.equal(M.details(n,u).answer,a);
 assert.equal(M.check('1.2x',1.15,.1),false);
});
test('rooms form a bidirectional six-room route with distinct lock sets and all artwork',()=>{
 const scope={window:{},URLSearchParams,location:{search:''},sessionStorage:{getItem:()=>null}};vm.runInNewContext(fs.readFileSync('warehouse-rooms.js','utf8'),scope);
 const {rooms,order}=scope.window.WarehouseRooms;assert.equal(order.length,6);
 order.forEach((id,i)=>{assert.equal(rooms[id].previous,order[i-1]||null);assert.equal(rooms[id].next,order[i+1]||null);assert.equal(rooms[id].lockOffset,i*3);});
 for(const [id,show] of Object.entries(shows)){assert.equal(show.lines.length,12);assert.ok(show.lines.every(l=>l[0]>=-1&&l[0]<show.cast.length&&l[1].length>10));
  const names=[id+'-backdrop-v1.webp',...show.cast.map((_,i)=>id+'-actor-'+i+'-v1.webp'),...Array.from({length:3},(_,i)=>id+'-lock-'+i+'-v1.webp')];for(const name of names)assert.ok(fs.statSync('assets/rounding/'+name).size>1000,name);
 }
});

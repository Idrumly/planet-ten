const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
function launch(values=[],query='',blocked=false){
 const store=new Map(values),location={href:'https://example.com/world.html'+query},window={};
 vm.runInNewContext(fs.readFileSync('orientation.js','utf8'),{URL,window,location,history:{replaceState(_a,_b,url){location.href=String(url);}},sessionStorage:{getItem(k){if(blocked)throw Error('blocked');return store.get(k);},setItem(k,v){if(blocked)throw Error('blocked');store.set(k,v);}}});
 return {store,location,progress:window.OrientationProgress};
}
test('fresh direct game visits require practice and the first shift',()=>{const f=launch();assert.match(f.location.href,/training=1/);assert.equal(f.progress.firstShiftRequired,true);});
test('practice completion unlocks first shift, then completing that unlocks assignments for this session',()=>{
 const first=launch();assert.equal(first.progress.practiceDone(),true);
 const next=launch([...first.store]);assert.equal(new URL(next.location.href).searchParams.has('training'),false);assert.equal(next.progress.firstShiftRequired,true);
 next.progress.firstShiftDone();assert.equal(launch([...next.store]).progress.firstShiftRequired,false);assert.equal(launch().progress.firstShiftRequired,true);
});
test('explicit practice remains replayable and blocked storage has a completion path',()=>{
 assert.match(launch([['planet-ten-practice','done']],'?training=1').location.href,/training=1/);
 assert.equal(launch([], '',true).progress.practiceDone(),false);
 const fallback=launch([],'?practice=complete',true);assert.equal(new URL(fallback.location.href).searchParams.has('training'),false);assert.equal(fallback.progress.firstShiftRequired,true);
});

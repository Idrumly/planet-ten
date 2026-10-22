const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
test('projected textures remain finite at window edges, stage front, and reverse views',()=>{
 let calls=0;
 const ctx=Object.fromEntries(['save','restore','beginPath','closePath','clip','drawImage'].map(k=>[k,()=>{}]));
 for(const k of ['lineTo','moveTo','transform'])ctx[k]=(...args)=>{args.forEach(n=>assert.ok(Number.isFinite(n),k+' produced a non-finite coordinate'));calls++;};
 class Image{constructor(){this.complete=true;this.naturalWidth=1600;this.naturalHeight=800;}}
 const scope={window:{},Image};vm.runInNewContext(fs.readFileSync('auditorium.js','utf8'),scope);
 for(const x of [-420,0,420])for(const z of [-801,-1050,-1500])for(const yaw of [0,.8,-.8,Math.PI]){
  const camera=(px,py,pz)=>({x:Math.cos(yaw)*(px-x)-Math.sin(yaw)*(z-pz),y:145-py,z:Math.sin(yaw)*(px-x)+Math.cos(yaw)*(z-pz)});
  const project=p=>({x:550+p.x*640/p.z,y:290+p.y*640/p.z});
  scope.window.createAuditorium(ctx,()=>{},camera,project,()=>{}).draw();
 }
 assert.ok(calls>1000,'Textured surfaces were exercised');
});
test('auditorium geometry renders while illustration downloads are pending',()=>{
 let geometry=0;class Image{constructor(){this.complete=false;this.naturalWidth=0;}}
 const scope={window:{},Image};vm.runInNewContext(fs.readFileSync('auditorium.js','utf8'),scope);
 scope.window.createAuditorium({},()=>geometry++,()=>{},()=>{},()=>{}).draw();
 assert.ok(geometry>100);
});

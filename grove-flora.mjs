import * as T from './vendor/three-0.187.0.mjs';

// Decorative ecology only: no clue targets, progress or additional animation loop.
export function addLivingGrove(scene) {
 let seed=314;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const vine=new T.MeshStandardMaterial({color:'#725088',roughness:.65,emissive:'#4f246f',emissiveIntensity:.35});
 const vein=new T.MeshBasicMaterial({color:'#80cfed',transparent:true,opacity:.65});
 const petals=new T.MeshStandardMaterial({color:'#8fd4ed',emissive:'#417cba',emissiveIntensity:.7,roughness:.3,metalness:.12,transparent:true,opacity:.8,depthWrite:false,side:T.DoubleSide});
 const hearts=new T.MeshBasicMaterial({color:'#c0f6ff'});
 const leafMat=new T.MeshStandardMaterial({color:'#9061ae',emissive:'#43164f',emissiveIntensity:.28,roughness:.78});
 const petalGeo=new T.SphereGeometry(1,10,7),coreGeo=new T.SphereGeometry(1,8,6);
 const petalBatch=new T.InstancedMesh(petalGeo,petals,180*5),coreBatch=new T.InstancedMesh(coreGeo,hearts,180),leafBatch=new T.InstancedMesh(petalGeo,leafMat,2200);
 const dummy=new T.Object3D();let flowers=0,leaves=0;
 function stamp(batch,i,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0){dummy.position.set(x,y,z);dummy.scale.set(sx,sy,sz);dummy.rotation.set(rx,ry,rz);dummy.updateMatrix();batch.setMatrixAt(i,dummy.matrix);}
 function leaf(x,y,z,size,a){stamp(leafBatch,leaves,x,y,z,size*.32,size,size*.1,.4,a,.5+random());leafBatch.setColorAt(leaves++,new T.Color(['#a977bf','#d581b2','#7375bd'][Math.floor(random()*3)]));}
 function bloom(x,y,z,size){
  for(let p=0;p<5;p++){const a=p*Math.PI*2/5;stamp(petalBatch,flowers*5+p,x+Math.sin(a)*size*.55,y+size*.2,z+Math.cos(a)*size*.55,size*.23,size*.75,size*.12,Math.cos(a)*.85,0,-Math.sin(a)*.85);}
  stamp(coreBatch,flowers++,x,y+size*.15,z,size*.18,size*.26,size*.18);
 }
 function tendril(points,radius,material){const curve=new T.CatmullRomCurve3(points);const m=new T.Mesh(new T.TubeGeometry(curve,48,radius,5,false),material);scene.add(m);return curve;}
 // Each column is wrapped in living spirals; hanging runners bridge the lintels.
 for(let i=0;i<18;i++){
  const a=(i+.5)*Math.PI*2/18,x=Math.sin(a)*9.1,z=-Math.cos(a)*9.1;
  const points=[];
  for(let j=0;j<=28;j++){const t=j/28,spin=t*Math.PI*4+i;points.push(new T.Vector3(x+Math.sin(spin)*.76,t*4.25,z+Math.cos(spin)*.76));}
  const curve=tendril(points,.055,vine);tendril(points.map(p=>p.clone().addScalar(.018)),.012,vein);
  for(let j=0;j<22;j++){const p=curve.getPoint(j/22);leaf(p.x,p.y,p.z,.24+random()*.14,j);if(j%6===2)bloom(p.x,p.y,p.z,.23);}
  const garland=[];
  for(let j=0;j<=12;j++){const t=j/12,angle=a+t*Math.PI*2/18;garland.push(new T.Vector3(Math.sin(angle)*8.65,4.15-Math.sin(t*Math.PI)*.55,-Math.cos(angle)*8.65));}
  const runner=tendril(garland,.04,vine);
  for(let j=0;j<16;j++){const p=runner.getPoint(j/16);leaf(p.x,p.y,p.z,.32,j);if(j%5===0)bloom(p.x,p.y-.12,p.z,.26);}
  // Larger lantern blossoms grow below the arches, behind the selectable plants.
  const b=a+.11,r=8.2,h=.7+random()*.6;
  tendril([new T.Vector3(Math.sin(b)*r,0,-Math.cos(b)*r),new T.Vector3(Math.sin(b)*r+.15,h*.5,-Math.cos(b)*r),new T.Vector3(Math.sin(b)*r,h,-Math.cos(b)*r)],.025,vine);
  bloom(Math.sin(b)*r,h,-Math.cos(b)*r,.55);
 }
 // Dense purple ground growth stays outside the inner study circle.
 while(leaves<2200){const a=random()*Math.PI*2,r=7.3+random()*9;leaf(Math.sin(a)*r,.04+random()*.18,-Math.cos(a)*r,.18+random()*.25,a);}
 petalBatch.count=flowers*5;coreBatch.count=flowers;leafBatch.count=leaves;scene.add(petalBatch,coreBatch,leafBatch);
 // Soft halos and scattered pollen: additive points, no full-screen bloom pass.
 const c=document.createElement('canvas');c.width=c.height=64;const ctx=c.getContext('2d'),gradient=ctx.createRadialGradient(32,32,0,32,32,32);gradient.addColorStop(0,'rgba(255,255,255,1)');gradient.addColorStop(.18,'rgba(255,255,255,.65)');gradient.addColorStop(.5,'rgba(255,255,255,.13)');gradient.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,64,64);const glowMap=new T.CanvasTexture(c);
 function points(positions,color,size,opacity){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));scene.add(new T.Points(g,new T.PointsMaterial({color,size,map:glowMap,transparent:true,opacity,depthWrite:false,blending:T.AdditiveBlending})));}
 const halos=[],pollen=[],m=new T.Matrix4(),v=new T.Vector3();for(let i=0;i<flowers;i++){coreBatch.getMatrixAt(i,m);v.setFromMatrixPosition(m);halos.push(v.x,v.y,v.z);}points(halos,'#85dfff',1.05,.5);
 for(let i=0;i<320;i++){const a=random()*Math.PI*2,r=7.4+random()*7;pollen.push(Math.sin(a)*r,.15+random()*.5,-Math.cos(a)*r);}points(pollen,'#ffd99c',.14,.9);
}

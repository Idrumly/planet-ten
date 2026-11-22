import * as T from './vendor/three-0.187.0.mjs';
import {botanicalTexture} from './botanical-textures.mjs';
import {glyphs} from './flower-art.mjs';

// Original procedural model: curved surfaces and tubular veins, not billboards.
export function createFlowerModel({runes=true}={}){
 const root=new T.Group(),crown=new T.Group();root.add(crown);crown.position.y=2.2;
 const anchors={},marks={},petals=[];
 const leafMap=botanicalTexture('leaf'),petalMap=botanicalTexture('petal');
 const skin=new T.MeshStandardMaterial({color:'#b7d6ae',map:leafMap,bumpMap:leafMap,bumpScale:.012,roughness:.64});
 const vein=new T.MeshStandardMaterial({color:'#bbbf81',roughness:.45,emissive:'#355336',emissiveIntensity:.35});
 const petalMaterial=new T.MeshPhysicalMaterial({color:'#ffffff',map:petalMap,bumpMap:petalMap,bumpScale:.009,roughness:.58,metalness:0,side:T.DoubleSide,clearcoat:.12});
 function add(geo,mat,parent=root){const o=new T.Mesh(geo,mat);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 function tube(points,radius,mat=skin,parent=root){return add(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),28,radius,7,false),mat,parent);}
 for(let i=0;i<5;i++){const a=i*Math.PI*2/5;tube([[Math.sin(a)*.75,0,Math.cos(a)*.55],[Math.sin(a)*.25,.18,Math.cos(a)*.25],[.12,.7,0],[-.12,1.3,-.1],[0,2.1,0]],.07-i*.005);}
 // Longitudinal surface: cupped edges, tapered tip and a recurved end.
 function surface(u,v){const width=.34*Math.pow(Math.sin(Math.PI*v),.7)*(1+.045*Math.sin(v*32));return new T.Vector3(u*width,.23+v*1.15,.04+v*.3-v*v*.52+u*u*.14*Math.sin(Math.PI*v)+Math.pow(Math.abs(u),3)*.025*Math.sin(v*32));}
 const pos=[],uv=[],indices=[];for(let j=0;j<=24;j++)for(let i=0;i<=12;i++){const p=surface(i/6-1,j/24);pos.push(p.x,p.y,p.z);uv.push(i/12,j/24);if(j<24&&i<12){const n=j*13+i;indices.push(n,n+1,n+13,n+1,n+14,n+13);}}
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(pos,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geometry.setIndex(indices);geometry.computeVertexNormals();
 const keys=['sentence','definition','partOfSpeech','test','wordHistory','human','show','hear'];
 keys.forEach((key,i)=>{
  const petal=new T.Group();crown.add(petal);petal.rotation.z=-i*Math.PI/4;petal.rotation.y=Math.sin(i)*.22;petal.scale.set(1,i%2?.85:1,1.7);petals.push(petal);
  const mat=petalMaterial.clone();mat.color.set(i%2?'#ffe6d6':'#f5d5e3');add(geometry,mat,petal);
  const mid=[];for(let j=0;j<=16;j++){const p=surface(0,j/16);p.z+=.012;mid.push([p.x,p.y,p.z]);}tube(mid,.009,vein,petal);
  for(const sign of [-1,1])for(let j=1;j<4;j++){const points=[];for(let k=0;k<=8;k++){const p=surface(sign*k/9,.15+j*.15+k*.012);p.z+=.012;points.push([p.x,p.y,p.z]);}tube(points,.005,vein,petal);}
  const anchor=new T.Object3D();anchor.position.copy(surface(0,.57));anchor.position.z+=.025;petal.add(anchor);anchors[key]=anchor;
  if(runes){const c=document.createElement('canvas');c.width=256;c.height=512;const ctx=c.getContext('2d');ctx.translate(128,292);ctx.scale(3.6,-3.6);ctx.translate(-16,-16);ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=1.5;ctx.strokeStyle='white';for(const match of glyphs[key].matchAll(/d="([^"]+)"/g))ctx.stroke(new Path2D(match[1]));const texture=new T.CanvasTexture(c);mat.emissiveMap=texture;mat.emissive.set('#73ff4f');mat.emissiveIntensity=1.5;marks[key]=mat;}
 });
 // A seed chamber suggests a quiet face through botanical folds and dark anthers.
 const heart=add(new T.SphereGeometry(1,28,20),skin,crown);heart.scale.set(.36,.43,.28);heart.position.z=.04;

 const gold=new T.MeshStandardMaterial({color:'#cfa35c',roughness:.4});
 const eyeMat=new T.MeshStandardMaterial({color:'#163b38',roughness:.18});
 const irisMat=new T.MeshStandardMaterial({color:'#dfaf55',roughness:.22,emissive:'#87602a',emissiveIntensity:.35});
 const glintMat=new T.MeshBasicMaterial({color:'#fff3d2'}),eyes=[],arms=[];
 for(const x of [-.155,.155]){
  const socket=new T.Group();socket.position.set(x,.08,.275);crown.add(socket);eyes.push(socket);
  const eye=add(new T.SphereGeometry(1,24,16),eyeMat,socket);eye.scale.set(.112,.093,.055);
  const iris=add(new T.SphereGeometry(1,20,14),irisMat,socket);iris.scale.set(.062,.074,.025);iris.position.z=.049;
  const pupil=add(new T.SphereGeometry(1,16,12),eyeMat,socket);pupil.scale.set(.027,.054,.014);pupil.position.z=.073;
  const glint=add(new T.SphereGeometry(.017,10,8),glintMat,socket);glint.position.set(-.022,.027,.085);
  tube([[x-.12,.09,.28],[x,.19,.32],[x+.12,.12,.28]],.021,skin,crown);
  tube([[x-.11,-.005,.28],[x,-.03,.30],[x+.10,.015,.28]],.013,vein,crown);
 }
 const nose=add(new T.SphereGeometry(1,16,12),skin,crown);nose.scale.set(.045,.09,.065);nose.position.set(0,-.075,.30);
 tube([[-.12,-.20,.27],[0,-.24,.30],[.13,-.185,.27]],.018,eyeMat,crown);
 tube([[-.07,-.26,.26],[0,-.28,.27],[.08,-.25,.26]],.011,vein,crown);
 // Botanical eyebrows and a small pollen crest give an attentive expression.
 for(let i=0;i<7;i++){const a=i*2.4,s=add(new T.SphereGeometry(.025,8,6),gold,crown);s.position.set(Math.sin(a)*.12,.29+(i%3)*.027,.21);}
 // A bark-and-leaf body beneath the blossom: layered coat, branching arms, roots.
 const torso=add(new T.SphereGeometry(1,24,18),skin);torso.position.set(0,1.12,-.08);torso.scale.set(.26,.68,.24);
 for(let i=0;i<7;i++){const a=i*Math.PI*2/7,leaf=add(geometry,skin);leaf.position.set(Math.sin(a)*.12,1.15,Math.cos(a)*.14);leaf.rotation.set(Math.cos(a)*.42,a,Math.PI+Math.sin(a)*.3);leaf.scale.set(.88,.85,1);}
 for(const side of [-1,1]){
  const arm=new T.Group();arm.position.set(side*.20,1.42,0);root.add(arm);arms.push(arm);
  tube([[0,0,0],[side*.30,-.14,.05],[side*.53,-.04,.14],[side*.65,.12,.20]],.045,skin,arm);
  const cuff=add(geometry,skin,arm);cuff.position.set(side*.12,-.14,.03);cuff.rotation.z=-side*1.22;cuff.scale.set(.48,.47,.7);
  for(let f=0;f<3;f++)tube([[side*.65,.12,.20],[side*(.70+f*.04),.20,.19],[side*(.66+f*.09),.28+f*.03,.17]],.016,skin,arm);
  const foot=add(new T.SphereGeometry(1,20,14),skin);foot.position.set(side*.25,.025,.25);foot.scale.set(.20,.07,.34);foot.rotation.y=side*.4;
 }
 function update(time,{motion=true,active='',collected=false}={}){
  crown.rotation.z=motion?Math.sin(time*.8)*.025:0;crown.rotation.x=motion?Math.sin(time*.6)*.025:0;
  const blink=motion&&time%5.4<.17?.15:1;for(const eye of eyes)eye.scale.y=blink;
  arms.forEach((arm,i)=>arm.rotation.z=motion?Math.sin(time*1.1+i)*.055+(active?(i?-.09:.09):0):0);
  for(let i=0;i<petals.length;i++)petals[i].rotation.x=(active===keys[i]?-.12:0)+(motion?Math.sin(time*.7+i)*.018:0);
  root.scale.setScalar(collected?.35:1);
 }
 function state(states){for(const [key,mark]of Object.entries(marks)){const s=states[key]||{};mark.emissiveIntensity=s.unavailable?0:s.done?.3:1.5;mark.emissive.set(s.active?'#c0ff8a':s.done?'#29653b':'#73ff4f');}}
 return {root,anchors,update,state};
}

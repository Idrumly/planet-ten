import * as T from './vendor/three-0.187.0.mjs';
import {glyphs} from './flower-art.mjs';

// Original procedural model: curved surfaces and tubular veins, not billboards.
export function createFlowerModel({runes=true}={}){
 const root=new T.Group(),crown=new T.Group();root.add(crown);crown.position.y=2.1;
 const anchors={},marks={},petals=[];
 const skin=new T.MeshStandardMaterial({color:'#685080',roughness:.65});
 const vein=new T.MeshStandardMaterial({color:'#af83b4',roughness:.45,emissive:'#502c68',emissiveIntensity:.35});
 const petalMaterial=new T.MeshPhysicalMaterial({color:'#8cbfdb',roughness:.38,metalness:.08,side:T.DoubleSide,clearcoat:.35});
 function add(geo,mat,parent=root){const o=new T.Mesh(geo,mat);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 function tube(points,radius,mat=skin,parent=root){return add(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),28,radius,7,false),mat,parent);}
 for(let i=0;i<5;i++){const a=i*Math.PI*2/5;tube([[Math.sin(a)*.75,0,Math.cos(a)*.55],[Math.sin(a)*.25,.18,Math.cos(a)*.25],[.12,.7,0],[-.12,1.3,-.1],[0,2.1,0]],.07-i*.005);}
 // Longitudinal surface: cupped edges, tapered tip and a recurved end.
 function surface(u,v){const width=.30*Math.pow(Math.sin(Math.PI*v),.7);return new T.Vector3(u*width,.23+v*1.15,.04+v*.3-v*v*.52+u*u*.19*Math.sin(Math.PI*v));}
 const pos=[],uv=[],indices=[];for(let j=0;j<=24;j++)for(let i=0;i<=12;i++){const p=surface(i/6-1,j/24);pos.push(p.x,p.y,p.z);uv.push(i/12,j/24);if(j<24&&i<12){const n=j*13+i;indices.push(n,n+1,n+13,n+1,n+14,n+13);}}
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(pos,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geometry.setIndex(indices);geometry.computeVertexNormals();
 const keys=['sentence','definition','partOfSpeech','test','wordHistory','human','show','hear'];
 keys.forEach((key,i)=>{
  const petal=new T.Group();crown.add(petal);petal.rotation.z=-i*Math.PI/4;petal.rotation.y=Math.sin(i)*.22;petal.scale.set(1,i%2?.85:1,1.7);petals.push(petal);
  const mat=petalMaterial.clone();mat.color.set(i%2?'#a587c5':'#75afc9');add(geometry,mat,petal);
  const mid=[];for(let j=0;j<=16;j++){const p=surface(0,j/16);p.z+=.012;mid.push([p.x,p.y,p.z]);}tube(mid,.009,vein,petal);
  for(const sign of [-1,1])for(let j=1;j<4;j++){const points=[];for(let k=0;k<=8;k++){const p=surface(sign*k/9,.15+j*.15+k*.012);p.z+=.012;points.push([p.x,p.y,p.z]);}tube(points,.005,vein,petal);}
  const anchor=new T.Object3D();anchor.position.copy(surface(0,.57));anchor.position.z+=.025;petal.add(anchor);anchors[key]=anchor;
  if(runes){const c=document.createElement('canvas');c.width=256;c.height=512;const ctx=c.getContext('2d');ctx.translate(128,292);ctx.scale(3.6,-3.6);ctx.translate(-16,-16);ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=1.5;ctx.strokeStyle='white';for(const match of glyphs[key].matchAll(/d="([^"]+)"/g))ctx.stroke(new Path2D(match[1]));const texture=new T.CanvasTexture(c);mat.emissiveMap=texture;mat.emissive.set('#73ff4f');mat.emissiveIntensity=1.5;marks[key]=mat;}
 });
 // A seed chamber suggests a quiet face through botanical folds and dark anthers.
 const heart=add(new T.SphereGeometry(1,28,20),skin,crown);heart.scale.set(.29,.38,.28);heart.position.z=.04;
 const gold=new T.MeshStandardMaterial({color:'#c4aa78',roughness:.55,emissive:'#786040',emissiveIntensity:.2});
 const eyeMat=new T.MeshStandardMaterial({color:'#30283e',roughness:.25});
 for(const x of [-.16,.16]){const eye=add(new T.SphereGeometry(1,16,12),eyeMat,crown);eye.scale.set(.055,.022,.025);eye.position.set(x,.08,.295);tube([[x-.08,.09,.28],[x,.15,.31],[x+.08,.1,.28]],.018,gold,crown);}
 tube([[0,.02,.32],[-.025,-.14,.32],[0,-.3,.24]],.012,vein,crown);
 for(let i=0;i<9;i++){const a=i*2.4,s=add(new T.SphereGeometry(.025,8,6),gold,crown);s.position.set(Math.sin(a)*.12,.23+(i%3)*.035,.24);}
 for(const side of [-1,1]){const leaf=add(geometry,skin);leaf.position.set(0,.45,0);leaf.rotation.set(.5,side*.5,-side*1.1);leaf.scale.set(.85,.9,1);}
 function update(time,{motion=true,active='',collected=false}={}){crown.rotation.z=motion?Math.sin(time*.8)*.018:0;crown.rotation.x=motion?Math.sin(time*.6)*.025:0;for(let i=0;i<petals.length;i++)petals[i].rotation.x=(active===keys[i]?-.12:0)+(motion?Math.sin(time*.7+i)*.018:0);root.scale.setScalar(collected?.35:1);}
 function state(states){for(const [key,mark]of Object.entries(marks)){const s=states[key]||{};mark.emissiveIntensity=s.unavailable?0:s.done?.3:1.5;mark.emissive.set(s.active?'#c0ff8a':s.done?'#29653b':'#73ff4f');}}
 return {root,anchors,update,state};
}

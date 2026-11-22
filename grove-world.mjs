import * as T from './vendor/three-0.187.0.mjs';
import {addLivingGrove} from './grove-flora.mjs';
import {createFlowerModel} from './flower-model.mjs';
// Rendering adapter only. Word progress, coins and audio stay in flower-study/garden.
export async function createGroveWorld({canvas,track,onFailure}){
 const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=T.SRGBColorSpace;
 renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.22;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 const scene=new T.Scene();scene.background=new T.Color('#302d50');scene.fog=new T.FogExp2('#9a789c',.016);
 const skyCanvas=document.createElement('canvas');skyCanvas.width=16;skyCanvas.height=256;const skyContext=skyCanvas.getContext('2d'),skyGradient=skyContext.createLinearGradient(0,0,0,256);skyGradient.addColorStop(0,'#272a4c');skyGradient.addColorStop(.55,'#716184');skyGradient.addColorStop(1,'#c69eac');skyContext.fillStyle=skyGradient;skyContext.fillRect(0,0,16,256);const skyTexture=new T.CanvasTexture(skyCanvas);skyTexture.colorSpace=T.SRGBColorSpace;scene.background=skyTexture;
 const camera=new T.PerspectiveCamera(57,1,.1,150);const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const hemi=new T.HemisphereLight('#b7caff','#503045',2.3);scene.add(hemi);
 const sun=new T.DirectionalLight('#ffd5c7',2.7);sun.position.set(-9,15,5);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-13,right:13,top:13,bottom:-13,near:.5,far:50});sun.shadow.bias=-.001;sun.shadow.normalBias=.04;scene.add(sun);
 const rim=new T.DirectionalLight('#8ccce9',1.6);rim.position.set(8,6,-9);scene.add(rim);
 const stone=new T.MeshStandardMaterial({color:'#9a86a8',roughness:.94,flatShading:true});
 const copper=new T.MeshStandardMaterial({color:'#79586b',roughness:1,flatShading:true});
 const dark=new T.MeshStandardMaterial({color:'#73647f',roughness:.98,flatShading:true});
 const frost=new T.MeshStandardMaterial({color:'#89acc9',roughness:.35,metalness:.22,emissive:'#27455e',emissiveIntensity:.7,flatShading:true});
 const rose=new T.MeshStandardMaterial({color:'#b081bd',roughness:.55,emissive:'#4f285b',emissiveIntensity:.35,flatShading:true});
 // Small procedural mineral textures supply grain and relief without extra downloads.
 function mineralTexture(base,repeat){const size=256,c=document.createElement('canvas');c.width=c.height=size;const ctx=c.getContext('2d'),im=ctx.createImageData(size,size);for(let y=0;y<size;y++)for(let x=0;x<size;x++){const i=(y*size+x)*4;const waves=Math.sin(x*.12+Math.sin(y*.07)*2)*8+Math.cos(y*.17+x*.05)*6;const noise=(Math.sin(x*127.1+y*311.7)*43758.5453)%1;const grain=waves+noise*19;for(let k=0;k<3;k++)im.data[i+k]=Math.max(0,Math.min(255,base[k]+grain));im.data[i+3]=255;}ctx.putImageData(im,0,0);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.repeat.set(repeat,repeat);return tex;}
 const rockMap=mineralTexture([172,163,180],3),soilMap=mineralTexture([161,128,132],35);
 for(const mat of [stone,dark]){mat.flatShading=false;mat.emissive.set('#30213c');mat.emissiveIntensity=.25;mat.map=rockMap;mat.bumpMap=rockMap;mat.bumpScale=.016;}
 copper.map=soilMap;copper.bumpMap=soilMap;copper.bumpScale=.018;copper.color.set('#635565');
 const rockGeo=new T.SphereGeometry(1,36,22);const vertices=rockGeo.attributes.position;for(let i=0;i<vertices.count;i++){const x=vertices.getX(i),y=vertices.getY(i),z=vertices.getZ(i);const r=1+.065*Math.sin(x*13+y*9)*Math.cos(z*11-y*7)+.025*Math.sin(y*31+x*17);vertices.setXYZ(i,x*r,y*r,z*r);}rockGeo.computeVertexNormals();
 const crystalGeo=new T.ConeGeometry(.25,1.5,5);
 function mesh(g,m,x,y,z,sx=1,sy=1,sz=1){const o=new T.Mesh(g,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;o.receiveShadow=true;scene.add(o);return o;}
 const terrain=new T.CircleGeometry(65,96);terrain.rotateX(-Math.PI/2);mesh(terrain,copper,0,-.18,0);
 const ringGeo=new T.TorusGeometry(7.1,.13,6,96);ringGeo.rotateX(Math.PI/2);mesh(ringGeo,stone,0,.01,0);
 const innerGeo=new T.TorusGeometry(3.4,.035,5,80);innerGeo.rotateX(Math.PI/2);mesh(innerGeo,frost,0,-.02,0);
 let seed=79;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<18;i++){const a=(i+.5)*Math.PI*2/18,x=Math.sin(a)*9.1,z=-Math.cos(a)*9.1;
 const pillar=mesh(rockGeo,i%3?stone:dark,x,1.9,z,.75+rand()*.25,2+rand()*.4,.72);pillar.rotation.set(rand()*.12,rand(),rand()*.13);
 const b=a+Math.PI/18;const lintel=mesh(rockGeo,stone,Math.sin(b)*9.1,4.05,-Math.cos(b)*9.1,1.7,.4,.65);lintel.rotation.y=-b;
 }
 for(let i=0;i<12;i++){const a=i*Math.PI*2/12;mesh(rockGeo,dark,Math.sin(a)*43,2,-Math.cos(a)*43,8,4+rand()*7,7);}
 const scatter=new T.InstancedMesh(rockGeo,stone,160),matrix=new T.Object3D();
 for(let i=0;i<160;i++){const a=rand()*Math.PI*2,r=8+rand()*30;matrix.position.set(Math.sin(a)*r,-.05,-Math.cos(a)*r);matrix.rotation.set(rand(),rand(),rand());const size=.2+rand()*.8;matrix.scale.set(size,size*.4,size);matrix.updateMatrix();scatter.setMatrixAt(i,matrix.matrix);}scatter.castShadow=true;scatter.receiveShadow=true;scene.add(scatter);
 const shards=new T.InstancedMesh(crystalGeo,frost,75);
 for(let i=0;i<75;i++){const a=rand()*Math.PI*2,r=7.5+rand()*3.2;matrix.position.set(Math.sin(a)*r,.2,-Math.cos(a)*r);matrix.rotation.set((rand()-.5)*.5,rand()*6,(rand()-.5)*.5);const size=.2+rand()*.8;matrix.scale.set(size,size,size);matrix.updateMatrix();shards.setMatrixAt(i,matrix.matrix);}scene.add(shards);
 // Branching mineral growths give the alien beds a recognisable non-Earth ecology.
 for(let i=0;i<18;i++){const a=rand()*Math.PI*2,r=7.4+rand()*2;const x=Math.sin(a)*r,z=-Math.cos(a)*r;for(let k=0;k<3;k++){const stem=mesh(new T.CylinderGeometry(.035,.075,.7+k*.16,5),rose,x+k*.12,.25+k*.08,z,.9,1,.9);stem.rotation.z=(k-1)*.35;mesh(rockGeo,k%2?frost:rose,x+k*.18,.68+k*.16,z,.23,.13,.23);}}
 const leafGeo=new T.SphereGeometry(1,10,7),leafMaterial=new T.MeshStandardMaterial({color:'#858ec0',roughness:.7,metalness:.08});const leaves=new T.InstancedMesh(leafGeo,leafMaterial,150);
 for(let i=0;i<150;i++){const cluster=Math.floor(i/5),a=cluster*Math.PI*2/30,r=7.5+(cluster%3)*.45,k=i%5;matrix.position.set(Math.sin(a)*r,.25+k*.06,-Math.cos(a)*r);matrix.rotation.set(.2,k*1.4+a,(k-2)*.35);matrix.scale.set(.13,.45+k*.05,.035);matrix.updateMatrix();leaves.setMatrixAt(i,matrix.matrix);leaves.setColorAt(i,new T.Color(['#a39bd0','#718ea5','#bd9aaa'][cluster%3]));}leaves.castShadow=true;scene.add(leaves);
 addLivingGrove(scene);
 const moon=mesh(new T.SphereGeometry(5,32,24),new T.MeshStandardMaterial({color:'#b6a0c9',roughness:1,emissive:'#5a405f',emissiveIntensity:.2}),-20,17,-45);
 const orbit=mesh(new T.TorusGeometry(7.6,.14,5,96),new T.MeshBasicMaterial({color:'#d2a9bd'}),moon.position.x,moon.position.y,moon.position.z);orbit.rotation.set(1.1,.3,.4);
 mesh(new T.SphereGeometry(2.3,24,16),new T.MeshBasicMaterial({color:'#b2a8d0'}),27,13, -53);
 const starPositions=new Float32Array(240*3);for(let i=0;i<240;i++){const a=rand()*Math.PI*2,r=65;starPositions[i*3]=Math.sin(a)*r;starPositions[i*3+1]=10+rand()*55;starPositions[i*3+2]=Math.cos(a)*r;}
 const starGeometry=new T.BufferGeometry();starGeometry.setAttribute('position',new T.BufferAttribute(starPositions,3));scene.add(new T.Points(starGeometry,new T.PointsMaterial({color:'#ddd7f7',size:.1,sizeAttenuation:true})));
 let atlas;try{atlas=await new T.TextureLoader().loadAsync('assets/garden/organic-flowers.webp');}catch(error){renderer.dispose();throw error;}
 atlas.colorSpace=T.SRGBColorSpace;
 const plantGroup=new T.Group();scene.add(plantGroup);const flowerPlanes=[],beds=[];
 const planeGeo=new T.PlaneGeometry(3,3),bedGeo=new T.CylinderGeometry(1.3,1.48,.22,12);
 for(let i=0;i<10;i++){
 const tex=atlas.clone();tex.repeat.set(1/5,1/2);tex.offset.set(i%5/5,1-(Math.floor(i/5)+1)/2);tex.needsUpdate=true;
 const mat=new T.MeshBasicMaterial({map:tex,transparent:true,alphaTest:.04,depthWrite:false,color:'#dfc5f7',side:T.DoubleSide});
 const plane=new T.Mesh(planeGeo,mat);plane.castShadow=true;plantGroup.add(plane);flowerPlanes.push(plane);
 const bed=mesh(bedGeo,dark,0,0,0);beds.push(bed);
 }
 const sculpted=createFlowerModel({runes:false});scene.add(sculpted.root);sculpted.root.position.set(0,0,-6);sculpted.root.scale.setScalar(.88);
 let total=5,index=0,studying=false,enabled=true,disposed=false,lost=false,angle=0,target=0,frame=0,lastTime=0;
 const projected=new T.Vector3(),right=new T.Vector3(),up=new T.Vector3();
 function positionPlants(){sculpted.root.visible=!studying;for(let i=0;i<10;i++){const a=i/total*Math.PI*2,visible=i<total;const p=flowerPlanes[i];p.visible=i!==0&&visible&&!studying;beds[i].visible=visible&&!studying;p.position.set(Math.sin(a)*6,1.6,-Math.cos(a)*6);beds[i].position.set(p.position.x,-.05,p.position.z);}}
 function alignButtons(){if(studying)return;const rect=track.getBoundingClientRect();camera.updateMatrixWorld();right.setFromMatrixColumn(camera.matrixWorld,0);up.setFromMatrixColumn(camera.matrixWorld,1);
 [...track.children].forEach((button,i)=>{const pos=flowerPlanes[i].position;projected.copy(pos).project(camera);const center={x:(projected.x+1)*innerWidth/2,y:(1-projected.y)*innerHeight/2,z:projected.z};const edge=pos.clone().addScaledVector(up,1.5).project(camera);const height=Math.abs((1-edge.y)*innerHeight/2-center.y)*2;
 const facing=pos.clone().sub(camera.position).dot(camera.getWorldDirection(new T.Vector3()))>0;
 button.style.left=(center.x-rect.left-height/2)+'px';button.style.top=(center.y-rect.top-height/2)+'px';button.style.width=height+'px';button.style.height=height+'px';button.style.visibility=facing&&center.z<1&&Math.abs(Number(button.dataset.slot))<=1?'visible':'hidden';
 });}
 function render(time){frame=0;if(disposed||lost||!enabled||document.hidden)return;const dt=Math.min((time-lastTime)/1000||.016,.05);lastTime=time;const distance=target-angle;angle=reduced.matches?target:angle+distance*(1-Math.exp(-dt*8));if(Math.abs(target-angle)<.001)angle=target;
 camera.position.set(-Math.sin(angle)*.4,2.5,Math.cos(angle)*.4);camera.lookAt(Math.sin(angle)*6,1.35,-Math.cos(angle)*6);
 for(const p of flowerPlanes)p.quaternion.copy(camera.quaternion);
 try{renderer.render(scene,camera);}catch{lost=true;onFailure();return;}if(lost||disposed)return;alignButtons();if(angle!==target)wake();}
 function wake(){if(!frame&&!disposed&&!document.hidden&&enabled&&!lost)frame=requestAnimationFrame(render);}
 function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();wake();}
 function show(next,count,inStudy){total=count;index=next;studying=inStudy;let nextAngle=index/total*Math.PI*2;while(nextAngle-angle>Math.PI)nextAngle-=Math.PI*2;while(nextAngle-angle< -Math.PI)nextAngle+=Math.PI*2;target=nextAngle;positionPlants();wake();}
 function setEnabled(value){enabled=value;canvas.hidden=!value;if(value)wake();else{cancelAnimationFrame(frame);frame=0;}}
 function contextLost(e){e.preventDefault();lost=true;cancelAnimationFrame(frame);frame=0;onFailure();}
 function visibility(){if(document.hidden){cancelAnimationFrame(frame);frame=0;}else wake();}
 canvas.addEventListener('webglcontextlost',contextLost);window.addEventListener('resize',resize);window.addEventListener('scroll',wake,{passive:true});document.addEventListener('visibilitychange',visibility);reduced.addEventListener('change',wake);
 function dispose(){disposed=true;cancelAnimationFrame(frame);window.removeEventListener('resize',resize);window.removeEventListener('scroll',wake);document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',wake);canvas.removeEventListener('webglcontextlost',contextLost);scene.traverse(o=>{o.geometry?.dispose();if(o.material){o.material.map?.dispose();o.material.dispose();}});atlas.dispose();skyTexture.dispose();rockMap.dispose();soilMap.dispose();renderer.dispose();}
 positionPlants();resize();return {show,setEnabled,dispose};
}

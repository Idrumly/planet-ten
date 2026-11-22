import * as T from './vendor/three-0.187.0.mjs';
import {createFlowerModel} from './flower-model.mjs?v=verdant-1';

export function createFlowerPortrait({host,flower,onFailure}){
 const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');host.append(canvas);
 let renderer;try{renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});}catch(e){canvas.remove();throw e;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(39,1,.1,30),model=createFlowerModel();scene.add(model.root);scene.add(new T.AmbientLight('#b6b3dd',.8));
 scene.add(new T.HemisphereLight('#c9e7ff','#51385d',2));const key=new T.DirectionalLight('#ffd3c3',3);key.position.set(-3,5,4);scene.add(key);const rim=new T.DirectionalLight('#80cfff',2.5);rim.position.set(3,3,-2);scene.add(rim);
 const controls=document.createElement('div');controls.className='flower-view-controls';controls.setAttribute('aria-label','Inspect the 3D flower');let angle=0;
 for(const [label,value]of [['View left',-.45],['Front',0],['View right',.45]]){const b=document.createElement('button');b.textContent=label;b.onclick=()=>{angle=value;draw(performance.now());};controls.append(b);}flower.after(controls);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame=0,disposed=false,states={},active='',last=0;
 const position=new T.Vector3();const originalButtons=[...flower.querySelectorAll('button')].map(b=>({b,left:b.style.left,top:b.style.top}));
 function buttonFor(k){return k==='hear'?document.getElementById('hear'):k==='test'?document.getElementById('test-petal'):flower.querySelector('[data-kind="'+k+'"]');}
 function draw(time){if(disposed||document.hidden)return;model.root.rotation.y=angle;model.update(time/1000,{motion:!reduced.matches,active});model.state(states);scene.updateMatrixWorld(true);renderer.render(scene,camera);
  for(const [k,anchor]of Object.entries(model.anchors)){const b=buttonFor(k);if(!b)continue;anchor.getWorldPosition(position).project(camera);b.style.left=(position.x+1)*50+'%';b.style.top=(1-position.y)*50+'%';}
 }
 function tick(time){frame=0;if(disposed||document.hidden)return;if(time-last>32){draw(time);last=time;}if(!reduced.matches)frame=requestAnimationFrame(tick);}
 function wake(){if(!frame&&!disposed&&!document.hidden)frame=requestAnimationFrame(tick);}
 function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.set(0,1.8,5.9);camera.lookAt(0,1.8,0);camera.updateProjectionMatrix();draw(performance.now());}
 function visibility(){cancelAnimationFrame(frame);frame=0;if(!document.hidden){draw(performance.now());wake();}}
 function lost(e){e.preventDefault();dispose();onFailure();}
 const observer=new ResizeObserver(resize);observer.observe(host);document.addEventListener('visibilitychange',visibility);reduced.addEventListener('change',visibility);canvas.addEventListener('webglcontextlost',lost);
 function dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);observer.disconnect();document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',visibility);canvas.removeEventListener('webglcontextlost',lost);scene.traverse(o=>{o.geometry?.dispose();o.material?.map?.dispose();o.material?.emissiveMap?.dispose();o.material?.dispose();});renderer.dispose();canvas.remove();controls.remove();flower.classList.remove('sculpted');for(const {b,left,top}of originalButtons){b.style.left=left;b.style.top=top;}}
 flower.classList.add('sculpted');resize();wake();return {dispose,sync(next){states=next;active=Object.keys(states).find(k=>states[k].active)||'';draw(performance.now());}};
}

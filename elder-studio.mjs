import * as T from 'three';
import {GLTFLoader,OrbitControls} from './vendor/three-addons-0.187.0.mjs';
const canvas=document.getElementById('canvas'),status=document.getElementById('status');
let renderer,controls,model,frame=0;
const scene=new T.Scene();scene.background=new T.Color('#253231');scene.fog=new T.Fog('#253231',13,25);
const camera=new T.PerspectiveCamera(38,1,.1,60);
function render(){frame=0;if(!renderer||document.hidden)return;renderer.render(scene,camera);}
function wake(){if(!frame&&!document.hidden)frame=requestAnimationFrame(render);}
function view(name){const values={front:[0,2.2,7,0,1.85,0],three:[3.3,2.6,6.4,0,1.85,0],side:[6.5,2.3,0,0,1.85,0],back:[0,2.2,-7,0,1.85,0],face:[.7,2.75,2.3,0,2.55,0]};const a=values[name];camera.position.set(...a.slice(0,3));controls.target.set(...a.slice(3));if(innerWidth<700&&name!=='face')camera.position.sub(controls.target).multiplyScalar(1.15).add(controls.target);controls.update();wake();}
try{
 renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 controls=new OrbitControls(camera,canvas);controls.enablePan=false;controls.minDistance=1.5;controls.maxDistance=11;controls.maxPolarAngle=Math.PI*.53;controls.addEventListener('change',wake);
 scene.add(new T.HemisphereLight('#e6eddb','#536254',.9));
 function light(color,intensity,x,y,z){const l=new T.DirectionalLight(color,intensity);l.position.set(x,y,z);scene.add(l);return l;}
 const key=light('#ffdfb5',3,-3,6,5);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-3,right:3,top:5,bottom:-2,near:.1,far:15});key.shadow.bias=-.0002;key.shadow.normalBias=.003;key.shadow.radius=3;
 light('#aacdd7',.85,4,3,3);light('#f8ba9a',2,1,5,-3);
 const floor=new T.Mesh(new T.PlaneGeometry(200,200),new T.MeshStandardMaterial({color:'#35403a',roughness:.95}));floor.rotation.x=-Math.PI/2;floor.position.y=-.025;floor.receiveShadow=true;scene.add(floor);
 const clay=new T.MeshStandardMaterial({color:'#c5b299',roughness:.78});const wire=new T.MeshBasicMaterial({color:'#b7d7c0',wireframe:true});
 function resize(){renderer.setSize(canvas.clientWidth,canvas.clientHeight,false);camera.aspect=canvas.clientWidth/canvas.clientHeight;camera.updateProjectionMatrix();wake();}
 window.addEventListener('resize',resize);document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else wake();});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();status.textContent='3D graphics paused. Reload this page to inspect the model again.';cancelAnimationFrame(frame);});
 document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>view(b.dataset.view));document.getElementById('reset').onclick=()=>view('three');
 document.getElementById('surface').onchange=e=>{model?.traverse(o=>{if(o.isMesh)o.material=e.target.value==='clay'?clay:e.target.value==='wire'?wire:o.userData.originalMaterial;});wake();};
 canvas.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();const offset=camera.position.clone().sub(controls.target);offset.applyAxisAngle(new T.Vector3(0,1,0),e.key==='ArrowLeft'?.15:-.15);camera.position.copy(controls.target).add(offset);controls.update();}});
 resize();view('three');
 const gltf=await new GLTFLoader().loadAsync('./assets/elder-clover/elder-clover.glb?v=elder-2');model=gltf.scene;
 model.traverse(o=>{if(o.isMesh){o.castShadow=!/fuzz/i.test(o.name);o.receiveShadow=!/fuzz/i.test(o.name);o.userData.originalMaterial=o.material;for(const mat of Array.isArray(o.material)?o.material:[o.material])if(mat.map)mat.map.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());}});
 scene.add(model);status.textContent='Asset study · sculpt and textures';document.body.dataset.loaded='true';wake();
}catch(error){status.textContent='The 3D preview could not load. You can download the model using “About this asset”, or reload to retry.';console.error(error);}

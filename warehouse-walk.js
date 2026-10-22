'use strict';
(()=>{
 const $=id=>document.getElementById(id);
 document.body.classList.add('walking-game');
 const viewport=document.createElement('section');viewport.id='walk-view';viewport.tabIndex=0;viewport.setAttribute('aria-label','Warehouse. W A S D to move, arrow left and right to look. Click the nearby door.');
 viewport.innerHTML='<canvas id="architecture" aria-hidden="true"></canvas><div id="inhabitants"></div><div class="walk-crosshair" aria-hidden="true">+</div><p id="walk-caption" role="status">Walk towards the Spelling Bee door. W A S D to move · ← → to look.</p><div class="walk-toolbar"><button id="approach">Walk to door</button><button id="inspect">Inspect door</button><button id="hall-reset" hidden>New codes</button></div><div class="walk-pad" aria-label="Movement controls"><button data-move="arrowleft" aria-label="Look left">↶</button><button data-move="w" aria-label="Walk forward">▲</button><button data-move="arrowright" aria-label="Look right">↷</button><button data-move="a" aria-label="Step left">◀</button><button data-move="s" aria-label="Walk backward">▼</button><button data-move="d" aria-label="Step right">▶</button></div>';
 document.querySelector('.bot').after(viewport);
 const dialog=document.createElement('dialog');dialog.id='lock-inspection';dialog.setAttribute('aria-label','Inspect the living door locks');dialog.innerHTML='<button id="leave-lock" class="leave-lock">Back to warehouse · Esc</button>';
 dialog.append($('console'));document.body.append(dialog);
 const ctx=$('architecture').getContext('2d'),entities=[],keys=new Set();
 let x=0,z=160,yaw=0,unlocked=false,opening=false,last=0,raf=0,width=800,height=600,inspectZoom=0;
 const near=()=>Math.abs(x)<230&&z< -350&&z> -900;
 function entity(kind,ex,ez,ew,eh,html,label,onClick){const el=document.createElement(onClick?'button':'div');el.className='world-object '+kind;el.style.width=ew+'px';el.style.height=eh+'px';el.innerHTML=html;if(label)el.setAttribute('aria-label',label);else el.setAttribute('aria-hidden','true');if(onClick)el.onclick=onClick;$('inhabitants').append(el);const obj={el,x:ex,z:ez,w:ew,h:eh,room:ez< -800};entities.push(obj);return obj;}
 const door=entity('walk-door',0,-720,280,410,'<span class="door-sign">PLANET TEN<strong>Spelling Bee</strong><small>AUTHORIZED PERSONNEL &amp; POLLEN</small></span><span class="door-fuzz">◉ ≋ ◉<br>◉ ≋ ◉<br>◉ ≋ ◉</span><span class="door-grip">✦</span>','Spelling Bee door',inspect);
 entity('crate',-335,-380,170,160,'<b>FRAGILE</b><span>Possibly opinions.</span>');
 entity('crate',340,-590,170,230,'<b>DO NOT SHAKE</b><span>Already offended.</span>');
 entity('wall-notice',-300,-710,180,100,'WAREHOUSE 01<br><strong>APPROXIMATELY SECURE</strong>');
 const beeHTML=document.querySelector('.bee').outerHTML,chairHTML=document.querySelector('.chair').outerHTML;
 const remarks=[
  'COMMUNITY. C · O · M · M · U · N · I · T · Y. May I have that in a pollen sentence?',
  'CITIZEN. C · I · T · I · Z · E · N. I pay my taxes in honey.',
  'CULTURE. C · U · L · T · U · R · E. Mine is mostly flower-based.'
 ];
 function bee(ex,ez,i){entity('resident bee-resident',ex,ez,280,350,chairHTML+beeHTML+'<span class="resident-label">'+['CHIEF SPELLER','CITIZENSHIP DIVISION','CULTURE COMMITTEE'][i]+'</span>','Talk to '+['chief spelling bee','citizenship bee','culture bee'][i],()=>say(remarks[i]));}
 bee(0,-1900,0);bee(-320,-1660,1);bee(325,-1740,2);
 [-360,-150,360].forEach((ex,i)=>entity('resident flower-resident',ex,[-1370,-1850,-1430][i],105,170,'<span>✿</span><b>'+['10','10','POLLEN'][i]+'</b>','Talk to flower judge '+(i+1),()=>say(['Ten out of ten. Excellent use of additional legs.','I was told there would be nectar.','Pollen. That is my entire judging system.'][i])));
 const banner=entity('room-banner',0,-2040,690,160,'<small>PLANET TEN CIVIC LITERACY PROGRAMME</small><strong>THE SPELLING BEE</strong><span>Words matter. So do snacks.</span>');
 banner.base=210;
 entity('honey-desk',-330,-1890,180,180,'<span>⬡</span><b>EMERGENCY NECTAR</b>','Inspect nectar supply',()=>say('Emergency nectar. For spelling emergencies. The budget is confidential.'));
 const speech=document.createElement('div');speech.id='resident-speech';speech.hidden=true;speech.setAttribute('role','status');speech.innerHTML='<p></p><button>Close</button>';viewport.append(speech);speech.querySelector('button').onclick=()=>{speech.hidden=true;viewport.focus({preventScroll:true});};
 function say(text){speech.hidden=false;speech.querySelector('p').textContent=text;window.RoundTalk(text);speech.querySelector('button').focus({preventScroll:true});keys.clear();}
 function camera(px,py,pz){const dx=px-x,dz=z-pz,c=Math.cos(yaw),s=Math.sin(yaw);return {x:c*dx-s*dz,y:145-py,z:s*dx+c*dz};}
 function project(p){const focal=Math.min(width*.8,640)+inspectZoom;return {x:width/2+p.x*focal/p.z,y:height*.48+p.y*focal/p.z,s:focal/p.z};}
 function polygon(points,fill,stroke){let pts=points.map(p=>camera(...p)),out=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length],ai=a.z>=15,bi=b.z>=15;if(ai)out.push(a);if(ai!==bi){const t=(15-a.z)/(b.z-a.z);out.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,z:15});}}if(out.length<3)return;ctx.beginPath();out.forEach((p,i)=>{const q=project(p);i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);});ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();}}
 function draw(){
  ctx.fillStyle='#0b182b';ctx.fillRect(0,0,width,height);
  polygon([[-520,360,250],[520,360,250],[520,360,-2100],[-520,360,-2100]],'#152c44');
  polygon([[-520,0,250],[-520,360,250],[-520,360,-2100],[-520,0,-2100]],'#29435c');
  polygon([[520,0,-2100],[520,360,-2100],[520,360,250],[520,0,250]],'#21354e');
  polygon([[-520,0,-2100],[-520,360,-2100],[520,360,-2100],[520,0,-2100]],'#304c60');
  for(let iz=200;iz> -2100;iz-=100)for(let ix=-520;ix<520;ix+=130)polygon([[ix,0,iz],[ix+130,0,iz],[ix+130,0,iz-100],[ix,0,iz-100]],((ix+520)/130+iz/100)%2?'#223444':'#293e4e','#46617155');
  for(let zz=0;zz> -2100;zz-=350){polygon([[-520,0,zz],[-520,350,zz],[-480,350,zz],[-480,0,zz]],'#56747c');polygon([[480,0,zz],[480,350,zz],[520,350,zz],[520,0,zz]],'#56747c');polygon([[-370,355,zz],[370,355,zz],[370,355,zz-30],[-370,355,zz-30]],'#aeffe0');}
  {polygon([[-520,0,-735],[-520,360,-735],[-145,360,-735],[-145,0,-735]],'#355165');polygon([[145,0,-735],[145,360,-735],[520,360,-735],[520,0,-735]],'#355165');}
  entities.forEach(o=>{const p=camera(o.x,o.base||0,o.z),q=project(p),visible=p.z>25&&(!o.room||unlocked)&&!(o===door&&unlocked&&!opening);o.el.hidden=!visible;if(!visible)return;o.el.style.transform=`translate(${q.x}px,${q.y}px) scale(${q.s}) translate(-50%,-100%)`;o.el.style.zIndex=String(Math.max(1,Math.round(10000-p.z)));});
  $('inspect').disabled=unlocked||!near();$('inspect').textContent=near()?'Inspect door':'Move closer to inspect';
 }
 function resize(){width=viewport.clientWidth;height=viewport.clientHeight;const dpr=Math.min(devicePixelRatio||1,2);$('architecture').width=width*dpr;$('architecture').height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
 function inspect(){if(unlocked)return;if(!near()){caption('A little closer, apprentice. Even this door has boundaries.');return;}keys.clear();inspectZoom=100;draw();dialog.showModal();$('question-title').focus();}
 function caption(text){$('walk-caption').textContent=text;}
 function close(){dialog.close();}
 $('leave-lock').onclick=close;dialog.addEventListener('close',()=>{inspectZoom=0;keys.clear();draw();viewport.focus({preventScroll:true});});
 $('approach').onclick=()=>{x=0;z=unlocked?-1050:-420;yaw=0;draw();caption(unlocked?'Inside the room. Click a bee or flower to talk.':'Door reached. Click the door or Inspect door.');viewport.focus({preventScroll:true});};
 $('inspect').onclick=inspect;
 $('hall-reset').onclick=()=>{window.RoundRestart();};
 function reset(){unlocked=false;opening=false;x=0;z=160;yaw=0;keys.clear();speech.hidden=true;if(dialog.open)dialog.close();$('hall-reset').hidden=true;$('approach').textContent='Walk to door';$('inspect').hidden=false;caption('Walk towards the Spelling Bee door. W A S D to move · ← → to look.');draw();}
 function open(){if(dialog.open)dialog.close();const transform=door.el.style.transform;opening=!document.body.classList.contains('still');if(opening)door.el.animate([{transform,opacity:1},{transform:transform+' rotateY(-95deg)',opacity:0}],{duration:650,easing:'ease-in'}).finished.then(()=>{opening=false;draw();}).catch(()=>{opening=false;draw();});unlocked=true;$('inspect').hidden=true;$('hall-reset').hidden=false;$('approach').textContent='Step into room';caption('Door open! Walk forward into the room. Click the bees and flower judges to meet them.');draw();viewport.focus({preventScroll:true});}
 window.WarehouseWalk={open,reset};
 function move(dt){const f=(keys.has('w')?1:0)-(keys.has('s')?1:0),r=(keys.has('d')?1:0)-(keys.has('a')?1:0);yaw+=((keys.has('arrowright')?1:0)-(keys.has('arrowleft')?1:0))*dt*1.3;const n=Math.hypot(f,r)||1,speed=210*dt;const nx=x+(Math.sin(yaw)*f+Math.cos(yaw)*r)/n*speed,nz=z+(-Math.cos(yaw)*f+Math.sin(yaw)*r)/n*speed;
  x=Math.max(-420,Math.min(420,nx));const crosses=(z+720)*(nz+720)<=0;if(!crosses||Math.abs(x)<115)z=Math.max(unlocked?-1930:-470,Math.min(180,nz));draw();}
 function frame(t){const dt=Math.min((t-last)/1000,.04);last=t;if(keys.size&&!dialog.open&&!document.hidden&&speech.hidden)move(dt);raf=requestAnimationFrame(frame);}
 document.addEventListener('keydown',e=>{if(dialog.open||!speech.hidden||e.target.closest('input,textarea,select')||!['w','a','s','d','arrowleft','arrowright'].includes(e.key.toLowerCase()))return;e.preventDefault();keys.add(e.key.toLowerCase());});
 document.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
 window.addEventListener('blur',()=>keys.clear());document.addEventListener('visibilitychange',()=>keys.clear());
 document.querySelectorAll('[data-move]').forEach(b=>{b.onpointerdown=e=>{b.setPointerCapture(e.pointerId);keys.add(b.dataset.move);move(.15);};b.onpointerup=b.onpointercancel=b.onlostpointercapture=()=>keys.delete(b.dataset.move);b.onclick=e=>{if(e.detail===0){keys.add(b.dataset.move);move(.2);keys.delete(b.dataset.move);}};});
 new ResizeObserver(resize).observe(viewport);window.addEventListener('pagehide',()=>cancelAnimationFrame(raf));resize();raf=requestAnimationFrame(frame);
})();

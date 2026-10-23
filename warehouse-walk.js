'use strict';
(()=>{
 const $=id=>document.getElementById(id),R=WarehouseRooms.current,hospital=R.id==='band-aid',extra=Boolean(WarehouseShows[R.id]),other=R.id!=='bee';
 document.body.classList.add('walking-game');
 const viewport=document.createElement('section');viewport.id='walk-view';viewport.tabIndex=0;viewport.setAttribute('aria-label','Warehouse. W A S D to move, arrow left and right to look. Click the nearby door.');
 viewport.innerHTML='<canvas id="architecture" aria-hidden="true"></canvas><div id="inhabitants"></div><div class="walk-crosshair" aria-hidden="true">+</div><p id="walk-caption" role="status">Walk towards the Spelling Bee door. W A S D to move · ← → to look.</p><div class="walk-toolbar"><button id="approach">Walk to door</button><button id="inspect">Inspect door</button><button id="hall-reset" hidden>New codes</button></div><div class="walk-pad" aria-label="Movement controls"><button data-move="arrowleft" aria-label="Look left">↶</button><button data-move="w" aria-label="Walk forward">▲</button><button data-move="arrowright" aria-label="Look right">↷</button><button data-move="a" aria-label="Step left">◀</button><button data-move="s" aria-label="Walk backward">▼</button><button data-move="d" aria-label="Step right">▶</button></div>';
 document.querySelector('.bot').after(viewport);
 const dialog=document.createElement('dialog');dialog.id='lock-inspection';dialog.setAttribute('aria-label','Inspect the living door locks');dialog.innerHTML='<button id="leave-lock" class="leave-lock">Back to warehouse · Esc</button>';
 const toolbar=document.createElement('div');toolbar.className='door-toolbar';toolbar.append($('leave-lock')||dialog.querySelector('#leave-lock'),$('question-title'));dialog.append(toolbar,$('console'));document.body.append(dialog);
 const ctx=$('architecture').getContext('2d'),entities=[],keys=new Set();
 let x=0,z=160,yaw=0,unlocked=false,opening=false,last=0,raf=0,width=800,height=600,inspectZoom=0;
 let auditorium,clinic,doorEpoch=0;
 const comic=window.createComicDialogue(viewport);let clickedActor=null;
 const route=document.createElement('button');route.id='room-route';route.hidden=true;route.textContent=R.next?'Next: '+WarehouseRooms.rooms[R.next].title+' →':'Warehouse tour complete ✓';route.onclick=()=>{location.href=R.next?'rounding.html?room='+R.next:'index.html';};viewport.append(route);
 const backRoute=document.createElement('button');backRoute.id='room-back';backRoute.hidden=true;backRoute.textContent=R.previous?'← '+WarehouseRooms.rooms[R.previous].title:'';backRoute.onclick=()=>{if(R.previous)location.href='rounding.html?room='+R.previous;};viewport.append(backRoute);
 document.addEventListener('living-lock-released',e=>{const img=document.querySelector('[data-door-lock="'+e.detail.index+'"]');if(img)img.classList.add('released');});
 const near=()=>Math.abs(x)<230&&z< -350&&z> -900;
 function entity(kind,ex,ez,ew,eh,html,label,onClick){const el=document.createElement(onClick?'button':'div');el.className='world-object '+kind;el.style.width=ew+'px';el.style.height=eh+'px';el.innerHTML=html;if(label)el.setAttribute('aria-label',label);else el.setAttribute('aria-hidden','true');if(onClick)el.onclick=()=>{clickedActor=el;onClick();};$('inhabitants').append(el);const obj={el,x:ex,z:ez,w:ew,h:eh,room:ez< -800};entities.push(obj);return obj;}
 const door=entity('walk-door',0,-720,280,410,'<span class="door-sign">PLANET TEN<strong>Spelling Bee</strong><small>AUTHORIZED PERSONNEL &amp; POLLEN</small></span><span class="door-fuzz illustrated-locks"><img data-door-lock="0" src="assets/rounding/fuzzy-lock-v1.webp" alt=""><img data-door-lock="1" src="assets/rounding/slug-lock-v1.webp" alt=""><img data-door-lock="2" src="assets/rounding/jelly-lock-v1.webp" alt=""></span><span class="door-grip">✦</span>','Spelling Bee door',inspect);
 door.el.querySelector('strong').textContent=R.title;door.el.querySelector('small').textContent='HIGHLY NECESSARY CIVIC SERVICES';door.el.setAttribute('aria-label',R.title+' door');
 door.el.querySelector('.door-fuzz').innerHTML=Array.from({length:R.lockCount},(_,i)=>'<span class="door-bolt-sprite" data-door-lock="'+i+'" style="--bolt-row:'+((i%3)*50)+'%" aria-hidden="true"></span>').join('');door.el.dataset.lockCount=R.lockCount;function refreshCast(){document.querySelectorAll('.door-lock-card').forEach((card,i)=>{const bolt=door.el.querySelector('[data-door-lock="'+i+'"]');if(bolt&&card.dataset.worm){bolt.classList.add('cast-bolt');bolt.style.setProperty('--worm-idle',card.style.getPropertyValue('--worm-idle'));}});}refreshCast();document.addEventListener('living-lock-cast',refreshCast);
 entity('crate',-335,-380,170,160,'<b>FRAGILE</b><span>Possibly opinions.</span>');
 entity('crate',340,-590,170,230,'<b>DO NOT SHAKE</b><span>Already offended.</span>');
 entity('wall-notice',-300,-710,180,100,'WAREHOUSE 01<br><strong>APPROXIMATELY SECURE</strong>');
 const beeHTML='<picture class="alien-bee-art"><source srcset="assets/rounding/alien-bee-v2.webp" type="image/webp"><img src="assets/rounding/alien-bee-v2.png" width="880" height="800" alt="" decoding="async"></picture>';
 const remarks=[
  'COMMUNITY. C · O · M · M · U · N · I · T · Y. May I have that in a pollen sentence?',
  'CITIZEN. C · I · T · I · Z · E · N. I pay my taxes in honey.',
  'CULTURE. C · U · L · T · U · R · E. Mine is mostly flower-based.'
 ];
 function bee(ex,ez,i){entity('resident bee-resident alien-variant-'+i,ex,ez,260,280,'<span class="hover-podium"></span>'+beeHTML+'<span class="resident-label">'+['CHIEF SPELLER','CITIZENSHIP DIVISION','CULTURE COMMITTEE'][i]+'</span>','Talk to '+['chief spelling bee','citizenship bee','culture bee'][i],()=>say(remarks[i]));}
 bee(0,-1930,0);bee(-300,-1900,1);bee(300,-1900,2);
 const judges=[-300,-155,300].map((ex,i)=>entity('resident flower-resident judge-'+i,ex,[-1690,-1910,-1690][i],145,225,'<picture class="flower-art"><source srcset="assets/rounding/flower-judge-v1.webp" type="image/webp"><img src="assets/rounding/flower-judge-v1.png" width="567" height="850" alt="" decoding="async"></picture><span class="judge-desk"><b>'+SpellingBee.judges[i]+'</b><em class="judge-score">READY</em></span>','Talk to '+SpellingBee.judges[i],()=>say(['I am Judge Petal. Please do not interrupt. I am rooting for him.','Professor Pollen. I have several degrees. Most are in the greenhouse.','Dame Dandelion. The competition is fierce. I am not going to seed without a fight.'][i])));
 const microphone=entity('stage-microphone',45,-1815,35,165,'<span></span><i></i>');
 const bell=entity('judge-bell',190,-1690,75,80,'<span class="bell-dome"></span><b>DING</b>','Ring the spelling bee bell',()=>ringBell());
 entity('bee-trophy',-65,-1910,65,95,'<span>★</span><b>BEST BEE</b>');
 entity('bee-bunting',0,-1980,660,45,'<span>▼</span><span>▼</span><span>▼</span><span>▼</span><span>▼</span><span>▼</span><span>▼</span>').base=355;
 const banner=entity('room-banner',0,-2090,500,65,'<small>PLANET TEN CIVIC LITERACY PROGRAMME</small><strong>THE SPELLING BEE</strong><span>Words matter. So do snacks.</span>');
 banner.base=425;
 // Small layered props remain world objects, so they move with the camera.
 [-390,390].forEach((ex,i)=>{
  entity('specimen-tank',ex,-1460,85,160,'<span class="tank-cap">⬡</span><span class="specimen"><i></i><i></i><i></i></span><b>LIVE VOWELS</b>');
  entity('lab-workstation',ex,-1990,150,170,'<div class="holo-screen"><small>LEXICON ANALYSIS</small><span>⬡ · ⟡ · ⬡</span><i></i><i></i><i></i><em>PHONEMES STABLE</em></div><div class="lab-bench"><span class="vial"></span><span class="vial"></span><span class="vial"></span><b>NECTAR / DATA</b></div>');
 });
 const holo=entity('floating-molecule',210,-1530,90,120,'<span>⬡</span><i>✧</i><b>⬡</b>');holo.base=210;
 entity('honey-desk',-420,-1930,100,100,'<span>⬡</span><b>EMERGENCY NECTAR</b>','Inspect nectar supply',()=>say('Emergency nectar. For spelling emergencies. The budget is confidential.'));
 entities.forEach(o=>{if(o.room&&o.z<=-1620&&!o.base)o.base=95;});
 if(other)entities.forEach(o=>{if(o.room)o.disabled=true;});
 if(R.previous)entity('room-exit',-425,-1670,115,225,'<small>RETURN TO</small><strong>'+WarehouseRooms.rooms[R.previous].title+'</strong><span>←</span><small>ENTER</small>','Return to '+WarehouseRooms.rooms[R.previous].title,()=>backRoute.click());
 entity('room-exit',425,-1670,115,225,'<small>'+(R.next?'NEXT DEPARTMENT':'TOUR COMPLETE')+'</small><strong>'+(R.next?WarehouseRooms.rooms[R.next].title:'Game suite')+'</strong><span>→</span><small>ENTER</small>',R.next?'Go to '+WarehouseRooms.rooms[R.next].title+' room':'Return to game suite',()=>route.click());
 function say(text){const speaker=clickedActor?.getAttribute('aria-label')?.replace(/^Talk to /,'')||'TEN-BOT';comic.show(speaker,text,clickedActor,{manual:true});}

 const show=document.createElement('section');show.id='bee-performance';show.hidden=true;show.setAttribute('aria-label','Live spelling bee');show.innerHTML='<div class="show-heading"><strong id="show-speaker"></strong><span id="show-count"></span></div><div class="show-controls"><button id="show-pause">Pause show</button><button id="show-next">Next word</button><button id="show-repeat">Hear line</button></div>';viewport.append(show);
 let showIndex=0,showPhase=0,showElapsed=0,showStarted=false,showPaused=false,showBeat=null,showWasActive=false,bellTimer;
 function ringBell(){bell.el.classList.remove('ding');void bell.el.offsetWidth;bell.el.classList.add('ding');clearTimeout(bellTimer);bellTimer=setTimeout(()=>bell.el.classList.remove('ding'),1000);window.RoundBell?.();}
 function clearActors(){judges.forEach(j=>j.el.classList.remove('is-speaking','is-cheering'));document.querySelectorAll('.bee-resident').forEach(b=>b.classList.remove('is-spelling'));}
 function performBeat(){
  showBeat=SpellingBee.beat(showIndex,showPhase);showElapsed=0;
  $('show-speaker').textContent=showBeat.speaker;$('show-count').textContent='WORD '+(showIndex+1)+' / '+SpellingBee.entries.length;
  comic.show(showBeat.speaker,showBeat.text,showPhase===1?document.querySelector('.alien-variant-0'):judges[showBeat.judge].el,{voice:showBeat.voice});clearActors();
  if(showPhase===0){judges[showBeat.judge].el.classList.add('is-speaking');judges.forEach(j=>j.el.querySelector('.judge-score').textContent='LISTENING');}
  if(showPhase===1)document.querySelector('.alien-variant-0').classList.add('is-spelling');
  if(showPhase===2){judges.forEach((j,i)=>{j.el.classList.add('is-cheering');j.el.querySelector('.judge-score').textContent=['10 / 10','BEE-RILLIANT','BLOOMING GOOD'][i];});ringBell();}

 }
 function updateShow(dt){
  route.hidden=!unlocked||z>=-800;backRoute.hidden=route.hidden||!R.previous;
  if(other){show.hidden=true;clinic?.update(dt,unlocked&&z< -800,!document.hidden&&!dialog.open);return;}
  const inRoom=unlocked&&z< -800;show.hidden=!inRoom;
  const active=inRoom&&!showPaused&&!document.hidden&&!dialog.open;
  show.classList.toggle('show-paused',!active);viewport.classList.toggle('performance-paused',!active);
  if(!active){if(showWasActive)window.RoundStopVoice?.();showWasActive=false;return;}
  showWasActive=true;
  if(!showStarted){showStarted=true;performBeat();return;}
  if(comic.holding())return;
  showElapsed+=dt*1000;
  if(showElapsed>=showBeat.duration&&!window.RoundVoiceBusy?.()){
   const n=SpellingBee.next(showIndex,showPhase);showIndex=n.index;showPhase=n.phase;performBeat();
  }
 }
 $('show-repeat').onclick=()=>comic.replay();
 $('show-pause').onclick=()=>{showPaused=!showPaused;$('show-pause').textContent=showPaused?'Resume show':'Pause show';if(showPaused)window.RoundStopVoice?.();};
 $('show-next').onclick=()=>{showIndex=(showIndex+1)%SpellingBee.entries.length;showPhase=0;showStarted=true;showPaused=false;$('show-pause').textContent='Pause show';performBeat();};
 function resetShow(){showIndex=0;showPhase=0;showElapsed=0;showStarted=false;showPaused=false;showWasActive=false;show.hidden=true;$('show-pause').textContent='Pause show';clearActors();clearTimeout(bellTimer);bell.el.classList.remove('ding');window.RoundStopVoice?.();}
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&showWasActive){window.RoundStopVoice?.();showWasActive=false;}});
 window.addEventListener('pagehide',()=>{clearTimeout(bellTimer);window.RoundStopVoice?.();});
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
  for(let zz=-850;zz> -2050;zz-=220){
   // Inlaid luminous conduits and ribbed wall plates frame the laboratory.
   [-1,1].forEach(side=>{const edge=side*519;
    polygon([[edge,80,zz],[edge,270,zz],[edge,270,zz-140],[edge,80,zz-140]],'#122e40','#5c9fa0');
    polygon([[edge,130,zz-15],[edge,138,zz-15],[edge,138,zz-125],[edge,130,zz-125]],'#56dcca');
    polygon([[side*450,1,zz],[side*440,1,zz],[side*440,1,zz-185],[side*450,1,zz-185]],'#6ee4cb');
   });
  }
  if(unlocked)auditorium?.draw();
  {polygon([[-520,0,-735],[-520,360,-735],[-145,360,-735],[-145,0,-735]],'#355165');polygon([[145,0,-735],[145,360,-735],[520,360,-735],[520,0,-735]],'#355165');}
  entities.forEach(o=>{const p=camera(o.x,o.base||0,o.z),q=project(p),visible=!o.disabled&&p.z>25&&(!o.room||unlocked)&&!(o===door&&unlocked&&!opening);o.el.hidden=!visible;if(!visible)return;o.el.style.transform=`translate(${q.x}px,${q.y}px) scale(${q.s}) translate(-50%,-100%)`;o.el.style.zIndex=String(Math.max(1,Math.round(10000-p.z)));});
  comic.position();
  $('inspect').disabled=unlocked||!near();$('inspect').textContent=near()?'Inspect door':'Move closer to inspect';
 }
 function resize(){width=viewport.clientWidth;height=viewport.clientHeight;const dpr=Math.min(devicePixelRatio||1,2);$('architecture').width=width*dpr;$('architecture').height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
 function inspect(){if(unlocked)return;if(!near()){caption('A little closer, apprentice! W A S D moves you; ← → turns you. Use the arrow buttons below, or choose Walk to door.');return;}keys.clear();inspectZoom=100;draw();dialog.showModal();$('question-title').focus();}
 function caption(text){$('walk-caption').textContent=text;}
 function close(){dialog.close();}
 $('leave-lock').onclick=close;dialog.addEventListener('close',()=>{inspectZoom=0;keys.clear();draw();viewport.focus({preventScroll:true});});
 $('approach').onclick=()=>{x=0;z=unlocked?-1050:-420;yaw=0;draw();caption(unlocked?(R.title+'. '+(R.previous?'Back: left. ':'')+(R.next?'Next: '+WarehouseRooms.rooms[R.next].title+' on the right.':'Game suite: right.')):'Door reached. Click the door or Inspect door.');viewport.focus({preventScroll:true});};
 $('inspect').onclick=inspect;
 $('hall-reset').onclick=()=>{window.RoundRestart();};
 function reset(){doorEpoch++;resetShow();clinic?.reset();route.hidden=true;backRoute.hidden=true;document.querySelectorAll("[data-door-lock]").forEach(img=>img.classList.remove("released"));unlocked=false;opening=false;x=0;z=160;yaw=0;keys.clear();comic.clear();if(dialog.open)dialog.close();$('hall-reset').hidden=true;$('approach').textContent='Walk to door';$('inspect').hidden=false;caption('Walk towards the '+R.title+' door. W A S D to move · ← → to look.');draw();}
 function open(){if(dialog.open)dialog.close();const epoch=++doorEpoch;const reveal=()=>{if(epoch!==doorEpoch)return;opening=false;x=0;z=-1050;yaw=0;draw();};const transform=door.el.style.transform;opening=!document.body.classList.contains('still');if(opening)door.el.animate([{transform,opacity:1},{transform:transform+' rotateY(-95deg)',opacity:0}],{duration:650,easing:'ease-in'}).finished.then(reveal).catch(reveal);unlocked=true;if(!opening)reveal();$('inspect').hidden=true;$('hall-reset').hidden=false;$('approach').textContent='Step into room';caption('Door open! Welcome to '+R.title+'. '+(R.next?'Next doorway on the right.':'You reached the last room of this wing!'));draw();viewport.focus({preventScroll:true});}
 window.WarehouseWalk={open,reset};
 function move(dt){const f=(keys.has('w')?1:0)-(keys.has('s')?1:0),r=(keys.has('d')?1:0)-(keys.has('a')?1:0);yaw+=((keys.has('arrowright')?1:0)-(keys.has('arrowleft')?1:0))*dt*1.3;const n=Math.hypot(f,r)||1,speed=210*dt;const nx=x+(Math.sin(yaw)*f+Math.cos(yaw)*r)/n*speed,nz=z+(-Math.cos(yaw)*f+Math.sin(yaw)*r)/n*speed;
  x=Math.max(-420,Math.min(420,nx));const crosses=(z+720)*(nz+720)<=0;if(!crosses||Math.abs(x)<115)z=Math.max(unlocked?-1500:-470,Math.min(180,nz));draw();}
 function frame(t){const elapsed=Math.min((t-last)/1000,1),dt=Math.min(elapsed,.04);last=t;comic.enable(unlocked&&z< -800&&!dialog.open);updateShow(elapsed);if(keys.size&&!dialog.open&&!document.hidden)move(dt);raf=requestAnimationFrame(frame);}
 document.addEventListener('keydown',e=>{if(dialog.open||e.target.closest('input,textarea,select')||!['w','a','s','d','arrowleft','arrowright'].includes(e.key.toLowerCase()))return;e.preventDefault();keys.add(e.key.toLowerCase());});
 document.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
 window.addEventListener('blur',()=>keys.clear());document.addEventListener('visibilitychange',()=>keys.clear());
 document.querySelectorAll('[data-move]').forEach(b=>{b.onpointerdown=e=>{b.setPointerCapture(e.pointerId);keys.add(b.dataset.move);move(.15);};b.onpointerup=b.onpointercancel=b.onlostpointercapture=()=>keys.delete(b.dataset.move);b.onclick=e=>{if(e.detail===0){keys.add(b.dataset.move);move(.2);keys.delete(b.dataset.move);}};});
 if(hospital)clinic=window.createBandAid(entity,viewport,say,comic);
 if(extra)clinic=window.createWarehouseShow(R,entity,viewport,say,comic);
 auditorium=window.createAuditorium(ctx,polygon,camera,project,draw,hospital,extra?R.id:null);
 caption('Walk towards the '+R.title+' door. W A S D to move · ← → to look.');
 new ResizeObserver(resize).observe(viewport);window.addEventListener('pagehide',()=>cancelAnimationFrame(raf));resize();window.RoundRestoreRoom?.();raf=requestAnimationFrame(frame);
})();

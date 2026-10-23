'use strict';
(()=>{
 const $=id=>document.getElementById(id),canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d'),atlas=new Image(),media=matchMedia('(prefers-reduced-motion: reduce)');
 const holds=[280,100,100,100,90,90,90,90,90,90,120,220,80,80,80,80,90,90,100,100,110,110,160,380],duration=holds.reduce((a,b)=>a+b,0);
 let ready=false,playing=false,elapsed=0,last=0,raf=0,still=media.matches,pose=0;
 function draw(index){pose=index;ctx.clearRect(0,0,900,400);if(!ready)return;
  // One scale for every drawing; the deflated body stays visibly smaller.
  const scale=1.28,w=256*scale;let x=450,y=354,angle=0;
  // Travel complements the drawn deformation rather than substituting for it.
  if(index>=12&&index<=18){const xs=[0,-55,60,-100,130,-75,0],ys=[0,-30,-55,-40,-25,-10,0],angles=[0,-.12,.15,-.18,.16,-.09,0],k=index-12;x+=xs[k];y+=ys[k];angle=angles[k];}
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.drawImage(atlas,index%6*256,Math.floor(index/6)*256,256,256,-w/2,-w,w,w);ctx.restore();$('frame').value=String(index+1);$('counter').value=`${index+1} / 24`;canvas.dataset.frame=String(index+1);
 }
 function stop(){playing=false;cancelAnimationFrame(raf);raf=0;$('pause').disabled=true;}
 function at(time){let end=0;for(let i=0;i<holds.length;i++){end+=holds[i];if(time<end)return i;}return 23;}
 function tick(now){const dt=Math.min(80,now-last);last=now;if(!document.hidden)elapsed+=dt*Number($('speed').value);draw(at(elapsed));if(elapsed>=duration){if($('loop').checked){elapsed=0;}else{stop();$('status').textContent='Puff is unlocked. Slightly less puffed up, still very pleased.';return;}}raf=requestAnimationFrame(tick);}
 function play(){if(!ready)return;stop();elapsed=0;if(still){draw(23);$('status').textContent='Motion is off: Puff is unlocked, deflated, and winking.';return;}playing=true;last=performance.now();$('pause').textContent='Pause';$('pause').disabled=false;$('status').textContent='Hold that breath…';draw(0);raf=requestAnimationFrame(tick);}
 function refreshMotion(){$('motion').textContent=still?'Motion OFF':'Motion ON';$('motion').setAttribute('aria-pressed',String(!still));if(still&&ready){stop();draw(23);$('status').textContent='Motion is off. Use the pose slider to inspect the drawings.';}}
 $('play').onclick=play;$('pause').onclick=()=>{if(playing){stop();$('pause').disabled=false;$('pause').textContent='Resume';}else{playing=true;last=performance.now();$('pause').textContent='Pause';raf=requestAnimationFrame(tick);}};
 $('frame').oninput=()=>{stop();draw(Number($('frame').value)-1);$('status').textContent='Pose inspection · Play the cartoon to restart.';};$('motion').onclick=()=>{still=!still;refreshMotion();};media.addEventListener('change',e=>{still=e.matches;refreshMotion();});
 atlas.onload=()=>{ready=true;$('play').disabled=false;$('play').textContent='Play the cartoon';draw(still?23:0);$('status').textContent=`Ready · ${(duration/1000).toFixed(1)} seconds · 24 illustrated poses`;refreshMotion();};atlas.onerror=()=>{$('status').textContent='Puff could not load. Reload this page to try again.';};atlas.src='assets/rounding/puff-v1/puff-atlas.webp';refreshMotion();window.addEventListener('pagehide',stop);
})();

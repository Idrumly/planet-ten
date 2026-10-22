'use strict';
(()=>{
 const creatures=[
  {name:'Professor Fuzzlet',kind:'fuzzy-lock',texture:'Fuzzy caterpillar'},
  {name:'Lady Slipperella',kind:'slug-lock',texture:'Pearlescent nudibranch'},
  {name:'Sir Wobbleworth',kind:'jelly-lock',texture:'Glowing jelly worm'},
  {name:'Nurse Fluffernoodle',kind:'velvet-lock',texture:'Velvet moth caterpillar'},
  {name:'Doctor Roly Poly',kind:'pebble-lock',texture:'Porcelain pill bug'},
  {name:'Madame Frill',kind:'ribbon-lock',texture:'Ribbon nudibranch'}
 ];
 const snake=document.getElementById('snake');
 const art=document.createElement('img');art.className='lock-illustration';art.alt='';art.width=1000;art.height=500;snake.prepend(art);
 const reward=document.createElement('div');reward.className='lock-reward';reward.setAttribute('aria-hidden','true');
 reward.innerHTML='<img class="reward-butterfly" src="assets/rounding/spark-butterfly-v1.webp" alt=""><div class="happy-flames"><i></i><i></i><i></i></div><div class="lock-sparks"></div><div class="lock-ash"><span>◡</span></div>';
 snake.append(reward);
 for(let i=0;i<22;i++){const spark=document.createElement('i');spark.style.setProperty('--angle',`${i*137.5}deg`);spark.style.setProperty('--distance',`${45+(i%5)*16}px`);spark.style.setProperty('--delay',`${(i%6)*.15}s`);reward.querySelector('.lock-sparks').append(spark);}
 const name=document.createElement('p');name.id='creature-name';name.className='creature-name';snake.before(name);
 const status=document.createElement('p');status.id='metamorphosis-status';status.setAttribute('role','status');status.hidden=true;snake.after(status);
 const skip=document.createElement('button');skip.type='button';skip.id='skip-metamorphosis';skip.textContent='Skip celebration';skip.hidden=true;status.after(skip);
 let current=0,run=null,raf=0,last=0;
 const phases=[
  [0,'crawl','Unlocked! Off for a little crawl…'],
  [1400,'butterfly','A butterfly! A perfectly normal career change.'],
  [3000,'ignite','Oh! Happily combustible.'],
  [4100,'sparkle','Fizzzzz! A sparkling performance.'],
  [5700,'ash','One delighted little pile of ashes. Lock released!']
 ];
 function displayPhase(phase,text){snake.dataset.phase=phase;status.textContent=text;}
 function finish(){if(!run)return;const done=run.resolve;run=null;cancelAnimationFrame(raf);skip.hidden=true;displayPhase('ash',phases[4][2]);document.dispatchEvent(new CustomEvent('living-lock-released',{detail:{index:current%3}}));done(true);}
 function tick(now){if(!run)return;const dt=Math.min(now-last,1000);last=now;
  const modal=document.getElementById('lock-inspection');const paused=document.hidden||(modal&&!modal.open);snake.classList.toggle('reward-paused',Boolean(paused));
  if(document.body.classList.contains('still')){finish();return;}
  if(!paused){run.elapsed+=dt;const p=phases.filter(p=>p[0]<=run.elapsed).at(-1);if(snake.dataset.phase!==p[1]){displayPhase(p[1],p[2]);if(p[1]==='ignite'||p[1]==='sparkle')window.RoundSparkle?.();}if(run.elapsed>=6500){finish();return;}}
  raf=requestAnimationFrame(tick);
 }
 function cancel(){cancelAnimationFrame(raf);if(run){const resolve=run.resolve;run=null;resolve(false);}skip.hidden=true;}
 function show(index){cancel();current=index;art.src=`assets/rounding/${creatures[index].kind}-v1.webp`;snake.dataset.creature=String(index);snake.dataset.phase='ready';snake.classList.remove('reward-paused');name.textContent=`${creatures[index].name} · ${creatures[index].texture}`;status.hidden=true;}
 function celebrate(still){cancel();status.hidden=false;return new Promise(resolve=>{run={resolve,elapsed:0};if(still){finish();status.textContent='Unlocked: a little crawl, a butterfly, a happy sparkler, and a pile of ashes.';return;}skip.hidden=false;skip.disabled=false;displayPhase(phases[0][1],phases[0][2]);last=performance.now();raf=requestAnimationFrame(tick);});}
 skip.onclick=finish;window.addEventListener('pagehide',cancel);
 window.LivingLocks={creatures,show,celebrate,cancel};
})();

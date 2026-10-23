'use strict';
(()=>{
 let storage=null;try{storage=sessionStorage;}catch{}
 const deck=LockGagModel.createDeck({storage}),runs=new Set(),byCard=new WeakMap();let raf=0,last=0;
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const frame=(transform,opacity=1)=>({transform,opacity});
 function build(run){
  const {stage,card,gag}=run,skin=card.querySelector('.worm-skin'),style=getComputedStyle(skin);
  function piece(kind,x,y,w,h,from=0,until=gag.duration,frames=null){
   const el=document.createElement('span');el.className='gag-actor '+(kind==='worm'?'gag-worm':'gag-prop');
   Object.assign(el.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%'});
   if(kind==='worm')Object.assign(el.style,{backgroundImage:style.backgroundImage,backgroundSize:style.backgroundSize,backgroundPosition:style.backgroundPosition});else el.innerHTML=LockGagArt(kind);
   el.hidden=true;stage.append(el);
   const animation=frames?el.animate(frames,{duration:Math.max(1,until-from),fill:'both',easing:'ease-in-out'}):null;animation?.pause();
   run.tracks.push({el,from,until,animation});return el;
  }
  const worm=(from,until,frames)=>piece('worm',3,3,94,90,from,until,frames);
  const pop=[frame('scale(.1)',0),frame('scale(1.15)'),frame('scale(1)')];
  const fade=[{opacity:0},{opacity:1}];
  const sound=(at,kind)=>run.sounds.push({at,kind,played:false});
  sound(180,'tickle');
  switch(gag.id){
   case 'fuse':
    worm(0,1850,[{clipPath:'inset(0 0 0 0)'},{clipPath:'inset(0 0 0 100%)'}]);
    piece('flame',0,0,12,90,80,1850,[frame('translateX(0)'),frame('translateX(730%)')]);
    piece('spark',0,20,9,60,80,1850,[frame('translateX(0) rotate(0deg)'),frame('translateX(1000%) rotate(270deg)')]);
    piece('ash',34,3,32,90,1750,3000,pop);sound(1200,'fizz');break;
   case 'balloon':
    worm(0,1100,[frame('scale(1)'),frame('scale(.65,1.1)'),frame('scale(.4,1.6)')]);
    piece('balloon',35,0,30,100,850,2900,[frame('scale(.3)',0),frame('scale(1.1)'),frame('translate(-70%,15%) rotate(-65deg)'),frame('translate(50%,-20%) rotate(70deg) scale(.8)'),frame('translate(-100%,10%) rotate(-90deg) scale(.6)'),frame('translate(260%,-80%) rotate(160deg) scale(.1)',0)]);sound(1000,'deflate');break;
   case 'taxi':
    worm(0,2000,[frame('scale(1)'),frame('rotate(-65deg) scale(.35,.8)'),frame('rotate(-65deg) scale(.35,.8)'),frame('translate(20%,15%) scale(.12)',0)]);
    piece('arms',39,0,20,80,550,1500,[frame('rotate(-15deg)'),frame('rotate(15deg)'),frame('rotate(-15deg)'),frame('rotate(15deg)')]);
    piece('taxi',53,15,42,85,800,3200,[frame('translateX(150%)'),frame('translateX(0)'),frame('translateX(0)'),frame('translateX(-260%)')]);sound(1300,'horn');break;
   case 'licorice':
    worm(0,650,[frame('scale(1)'),frame('scaleY(.5)',0)]);
    piece('licorice',10,0,70,90,400,2350,[{clipPath:'inset(0 0 0 0)',opacity:1},{clipPath:'inset(0 0 0 0)',opacity:1,offset:.4},{clipPath:'inset(0 30% 0 0)',offset:.6},{clipPath:'inset(0 60% 0 0)',offset:.8},{clipPath:'inset(0 100% 0 0)',opacity:0}]);
    piece('cloudbun',57,0,34,100,650,3100,[frame('translateX(150%)'),frame('translateX(0)'),frame('translateX(-15%) scaleY(.9)'),frame('translateX(-30%) scaleY(1)'),frame('translateX(-50%) scaleY(.9)'),frame('translateX(-60%) scaleY(1)')]);sound(1600,'munch');break;
   case 'puddle':
    worm(0,2500,[frame('scale(1)'),frame('translateY(15%) scale(1.03,.75)'),frame('translateY(30%) scale(1.1,.4)'),frame('translateY(45%) scale(1.15,.04)',0)]);
    piece('puddle',16,0,68,100,850,3400,[frame('scale(.1)',0),frame('scale(.6,.5)'),frame('scale(1,1)')]);sound(2300,'plop');break;
   case 'bubbles':
    worm(0,1150,[frame('scale(1)'),frame('scale(.9,1.1)',0)]);
    for(let i=0;i<12;i++)piece('bubble',5+i*7,20+(i%3)*12,12,65,350+i*70,2300+i*45,[frame('scale(.1)',0),frame('scale(1)'),frame(`translate(${i%2?-70:80}%,-180%) scale(.65)`,0)]);sound(1000,'pop');break;
   case 'hoop':
    worm(0,1200,[frame('scale(1)'),frame('scale(.55,.9) rotate(25deg)'),frame('scale(.18,.8) rotate(90deg)',0)]);
    piece('hoop',33,0,34,100,750,3100,[frame('scale(.2)',0),frame('scale(1)'),frame('translateX(220%) rotate(540deg)')]);sound(1200,'roll');break;
   case 'slipper':
    worm(0,2200,[frame('scale(1)'),frame('scale(.7)'),frame('scale(.7)'),frame('scale(.3) rotate(-80deg)')]);
    piece('prince',64,0,25,95,0,4000,[frame('translateX(180%)'),frame('translateX(0)'),frame('translateX(0)'),frame('translateX(-20%)'),frame('translateX(170%) rotate(15deg)')]);
    piece('shoe',42,25,16,65,500,1350,[frame('translateX(120%) scale(.5)'),frame('scale(.5)'),frame('translateX(120%) scale(.5)',0)]);
    piece('shoe',43,25,20,70,1250,2200,pop);
    piece('gown',35,0,30,100,2000,4000,[frame('scale(.2)',0),frame('scale(1)'),frame('translate(15%,0) rotate(-15deg)'),frame('translate(50%,0) rotate(15deg)'),frame('translate(190%,0) rotate(350deg)',0)]);sound(2100,'waltz');break;
   case 'wizard':
    worm(0,1750,[frame('scale(1)'),frame('scale(1)'),frame('rotate(180deg) scale(.1)',0)]);
    piece('wizard',68,0,27,100,0,3300,[frame('translateX(160%)'),frame('translateX(0)'),frame('rotate(-8deg)'),frame('rotate(8deg)'),frame('translateX(160%)')]);
    piece('spark',39,0,24,100,1050,1800,[frame('scale(.1)',0),frame('scale(1.4) rotate(90deg)'),frame('scale(.1)',0)]);
    piece('frog',30,0,30,100,1600,3300,[frame('scale(.1)',0),frame('scale(1)'),frame('translate(-80%,-30%)'),frame('translate(-160%,0)'),frame('translate(-250%,-40%)',0)]);sound(1150,'magic');break;
   case 'starblade':
    worm(0,1050,[frame('scale(1)'),frame('rotate(-90deg) scale(.12,.7)',0)]);
    piece('knight',48,0,28,100,500,3300,[frame('translateX(180%)'),frame('translateX(0)'),frame('rotate(-8deg)'),frame('rotate(8deg)'),frame('translateX(-220%)')]);
    piece('blade',37,0,16,100,850,3300,[frame('scaleY(.1)',0),frame('scaleY(1)'),frame('rotate(-55deg)'),frame('rotate(55deg)'),frame('translateX(-300%) rotate(-180deg)',0)]);sound(1200,'swish');break;
   case 'disco':
    piece('disco',39,-10,22,70,0,3000,[frame('translateY(-130%)'),frame('translateY(0) rotate(0deg)'),frame('rotate(180deg)'),frame('translateY(-130%) rotate(270deg)')]);
    worm(0,3000,[frame('scale(1)'),frame('translateY(15%) rotate(-7deg) scale(.8)'),frame('translateY(-7%) rotate(7deg) scale(.8)'),frame('translateY(15%) rotate(-7deg) scale(.8)'),frame('translateX(130%) rotate(20deg)',0)]);sound(700,'disco');break;
   case 'popcorn':
    worm(0,1300,[frame('scale(1)'),frame('scale(.7,1.2)'),frame('scale(.5,.8)'),frame('scale(.8,1.2)'),frame('scale(.1)',0)]);
    piece('popcorn',34,0,32,100,1000,2800,pop);
    for(let i=0;i<8;i++)piece('kernel',43,40,10,45,1100+i*55,2000+i*70,[frame('scale(.1)',0),frame(`translate(${(i-4)*110}%,-150%)`),frame(`translate(${(i-4)*110}%,150%)`,0)]);sound(1200,'pop');break;
   case 'rocket':
    worm(0,1100,[frame('scale(1)'),frame('rotate(-90deg) scale(.16,.9)',0)]);
    piece('rocket',34,0,32,100,750,3000,[frame('scale(.2)',0),frame('scale(1)'),frame('translateY(8%)'),frame('translateY(-170%)')]);
    piece('flame',42,65,16,45,1500,2700,[frame('scaleY(.2)',0),frame('scaleY(1)'),frame('translateY(-300%)',0)]);sound(1600,'launch');break;
   case 'zipper':
    piece('worm',3,3,94,90,0,2300,[{clipPath:'inset(0 50% 0 0)',transform:'translateX(0)'},{clipPath:'inset(0 50% 0 0)',transform:'translateX(-100%)'}]);
    piece('worm',3,3,94,90,0,2300,[{clipPath:'inset(0 0 0 50%)',transform:'translateX(0)'},{clipPath:'inset(0 0 0 50%)',transform:'translateX(100%)'}]);
    piece('zipper',42,-10,16,110,0,3000,[frame('translateY(-70%)'),frame('translateY(0)'),frame('translateY(90%)',0)]);sound(750,'zip');break;
   case 'portal':
    piece('portal',69,-5,24,105,0,2700,[frame('scaleY(.1)',0),frame('scaleY(1)'),frame('rotate(12deg)'),frame('scaleY(.1)',0)]);
    worm(0,1800,[frame('scale(1)'),frame('translateX(30%) scale(.3,.8)'),frame('translateX(32%) scale(.02)',0)]);
    for(let i=0;i<3;i++)piece('sock',69,5,18,85,1650+i*130,3000+i*90,[frame('scale(.1)',0),frame(`translate(${-160-i*90}%,-30%) rotate(${-80-i*45}deg)`),frame(`translate(${-220-i*100}%,120%) rotate(-180deg)`,0)]);sound(1600,'boing');break;
   case 'origami':
    worm(0,1300,[frame('scale(1)'),frame('scaleX(.5) rotate(8deg)'),frame('scale(.3,.6) rotate(-8deg)'),frame('scale(.2)',0)]);
    piece('plane',33,0,34,100,1050,2900,[frame('scale(.1)',0),frame('scale(1)'),frame('translate(-60%,20%) rotate(-12deg)'),frame('translate(250%,-110%) rotate(-25deg)')]);sound(1800,'swish');break;
   case 'magician':
    worm(0,1800,[frame('scale(1)'),frame('translateY(-15%) scale(.5)'),frame('translateY(40%) scale(.05)',0)]);
    piece('hat',33,20,34,80,300,3300,[frame('scale(.1)',0),frame('scale(1)'),frame('rotate(-12deg)'),frame('rotate(12deg)'),frame('scale(.3)',0)]);
    piece('wizard',65,0,25,100,200,2400,[frame('translateX(150%)'),frame('translateX(0)'),frame('translate(-80%,20%) scale(.1)',0)]);
    piece('worm',30,0,40,70,2000,3300,[frame('translateY(80%) scale(.1)',0),frame('rotate(-20deg) scale(1)'),frame('translateX(-200%) rotate(-15deg)',0)]);sound(2100,'magic');break;
   case 'sneeze':
    piece('feather',7,0,20,90,0,1300,[frame('rotate(-30deg)'),frame('rotate(20deg)'),frame('rotate(-30deg)'),frame('rotate(20deg)',0)]);
    worm(0,2000,[frame('scale(1)'),frame('scale(.95,1.05)'),frame('scale(1.02,.95)'),frame('scale(.95,1.05)'),frame('translateX(120%) scale(.6)',0)]);
    for(let i=0;i<7;i++)piece('moustache',20,25,13,60,1300+i*40,2300+i*60,[frame('scale(.1)',0),frame(`translate(${(i-2)*90}%,-30%) rotate(${i*40}deg)`),frame(`translate(${(i-2)*150}%,150%) rotate(${i*80}deg)`,0)]);sound(1400,'sneeze');break;
   case 'skate':
    piece('skate',34,40,32,60,0,2900,[frame('translateX(-200%)'),frame('translateX(0)'),frame('translateY(-20%) rotate(-15deg)'),frame('translate(220%,-20%) rotate(15deg)')]);
    worm(0,2900,[frame('scale(1)'),frame('translateY(-10%) scale(.45,.8)'),frame('translateY(-20%) rotate(-15deg) scale(.45,.8)'),frame('translate(100%,-20%) rotate(15deg) scale(.45,.8)',0)]);sound(1600,'roll');break;
   case 'pancake':
    worm(0,1300,[frame('scale(1)'),frame('translateY(20%) scale(.3,.2)',0)]);
    piece('chef',65,0,25,100,0,3200,[frame('translateX(150%)'),frame('translateX(0)'),frame('rotate(-10deg)'),frame('rotate(10deg)'),frame('translateX(150%)')]);
    piece('pan',34,25,32,75,500,3200,[frame('scale(.1)',0),frame('scale(1)'),frame('rotate(-20deg)'),frame('rotate(20deg)'),frame('rotate(0deg)')]);
    piece('pancake',33,10,28,65,1100,3200,[frame('scale(.1)',0),frame('scale(1)'),frame('translateY(-80%) rotateX(180deg)'),frame('translateY(15%) rotateX(360deg)'),frame('translateY(-40%) rotateX(540deg)'),frame('translateY(15%) rotateX(720deg)')]);sound(1500,'boing');break;
  }
 }
 function render(run){
  for(const t of run.tracks){t.el.hidden=run.elapsed<t.from||run.elapsed>=t.until;if(t.animation)t.animation.currentTime=Math.max(0,Math.min(t.until-t.from,run.elapsed-t.from));}
  for(const cue of run.sounds)if(!cue.played&&run.elapsed>=cue.at){cue.played=true;window.RoundGagSound?.(cue.kind);}
 }
 function finish(run,cancelled=false){
  if(!runs.has(run))return;runs.delete(run);run.tracks.forEach(t=>t.animation?.cancel());run.card.classList.remove('gag-running');
  if(cancelled){run.stage.remove();run.card.classList.remove('gag-played');run.card.dataset.gagState='cancelled';}else{
   run.stage.replaceChildren();const end=document.createElement('span');end.className='gag-ending';end.innerHTML=LockGagArt(run.gag.ending);run.stage.append(end);run.card.dataset.gagState='complete';
  }
  run.resolve(!cancelled);if(!runs.size){cancelAnimationFrame(raf);raf=0;}
 }
 function tick(now){
  const dt=Math.min(100,Math.max(0,now-last));last=now;
  for(const run of [...runs]){
   if(!run.card.isConnected){finish(run,true);continue;}
   if(document.body.classList.contains('still')||motion.matches){finish(run);continue;}
   const dialog=run.card.closest('dialog');
   if(document.hidden||(dialog&&!dialog.open)||!run.card.checkVisibility())continue;
   run.elapsed+=dt;render(run);if(run.elapsed>=run.gag.duration)finish(run);
  }
  if(runs.size)raf=requestAnimationFrame(tick);
 }
 function play(card,{id=null,still=false}={}){
  byCard.get(card)?.cancel();card.querySelector('.gag-stage')?.remove();
  const gag=id?LockGagModel.gags.find(g=>g.id===id):deck.next();if(!gag)throw Error('Unknown lock gag');
  const stage=document.createElement('span');stage.className='gag-stage';stage.setAttribute('aria-hidden','true');card.querySelector('.lock-picture').append(stage);
  card.classList.add('gag-running','gag-played');card.dataset.gag=gag.id;card.dataset.gagState='playing';
  const run={card,stage,gag,tracks:[],sounds:[],elapsed:0,resolve:null};const finished=new Promise(resolve=>run.resolve=resolve);
  const controller={gag,finished,finish:()=>finish(run),cancel:()=>finish(run,true)};byCard.set(card,controller);runs.add(run);
  try{build(run);render(run);}catch(error){finish(run);console.error('Lock celebration could not animate',error);}
  if(still||motion.matches||document.body.classList.contains('still'))finish(run);
  else if(!raf){last=performance.now();raf=requestAnimationFrame(tick);}
  return controller;
 }
 const finishAll=()=>[...runs].forEach(run=>finish(run));
 window.addEventListener('pagehide',()=>[...runs].forEach(run=>finish(run,true)));
 window.LockGags={play,finishAll,cancelAll:()=>[...runs].forEach(run=>finish(run,true))};
})();

'use strict';
const $=id=>document.getElementById(id),M=GlowMath;
let contract=PowerContracts.contracts[0];
let state={...contract.start},tool='split',phase=0,busy=false,complete=false,history=[],sound=false,audio;
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),activeAnimations=new Set();let still=reduced.matches;
function setMotion(){document.documentElement.classList.toggle('still',still);$('motion').textContent=still?'Motion off':'Motion on';$('motion').setAttribute('aria-pressed',String(still));if(still)for(const a of activeAnimations)a.finish();if(typeof resumeMachineLoop==='function'&&!still&&complete)resumeMachineLoop();}
setMotion();$('motion').onclick=()=>{still=!still;setMotion();};reduced.addEventListener('change',e=>{still=e.matches;setMotion();});
function beep(kind){if(!sound)return;try{audio ||= new(window.AudioContext||window.webkitAudioContext)();audio.resume().catch(()=>{});const notes=kind==='error'?[85,65]:kind==='tap'?[170,700]:kind==='step'?[95]:kind==='win'?[262,330,392,523]:kind==='join'?[180,350,540]:[530,320,180];notes.forEach((f,i)=>{const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime+i*.1;o.type=kind==='error'?'sawtooth':kind==='tap'?'triangle':'sine';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*.65,t+.16);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.045,t+.015);g.gain.exponentialRampToValueAtTime(.001,t+.2);o.connect(g).connect(audio.destination);o.start(t);o.stop(t+.21);});}catch{sound=false;$('sound').textContent='Sound unavailable';$('sound').setAttribute('aria-pressed','false');}}
$('sound').onclick=()=>{sound=!sound;$('sound').textContent=sound?'Sound on':'Sound off';$('sound').setAttribute('aria-pressed',String(sound));if(sound)beep('join');};
function cell(){const c=document.createElement('span');c.className='cell';c.append(GlowCelebrations.core());return c;}
function targetCount(){return contract.keys[phase].amount;}
function render(){
 const cargo=$('cargo');cargo.replaceChildren();$('world').classList.toggle('large-contract',contract.value>28);
 const tenRows=Math.ceil(state.tens/2),oneRows=Math.ceil(state.ones/10),rows=Math.max(1,tenRows+oneRows);
 $('world').classList.toggle('hundreds-round',!!contract.hundreds);
 if(isFarm())renderGrowBlocks();else for(const unit of ['hundreds','tens','ones'])for(let i=0;i<(state[unit]||0);i++){
  const ten=unit==='tens',flat=unit==='hundreds',b=document.createElement('button');b.className='block '+(flat?'flat':ten?'rod':'single');b.dataset.unit=unit;
  const x=ten?(state.tens===1?50:26+(i%2)*48):5+(i%10)*10,row=ten?Math.floor(i/2):tenRows+Math.floor(i/10),y=rows===1?40:row*90/(rows-1);
  b.style.setProperty('--x',x+'%');b.style.setProperty('--y',y+'%');b.style.setProperty('--angle','0deg');b.style.setProperty('--delay',-i*.33+'s');
  b.setAttribute('aria-label',(flat?'Hundred':ten?'Ten':'One')+' block '+(i+1));
  const cells=document.createElement('span');cells.className='cells';cells.setAttribute('aria-hidden','true');for(let k=0;k<(flat?100:ten?10:1);k++)cells.append(cell());b.append(cells);
  const label=document.createElement('span');label.className='unit-label';label.textContent=flat?'1 HUNDRED':ten?'1 TEN':'1';label.setAttribute('aria-hidden','true');b.append(label);b.disabled=busy||complete;
  b.onclick=e=>{if(tool==='join'&&(unit==='ones'||unit==='tens'&&contract.hundreds)){if(e.detail===0&&!busy&&!complete)keyboardPickup(b);return;}exchange(unit,b);};cargo.append(b);
 }
 $('count').textContent=M.count(state);$('representation').textContent=M.describe(state);$('rule-progress').textContent=complete&&rule().kind==='fewest'?M.count(state)+' blocks · Fewest found!':PowerContracts.progress(state,rule());
 document.querySelector('.aim-hint').textContent=isFarm()?'SPLIT: CLICK · JOIN: SWEEP 10 MATCHING BLOCKS · TAB + ENTER · ESC CANCELS':contract.hundreds?'SPLIT: CLICK · JOIN: SWEEP 10 MATCHING ONES OR TENS · TAB + ENTER · ESC CANCELS':'SPLIT: CLICK · JOIN: DRAG ACROSS 10 ONES · KEYBOARD: TAB + ENTER · ESC CANCELS';
 $('undo').disabled=busy||complete||!history.length;for(const id of ['supply','split-tool','join-tool','restart'])$(id).disabled=busy||complete&&id!=='restart';
}
function select(next){if(busy||complete)return;if(pickup){releasePickup(true);return;}tool=next;$('world').dataset.tool=next;$('split-tool').setAttribute('aria-pressed',String(next==='split'));$('join-tool').setAttribute('aria-pressed',String(next==='join'));$('held-tool').className=`held-tool ${next}`;$('held-label').textContent=next==='split'?'DISCOMBOBULATOR':'TRANSMORGIFIER';$('feedback').textContent=isFarm()?(next==='split'?'Click a Grow Block to release ten of the next smaller unit.':'Sweep up 10 matching Grow Blocks to make the next unit.'):next==='split'?(contract.hundreds?'Click a hundred flat to make 10 tens, or a ten to make 10 ones.':'Aim at a ten. Click to split it.'):(contract.hundreds?'Sweep up 10 ones → 1 ten, or 10 tens → 1 hundred.':'Click and drag across 10 ones, then release to make a ten.');}
$('split-tool').onclick=()=>select('split');$('join-tool').onclick=()=>select('join');document.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey||e.repeat)return;if(e.key==='1')select('split');if(e.key==='2')select('join');});
let pointer={x:innerWidth/2,y:innerHeight/2},aimFrame=0;
function aim(e){if(typeof pickup!=='undefined'&&pickup)return;if(e.pointerType==='touch')return;pointer={x:e.clientX,y:e.clientY};$('world').classList.add('aiming');const target=e.target.closest('.block,#supply');$('reticle').classList.toggle('target',!!target);if(!aimFrame)aimFrame=requestAnimationFrame(()=>{aimFrame=0;const r=$('world').getBoundingClientRect(),x=pointer.x-r.left,y=pointer.y-r.top,nx=x/r.width-.5;const ui=e.target.closest('header,.bottom-hud,.completion,.power-station');if(!busy&&!complete&&!still&&!ui){if(!target)$('world').style.setProperty('--pan',`${-nx*95}px`);const gun=$('held-tool'),gx=r.width-gun.offsetWidth*.25,gy=r.height-15,angle=Math.atan2(y-gy,x-gx)*180/Math.PI+130;$('world').style.setProperty('--look',`${Math.max(-38,Math.min(38,angle))}deg`);}$('reticle').style.left=`${x}px`;$('reticle').style.top=`${y}px`;});}
$('world').addEventListener('pointermove',aim);$('world').addEventListener('pointerleave',()=>$('world').classList.remove('aiming'));
async function animate(el,frames,duration,options={}){const final={...frames.at(-1)};delete final.offset;delete final.easing;if(still){Object.assign(el.style,final);return;}const a=el.animate(frames,{duration,easing:'ease-in-out',fill:'forwards',...options});activeAnimations.add(a);if(typeof machinePaused!=='undefined'&&machinePaused)a.pause();let finished=false;try{await a.finished;finished=true;}catch{}finally{if(finished)Object.assign(el.style,final);activeAnimations.delete(a);a.cancel();}}
function shoot(button){const world=$('world').getBoundingClientRect(),target=button.getBoundingClientRect(),gun=$('held-tool').getBoundingClientRect(),line=$('beam-line');line.setAttribute('x1',gun.left-world.left+gun.width*.25);line.setAttribute('y1',gun.top-world.top+gun.height*.4);line.setAttribute('x2',target.left-world.left+target.width/2);line.setAttribute('y2',target.top-world.top+target.height/2);$('beam').className.baseVal=`beam ${tool}`;void $('beam').getBoundingClientRect();$('beam').classList.add('firing');$('held-tool').classList.add('firing');beep(tool);}
async function fly(from,to){if(still)return;const ghost=document.createElement('div');ghost.className='ghost';ghost.style.left=`${from.x}px`;ghost.style.top=`${from.y}px`;ghost.append(cell());document.body.append(ghost);try{await animate(ghost,[{transform:'translate(0,0)'},{transform:`translate(${(to.x-from.x)*.45}px,${(to.y-from.y)*.45-35}px)`,offset:.45},{transform:`translate(${to.x-from.x}px,${to.y-from.y}px)`}],850);}finally{ghost.remove();}}
async function exchange(unit,button,pickedRects=null){
 if(isFarm())return farmExchange(unit,button,pickedRects);
 if(busy||complete)return;unit=unit===true?'tens':unit===false?'ones':unit;
 if(tool==='split'&&unit==='ones'){rejectAction('Fractional Power Upgrade Unavailable to Mere Apprentices.');return;}
 if(tool==='join'&&(unit==='hundreds'||unit==='tens'&&!contract.hundreds)){rejectAction('Collect ten matching smaller blocks first.');return;}
 if(tool==='join'&&state[unit]<10){rejectAction('You need 10 '+unit+'.');return;}
 busy=true;const prev={...state};history.push(prev);const next=tool==='split'?(unit==='hundreds'?'tens':'ones'):(unit==='tens'?'hundreds':'tens');
 const sourceSelector='[data-unit="'+unit+'"] .cell';
 const from=tool==='split'?[...button.querySelectorAll('.cell')].map(e=>e.getBoundingClientRect()):(pickedRects||[...$('cargo').querySelectorAll(sourceSelector)].slice(0,unit==='tens'?100:10).map(e=>e.getBoundingClientRect()));
 shoot(button);state=M.exchange(state,tool,unit);if(M.value(state)!==contract.value)throw Error('Value changed');render();
 const destinations=[...$('cargo').querySelectorAll('[data-unit="'+next+'"]')];const changed=tool==='split'?destinations.slice(prev[next]||0):destinations.slice(-1);const cells=changed.flatMap(b=>[...b.querySelectorAll('.cell')]),to=cells.map(e=>e.getBoundingClientRect());
 cells.forEach(e=>e.style.visibility='hidden');$('representation').textContent=M.describe(prev)+' → '+M.describe(state);
 await Promise.all(from.map((r,i)=>fly(r,to[i])));cells.forEach(e=>e.style.visibility='');busy=false;render();
 if(tool==='join'){const joined=[...$('cargo').querySelectorAll('[data-unit="'+next+'"]')].at(-1);beep('join');sizzle();GlowCelebrations.play(joined,next,undefined,{still,active:activeAnimations});}
 $('held-tool').classList.remove('firing');$('feedback').textContent=M.count(state)+' blocks. The value is still '+contract.value+'.';
}
$('undo').onclick=()=>{if(busy||complete||!history.length)return;if(pickup){releasePickup(true);return;}state=history.pop();render();$('feedback').textContent='Exchange undone. Value '+contract.value+'.';};


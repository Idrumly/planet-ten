'use strict';
const q=s=>document.querySelector(s),STOP=Symbol('stopped');
let rewardEpoch=0,rewardRunning=false,repeating=false,machinePaused=false;
function guard(id){if(id!==rewardEpoch)throw STOP;}
async function step(id,el,frames,duration,options){guard(id);await animate(el,frames,duration,options);guard(id);}
function stopReward(){rewardEpoch++;repeating=false;rewardRunning=false;machinePaused=false;for(const a of activeAnimations)a.cancel();$('pause-machine').hidden=true;$('pause-machine').textContent='Pause machine';$('pause-machine').setAttribute('aria-pressed','false');}
function clearPerformance(){for(const selector of ['#performer','#printer','#legs','.left-leg','.right-leg','.hammer','.vacuum-arm','.impact','#floor-hammer'])q(selector).removeAttribute('style');$('machine').classList.remove('performing');}
function showBrief(){if(window.FirstPuzzle?.active){q(".mission").hidden=false;return;}if(busy)return;if(pickup){releasePickup(true);return;}$('brief-title').innerHTML='Make '+contract.value+'.<br>'+PowerContracts.instruction(rule());$('brief-copy').textContent=(contract.hundreds&&phase===0?'HUNDRED FLAT UNLOCKED: 1 hundred = 10 tens = 100 ones. Click a flat to split it. Sweep up 10 rods to rebuild it. ':'')+'Keep the value '+contract.value+'. Split or join Glowblocks to match this power key.';if(isFarm()){$('brief-copy').textContent=(phase===0?'Welcome to Tidebloom Farm. Grow Blocks hold water: 10 ones = 1 ten; 10 tens = 1 hundred; 10 hundreds = 1 thousand; 10 thousands = 1 ten thousand. ':'')+'Keep the value '+contract.value+'. '+(rule().kind==='different'?'Find four different place-value representations. Moving blocks without regrouping does not count.':'Meet each watering key to grow your seed.');const seed=FarmContracts.seeds[contract.seedIndex];$('seed-source').hidden=false;$('seed-source').href=seed[5];$('seed-source').textContent='Earth inspiration: '+seed[4];}else $('seed-source').hidden=true;q('.mission').hidden=true;if(!$('briefing').open)$('briefing').showModal();window.PlanetNPC?.brief();}
$('briefing').addEventListener('close',()=>{q('.mission').hidden=false;q('.mission').classList.remove('docked');void q('.mission').offsetWidth;q('.mission').classList.add('docked');$('split-tool').focus({preventScroll:true});});
$('open-brief').onclick=showBrief;
async function growLegs(id){$('machine').classList.add('performing');await Promise.all([step(id,$('printer'),[{transform:'translateY(166px)'},{transform:'translateY(0px)'}],1550),step(id,$('legs'),[{opacity:'0',transform:'translateY(160px) scaleY(.12)'},{opacity:'1',transform:'translateY(0px) scaleY(1)'}],1550)]);$('machine-desc').textContent='The fabricator has grown two hairy human legs.';}
async function walk(id,from,to){const left=q('.left-leg'),right=q('.right-leg');async function stride(){for(let i=0;i<3;i++){guard(id);beep('step');await Promise.all([step(id,left,[{transform:'rotate(-10deg)'},{transform:'rotate(12deg)'},{transform:'rotate(-10deg)'}],540),step(id,right,[{transform:'rotate(12deg)'},{transform:'rotate(-10deg)'},{transform:'rotate(12deg)'}],540)]);}left.style.transform='rotate(0deg)';right.style.transform='rotate(0deg)';}await Promise.all([step(id,$('performer'),[{transform:`translateX(${from}px)`},{transform:`translateX(${to}px)`}],1620,{easing:'linear'}),stride()]);}
// The hammer only leaves the ground for a pickup and quick knee tap.
async function pickUpHammer(id){
 q('.vacuum-arm').style.opacity='1';
 await step(id,q('.vacuum-arm'),[{transform:'scaleY(.08)'},{transform:'scaleY(1)'}],850);
 guard(id);$('floor-hammer').style.opacity='0';q('.hammer').style.opacity='1';
 await step(id,q('.hammer'),[{transform:'rotate(65deg)'},{transform:'rotate(-15deg)'}],550);
}
async function dropHammer(id,x){
 await step(id,q('.hammer'),[{transform:'rotate(17deg)'},{transform:'translate(0px,20px) rotate(65deg)'}],250);
 guard(id);q('.hammer').style.opacity='0';
 $('floor-hammer').style.transform='translateX('+(x-390)+'px)';$('floor-hammer').style.opacity='1';
 await Promise.all([step(id,$('floor-hammer'),[{transform:'translate('+(x-390)+'px,-10px)'},{transform:'translate('+(x-390)+'px,0px)'}],160),step(id,q('.vacuum-arm'),[{transform:'scaleY(1)'},{transform:'scaleY(.08)'}],650)]);
 guard(id);q('.vacuum-arm').style.opacity='0';
}
async function hammerAndHop(id,x){const hammer=q('.hammer');await step(id,hammer,[{transform:'rotate(-15deg)'},{transform:'rotate(-35deg)'},{transform:'rotate(17deg)'}],650);beep('tap');q('.impact').style.opacity='1';await Promise.all([step(id,q('.right-leg'),[{transform:'rotate(0deg)'},{transform:'rotate(-35deg)'}],220),dropHammer(id,x)]);q('.impact').style.opacity='0';for(let i=0;i<3;i++){beep('step');await step(id,$('performer'),[{transform:`translate(${x}px,0px) rotate(0deg)`},{transform:`translate(${x}px,-${i===1?39:25}px) rotate(-4deg)`},{transform:`translate(${x}px,0px) rotate(0deg)`}],480);}await step(id,q('.right-leg'),[{transform:'rotate(-35deg)'},{transform:'rotate(0deg)'}],350);}
async function ambient(id){rewardRunning=true;try{while(repeating&&!still&&id===rewardEpoch){await step(id,$('performer'),[{transform:'translateX(0px)'},{transform:'translateX(0px)'}],800);if(still)break;await walk(id,0,240);await pickUpHammer(id);await hammerAndHop(id,240);await walk(id,240,-65);await walk(id,-65,0);}}catch(e){if(e!==STOP)throw e;}finally{if(id===rewardEpoch)rewardRunning=false;}}
function resumeMachineLoop(){if(isToaster()||isMicrowave()||isHundredMachine()||isFarm())return;if(complete&&!rewardRunning&&!still){repeating=true;ambient(rewardEpoch);}}
async function secondReward(){const id=++rewardEpoch;busy=true;rewardRunning=true;repeating=true;render();$('world').classList.add('cutscene');$('world').style.setProperty('--pan','0px');$('pause-machine').hidden=false;try{await walk(id,0,240);await pickUpHammer(id);await hammerAndHop(id,240);await walk(id,240,0);guard(id);$('machine-desc').textContent='The hairy-legged machine extends a vacuum-hose arm to pick up a hammer, taps its knee, drops the hammer, and hops away before returning for it.';$('machine-display').textContent='COMPLETE';$('feedback').textContent='Power delivered. All '+contract.keys.length+' representations have value '+contract.value+'.';busy=false;complete=true;$('world').classList.remove('cutscene');render();$('completion').hidden=false;window.PlanetNPC?.completed();$('again').focus({preventScroll:true});beep('win');rewardRunning=false;await ambient(id);}catch(e){if(e!==STOP)throw e;}}
async function firstReward(){
 const id=++rewardEpoch;busy=true;rewardRunning=true;render();$('world').classList.add('cutscene');$('world').style.setProperty('--pan','0px');
 try{
  if(phase===0)await growLegs(id);
  else await step(id,$('printer'),[{transform:'translateY(0) rotate(0)'},{transform:'translateY(-12px) rotate(-3deg)'},{transform:'translateY(0) rotate(3deg)'},{transform:'translateY(0) rotate(0)'}],850);
  guard(id);phase++;history=[];busy=false;rewardRunning=false;$('world').classList.remove('cutscene');updateContractUI();$('feedback').textContent='Power key accepted. '+PowerContracts.instruction(rule());render();showBrief();
 }catch(e){if(e!==STOP)throw e;}
}
$('supply').onclick=async()=>{
 if(busy||complete)return;if(pickup){releasePickup(true);return;}
 if(isFarm()&&keyRecords.some(r=>r.signature===M.signature(state))){rejectAction('You already used that representation. Split or regroup to find a different one.');return;}
 if(isFarm()&&rule().varyLargest&&keyRecords.some(r=>r.state.tenThousands===state.tenThousands)){rejectAction('Use a new ten-thousand count. You already used '+(state.tenThousands||0)+'.');return;}
 if(isFarm()&&!PowerContracts.matches(state,contract,phase,keyRecords)){rejectAction('Keep the value '+contract.value+'. '+PowerContracts.instruction(rule()));return;}
 if(!PowerContracts.matches(state,contract,phase,keyRecords)){rejectAction('Value '+contract.value+'. '+PowerContracts.instruction(rule())+' You have '+PowerContracts.measure(state,rule().kind)+'.');return;}
 window.FirstPuzzle?.powering();busy=true;render();await awardKey();await (isFarm()?waterSeed():feedPower());isFarm()?farmReward():isHundredMachine()?hundredReward():isMicrowave()?microwaveReward():isToaster()?toasterReward():phase===contract.keys.length-1?secondReward():firstReward();
};
$('pause-machine').onclick=()=>{machinePaused=!machinePaused;$('pause-machine').textContent=machinePaused?'Resume machine':'Pause machine';$('pause-machine').setAttribute('aria-pressed',String(machinePaused));for(const a of activeAnimations)machinePaused?a.pause():a.play();if(!machinePaused)resumeMachineLoop();};
function reset(){
 if(pickup){releasePickup(true);return;}if(busy&&!rewardRunning)return;stopReward();busy=false;state={...contract.start};phase=0;complete=false;history=[];keyRecords=[];clearPerformance();configureMachine();$('completion').hidden=true;$('world').classList.remove('cutscene');$('machine-desc').textContent='A futuristic printer with an empty illuminated print chamber.';$('key-caption').textContent='Find every power key.';updateContractUI();select('split');render();showBrief();
}
$('chapter-switch').onclick=()=>{if(busy)return;if(pickup){releasePickup(true);return;}contract=PowerContracts.refresh(isFarm()?'first-shift':'farm-walnut');$('contract-choice').value=contract.id;reset();};
$('contract-choice').onchange=e=>{contract=PowerContracts.refresh(e.target.value);reset();};
$('next-round').onclick=()=>{contract=PowerContracts.refresh(PowerContracts.contracts[PowerContracts.contracts.findIndex(c=>c.id===contract.id)+1].id);$('contract-choice').value=contract.id;reset();};$('toaster-replay').onclick=replayToaster;
$('restart').onclick=reset;$('again').onclick=()=>{contract=PowerContracts.refresh(contract.id);reset();};configureMachine();updateContractUI();render();showBrief();

'use strict';
function isMicrowave(){return contract.id==='microwave';}
const microwaveHands=Array.from({length:20},(_,i)=>`<g transform="rotate(${i*18})"><g class="alien-hand" id="wave-hand-${i}"><path d="M0-51V-83" stroke="#71e6c5" stroke-width="9" stroke-linecap="round"/><path d="M-6-81l-7-9m8 8-2-15m7 14v-17m5 19 6-13" fill="none" stroke="#d6ff9e" stroke-width="5" stroke-linecap="round"/><ellipse cy="-83" rx="9" ry="8" fill="#d6ff9e"/></g></g>`).join('');
$('machine').insertAdjacentHTML('afterend',`<svg id="microwave-machine" class="machine" viewBox="0 0 840 550" role="img" aria-labelledby="microwave-title microwave-desc" hidden>
<title id="microwave-title">Alien Microwaving Microwave</title><desc id="microwave-desc">A futuristic microwave with an open door.</desc>
<defs><linearGradient id="micro-metal" x2="0.8" y2="1"><stop stop-color="#d9f9ff"/><stop offset=".45" stop-color="#7099bc"/><stop offset="1" stop-color="#273e66"/></linearGradient></defs>
<ellipse cx="410" cy="452" rx="255" ry="22" fill="#092b4466"/>
<g id="microwave-body">
<path d="M195 143l31-44h359l46 44" fill="#4b789b" stroke="#122b48" stroke-width="6"/>
<rect id="microwave-shell" x="160" y="140" width="490" height="272" rx="35" fill="url(#micro-metal)" stroke="#102c49" stroke-width="7"/>
<path d="M200 413v20h50v-20m300 0v20h50v-20" stroke="#173951" stroke-width="13"/>
<rect x="184" y="164" width="342" height="219" rx="22" fill="#091c36" stroke="#99f4e4" stroke-width="5"/>
<ellipse cx="353" cy="348" rx="136" ry="16" fill="#66b5bc"/>
<g id="microwave-energy" opacity="0"><ellipse cx="354" cy="282" rx="100" ry="63" fill="#81f1ba" opacity=".35"/><path d="M280 300q-30-35 0-55t0-45m70 105q-30-35 0-55t0-45m70 95q-30-35 0-55t0-45" stroke="#c2ff91" stroke-width="8" fill="none"/></g>
<g id="microwave-door"><rect x="184" y="164" width="342" height="219" rx="22" fill="#416480" stroke="#b5faff" stroke-width="6"/><rect x="203" y="181" width="270" height="178" rx="15" fill="#12374a" fill-opacity=".85" stroke="#63929c" stroke-width="3"/><path d="M219 200l230 140m-230-100 180 110m-170-150 220 105" stroke="#9bdad1" opacity=".13" stroke-width="10"/><path d="M497 222v103" stroke="#d8ffec" stroke-width="14" stroke-linecap="round"/></g>
<rect x="549" y="176" width="76" height="43" rx="8" fill="#082f34"/><text id="microwave-display" x="587" y="203" text-anchor="middle" fill="#b6ffb5" font-size="15" font-family="monospace">M—45</text>
<g fill="#98f0df" stroke="#294960" stroke-width="3"><circle cx="565" cy="247" r="9"/><circle cx="606" cy="247" r="9"/><circle cx="565" cy="278" r="9"/><circle cx="606" cy="278" r="9"/><circle cx="585" cy="331" r="24"/></g>
<g id="micro-fan" stroke="#163b55" stroke-width="5"><path d="M585 311v40m-20-20h40m-34-14 28 28m0-28-28 28"/></g>
<path d="M275 99V75m230 24V75" stroke="#a1ddeb" stroke-width="6"/><circle cx="275" cy="69" r="10" fill="#eebaff"/><circle cx="505" cy="69" r="10" fill="#9effce"/>
</g>
<g transform="translate(400 350)"><g id="microwave-alien" opacity="0">${microwaveHands}<circle r="58" fill="#9478dc" stroke="#302953" stroke-width="5"/><ellipse cy="12" rx="43" ry="35" fill="#ae91eb"/><g fill="#eefff2"><ellipse cx="-21" cy="-12" rx="14" ry="20"/><ellipse cx="21" cy="-12" rx="14" ry="20"/></g><g fill="#1b5570"><circle cx="-19" cy="-8" r="7"/><circle cx="23" cy="-8" r="7"/></g><path d="M-20 22q20 25 40 0" stroke="#302953" stroke-width="5" fill="#f3ace0" stroke-linecap="round"/></g></g>
</svg>`);
function resetMicrowave(){
 $('microwave-machine').toggleAttribute('hidden',!isMicrowave());
 $('world').classList.toggle('microwave-round',isMicrowave());
 for(const id of ['microwave-door','microwave-body','microwave-energy','micro-fan','microwave-alien',...Array.from({length:20},(_,i)=>'wave-hand-'+i)])$(id).removeAttribute('style');
 $('microwave-display').textContent='M—45';$('microwave-desc').textContent='A futuristic microwave with an open door.';
}
function microwaveHum(){
 if(!sound)return;
 beep('step');if(!audio)return;
 const t=audio.currentTime,o=audio.createOscillator(),g=audio.createGain();
 o.type='sawtooth';o.frequency.setValueAtTime(65,t);o.frequency.exponentialRampToValueAtTime(180,t+1.5);o.frequency.exponentialRampToValueAtTime(45,t+2.7);
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.018,t+.2);g.gain.linearRampToValueAtTime(0,t+2.8);o.connect(g).connect(audio.destination);o.start(t);o.stop(t+2.8);
}
async function microwaveReward(){
 const id=++rewardEpoch;busy=true;rewardRunning=true;render();$('world').classList.add('cutscene');$('world').style.setProperty('--pan','0px');$('pause-machine').hidden=false;
 try{
  if(phase===0){
   await step(id,$('microwave-door'),[{transform:'scaleX(.12) skewY(-12deg)'},{transform:'scaleX(1) skewY(0deg)'}],1400);beep('tap');
   $('microwave-desc').textContent='The microwave door has closed. First key complete.';
  }else if(phase===1){
   microwaveHum();$('microwave-display').textContent='BZZZ';
   await Promise.all([
    step(id,$('microwave-body'),[{transform:'translateX(0)'},{transform:'translateX(-5px) rotate(-1deg)'},{transform:'translateX(5px) rotate(1deg)'},{transform:'translateX(0)'}],700,{iterations:4}),
    step(id,$('micro-fan'),[{transform:'rotate(0deg)'},{transform:'rotate(1080deg)'}],2800),
    step(id,$('microwave-energy'),[{opacity:0},{opacity:1},{opacity:.6}],2800)
   ]);$('microwave-display').textContent='READY';$('microwave-desc').textContent='The microwave has hummed, buzzed, shaken and whirred. Something is ready inside.';
  }else{
   beep('win');
   await step(id,$('microwave-door'),[{transform:'scaleX(1)'},{transform:'scaleX(.12) skewY(-12deg)'}],1100);
   $('microwave-energy').style.opacity='0';
   await step(id,$('microwave-alien'),[{opacity:0,transform:'translateY(-70px) scale(.15)'},{opacity:1,transform:'translateY(35px) scale(1.12)',offset:.8},{opacity:1,transform:'translateY(25px) scale(1)'}],1400);
   for(let i=0;i<20;i++)await step(id,$('wave-hand-'+i),[{transform:'translateY(0)'},{transform:'translateY(-17px)',offset:.5},{transform:'translateY(0)'}],210);
   $('microwave-desc').textContent='A small purple alien with twenty hands has emerged and performed a stadium wave, one hand at a time.';
  }
  guard(id);busy=false;rewardRunning=false;machinePaused=false;$('pause-machine').hidden=true;$('pause-machine').textContent='Pause machine';$('pause-machine').setAttribute('aria-pressed','false');$('world').classList.remove('cutscene');
  if(phase===2){complete=true;render();$('completion').hidden=false;$('feedback').textContent='All three keys accepted. Every representation has value 45.';$('again').focus({preventScroll:true});}
  else{phase++;history=[];updateContractUI();render();showBrief();}
 }catch(e){if(e!==STOP)throw e;}
}

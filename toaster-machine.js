'use strict';
const toasterStageDescriptions=[
  'A familiar chrome kitchen toaster with two empty slots and a sliding lever.',
  'Two slices of spotted alien bread stick out of the toaster.',
  'The lever is down. Only the tops of the alien toast remain visible.',
  'A round alien lamprey mouth has appeared on the front of the toaster.',
  'Three little baby toasters sit below Mamma, with their mouths facing upwards.',
  'Mamma has swallowed her toast and fed colourful chewed-toast crumbs to her three baby toasters.'
];
function toothRing(cx,cy,r,n=16){return Array.from({length:n},(_,i)=>`<path d="M${cx-5} ${cy-r}l5 13 5-13Z" fill="#fff0bd" transform="rotate(${i*360/n} ${cx} ${cy})"/>`).join('');}
function babyMarkup(x,i){return `<g transform="translate(${x} 425)"><g id="baby-${i}" class="baby-actor"><ellipse cx="55" cy="94" rx="62" ry="10" fill="#0b263b55"/><path d="M5 20Q5 0 55 0T105 20v59q0 13-15 13H20Q5 92 5 79Z" fill="url(#toast-chrome)" stroke="#203b50" stroke-width="4"/><ellipse cx="55" cy="19" rx="44" ry="19" fill="#78ddd3" stroke="#203b50" stroke-width="4"/><ellipse cx="55" cy="19" rx="32" ry="13" fill="#351c51"/><path d="M27 12l5 10 5-12m10-3l6 13 5-13m10 2l5 12 5-9" fill="#fff0bd"/><circle cx="30" cy="57" r="7" fill="#123d4d"/><circle cx="79" cy="57" r="7" fill="#123d4d"/><path class="baby-smile" d="M40 75q15 13 30 0" fill="none" stroke="#154658" stroke-width="4" stroke-linecap="round"/><path d="M15 92v7m80-7v7" stroke="#17364d" stroke-width="8"/><ellipse id="baby-food-${i}" cx="55" cy="19" rx="23" ry="7" fill="#ecc477" opacity="0"/></g></g>`;}
const toastSvg=`<svg id="toaster-machine" class="machine toaster-machine" viewBox="0 0 840 550" role="img" aria-labelledby="toaster-title toaster-desc" hidden>
<title id="toaster-title">Mamma Toaster Feeds Her Babies</title><desc id="toaster-desc">${toasterStageDescriptions[0]}</desc>
<defs><linearGradient id="toast-chrome" x2=".8" y2="1"><stop stop-color="#fcf4df"/><stop offset=".35" stop-color="#d2e7ec"/><stop offset=".6" stop-color="#91b6c4"/><stop offset="1" stop-color="#467388"/></linearGradient><linearGradient id="toast-crust" x2="0" y2="1"><stop stop-color="#e2c76e"/><stop offset="1" stop-color="#b46da3"/></linearGradient></defs>
<ellipse cx="337" cy="416" rx="195" ry="21" fill="#102e4666"/>
<g id="toaster-body">
<g id="alien-bread" opacity="0">
<path d="M205 233V123q-24-32 6-48 40-29 76-2 33-23 53 5 23 28-8 48v107Z" fill="url(#toast-crust)" stroke="#63395f" stroke-width="6"/><path d="M219 217V130q-12-20 3-34 26-18 61 0 24-17 34 2 12 17-1 30v89Z" fill="#b9e58c"/><path d="M355 233V112q-25-27 0-45 37-27 67-1 27-23 50 1 24 27-2 46v120Z" fill="url(#toast-crust)" stroke="#63395f" stroke-width="6"/><path d="M369 216V117q-15-19 1-31 23-15 52 0 20-15 33 1 10 16-1 28v101Z" fill="#f2b4d3"/>
<g fill="#685b9a"><ellipse cx="242" cy="142" rx="10" ry="14"/><ellipse cx="286" cy="112" rx="7" ry="10"/><ellipse cx="291" cy="179" rx="13" ry="8"/><ellipse cx="395" cy="128" rx="12" ry="7"/><ellipse cx="430" cy="175" rx="9" ry="15"/></g><g fill="#ecffb5"><circle cx="243" cy="140" r="4"/><circle cx="430" cy="173" r="4"/></g>
</g>
<path id="toaster-shell" d="M158 249q0-49 47-49h245q57 0 57 49v126q0 36-38 36H196q-38 0-38-36Z" fill="url(#toast-chrome)" stroke="#1d3a50" stroke-width="6"/>
<path d="M173 245q0-36 38-36h228q43 0 50 34" fill="none" stroke="#effff1" stroke-width="5"/>
<path d="M200 219h125m32 0h112" stroke="#142b3e" stroke-width="12" stroke-linecap="round"/>
<path d="M201 215h122m34 0h110" stroke="#f1ffe8" stroke-width="3"/>
<path d="M182 265v98m308-97v97" stroke="#effaff" stroke-width="5" opacity=".65"/>
<path d="M199 410v10h42v-10m187 0v10h42v-10" fill="#17364b"/>
<path d="M521 245v111" stroke="#1e3a50" stroke-width="12" stroke-linecap="round"/><path d="M521 245v111" stroke="#659aab" stroke-width="5"/>
<g id="toast-lever"><path d="M503 247h37" stroke="#18394d" stroke-width="9"/><rect x="527" y="235" width="39" height="22" rx="7" fill="#e6f6dc" stroke="#213e54" stroke-width="4"/></g>
<circle cx="465" cy="373" r="17" fill="#1e4157" stroke="#e6f5dd" stroke-width="3"/><path d="M465 360v10" stroke="#baffc3" stroke-width="4"/><text id="toaster-display" x="250" y="389" fill="#163b50" font-family="monospace" font-size="12">T—64 / STANDBY</text>
<g id="mamma-mouth" opacity="0"><ellipse cx="330" cy="313" rx="68" ry="64" fill="#75d4cf" stroke="#183b54" stroke-width="6"/><circle cx="330" cy="313" r="51" fill="#75519a" stroke="#c3a7df" stroke-width="6"/><circle cx="330" cy="313" r="36" fill="#261c45"/>${toothRing(330,313,48)}<ellipse cx="330" cy="325" rx="18" ry="9" fill="#9d71b0"/></g>
</g>
${[140,325,510].map(babyMarkup).join('')}
<g id="toast-crumbs" aria-hidden="true"></g>
</svg>`;
$('machine').insertAdjacentHTML('afterend',toastSvg);
function isToaster(){return contract.id==='mixed-practice';}
function configureMachine(){
 const toaster=isToaster(),microwave=isMicrowave();resetMicrowave();configureHundredMachine();$('machine').toggleAttribute('hidden',toaster||microwave||isHundredMachine()||isFarm());$('toaster-machine').toggleAttribute('hidden',!toaster);$('world').classList.toggle('toaster-round',toaster);
 $('complete-title').textContent=microwave?'Alien Microwaving Microwave Complete':toaster?'Mamma Toaster Feeds Her Babies Machine Complete':'Hairy Leg Reflex Machine Complete';
 for(const id of ['alien-bread','toast-lever','mamma-mouth','toaster-body',...Array.from({length:3},(_,i)=>`baby-${i}`),...Array.from({length:3},(_,i)=>`baby-food-${i}`)])$(id).removeAttribute('style');
 $('toast-crumbs').replaceChildren();$('toaster-desc').textContent=toasterStageDescriptions[0];$('toaster-display').textContent='T—64 / STANDBY';
 $('toaster-replay').hidden=true;$('toaster-replay').disabled=false;const index=PowerContracts.contracts.findIndex(c=>c.id===contract.id);$('next-round').hidden=index===PowerContracts.contracts.length-1;$('next-round').textContent='Round '+(index+2)+' →';if(isHundredMachine())$('complete-title').textContent=PowerContracts.machines.find(m=>m[0]===contract.id)[1]+' Complete';configureFarm();if(!isFarm())document.querySelector('.hundred-intake').hidden=!contract.hundreds;if(contract.id==='blender')$('next-round').textContent='Visit the alien farm →';if(isFarm())$('next-round').textContent='Next garden bed →';
}
async function toasterFeed(id){
 await step(id,$('toaster-body'),[{transform:'translateX(0)'},{transform:'translateX(-8px) rotate(-2deg)'},{transform:'translateX(8px) rotate(2deg)'},{transform:'translateX(-5px)'},{transform:'translateX(0)'}],900);
 await step(id,$('alien-bread'),[{transform:'translateY(125px)',opacity:1},{transform:'translateY(225px)',opacity:0}],650);beep('join');
 for(let i=0;i<3;i++){
  guard(id);const x=195+i*185,crumbs=[];
  for(let j=0;j<6;j++){const c=document.createElementNS('http://www.w3.org/2000/svg','path');c.setAttribute('d','M-5-4L4-6 7 2 1 6-6 3Z');c.setAttribute('fill',['#f2d48a','#b8df85','#e9a7cd'][j%3]);c.setAttribute('stroke','#977856');c.setAttribute('stroke-width','1.5');$('toast-crumbs').append(c);crumbs.push(c);}
  beep('tap');await Promise.all(crumbs.map((c,j)=>step(id,c,[{transform:`translate(330px,313px) scale(.6)`,opacity:1},{transform:`translate(${(330+x)/2+j*3}px,${355-j*5}px) scale(1)`,opacity:1,offset:.45},{transform:`translate(${x+(j-3)*4}px,444px) scale(.6)`,opacity:0}],650+j*45)));
  crumbs.forEach(c=>c.remove());$('baby-food-'+i).style.opacity='1';await step(id,$('baby-'+i),[{transform:'scale(1)'},{transform:'scale(1.12,.9)'},{transform:'scale(1)'}],400);
 }
}
async function toasterReward(){
 const id=++rewardEpoch;busy=true;rewardRunning=true;render();$('world').classList.add('cutscene');$('world').style.setProperty('--pan','0px');$('pause-machine').hidden=false;
 try{
  if(phase===0)await step(id,$('alien-bread'),[{transform:'translateY(-180px)',opacity:0},{transform:'translateY(-15px)',opacity:1,offset:.8},{transform:'translateY(0)',opacity:1}],1300);
  else if(phase===1){beep('step');await Promise.all([step(id,$('toast-lever'),[{transform:'translateY(0)'},{transform:'translateY(98px)'}],750),step(id,$('alien-bread'),[{transform:'translateY(0)',opacity:1},{transform:'translateY(125px)',opacity:1}],1000)]);}
  else if(phase===2){beep('join');await step(id,$('mamma-mouth'),[{transform:'scale(.05)',opacity:0},{transform:'scale(1.15)',opacity:1,offset:.7},{transform:'scale(1)',opacity:1}],1200);}
  else if(phase===3){for(let i=0;i<3;i++){beep('tap');await step(id,$('baby-'+i),[{transform:`translate(${135-i*185}px,-202px) scale(.05)`,opacity:0},{transform:`translate(${(135-i*185)*.4}px,-130px) scale(.5)`,opacity:1,offset:.45},{transform:'translate(0,0) scale(1)',opacity:1}],850);}}
  else await toasterFeed(id);
  guard(id);$('toaster-desc').textContent=toasterStageDescriptions[phase+1];$('toaster-display').textContent=phase===4?'MAMMA / WELL FED':'T—64 / KEY '+(phase+1);
  busy=false;rewardRunning=false;machinePaused=false;$('pause-machine').textContent='Pause machine';$('pause-machine').setAttribute('aria-pressed','false');$('pause-machine').hidden=true;$('world').classList.remove('cutscene');
  if(phase===4){complete=true;render();$('completion').hidden=false;$('toaster-replay').hidden=false;$('feedback').textContent='All five keys accepted. Value 64.';$('again').focus({preventScroll:true});beep('win');}
  else{phase++;history=[];updateContractUI();render();$('feedback').textContent='Power key accepted. '+PowerContracts.instruction(rule());showBrief();}
 }catch(e){if(e!==STOP)throw e;}
}
async function replayToaster(){
 if(busy)return;const id=++rewardEpoch;busy=true;rewardRunning=true;$('toaster-replay').disabled=true;$('pause-machine').hidden=false;
 try{for(let i=0;i<3;i++)$('baby-food-'+i).style.opacity='0';await toasterFeed(id);guard(id);}
 catch(e){if(e!==STOP)throw e;}finally{if(id===rewardEpoch){busy=false;rewardRunning=false;machinePaused=false;$('pause-machine').textContent='Pause machine';$('pause-machine').setAttribute('aria-pressed','false');$('toaster-replay').disabled=false;$('pause-machine').hidden=true;}}
}

'use strict';
let keyRecords=[];
function rule(){return contract.keys[phase];}
function keyIcon(){return '<svg viewBox="0 0 48 32" aria-hidden="true"><circle cx="13" cy="16" r="9"/><path d="M22 16h21m-8 0v8m7-8v6"/></svg>';}
function drawKeys(){
 $('key-count').textContent=keyRecords.length+' / '+contract.keys.length;$('key-slots').replaceChildren();
 contract.keys.forEach((_,i)=>{const b=document.createElement('button'),record=keyRecords[i];b.className='key-socket'+(record?' earned':'');b.innerHTML=keyIcon()+'<span>'+(i+1)+'</span>';b.disabled=!record;b.setAttribute('aria-label',record?'Key '+(i+1)+': '+record.value+', '+record.description:'Key '+(i+1)+' locked');if(i===phase&&!record)b.classList.add('current');b.onclick=()=>{$('key-caption').textContent=record.value+': '+record.description;};$('key-slots').append(b);});
}
function updateContractUI(){
 $('phase').textContent=(isFarm()?'WATER KEY ':'POWER KEY ')+(phase+1)+' / '+contract.keys.length;
 $('mission-title').innerHTML='Make <b>'+contract.value+'</b><em>'+PowerContracts.instruction(rule())+'</em>';
 $('value').textContent=contract.value;$('target').textContent=rule().kind==='blocks'?' / '+rule().amount:'';
 $('rule-progress').textContent=PowerContracts.progress(state,rule());
 $('machine-display').textContent='KEY '+(phase+1)+' · VALUE '+contract.value;drawKeys();
}
function keyFanfare(){if(!sound)return;try{audio ||= new(window.AudioContext||window.webkitAudioContext)();audio.resume().catch(()=>{});[392,523.25,659.25,783.99].forEach((f,i)=>{for(const ratio of [1,2]){const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime+i*.13;o.type='triangle';o.frequency.setValueAtTime(f*.92*ratio,t);o.frequency.exponentialRampToValueAtTime(f*ratio,t+.07);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.026/ratio,t+.025);g.gain.exponentialRampToValueAtTime(.001,t+.4);o.connect(g).connect(audio.destination);o.start(t);o.stop(t+.42);}});}catch{beep('win');}}
async function awardKey(){
 keyRecords.push({value:contract.value,description:M.describe(state),signature:M.signature(state),state:{...state}});drawKeys();$('key-caption').textContent='KEY '+(phase+1)+' ACCEPTED · '+contract.value+': '+M.describe(state);
 const socket=$('key-slots').children[phase];socket.classList.add('new-key');keyFanfare();
 await Promise.all([animate(socket,[{transform:'scale(.85)'},{transform:'scale(1.18)',offset:.45},{transform:'scale(1)'}],850),...Array.from($('cargo').querySelectorAll('.block'),b=>isFarm()?animate(b,[{opacity:1},{opacity:.6},{opacity:1}],650):GlowCelebrations.play(b,b.dataset.unit||'ones',undefined,{still,active:activeAnimations}))]);socket.classList.remove('new-key');farmNotebook();
}

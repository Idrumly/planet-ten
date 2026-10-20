'use strict';
(() => {
 const synth=window.speechSynthesis,supported=!!(synth&&window.SpeechSynthesisUtterance);
 const main=document.getElementById('sound');let generation=0,current=null,narration=null;
 const clips=window.PlanetVoiceClips||[],hasVoice=clips.length>0||supported;
 const normalize=value=>value.replace(/\s+/g," ").trim();
 try{sound=sessionStorage.getItem('planet-ten-sound')==='on';}catch{sound=false;}
 const controls=[main,...document.querySelectorAll('[data-sound-toggle]')];
 const practice=document.querySelector('.training-panel'),story=document.querySelector('.story-nav');
 let replay=null,status=null;
 if(practice||story){
  const group=document.createElement('div');group.className='voice-controls';
  replay=document.createElement('button');replay.type='button';replay.id='hear-instruction';
  status=document.createElement('span');status.id='voice-status';status.setAttribute('role','status');group.append(replay,status);
  if(practice)practice.insertBefore(group,document.getElementById('training-form'));else story.insertBefore(group,document.getElementById('next'));
 }
 function refresh(){
  for(const button of controls){button.textContent=sound?'🔇 Turn sound OFF':'🔊 Turn sound ON';button.setAttribute('aria-pressed',String(sound));}
  document.documentElement.dataset.sound=sound?'on':'off';
  if(replay){replay.disabled=!hasVoice;replay.textContent=hasVoice?(sound?'🔊 Hear instruction again':'🔊 Sound on & listen'):'Voice unavailable';}
 }
 function stop(){generation++;current=null;if(narration){narration.pause();narration.currentTime=0;narration=null;}if(supported)synth.cancel();document.documentElement.dataset.speaking='false';}
 function text(){
  const instruction=document.getElementById('training-instruction');
  if(instruction){const hint='';const form=document.getElementById('training-form');return [instruction.textContent,!form.hidden?'Type the total value and the number of blocks. Then choose Check my answers.':'',hint].filter(Boolean).join(' ');}
  const frame=document.querySelector('.frame.active');return frame?[...frame.querySelectorAll('h1,.bubble p')].map(el=>el.textContent).join('. '):'';
 }
 function say(message){
  stop();if(!sound||!message||document.hidden)return;
  const clip=clips.find(item=>normalize(item.text)===normalize(message));
  if(clip){
   const token=generation,player=new Audio(clip.src);narration=player;player.volume=.85;
   if(status)status.textContent='';
   player.onplaying=()=>{if(token===generation)document.documentElement.dataset.speaking='true';};
   player.onended=()=>{if(token===generation){document.documentElement.dataset.speaking='false';narration=null;}};
   const failed=()=>{if(token===generation){document.documentElement.dataset.speaking='false';if(status)status.textContent='Press Hear instruction again to start the voice.';}};
   player.onerror=failed;player.play().catch(failed);return;
  }
  if(!supported){if(status)status.textContent='This browser has no tutorial voice. The written instructions still work.';return;}
  const token=generation;
  if(status)status.textContent='';
  // Short sentences avoid long speech queues; a new instruction cancels the old one.
  const pieces=message.match(/[^.!?]+[.!?]*/g)||[message];
  const voices=synth.getVoices(),english=voices.filter(v=>/^en(?:-|_)/i.test(v.lang));
  const voice=english.find(v=>v.localService&&/zira|samantha|female/i.test(v.name))||english.find(v=>v.localService)||english[0];
  function next(index){
   if(token!==generation||!sound||document.hidden)return;
   if(index===pieces.length){current=null;document.documentElement.dataset.speaking='false';return;}
   const utterance=new SpeechSynthesisUtterance(pieces[index].trim());current=utterance;
   utterance.lang=voice?.lang||'en-US';if(voice)utterance.voice=voice;
   utterance.pitch=1.65;utterance.rate=.9;utterance.volume=.85;
   utterance.onstart=()=>{if(token===generation)document.documentElement.dataset.speaking='true';};
   utterance.onend=()=>next(index+1);
   utterance.onerror=event=>{if(token!==generation)return;current=null;document.documentElement.dataset.speaking='false';if(status&&event.error!=='canceled'&&event.error!=='interrupted')status.textContent='Voice could not start. Press Hear instruction again to retry.';};
   try{synth.speak(utterance);}catch{if(status)status.textContent='Voice could not start. You can still read every instruction.';}
  }
  next(0);
 }
 function enable(on){
  sound=on;try{sessionStorage.setItem('planet-ten-sound',on?'on':'off');}catch{}
  if(!on){stop();if(typeof audio!=='undefined'&&audio){const old=audio;audio=undefined;old.close().catch(()=>{});}if(status)status.textContent='Sound is off.';}
  refresh();if(on)say(text());
 }
 for(const button of controls)button.onclick=()=>enable(!sound);
 if(replay)replay.onclick=()=>{if(!sound)enable(true);else say(text());};
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.addEventListener('pagehide',stop);
 // Voice lists may arrive later; choose the freshest available voice on each read.
 if(supported)synth.getVoices();
 window.PlanetVoice={say,instructionChanged:()=>say(text()),refresh,stop};
 refresh();if(sound)say(text());
})();

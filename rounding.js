'use strict';
(()=>{
 const $=id=>document.getElementById(id),M=RoundingModel,R=WarehouseRooms.current,lockCount=R.lockCount||3;
 let questions=[],index=0,opened=false,sound=false,voice=true,audio=null,revealTimer=null,beeTimer=null;
 try{const settings=JSON.parse(sessionStorage.getItem('planet-ten-rounding-settings')||'null');if(settings){sound=Boolean(settings.sound);voice=Boolean(settings.voice);}}catch{}
 const media=matchMedia('(prefers-reduced-motion: reduce)');let still=media.matches;try{const settings=JSON.parse(sessionStorage.getItem('planet-ten-rounding-settings')||'null');if(settings)still=media.matches||Boolean(settings.still);}catch{}
 document.body.classList.toggle('review-room',Boolean(R.review));
 const lockList=document.querySelector('.locks');lockList.innerHTML=Array.from({length:lockCount},(_,i)=>'<li><span class="mini-snake" aria-hidden="true">◉ ≋ ◉</span><b>Lock '+(i+1)+'</b><span class="lock-state">Waiting</span></li>').join('');
 document.querySelector('.heading > span').textContent=('ROOM '+String(R.number).padStart(2,'0'))+(R.review?' / FINAL REVIEW · FIVE LOCKS · NO HINTS':' / ROUND TO THE NEAREST '+R.place.toUpperCase());
 $('enter').textContent='Open '+R.title+' →';
 $('room-title').textContent=R.title;
 let narration=null;function stopVoice(){if(narration){narration.pause();narration=null;}window.speechSynthesis?.cancel();}
 function speak(text,speaker='TEN-BOT'){stopVoice();if(!sound||!voice)return;const clip=window.RoundingVoiceClips?.find(c=>c.text===text);const fallback=()=>{if(!sound||!voice||!window.speechSynthesis||!window.SpeechSynthesisUtterance)return;const u=new SpeechSynthesisUtterance(text);u.voice=window.speechSynthesis.getVoices().find(v=>/Zira/i.test(v.name))||null;u.pitch=speaker==='Mr. Martian'?.72:1.55;u.rate=.9;u.volume=.85;window.speechSynthesis.speak(u);};if(clip){const a=new Audio(clip.src);narration=a;a.play().catch(()=>{if(narration===a)fallback();});}else fallback();}
 function tell(text){$('instruction').textContent=text;speak(text);} window.RoundTalk=tell;
 window.RoundStageSpeak=speak;window.RoundStopVoice=stopVoice;
 window.RoundVoiceBusy=()=>Boolean((narration&&!narration.paused&&!narration.ended)||window.speechSynthesis?.speaking);
 window.RoundSparkle=()=>{[880,1320,1760,2200].forEach((f,i)=>tone(f,i*.1,.18));};
 window.RoundRoomSound=(room,action)=>{if(room==='board'&&action==='jump')[330,440,550].forEach((f,i)=>tone(f,i*.1,.12,'triangle'));if(room==='brain'&&action==='rumble')tone(65,0,.8,'triangle',35);if(room==='court'&&action==='gavel')tone(95,0,.12,'triangle',45);if(room==='shoe'&&action==='bell')window.RoundBell();};
 window.RoundGagSound=kind=>{
  if(['fizz','zip','sneeze'].includes(kind)){tone(900,0,.22,'triangle',80);tone(1300,.08,.18,'sine',100);}
  else if(kind==='horn'){tone(330,0,.17,'triangle');tone(440,.19,.19,'triangle');}
  else if(kind==='deflate'){tone(1200,0,.65,'sine',130);tone(390,.3,.22,'triangle',800);}
  else if(kind==='waltz'||kind==='disco'){[523,659,784].forEach((f,i)=>tone(f,i*.13,.18,'triangle'));}
  else if(kind==='launch'||kind==='swish'){tone(110,0,.45,'triangle',1000);}
  else if(kind==='magic'){[660,990,1320].forEach((f,i)=>tone(f,i*.09,.25));}
  else {tone(260,0,.15,'sine',650);tone(520,.12,.12,'sine',200);}
 };
 window.RoundBell=()=>{tone(1046,0,.65);tone(1568,.025,.55);tone(2093,0,.35);};
 function refreshSettings(){
  try{sessionStorage.setItem('planet-ten-rounding-settings',JSON.stringify({sound,voice,still}));}catch{}
  $('sound').textContent=sound?'Sound ON':'Sound OFF';$('sound').setAttribute('aria-pressed',String(sound));
  $('voice').textContent=voice?'Voice ON':'Voice OFF';$('voice').setAttribute('aria-pressed',String(voice));
  $('motion').textContent=still?'Motion OFF':'Motion ON';$('motion').setAttribute('aria-pressed',String(!still));document.body.classList.toggle('still',still);
 }
 function ctx(){if(!sound)return null;try{if(!audio){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return null;audio=new Audio();}if(audio.state==='suspended')audio.resume().catch(()=>{});return audio;}catch{return null;}}
 function tone(frequency,start,length,type='sine',end=frequency){const a=ctx();if(!a)return;const t=a.currentTime+start,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(frequency,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,end),t+length);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.075,t+.015);g.gain.exponentialRampToValueAtTime(.001,t+length);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+length+.02);}
 function unlock(){const base=240+index*90;[0,1,2,3].forEach(i=>tone(base*(1+i*.35),i*.13,.2,'sine',base*(1+i*.35)*1.3));tone(90,.3,.5,'triangle',420);}
 const board=document.createElement('div');board.className='door-lock-board';
 const title=$('question-title');
 const enter=$('enter');$('console').replaceChildren(title,board,enter);
 let puzzle=null;
 function render(){
  opened=false;$('door-progress').textContent='0 / '+lockCount+' locks unlocked';enter.hidden=false;enter.disabled=true;enter.textContent='Open '+R.title+' · 0 / '+lockCount+' locks unlocked';
  title.textContent=R.title+' · unlock all '+lockCount+' locks';
  puzzle=window.createDoorPuzzle({root:board,questions,room:R,
   onUnlock:(slot,count)=>{index=slot;unlock();$('door-progress').textContent=count+' / '+lockCount+' locks unlocked';enter.textContent='Open '+R.title+' · '+count+' / '+lockCount+' locks unlocked';},
   onReady:()=>{enter.disabled=false;enter.textContent='Open '+R.title+' →';tell('All locks open! Open the '+R.title+' door.');}
  });
  tell(R.intro+' All '+lockCount+' locks are ready. Try them in any order.');
 }
 const beeLines=['My word is… COMMUNITY.','C · O · M…','M · U · N…','I · T · Y!','COMMUNITY. A group of people who live, work, or help one another.','“May I have that in a pollen sentence?”'];
 function beeShow(){clearTimeout(beeTimer);let step=0;$('bee-speech').textContent=beeLines[0];
  if(still){$('bee-speech').textContent='C · O · M · M · U · N · I · T · Y. “May I have that in a pollen sentence?”';return;}
  const advance=()=>{step++;if(step>=beeLines.length)return;$('bee-speech').textContent=beeLines[step];tone(180+step*35,0,.2,'triangle',250+step*20);beeTimer=setTimeout(advance,step===4?4500:2100);};beeTimer=setTimeout(advance,2500);
 }
 $('enter').onclick=()=>{if(!puzzle?.complete()||opened)return;opened=true;window.LockGags?.finishAll();WarehouseRooms.complete();$('enter').disabled=true;$('door').classList.add('unlocking');[523,659,784,1046].forEach((f,i)=>tone(f,i*.14,.55,'triangle'));window.WarehouseWalk?.open();
  revealTimer=setTimeout(()=>{document.querySelector('.warehouse').hidden=true;$('room').hidden=false;$('summary').textContent=questions.map(q=>`${q.n} → ${q.answer} (nearest ${q.place})`).join('   ·   ');tell(R.reveal);$('room-title').focus();if(!window.WarehouseWalk)beeShow();},still?0:700);
 };
 function reset(){window.LockGags?.cancelAll();window.WarehouseWalk?.reset();clearTimeout(revealTimer);clearTimeout(beeTimer);stopVoice();questions=M.roomQuestions(R);index=0;$('room').hidden=true;document.querySelector('.warehouse').hidden=false;$('enter').disabled=false;$('door').classList.remove('unlocking');render();}
 $('again').onclick=()=>{reset();$('question-title').focus();};$('replay').onclick=beeShow;
 $('sound').onclick=()=>{sound=!sound;if(sound){ctx();speak($('instruction').textContent);}else{stopVoice();audio?.suspend().catch(()=>{});}refreshSettings();};
 $('voice').onclick=()=>{voice=!voice;if(!voice)stopVoice();refreshSettings();};
 $('hear').onclick=()=>{sound=true;voice=true;ctx();refreshSettings();speak($('instruction').textContent);};
 if(!window.speechSynthesis&&!window.RoundingVoiceClips){$('voice').disabled=true;$('hear').disabled=true;$('hear').textContent='Read the instructions above';}
 $('motion').onclick=()=>{still=!still;refreshSettings();if(opened&&!$('room').hidden&&!window.WarehouseWalk)beeShow();};
 media.addEventListener('change',e=>{still=e.matches;refreshSettings();if(opened&&!$('room').hidden&&!window.WarehouseWalk)beeShow();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stopVoice();audio?.suspend().catch(()=>{});clearTimeout(beeTimer);}else if(opened&&!$('room').hidden&&!window.WarehouseWalk)beeShow();});
 window.addEventListener('pagehide',()=>{stopVoice();clearTimeout(beeTimer);clearTimeout(revealTimer);audio?.close().catch(()=>{});});
 window.RoundRestart=()=>{WarehouseRooms.clear();reset();};window.RoundRestoreRoom=()=>{if(WarehouseRooms.completed()){opened=true;window.WarehouseWalk?.open();tell('Welcome back to '+R.title+'. Your locks are still released. A rare administrative success.');}};refreshSettings();reset();
})();

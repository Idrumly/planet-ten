'use strict';
(()=>{
 const $=id=>document.getElementById(id),M=RoundingModel,R=WarehouseRooms.current;
 let questions=[],index=0,solved=false,opened=false,sound=false,voice=true,audio=null,tickleTimer=null,revealTimer=null,beeTimer=null;
 try{const settings=JSON.parse(sessionStorage.getItem('planet-ten-rounding-settings')||'null');if(settings){sound=Boolean(settings.sound);voice=Boolean(settings.voice);}}catch{}
 const media=matchMedia('(prefers-reduced-motion: reduce)');let still=media.matches;try{const settings=JSON.parse(sessionStorage.getItem('planet-ten-rounding-settings')||'null');if(settings)still=media.matches||Boolean(settings.still);}catch{}
 const narrations=[R.intro,
 'One lock down. Its union requires a tickle break. Round this new number to the nearest '+R.place+'. Request another clue only when you need it.',
 'Last lock. Take your time. Warehouse policy: no lock may remain emotionally undecided.'
 ];
 document.querySelector('#question-title em').textContent=R.unit;
 document.querySelector('.heading > span').textContent=(R.id==='bee'?'ROOM 01':'ROOM 02')+' / ROUND TO THE NEAREST '+R.place.toUpperCase();
 $('enter').textContent='Open the '+R.title+' room →';
 $('room-title').textContent=R.title;
 let narration=null;function stopVoice(){if(narration){narration.pause();narration=null;}window.speechSynthesis?.cancel();}
 function speak(text){stopVoice();if(!sound||!voice)return;const clip=window.RoundingVoiceClips?.find(c=>c.text===text);const fallback=()=>{if(!sound||!voice||!window.speechSynthesis||!window.SpeechSynthesisUtterance)return;const u=new SpeechSynthesisUtterance(text);u.voice=window.speechSynthesis.getVoices().find(v=>/Zira/i.test(v.name))||null;u.pitch=1.55;u.rate=.9;u.volume=.85;window.speechSynthesis.speak(u);};if(clip){const a=new Audio(clip.src);narration=a;a.play().catch(()=>{if(narration===a)fallback();});}else fallback();}
 function tell(text){$('instruction').textContent=text;speak(text);} window.RoundTalk=tell;
 window.RoundStageSpeak=speak;window.RoundStopVoice=stopVoice;
 window.RoundVoiceBusy=()=>Boolean((narration&&!narration.paused&&!narration.ended)||window.speechSynthesis?.speaking);
 window.RoundSparkle=()=>{[880,1320,1760,2200].forEach((f,i)=>tone(f,i*.1,.18));};
 window.RoundBell=()=>{tone(1046,0,.65);tone(1568,.025,.55);tone(2093,0,.35);};
 function refreshSettings(){
  try{sessionStorage.setItem('planet-ten-rounding-settings',JSON.stringify({sound,voice,still}));}catch{}
  $('sound').textContent=sound?'Sound ON':'Sound OFF';$('sound').setAttribute('aria-pressed',String(sound));
  $('voice').textContent=voice?'Voice ON':'Voice OFF';$('voice').setAttribute('aria-pressed',String(voice));
  $('motion').textContent=still?'Motion OFF':'Motion ON';$('motion').setAttribute('aria-pressed',String(!still));document.body.classList.toggle('still',still);
 }
 function ctx(){if(!sound)return null;try{if(!audio){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return null;audio=new Audio();}if(audio.state==='suspended')audio.resume().catch(()=>{});return audio;}catch{return null;}}
 function tone(frequency,start,length,type='sine',end=frequency){const a=ctx();if(!a)return;const t=a.currentTime+start,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(frequency,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,end),t+length);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.075,t+.015);g.gain.exponentialRampToValueAtTime(.001,t+length);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+length+.02);}
 function giggle(){[0,.11,.23].forEach((t,i)=>tone(430+i*90,t,.09,'sine',750+i*60));tone(160,.03,.18,'triangle',250);}
 function unlock(){const base=240+index*90;[0,1,2,3].forEach(i=>tone(base*(1+i*.35),i*.13,.2,'sine',base*(1+i*.35)*1.3));tone(90,.3,.5,'triangle',420);}
 const chatter=["That tickles!","I'm a wobble belly!","Please respect my personal fluff.","Hee hee! Not the tens!","My digits are very ticklish.","I trained for this. Mostly naps.","Do I look round in this?","Careful! Those are my number noodles.","I'm security. Very serious. Hee hee.","Fluff inspection passed!","Who ordered the belly wiggles?","My hair has its own postcode.","I'm a lock, not a sock!","Professional noodle at your service.","One more tickle. For science."];
 let chatterBag=[],lastChatter=0;const bubble=document.createElement('p');bubble.id='lock-chatter';bubble.className='lock-chatter';bubble.textContent='My number is ready. Tickle responsibly.';$('snake').before(bubble);
 function chat(){if(Date.now()-lastChatter<800)return;lastChatter=Date.now();if(!chatterBag.length)chatterBag=chatter.map((_,i)=>i).sort(()=>Math.random()-.5);bubble.textContent=chatter[chatterBag.pop()];}
 function tickle(){chat();clearTimeout(tickleTimer);$('snake').classList.remove('tickled');requestAnimationFrame(()=>$('snake').classList.add('tickled'));tickleTimer=setTimeout(()=>$('snake').classList.remove('tickled'),480);giggle();}
 let rewardEpoch=0;
 const fields=[];
 ['Hundreds','Tens','Ones'].forEach((name,i)=>{
  const segment=document.createElement('div');segment.className='digit';
  segment.innerHTML=`<label for="digit-${i}">${name}</label><button type="button" aria-label="Increase ${name.toLowerCase()} digit">▲</button><input id="digit-${i}" type="text" inputmode="numeric" pattern="[0-9]" maxlength="1" value="0" autocomplete="off" aria-describedby="feedback"><button type="button" aria-label="Decrease ${name.toLowerCase()} digit">▼</button>`;
  const input=segment.querySelector('input'),buttons=segment.querySelectorAll('button');fields.push(input);
  function turn(delta){if(solved)return;input.value=String((Number(input.value||0)+delta+10)%10);updateAnswer();tickle();}
  buttons[0].onclick=()=>turn(1);buttons[1].onclick=()=>turn(-1);
  input.oninput=()=>{input.value=input.value.replace(/[^0-9]/g,'').slice(-1);updateAnswer();tickle();};
  input.onkeydown=e=>{if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();turn(e.key==='ArrowUp'?1:-1);}};
  $('digits').append(segment);
 });
 function updateAnswer(){$('answer-number').value=String(Number(fields.map(f=>f.value||'0').join('')));}
 let hintLevel=0;
 function showHelp(level){hintLevel=Math.max(0,Math.min(3,level));const state=M.hintState(hintLevel),q=questions[index];
  $('number-help').hidden=!state.line;
  ['low','mid','high'].forEach(id=>$(id).hidden=!state.benchmarks);
  $('marker').hidden=!state.number;
  $('between').textContent=state.number?q.n+' is marked on the line.':state.benchmarks?'The endpoints are consecutive '+R.place+'s. The middle label is halfway.':'Imagine the two neighbouring '+R.place+'s at the ends of this line.';
  $('line-explanation').textContent=state.benchmarks?'Choose the nearer endpoint. Exactly halfway? Choose the larger number.':'Where might your number belong?';
  $('help').textContent=['Clue 1: show a number line','Clue 2: add benchmarks','Clue 3: place the number','All three clues shown'][hintLevel];
  $('help').disabled=hintLevel===3;$('help').setAttribute('aria-expanded',String(state.line));
 }
 function render(){rewardEpoch++;bubble.textContent="My number is ready. Tickle responsibly.";window.LivingLocks?.show(index+R.lockOffset);const q=questions[index];solved=false;opened=false;$('snake').dataset.lock=String(index);$('snake').classList.remove('accepted');$('target').textContent=q.n;$('lock-number').textContent=`LIVING LOCK ${index+1} / 3`;
  $('feedback').textContent='';fields.forEach((f,i)=>f.value=String(q.n).padStart(3,'0')[i]);updateAnswer();$('answer-form').querySelectorAll('button,input').forEach(el=>el.disabled=false);
  $('next-lock').hidden=true;$('enter').hidden=true;$('help').hidden=false;$('check').hidden=false;
  $('low').textContent=q.low;$('high').textContent=q.high;$('mid').textContent=q.mid;$('marker').textContent=q.n;$('marker').style.setProperty('--position',`${(q.n-q.low)/R.unit*100}%`);
  $('between').textContent=`${q.n} is between ${q.low} and ${q.high}. The midpoint is ${q.mid}.`;
  $('line-explanation').textContent='Choose the closer ten. Exactly halfway? Choose the larger ten.';showHelp(0);
  document.querySelectorAll('.locks li').forEach((li,i)=>{li.classList.toggle('current',i===index);li.classList.toggle('done',i<index);li.querySelector('.lock-state').textContent=i<index?'Unlocked':i===index?'Your turn':'Waiting';});
  $('door-progress').textContent=`${index} / 3 locks tickled into cooperation`;tell(narrations[index]);
 }
 $('answer-form').onsubmit=e=>{e.preventDefault();if(solved)return;const q=questions[index];
  if(fields.some(f=>f.value==='')){$('feedback').textContent='Put one digit in each furry patch. Use 0 for an empty place.';return;}
  if(!M.check($('answer-number').value,q.n,R.unit)){const text='Not quite yet. Try rounding to the nearest '+R.place+' again. You can request the next clue when you need it.';$('feedback').textContent=text;speak(text);tone(180,0,.16,'triangle',130);return;}
  solved=true;unlock();tickle();$('snake').classList.add('accepted');$('answer-form').querySelectorAll('button,input').forEach(el=>el.disabled=true);$('check').hidden=true;
  const explanation=q.n===q.mid?'Exactly halfway, so we choose the larger '+R.place+'.':`${q.answer} is the closer ${R.place}.`;
  $('feedback').textContent=`${q.n} rounds to ${q.answer}. ${explanation} Lock ${index+1} unlocked!`;
  const li=document.querySelectorAll('.locks li')[index];li.classList.remove('current');li.classList.add('done');li.querySelector('.lock-state').textContent='Unlocked';
  $('door-progress').textContent=`${index+1} / 3 locks tickled into cooperation`;
  tell(index===2?'All three locks have agreed to stop being a door. Open the '+R.title+' room. I am sure the label is perfectly normal.':'The lock is delighted. Read your rounded number below. We will be hearing about this in its performance review.');
  const next=$(index===2?'enter':'next-lock'),epoch=rewardEpoch;
  window.LivingLocks.celebrate(still).then(completed=>{if(!completed||epoch!==rewardEpoch)return;next.hidden=false;if(document.getElementById('lock-inspection')?.open)next.focus({preventScroll:true});});
 };
 $('help').onclick=()=>showHelp(hintLevel+1);
 $('next-lock').onclick=()=>{if(!solved||index>=2)return;index++;render();$('question-title').focus();};
 const beeLines=['My word is… COMMUNITY.','C · O · M…','M · U · N…','I · T · Y!','COMMUNITY. A group of people who live, work, or help one another.','“May I have that in a pollen sentence?”'];
 function beeShow(){clearTimeout(beeTimer);let step=0;$('bee-speech').textContent=beeLines[0];
  if(still){$('bee-speech').textContent='C · O · M · M · U · N · I · T · Y. “May I have that in a pollen sentence?”';return;}
  const advance=()=>{step++;if(step>=beeLines.length)return;$('bee-speech').textContent=beeLines[step];tone(180+step*35,0,.2,'triangle',250+step*20);beeTimer=setTimeout(advance,step===4?4500:2100);};beeTimer=setTimeout(advance,2500);
 }
 $('enter').onclick=()=>{if(!solved||index!==2||opened)return;opened=true;WarehouseRooms.complete();$('enter').disabled=true;$('door').classList.add('unlocking');tone(70,0,.65,'triangle',260);tone(570,.3,.3,'sine',130);
  revealTimer=setTimeout(()=>{document.querySelector('.warehouse').hidden=true;$('room').hidden=false;$('summary').textContent=questions.map(q=>`${q.n} → ${q.answer}`).join('   ·   ')+' — all rounded to the nearest '+R.place+'.';tell(R.reveal);$('room-title').focus();if(!window.WarehouseWalk)beeShow();window.WarehouseWalk?.open();},still?0:700);
 };
 function reset(){window.WarehouseWalk?.reset();clearTimeout(revealTimer);clearTimeout(beeTimer);stopVoice();questions=M.questions(Math.random,R.unit);index=0;$('room').hidden=true;document.querySelector('.warehouse').hidden=false;$('enter').disabled=false;$('door').classList.remove('unlocking');render();}
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

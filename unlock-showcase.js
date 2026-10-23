'use strict';
(()=>{
 const $=id=>document.getElementById(id),media=matchMedia('(prefers-reduced-motion: reduce)');let run=null,sound=false,audio=null;
 document.body.classList.toggle('still',media.matches);
 for(const gag of LockGagModel.gags){
  const option=document.createElement('option');option.value=gag.id;option.textContent=gag.title;$('act').append(option);
  const item=document.createElement('li'),button=document.createElement('button');button.type='button';button.innerHTML=gag.title+'<small>'+(gag.duration/1000)+' seconds</small>';button.onclick=()=>{$('act').value=gag.id;play(gag.id);};item.append(button);$('programme').append(item);
 }
 function refresh(){$('motion').textContent=document.body.classList.contains('still')?'Motion OFF':'Motion ON';$('motion').setAttribute('aria-pressed',String(!document.body.classList.contains('still')));}
 function play(id){run?.cancel();run=LockGags.play($('audition'),{id});window.auditionRun=run;$('act').value=run.gag.id;$('act-title').textContent=run.gag.title+' · '+run.gag.duration/1000+' seconds';$('punchline').textContent=run.gag.caption;}
 $('play').onclick=()=>play($('act').value);$('surprise').onclick=()=>play(null);$('finish').onclick=()=>run?.finish();
 $('worm').onchange=()=>{$('audition').dataset.reaction=$('worm').value;play($('act').value);};
 $('motion').onclick=()=>{document.body.classList.toggle('still');if(document.body.classList.contains('still'))run?.finish();refresh();};
 media.addEventListener('change',e=>{document.body.classList.toggle('still',e.matches);if(e.matches)run?.finish();refresh();});
 $('sound').onclick=()=>{sound=!sound;$('sound').textContent=sound?'Sound ON':'Sound OFF';$('sound').setAttribute('aria-pressed',String(sound));if(!sound)audio?.suspend();else audio?.resume();};
 window.RoundGagSound=kind=>{if(!sound)return;try{audio??=new AudioContext();audio.resume().catch(()=>{});const oscillator=audio.createOscillator(),gain=audio.createGain(),t=audio.currentTime;oscillator.type='sine';oscillator.frequency.setValueAtTime(kind==='magic'?1100:kind==='horn'?330:500,t);oscillator.frequency.exponentialRampToValueAtTime(kind==='deflate'?90:kind==='launch'?1500:220,t+.3);gain.gain.setValueAtTime(.06,t);gain.gain.exponentialRampToValueAtTime(.001,t+.35);oscillator.connect(gain);gain.connect(audio.destination);oscillator.start(t);oscillator.stop(t+.36);}catch{}};
 refresh();
})();

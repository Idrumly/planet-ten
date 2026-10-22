'use strict';
window.createBandAid=function(entity,viewport,say){
 const lines=[
  ['Doctor Brass','Welcome to Band Aid. We practise medicine. Mostly scales.','doctor'],
  ['Violet Violin','I have a sprained bow. The doctor says I need plenty of rests.','violin'],
  ['Doctor Brass','One tuning fork, two deep breaths. This may B-flat a little.','doctor'],
  ['Violet Violin','That feels better! Finally, someone who understands my strings.','violin'],
  ['Bongo','I seem to have lost my beat. Has anyone checked under the bed?','drum'],
  ['Doctor Brass','Pulse check. One, two, three, four. A surprisingly catchy diagnosis.','doctor'],
  ['Bongo','There it is! It was hiding in my rhythm section!','drum'],
  ['TEN-BOT','Essential services restored. The community can now recover in harmony. Unfortunately.','all'],
  ['Violet Violin','May I go home? I promise to avoid treble.','violin'],
  ['Doctor Brass','After one more check-up. We have very high standards. And very low notes.','doctor'],
  ['Bongo','My bill says percussion therapy. I thought you said discussion therapy.','drum'],
  ['TEN-BOT','Please remain composed. The hospital is conducting a full investigation.','all']
 ];
 const actors={};
 [['doctor','trumpet-doctor',0,-1790,220,330,'Doctor Brass'],['violin','violin-patient',-290,-1710,210,270,'Violet Violin'],['drum','drum-patient',290,-1710,220,240,'Bongo']].forEach(([id,asset,x,z,w,h,name])=>{
  actors[id]=entity('clinic-resident clinic-'+id,x,z,w,h,'<img src="assets/rounding/'+asset+'-v1.webp" alt=""><span class="resident-label">'+name+'</span><span class="healing-notes" aria-hidden="true">♪ ♫ ♪</span>','Talk to '+name,()=>say(lines.find(l=>l[2]===id)[1]));
 });
 entity('clinic-sign',0,-2070,510,70,'<small>PLANET TEN HARMONIC HEALTH SERVICE</small><strong>BAND AID</strong><span>Please take a rest.</span>').base=380;
 [-390,390].forEach((x,i)=>entity('clinic-monitor',x,-1870,100,140,'<b>'+(i?'RHYTHM':'HARMONY')+'</b><span>⌁ ♫ ⌁</span><small>RECOVERING NICELY</small>'));
 const panel=document.createElement('section');panel.id='clinic-performance';panel.hidden=true;panel.innerHTML='<div class="show-heading"><strong></strong><span>WARD ROUNDS</span></div><p></p><button type="button">Pause ward rounds</button>';viewport.append(panel);
 let index=0,elapsed=0,started=false,paused=false,wasActive=false;
 function perform(){const [speaker,text,actor]=lines[index];panel.querySelector('strong').textContent=speaker;panel.querySelector('p').textContent=text;Object.entries(actors).forEach(([id,obj])=>obj.el.classList.toggle('treating',actor===id||actor==='all'));window.RoundStageSpeak?.(text);if(index===5||index===6)window.RoundBell?.();elapsed=0;}
 panel.querySelector('button').onclick=()=>{paused=!paused;panel.querySelector('button').textContent=paused?'Resume ward rounds':'Pause ward rounds';if(paused)window.RoundStopVoice?.();};
 return {update(dt,inRoom,available){panel.hidden=!inRoom;const active=inRoom&&available&&!paused;viewport.classList.toggle('clinic-paused',!active);if(!active){if(wasActive)window.RoundStopVoice?.();wasActive=false;return;}wasActive=true;if(!started){started=true;perform();}elapsed+=dt;if(elapsed>8&&!window.RoundVoiceBusy?.()){index=(index+1)%lines.length;perform();}},reset(){index=0;elapsed=0;started=false;paused=false;wasActive=false;panel.hidden=true;panel.querySelector('button').textContent='Pause ward rounds';}};
};

'use strict';
window.createBandAid=function(entity,viewport,say){
 const lines=[
  ['Doctor Brass','Nobody panic. I have watched nearly three episodes of Emergency Orchestra.','doctor'],
  ['Fergus Flugelhorn','Doctor! Every time I sneeze, I play jazz!','flugelhorn'],
  ['Doctor Brass','Stay with me, Fergus. Look into my bell. How many valves am I holding up?','doctor'],
  ['Fergus Flugelhorn','Three... no, four! Sorry. That last one was an improvised solo.','flugelhorn'],
  ['TEN-BOT','The patient is blue and covered in fur. Both conditions predate admission.','flugelhorn'],
  ['Doctor Brass','We need a warm blanket and twenty millilitres of smooth jazz. Stat!','doctor'],
  ['Fergus Flugelhorn','Tell my band... I always loved... the dramatic pauses.','flugelhorn'],
  ['Doctor Brass','You have a minor case of the brass sniffles. Your encore is not cancelled.','doctor'],
  ['Perry Piano','Doctor, be honest. Will I ever grin in C major again?','piano'],
  ['Doctor Brass','Three chipped key teeth. Prepare the grand operation. Somebody fetch the tiny tuning wrench!','doctor'],
  ['Perry Piano','I want a second opinion! Preferably in harmony with the first.','piano'],
  ['Violet Violin','As a fellow patient, I suggest you stop grinding your scales at night.','violin'],
  ['Perry Piano','They said the procedure was keyhole surgery. I appear to have several.','piano'],
  ['Doctor Brass','Open wide. Say Aaaaa minor. Excellent. Now hold that note.','doctor'],
  ['Perry Piano','Aaaaa minor! Is my smile supposed to have a rest in the middle?','piano'],
  ['TEN-BOT','Dental records updated. The patient has been advised to floss between movements.','piano'],
  ['Bongo','Doctor! I have lost my beat again!','drum'],
  ['Doctor Brass','Clear the ward! I need a count-in! One, two, three, FOUR!','doctor'],
  ['Bongo','I have a pulse! I HAVE A PULSE! And it is surprisingly danceable!','drum'],
  ['Violet Violin','My bow is sprained. Can I have something for the strings?','violin'],
  ['Doctor Brass','Plenty of rests. No heavy symphonies for a week.','doctor'],
  ['Fergus Flugelhorn','I am cured! HONK! Mostly cured. HONK! Emotionally cured.','flugelhorn'],
  ['Perry Piano','Can somebody bring my dinner? Nothing too sharp.','piano'],
  ['TEN-BOT','Another life saved by musical medicine. The paperwork is in triplets.','all']
 ];
 const actors={};
 const cast=[['doctor','trumpet-doctor',0,-1900,190,310,'Doctor Brass'],['violin','violin-patient',-335,-1750,130,200,'Violet Violin'],['drum','drum-patient',365,-1750,140,175,'Bongo'],['flugelhorn','flugelhorn-patient',-175,-1710,210,265,'Fergus Flugelhorn'],['piano','piano-patient',175,-1710,210,265,'Perry Piano']];
 const chatterCount={};
 cast.forEach(([id,asset,x,z,w,h,name])=>{
  const bed=id==='flugelhorn'||id==='piano';
  const furniture=bed?'<span class="patient-bed" aria-hidden="true"><i class="bed-pillow"></i><i class="bed-rail"></i><i class="bed-wheel"></i><i class="bed-wheel"></i></span>':id==='violin'||id==='drum'?'<span class="hover-podium" aria-hidden="true"></span>':'';
  actors[id]=entity('clinic-resident clinic-'+id+(bed?' bed-patient':''),x,z,w,h,furniture+'<img src="assets/rounding/'+asset+'-v1.webp" alt=""><span class="resident-label">'+name+'</span><span class="healing-notes" aria-hidden="true">♪ ♫ ♪</span><span class="patient-exclamation" aria-hidden="true">'+(id==='flugelhorn'?'HONK!':id==='piano'?'A♭... aaah!':id==='drum'?'BA-DUM!':'♪')+'</span>','Talk to '+name,()=>{const replies=lines.filter(l=>l[0]===name);say(replies[(chatterCount[id]||0)%replies.length][1]);chatterCount[id]=(chatterCount[id]||0)+1;});
  if(id==='violin'||id==='drum')actors[id].base=40;
 });
 entity('clinic-sign',0,-2070,510,70,'<small>PLANET TEN HARMONIC HEALTH SERVICE</small><strong>BAND AID</strong><span>Please take a rest.</span>').base=380;
 [-390,390].forEach((x,i)=>entity('clinic-monitor',x,-1870,100,140,'<b>'+(i?'RHYTHM':'HARMONY')+'</b><span>⌁ ♫ ⌁</span><small>RECOVERING NICELY</small>'));
 const panel=document.createElement('section');panel.id='clinic-performance';panel.hidden=true;panel.innerHTML='<div class="show-heading"><strong></strong><span>WARD ROUNDS</span></div><p></p><div class="ward-controls"><button type="button" class="ward-pause">Pause ward rounds</button><button type="button" class="ward-next">Next scene →</button></div>';viewport.append(panel);
 let index=0,elapsed=0,started=false,paused=false,wasActive=false;
 function perform(){const [speaker,text,actor]=lines[index];panel.querySelector('strong').textContent=speaker;panel.querySelector('p').textContent=text;Object.entries(actors).forEach(([id,obj])=>obj.el.classList.toggle('treating',actor===id||actor==='all'));window.RoundStageSpeak?.(text);if(lines[index][0]==='Bongo')window.RoundBell?.();elapsed=0;}
 panel.querySelector('.ward-pause').onclick=()=>{paused=!paused;panel.querySelector('button').textContent=paused?'Resume ward rounds':'Pause ward rounds';if(paused)window.RoundStopVoice?.();};
 panel.querySelector('.ward-next').onclick=()=>{index=(index+1)%lines.length;started=true;perform();if(paused)window.RoundStopVoice?.();};
 return {update(dt,inRoom,available){panel.hidden=!inRoom;const active=inRoom&&available&&!paused;viewport.classList.toggle('clinic-paused',!active);if(!active){if(wasActive)window.RoundStopVoice?.();wasActive=false;return;}wasActive=true;if(!started){started=true;perform();}elapsed+=dt;if(elapsed>8&&!window.RoundVoiceBusy?.()){index=(index+1)%lines.length;perform();}},reset(){index=0;elapsed=0;started=false;paused=false;wasActive=false;panel.hidden=true;panel.querySelector('button').textContent='Pause ward rounds';}};
};

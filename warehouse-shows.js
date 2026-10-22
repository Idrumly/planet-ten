'use strict';
const WarehouseShows={
 board:{title:'Board Room',cast:['Rolland','Shred','Duke Surf'],lines:[
  [0,'I move that we get this party rolling.','dance'],[1,'Seconded. I brought my best board shorts.','dance'],[2,'The minutes will record that this meeting is totally tubular.','wave'],
  [-1,'The board has reached a unanimous decision. Nobody knows what it was.','dance'],[0,'First item: an emergency kickflip. All in favour?','jump'],[1,'Aye! Though I prefer a cool, measured approach.','spin'],
  [2,'I have a wave of new ideas. Mostly waves.','wave'],[0,'Please stop tabling the motion. I just waxed the table.','dance'],[1,'We need more chairpersons. These chairs have no rhythm.','dance'],
  [2,'Motion carried! All the way across the dance floor!','wave'],[-1,'Productivity has increased by four cartwheels. Finance is struggling to convert that.','dance'],[0,'Meeting adjourned. Party permanently in session.','jump']
 ]},
 brain:{title:'Brainstorming Department',cast:['Drizzle'],lines:[
  [0,'I was told to bring one good idea. I brought an umbrella instead.','rain'],[-1,'Current forecast: scattered thoughts with a chance of genius.','rain'],[0,'Ah. A brain drop. That explains the headaches in the budget.','drip'],
  [0,'I have a brilliant idea! We should move the meeting indoors.','rumble'],[-1,'You are indoors. Facilities has been notified. Again.','rain'],[0,'There is a hole in my umbrella. My plan has a hole in it too.','drip'],
  [0,'Wait! What if we collected the thoughts in a bucket?','idea'],[-1,'Approved. The bucket committee will meet after the downpour.','rain'],[0,'That big one was a thunderthought. I nearly understood it.','rumble'],
  [0,'I would think outside the box, but it is raining out there as well.','drip'],[-1,'Innovation target achieved. One damp employee, several fresh ideas.','idea'],[0,'Same time tomorrow? I will bring a bigger umbrella.','rain']
 ]},
 court:{title:'Food Court',cast:['Justice Bun','Frank Fries','Deputy Fizz'],lines:[
  [2,'All rise! The honourable Justice Bun is now in sesame.','rise'],[0,'Order in the court! And a small order of fries.','gavel'],[1,'Your Honour, I am already here.','witness'],
  [0,'You stand accused of being a little too salty. How do you plead?','gavel'],[1,'Lightly seasoned, Your Honour!','witness'],[2,'Exhibit A: one suspiciously empty ketchup bottle.','evidence'],
  [1,'Objection! That evidence has been squeezed!','witness'],[0,'Sustained. We will not relish unreliable testimony.','gavel'],[-1,'The jury has requested lunch. This creates a complicated conflict of interest.','rise'],
  [2,'The taco juror has folded under pressure.','evidence'],[0,'Verdict: deliciously innocent. Case closed. Kitchen open.','verdict'],[1,'Thank you! I knew justice would be served with a side of me.','verdict']
 ]},
 shoe:{title:'Shoe Box',cast:['Dash','Lady Heel','Referee Boot'],lines:[
  [2,'Welcome to the Shoe Box. Keep it friendly. No stepping on toes.','bell'],[0,'I have been training all week. Mostly running away from laundry.','shuffle'],[1,'I shall win with grace, elegance, and a very good heel turn.','heel'],
  [2,'Round one! Touch gloves. Mind the laces.','spar'],[0,'Behold my fancy footwork! It is literally all I have.','shuffle'],[1,'I see your footwork and raise you several centimetres.','heel'],
  [-1,'Athletic excellence. Neither contestant has remembered which foot they are.','spar'],[0,'Time out! My tongue is tied.','rest'],[2,'That is a shoelace. Still, a valid concern.','bell'],
  [1,'Let us call it a draw. We make a rather striking pair.','bow'],[0,'Agreed. Sole mates?','bow'],[2,'A sporting finish! Please applaud with your hands. The shoes are busy.','bell']
 ]}
};
if(typeof module!=='undefined')module.exports=WarehouseShows;
if(typeof window!=='undefined')window.createWarehouseShow=function(room,entity,viewport,say,comic){
 const data=WarehouseShows[room.id],actors=[],counts={};viewport.dataset.show=room.id;
 data.cast.forEach((name,i)=>{
  const single=room.id==='brain',x=single?0:[-225,0,225][i],z=single?-1780:-1850;
  const obj=entity('pun-resident cast-'+room.id+' actor-'+i,x,z,single?330:210,single?355:295,'<img src="assets/rounding/'+room.id+'-actor-'+i+'-v1.webp" alt=""><span class="resident-label">'+name+'</span>','Talk to '+name,()=>{const lines=data.lines.filter(l=>l[0]===i);say(lines[(counts[i]||0)%lines.length][1]);counts[i]=(counts[i]||0)+1;});actors.push(obj);
 });
 entity('clinic-sign',0,-2080,490,70,'<small>PLANET TEN CIVIC SERVICES</small><strong>'+data.title.toUpperCase()+'</strong><span>Highly necessary. Officially.</span>').base=390;
 if(room.id==='board')entity('disco-orb',0,-2000,70,70,'<span>✦</span>').base=300;
 if(room.id==='brain'){
  const drops=Array.from({length:12},(_,i)=>'<i class="brain-drop" style="--i:'+i+'">🧠</i>').join('');
  entity('thought-weather',0,-1760,460,390,'<span class="thought-cloud">☁</span><span class="thought-bolt">ϟ</span>'+drops).base=80;
 }
 if(room.id==='court')entity('court-bench',-225,-1870,240,85,'<span>⚖</span>');
 if(room.id==='shoe')entity('ring-front',0,-1960,700,80,'<i></i><i></i><i></i>');
 const controls=document.createElement('section');controls.id='pun-performance';controls.hidden=true;controls.innerHTML='<button class="pun-pause">Pause scene</button><button class="pun-next">Next scene →</button><button class="pun-hear">Hear line</button>';viewport.append(controls);
 let index=0,elapsed=0,started=false,paused=false,wasActive=false;
 function perform(){const [actor,text,action]=data.lines[index];viewport.dataset.action=action;comic.show(actor<0?'TEN-BOT':data.cast[actor],text,actors[actor]?.el);actors.forEach((obj,i)=>obj.el.classList.toggle('speaking',i===actor));if(!paused)window.RoundRoomSound?.(room.id,action);elapsed=0;}
 controls.querySelector('.pun-pause').onclick=()=>{paused=!paused;controls.querySelector('.pun-pause').textContent=paused?'Resume scene':'Pause scene';if(paused)window.RoundStopVoice?.();};
 controls.querySelector('.pun-next').onclick=()=>{index=(index+1)%data.lines.length;started=true;perform();if(paused)window.RoundStopVoice?.();};
 controls.querySelector('.pun-hear').onclick=()=>comic.replay();
 return {update(dt,inRoom,available){controls.hidden=!inRoom;const active=inRoom&&available&&!paused;viewport.classList.toggle('pun-paused',!active);if(!active){if(wasActive)window.RoundStopVoice?.();wasActive=false;return;}wasActive=true;if(!started){started=true;perform();}if(comic.holding())return;elapsed+=dt;if(elapsed>Math.max(7,data.lines[index][1].length*.07)&&!window.RoundVoiceBusy?.()){index=(index+1)%data.lines.length;perform();}},reset(){index=0;elapsed=0;started=false;paused=false;wasActive=false;controls.hidden=true;controls.querySelector('.pun-pause').textContent='Pause scene';}};
};

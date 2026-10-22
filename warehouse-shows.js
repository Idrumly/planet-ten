'use strict';
const WarehouseShows={
 bull:{title:'Bulldozer Garage',cast:['Sir Snores','Cowpoke Nebula','Daisy Dozer'],lines:[
  [1,'Shhh! Keep your boots quiet, partner. The bulls are dozing.','hush'],[0,'Mmmmooo... zzz... five more moons...','sleep'],
  [1,'Welcome to the bulldozer garage. We park the bulls here until their naps are finished.','hush'],[2,'Snrrrk... do not tow me...','sleep'],
  [1,'That one dreams of stampeding. So far he has only stamped his pillow.','hush'],[0,'Moo... soft grass... extra soft...','sleep'],
  [1,'No engines in here. That rumble is entirely nasal.','hush'],[2,'Zzz... put it in snooze gear...','sleep'],
  [1,'Please whisper. If they wake up, I have to read the whole bedtime manual again.','hush'],[-1,'Garage inspection complete. Two bulls, zero productivity, excellent pillow coverage.','sleep'],
  [1,'Mind the horns. They are parked, but they have a wide turning circle.','hush'],[1,'Tiptoe on through, partner. Let sleeping bulls doze.','hush']
 ]},
 coffee:{title:'Coffee Shop',cast:['Mr. Martian'],lines:[
  [0,'Ahh. Hot burnt bean juice. Earthlings have such peculiar refreshment rituals.','sip'],
  [0,'Technically these beans are seeds inside coffee cherries. You harvest a fruit to drink its luggage.','explain'],
  [0,'You remove the fruit and dry the seeds. The order depends on the processing method. A very organised undressing.','explain'],
  [0,'Then you roast the green seeds until they turn brown and develop those wonderful aromas.','explain'],
  [0,'Burnt bean juice is my nickname. Roasting is controlled heating; properly roasted coffee need not be burned.','sip'],
  [0,'Next you grind the roasted seeds into little particles. A fragrant geological disaster.','explain'],
  [0,'Smaller pieces give the water more exposed surface to work on. The seed has become a very accessible rubble pile.','explain'],
  [0,'For this filter coffee, hot water passes through the grounds and dissolves soluble flavour compounds.','explain'],
  [0,'The filter holds back most of the solid grounds. I drink the extraction, not the crunchy evidence.','sip'],
  [0,'Water temperature, grind size and contact time all affect extraction. Even bean bathing has engineering standards.','explain'],
  [0,'Espresso uses pressure to push hot water through finely ground coffee. A tiny, intense seed interrogation.','explain'],
  [0,'Fruit seeds. Roasted. Crushed. Extracted. Served in a cup. Oddly elaborate. Delightfully aromatic.','sip']
 ]},
 butter:{title:'Butterflies Feeding',cast:['Baron Buzz','Lady Bristle','Sir Slurp'],lines:[
  [0,'Welcome to dinner. I ordered the butter. With a side of butter.','dine'],[1,'An exquisite brick. The chef has captured the very essence of rectangle.','dine'],
  [2,'Would anyone care for bread? No? Excellent. More room for butter.','dine'],[-1,'Butterflies feeding. The signage department has once again declined to add a space.','dine'],
  [0,'Please admire my table manners. All six elbows are off the table. Mostly.','dine'],[1,'This vintage has delicate notes of dairy and absolutely no ambition to be a vegetable.','dine'],
  [2,'My compliments to the cow. And to whoever cut the corners so precisely.','dine'],[0,'Waiter! There is a fly in my butter. Oh. That is me. Carry on.','dine'],
  [1,'A napkin for every leg, please. Fine dining is terribly demanding.','dine'],[2,'I shall have dessert. Something light. A smaller brick of butter.','dine'],
  [-1,'Final inspection passed. Your rounding opened every room. The dinner bill is somebody else’s problem.','dine'],[0,'To our brilliant guest! You rounded beautifully. We will try not to land on your certificate.','dine']
 ]},
 vacuum:{title:'Vacuum Cleaner Storage',cast:['Lintley','Polly Polish','Dustbert','Hosey','Flossie','Squeegee','Snorkel','Buff'],lines:[
  [0,'Please let us out! Your vacuum cleaners need cleaning! We can hear their filters from here.','plead'],
  [1,'I will polish your vacuum until it can see its own worried little reflection. Please?','plead'],
  [2,'Let me at that dust bag! I have trained my whole life for this extremely specific moment.','plead'],
  [3,'Please take me home! I can untangle a vacuum hose without getting emotionally attached.','plead'],
  [4,'I am polishing our one practice vacuum. Please let me out to clean yours next!','polish'],
  [5,'Four hands. Four brushes. One magnificent obsession. Please let me clean your vacuum!','plead'],
  [6,'I can reach right inside the hose. Please! I have been practising on a macaroni.','plead'],
  [7,'Let us out! Even your little handheld vacuum deserves a tiny spa day!','plead'],
  [-1,'Vacuum cleaner storage. Storage for the cleaners of vacuums. The label is technically accurate.','wait'],
  [0,'We promise to bring your vacuum back cleaner than the floor it was supposed to clean!','plead'],
  [2,'You opened the door! We have our brushes packed. Please say you brought a vacuum!','plead'],
  [7,'All eight of us are ready! Please, please, PLEASE let us clean your vacuums!','plead']
 ]},
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
  const single=room.id==='brain'||room.id==='coffee',vacuum=room.id==='vacuum',bull=room.id==='bull',diner=room.id==='butter',x=vacuum?[-270,-90,90,270][i%4]:single?0:[-245,0,245][i],z=vacuum?(i<4?-1990:-1720):single?-1780:bull&&i===1?-1750:-1850;
  const obj=entity('pun-resident cast-'+room.id+' actor-'+i,x,z,vacuum?155:single?370:bull&&i!==1?270:diner?245:210,vacuum?205:single?355:bull&&i!==1?230:diner?310:295,'<img src="assets/rounding/'+room.id+'-actor-'+i+'-v1.webp" alt=""><span class="resident-label">'+name+'</span>','Talk to '+name,()=>{const lines=data.lines.filter(l=>l[0]===i);say(lines[(counts[i]||0)%lines.length][1]);counts[i]=(counts[i]||0)+1;});if(vacuum&&i<4)obj.base=155;actors.push(obj);
 });
 entity('clinic-sign',0,-2080,490,70,'<small>PLANET TEN CIVIC SERVICES</small><strong>'+data.title.toUpperCase()+'</strong><span>Highly necessary. Officially.</span>').base=390;
 if(room.id==='vacuum'){
  entity('vacuum-riser',0,-2000,720,155,'<span>VACUUM CARE CREW · PLEASE LET US OUT!</span>');
  entity('vacuum-worktable',-270,-1670,170,125,'<img src="assets/rounding/vacuum-table-v1.webp" alt="One practice vacuum on a table, being polished by Flossie">');
 }
 if(room.id==='bull')[-245,245].forEach(x=>{entity('dozing-letters',x,-1840,70,55,'<span>Z z z</span>').base=235;});
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

'use strict';
(()=>{
 const descriptions=[
  'The Cloudbun chases the Hairy Leg Reflex Machine. It drops its hammer and flees on tiptoe.',
  'The Slobber Slug leaves a slippery trail. The dust bunnies pull their skidding vacuum along on its own leashes.',
  'The Pocket Puffalo enters the stationary elevator. The whole building moves to deliver one tiny snack.',
  'Mamma Toaster gives the Jellyjaw a slice of toast. Her baby toasters bounce in outrage.',
  'The Moonkit becomes two living pompoms. The Zargon cheerleader jumps and does the splits. The pompoms keep waving after she stops.',
  'A glass dome protects Mr. Martian’s coffee. The Mucus Mite politely polishes the outside.',
  'The Tiny Star Otter conducts a parade of the hairy-legged machine, the dust-bunny vacuum and the Frankenfruit monster.'
 ];
 const originalPrinter=$('machine').innerHTML;
 const metal='<defs><linearGradient id="hundred-metal" x2=".8" y2="1"><stop stop-color="#d8f8e9"/><stop offset=".5" stop-color="#799ab8"/><stop offset="1" stop-color="#3a5378"/></linearGradient></defs>';
 // Guest artwork uses its own IDs and no workshop CSS, so it cannot alter another level.
 function guestArt(markup,prefix){
  return markup.replace(/\sclass="([^"]*)"/g,' data-art-class="$1"').replace(/\sstyle="[^"]*"/g,'')
   .replace(/id="([^"]+)"/g,(_,name)=>`id="${prefix}-${name}" data-part="${name}"`)
   .replace(/url\(#([^)]+)\)/g,`url(#${prefix}-$1)`)
   .replace(/aria-labelledby="[^"]*"/g,'');
 }
 function workshop(kind,prefix='guest'){return guestArt(metal+machineArt(kind),prefix);}
 const actor=(id,art,x,y,scale=1)=>`<g transform="translate(${x} ${y}) scale(${scale})"><g id="fx-${id}">${art}</g></g>`;
 const snack='<path d="M-17-9q17-25 34 0l-5 20h-24Z" fill="#ffd280" stroke="#795571" stroke-width="3"/><circle cx="-5" cy="-3" r="3" fill="#bf7c91"/><circle cx="7" cy="4" r="3" fill="#bf7c91"/>';
 const pom=()=>`<g>${Array.from({length:18},(_,i)=>`<path d="M0 0Q${Math.cos(i)*30} ${Math.sin(i)*30} ${Math.cos(i)*61} ${Math.sin(i)*55}" fill="none" stroke="${i%2?'#c3edff':'#e8bbf2'}" stroke-width="8" stroke-linecap="round"/>`).join('')}<circle r="28" fill="#bddeef"/><path d="M-21-13l-5-24 23 15m8 0 23-15-5 24" fill="#bddeef"/><g fill="#263c58"><ellipse cx="-11" cy="-3" rx="5" ry="8"/><ellipse cx="11" cy="-3" rx="5" ry="8"/></g><path d="M-8 12q8 9 16 0" stroke="#835c87" stroke-width="3" fill="none"/></g>`;
 function build(index){
  $('farm-crossover')?.remove();$('world').classList.add('farm-crossover');
  const animal=creatureArt(index,!!FarmContracts.seeds[index][3]);
  let props='',guest='';
  if(index===0)guest=actor('guest',guestArt(originalPrinter,'guest'),330,70,.82);
  if(index===1){guest=actor('guest',workshop('vacuum'),350,140,.8);props='<path id="fx-slime" d="M160 469Q430 442 880 471" fill="none" stroke="#b2e887" stroke-width="24" stroke-linecap="round" opacity="0"/>';}
  if(index===2){guest=actor('guest',workshop('elevator'),330,85,.86);props=actor('snack',snack,660,350,.8);}
  if(index===3){guest=actor('guest',guestArt($('toaster-machine').innerHTML,'guest'),330,50,.76);props=actor('toast',snack,590,275,2.4);}
  if(index===4){guest=actor('guest',workshop('cheerleader'),280,35,.92);props=actor('pom-left',pom(),460,305,.7)+actor('pom-right',pom(),810,305,.7);}
  if(index===5){guest=actor('guest',workshop('coffee'),335,35,.9);props='<g id="fx-dome" opacity="0"><path d="M520 425V240a150 150 0 0 1 300 0v185Z" fill="#b4ffff" fill-opacity=".2" stroke="#dcffff" stroke-width="7"/><path d="M545 310v-65q0-70 65-95" fill="none" stroke="#efffff" stroke-width="9" stroke-linecap="round"/><path d="M505 430h330" stroke="#6be0e1" stroke-width="16" stroke-linecap="round"/></g><g id="fx-sparkle" opacity="0" fill="none" stroke="#edffff" stroke-width="5"><path d="M555 270v40m-20-20h40m210 40v30m-15-15h30"/></g>';}
  if(index===6){guest=actor('march-printer',guestArt(originalPrinter,'parade'),90,185,.57)+actor('march-vacuum',workshop('vacuum','parade-vac'),310,265,.48)+actor('march-fruit',workshop('blender','parade-fruit'),590,240,.62);props='<g id="fx-baton" stroke="#ffe49c" stroke-width="8" stroke-linecap="round" style="transform-origin:175px 415px"><path d="M175 415l60-70"/><circle cx="235" cy="345" r="9" fill="#c5ffea"/></g>';}
  const animalX=index===6?145:165,animalY=425;
  document.querySelector('.machine-area').insertAdjacentHTML('beforeend',`<svg id="farm-crossover" viewBox="0 0 1000 570" role="img" aria-labelledby="fx-title fx-desc"><title id="fx-title">${FarmContracts.seeds[index][6]} meets the machines</title><desc id="fx-desc">${descriptions[index]}</desc><ellipse cx="515" cy="475" rx="440" ry="28" fill="#103e5055"/>${index===1?props:''}${guest}${actor('animal',animal,animalX,animalY,.7)}${index===1?'':props}</svg>`);
  const root=$('farm-crossover');
  const show=part=>root.querySelectorAll(`[data-part="${part}"]`).forEach(el=>el.style.opacity=1);
  const hide=part=>root.querySelectorAll(`[data-part="${part}"]`).forEach(el=>el.style.opacity=0);
  ['legs','dust-0','dust-1','dust-leashes','zargon-head','zargon-tentacles','mamma-mouth','coffee-fill','coffee-steam','fruit-monster'].forEach(show);
  // Classes stripped from imported artwork: expose only the finished parts we need.
  root.querySelectorAll('[data-art-class="hammer"],[data-art-class="vacuum-arm"],[data-art-class="impact"]').forEach(el=>el.style.opacity=0);
  hide('alien-bread');hide('coffee-beans');hide('blender-fruit');hide('elevator-doors');
  if(index===2)$('fx-snack').style.opacity=0;
  if(index===4){$('fx-pom-left').style.opacity=0;$('fx-pom-right').style.opacity=0;}
  if(index===6){const fruit=root.querySelector('[data-part="fruit-monster"]').outerHTML;root.querySelector('#fx-march-fruit').innerHTML=fruit;}
  return root;
 }
 async function play(id,index){
  guard(id);const root=build(index),el=name=>root.querySelector(name.startsWith('@')?`[data-part="${name.slice(1)}"]`:'#fx-'+name);
  const act=(name,frames,ms=900,options)=>step(id,el(name),frames,ms,options);
  const move=(name,points,ms,options)=>act(name,points.map(([x,y=0,angle=0])=>({transform:`translate(${x}px,${y}px) rotate(${angle}deg)`})),ms,options);
  const appear=name=>act(name,[{opacity:0},{opacity:1}],350);
  const bounce=(name,height=20,times=3)=>move(name,[[0,0],[0,-height],[0,0]],480,{iterations:times});
  // A brief arrival leaves time to recognize the returning invention.
  await act('animal',[{opacity:0},{opacity:1}],400);beep('tap');
  switch(index){
   case 0:
    await move('@floor-hammer',[[0,-100],[0,0]],550);beep('step');
    await Promise.all([move('guest',[[0,0],[180,-18],[80,0],[-100,-18],[0,0]],5600),move('animal',[[0,0],[350,-35],[480,0],[180,-35],[350,0]],5600),...['left-leg','right-leg'].map((name,i)=>{const leg=root.querySelector(`[data-part="legs"] > g:nth-child(${i+1})`);leg.style.transformOrigin=i?'380px 280px':'240px 280px';return step(id,leg,[{transform:'rotate(-12deg)'},{transform:'rotate(14deg)'},{transform:'rotate(-12deg)'}],470,{iterations:12});})]);
    break;
   case 1:
    await appear('slime');await move('animal',[[0,0],[250,-4],[470,0]],1600);
    await Promise.all([move('guest',[[0,0],[-70,0,6],[50,0,-5],[110,0,0]],3000),bounce('@dust-0',24,6),bounce('@dust-1',18,6)]);
    break;
   case 2:
    await move('animal',[[0,0],[700,-10]],1900);
    await act('animal',[{opacity:1},{opacity:.35}],350);
    await move('@moving-building',[[0,0],[0,-150],[0,30],[0,-90]],3000);
    await appear('snack');await move('snack',[[0,0],[-8,90]],1100);beep('win');
    await act('animal',[{opacity:.35},{opacity:1}],350);await move('animal',[[700,-10],[700,-25],[700,-10]],480,{iterations:2});
    break;
   case 3:
    await move('animal',[[0,0],[240,0]],1100);
    await move('toast',[[0,0],[-50,-45],[-107,65]],1500);
    await act('toast',[{opacity:1,transform:'translate(-107px,65px) scale(1)'},{opacity:0,transform:'translate(-107px,65px) scale(.1)'}],500);beep('tap');
    await Promise.all([move('animal',[[240,0],[240,-18],[240,0]],480,{iterations:4}),...['@baby-0','@baby-1','@baby-2'].map(name=>bounce(name,35,4))]);
    break;
   case 4:
    await move('animal',[[0,0],[620,-130]],1600);
    await act('animal',[{opacity:1,transform:'translate(620px,-130px) scale(1)'},{opacity:0,transform:'translate(620px,-130px) scale(.1)'}],500);
    await Promise.all([appear('pom-left'),appear('pom-right')]);beep('join');
    await Promise.all([bounce('guest',80,2),move('pom-left',[[0,0],[-30,-100],[0,0]],960,{iterations:2}),move('pom-right',[[0,0],[30,-100],[0,0]],960,{iterations:2})]);
    await Promise.all(Array.from({length:8},(_,i)=>act('@tentacle-'+i,[{transform:'rotate(0)',transformOrigin:(330+i*15)+'px 323px'},{transform:`rotate(${i<4?55:-55}deg)`,transformOrigin:(330+i*15)+'px 323px'}],850)));
    await Promise.all([move('pom-left',[[0,0,-15],[0,-15,15],[0,0,-15]],600,{iterations:4}),move('pom-right',[[0,0,15],[0,-15,-15],[0,0,15]],600,{iterations:4})]);
    break;
   case 5:
    await move('animal',[[0,0],[470,-60]],1500);
    await act('dome',[{opacity:0,transform:'translateY(-230px)'},{opacity:1,transform:'translateY(0)'}],500);beep('tap');
    await move('animal',[[470,-60],[380,0],[470,-30],[440,-80],[470,-30],[440,-80],[470,-30]],2700);
    await appear('sparkle');await move('animal',[[470,-30],[470,-39],[470,-30]],480,{iterations:2});
    break;
   case 6:
    await Promise.all([move('baton',[[0,0,-10],[0,0,12],[0,0,-10]],600,{iterations:8}),...['march-printer','march-vacuum','march-fruit'].map((name,i)=>move(name,[[0,0],[-110,-12],[0,0],[60,-12],[0,0]],4800+200*i)),bounce('animal',12,10)]);
    break;
  }
  guard(id);$('garden-desc').textContent=descriptions[index];return descriptions[index];
 }
 const replay=document.createElement('button');replay.id='farm-replay';replay.textContent='Watch them again';replay.hidden=true;$('completion').querySelector('div').append(replay);
 function clear(){$('farm-crossover')?.remove();$('world').classList.remove('farm-crossover');replay.hidden=true;}
 replay.onclick=async()=>{
  if(busy||!complete||!isFarm())return;
  window.PlanetVoice?.stop();stopReward();const id=rewardEpoch;busy=true;rewardRunning=true;$('completion').hidden=true;$('world').classList.add('cutscene');$('pause-machine').hidden=false;render();
  try{await play(id,contract.seedIndex);guard(id);busy=false;rewardRunning=false;machinePaused=false;$('pause-machine').hidden=true;$('pause-machine').textContent='Pause machine';$('pause-machine').setAttribute('aria-pressed','false');$('world').classList.remove('cutscene');render();$('completion').hidden=false;replay.focus({preventScroll:true});}catch(e){if(e!==STOP)throw e;}
 };
 window.FarmCrossovers={play,clear,descriptions,completed(){replay.hidden=false;}};
})();

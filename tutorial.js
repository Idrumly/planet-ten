'use strict';
const $ = id => document.getElementById(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let quietMotion = reduced.matches, sound = false, audio, split = false, busy = false;
function updateMotion(){document.documentElement.classList.toggle('still',quietMotion);$('motion').textContent=quietMotion?'Motion off':'Motion on';$('motion').setAttribute('aria-pressed',String(quietMotion));}
updateMotion();
reduced.addEventListener('change',e=>{quietMotion=e.matches;updateMotion();});
$('motion').onclick=()=>{quietMotion=!quietMotion;updateMotion();};
$('sound').onclick=()=>{sound=!sound;$('sound').textContent=sound?'Sound on':'Sound off';$('sound').setAttribute('aria-pressed',String(sound));tone(true);};
function tone(join){if(!sound)return;try{audio ||= new (window.AudioContext||window.webkitAudioContext)();audio.resume().catch(()=>{});const osc=audio.createOscillator(),gain=audio.createGain(),now=audio.currentTime;osc.type='sine';osc.frequency.setValueAtTime(join?160:560,now);osc.frequency.exponentialRampToValueAtTime(join?660:120,now+.4);gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.07,now+.04);gain.gain.exponentialRampToValueAtTime(.001,now+.5);osc.connect(gain).connect(audio.destination);osc.start(now);osc.stop(now+.52);}catch{sound=false;$('sound').textContent='Sound unavailable';$('sound').setAttribute('aria-pressed','false');}}
function jelly(){const cell=document.createElement('span');cell.className='jelly';cell.innerHTML='<i></i>';return cell;}
for(let i=0;i<10;i++){const c=jelly();c.style.setProperty('--ripple',i);$('demo').append(c);}
function positionDemo(){[...$('demo').children].forEach((cell,i)=>{const x=split?12+(i%5)*57:10+i*28;const y=split?28+Math.floor(i/5)*65+(i%2)*6:58;cell.style.transform=`translate(${x}px,${y}px) rotate(${split?(i%3-1)*8:0}deg)`;});}
positionDemo();
async function exchange(next){if(busy||split===next)return;busy=true;$('demo').classList.remove('coalescing');split=next;$('split').disabled=true;$('join').disabled=true;$('tool-hint').textContent=split?'1 ten becomes 10 ones. The value stays 10.':'10 ones become 1 ten. The value stays 10.';positionDemo();tone(!split);$('exchange-sfx').textContent=split?'PLOOP!':'SCHLOOP!';$('exchange-sfx').classList.remove('pop');void $('exchange-sfx').offsetWidth;$('exchange-sfx').classList.add('pop');await new Promise(r=>setTimeout(r,quietMotion?0:1050));if(!split){$('demo').classList.add('coalescing');tone(true);}$('representation').innerHTML=split?'10 ones <span>· 10 blocks</span>':'1 ten <span>· 1 block</span>';$('demo').setAttribute('aria-label',split?'Ten separate ones':'One ten made of ten connected glow cells');$('split').disabled=split;$('join').disabled=!split;busy=false;}
$('split').onclick=()=>exchange(true);$('join').onclick=()=>exchange(false);
let pokes=0;$('wobble').onclick=()=>{const cell=$('wobble').querySelector('.jelly');cell.classList.remove('wobbling');void cell.offsetWidth;cell.classList.add('wobbling');$('wobble-caption').textContent=['Wobble tested. Ready for work.','Mr. Martian: “Yes, that is technically science.”','Still one cell. Just a wobblier one.'][pokes++%3];tone(false);};

$('start').onclick=()=>{location.href='world.html';};

let page=0;
const frames=[...document.querySelectorAll('.frame')];
function showPage(next){page=Math.max(0,Math.min(frames.length-1,next));frames.forEach((frame,i)=>{frame.hidden=i!==page;frame.classList.toggle('active',i===page);});$('chapter-name').textContent=frames[page].dataset.chapter;$('page-count').textContent=`${page+1} / ${frames.length}`;$('previous').disabled=page===0;$('next').hidden=page===frames.length-1;document.querySelectorAll('.dots i').forEach((dot,i)=>dot.classList.toggle('current',i===page));document.querySelector('.dots').setAttribute('aria-label',`Page ${page+1} of ${frames.length}`);frames[page].querySelector('h1').focus({preventScroll:true});}
$('next').onclick=()=>showPage(page+1);$('previous').onclick=()=>showPage(page-1);
let greetings=0;$('greet').onclick=()=>{$('hello').textContent=['“All hands on deck!”','“Four arms. Still only one head.”','“Ready, apprentice?”'][greetings++%3];tone(true);};
let hoverFrame=0;$('story').addEventListener('pointermove',e=>{if(quietMotion||e.pointerType==='touch'||hoverFrame)return;hoverFrame=requestAnimationFrame(()=>{hoverFrame=0;const r=$('story').getBoundingClientRect(),tutor=document.querySelector('.tutor');tutor.style.setProperty('--tx',`${(e.clientX-r.left-r.width/2)*.014}px`);tutor.style.setProperty('--ty',`${(e.clientY-r.top-r.height/2)*.012}px`);});});




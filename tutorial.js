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
let pokes=0;$('wobble').onclick=()=>{const cell=$('wobble').querySelector('.jelly');cell.classList.remove('wobbling');void cell.offsetWidth;cell.classList.add('wobbling');$('wobble-caption').textContent=['Wobble tested. Ready for work.','Mr. Martian: “Yes, that is technically science.”','Still one cell. Just a wobblier one.'][pokes++%3];tone(false);};

$('start').onclick=()=>{location.href='world.html?training=1';};

let page=0;
const frames=[...document.querySelectorAll('.frame')];
function showPage(next){page=Math.max(0,Math.min(frames.length-1,next));frames.forEach((frame,i)=>{frame.hidden=i!==page;frame.classList.toggle('active',i===page);});$('chapter-name').textContent=frames[page].dataset.chapter;$('page-count').textContent=`${page+1} / ${frames.length}`;$('previous').disabled=page===0;$('next').hidden=page===frames.length-1;document.querySelectorAll('.dots i').forEach((dot,i)=>dot.classList.toggle('current',i===page));document.querySelector('.dots').setAttribute('aria-label',`Page ${page+1} of ${frames.length}`);frames[page].querySelector('h1').focus({preventScroll:true});window.PlanetVoice?.instructionChanged();}
$('next').onclick=()=>showPage(page+1);$('previous').onclick=()=>showPage(page-1);
let greetings=0;$('greet').onclick=()=>{$('hello').textContent=['“All hands on deck!”','“Four arms. Still only one head.”','“Ready, apprentice?”'][greetings++%3];tone(true);};
let hoverFrame=0;$('story').addEventListener('pointermove',e=>{if(quietMotion||e.pointerType==='touch'||hoverFrame)return;hoverFrame=requestAnimationFrame(()=>{hoverFrame=0;const r=$('story').getBoundingClientRect(),tutor=document.querySelector('.tutor');tutor.style.setProperty('--tx',`${(e.clientX-r.left-r.width/2)*.014}px`);tutor.style.setProperty('--ty',`${(e.clientY-r.top-r.height/2)*.012}px`);});});




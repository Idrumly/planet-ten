import {feedbackFor,wisdom,learningResult,detectiveChoices,detectiveTip,canLeaveFlower} from './bee-tutor.mjs';
import {options,newProfile,restoreProfile,makeover,potential,settle,appendLetter,questions,clueNames,drawTutorial} from './bee-playground-rules.mjs';
import {beeAvatar} from './bee-avatar.mjs';
const $=id=>document.getElementById(id),storageKey='planetTen.designPlayground.v1';
let profile=newProfile(),draft,answer='',unlocked=[],finished=false,heard=false,clueBusy=false,voices=[],active=new Set(),speechChannel='',learningRetry=false,wisdomIndex=0;
try{profile=restoreProfile(JSON.parse(localStorage.getItem(storageKey)));}catch{}
learningRetry=!!profile.correction;
const currentQuestion=()=>questions.find(q=>q.word===profile.round[profile.index]);
const tell=text=>{$('message').textContent=text;};
function persist(){try{localStorage.setItem(storageKey,JSON.stringify(profile));$('save-state').textContent='Saved on this browser · demo only';}catch{$('save-state').textContent='Browser saving is unavailable. Keep this page open to keep your demo.';}}
function paint(){
 $('hero').innerHTML=beeAvatar(profile.look,'hero');$('balance').textContent=profile.balance;
 $('progress').textContent=`Flower ${profile.index+1} / ${profile.round.length}`;
 $('answer').textContent=answer||'Tap the honeycomb letters';$('answer').classList.toggle('typed',!!answer);
 $('prize').textContent=learningRetry?'Learning retry · no prize at stake':profile.earned.includes(currentQuestion().word)?'Practice again · prize already earned':`This word: up to ${potential(unlocked)} HoneyHexes`;
 $('freebee').textContent=learningRetry?'All learning clues free':unlocked.length?'Freebee used · replays free':'1 freebee clue';
 $('submit').hidden=finished;$('next').hidden=!canLeaveFlower(finished,profile.correction);$('next').textContent=profile.index===9?'Practise again →':'Next flower →';
 for(const node of document.querySelectorAll('#keyboard button, #erase, #clear, #space, #apostrophe, #hyphen'))node.disabled=finished||clueBusy;
 $('submit').disabled=!answer.trim()||!heard||clueBusy;
 for(const [key,label] of Object.entries(clueNames)){const b=$('clue-'+key);const free=learningRetry||unlocked.includes(key)||!unlocked.length;b.disabled=finished||clueBusy||!currentQuestion()[key];b.querySelector('small').textContent=!currentQuestion()[key]?'Not available':unlocked.includes(key)?'Replay · free':free?(learningRetry?'Learning help · free':'Use freebee'):`Prize −1 → ${Math.max(0,potential([...unlocked,key]))}`;}
}
function stopSpeech(){window.speechSynthesis?.cancel();for(const end of [...active])end(false);$('hero').parentElement.classList.remove('speaking');document.querySelector('.hologram').classList.remove('speaking');}
function speech(text,channel='human',look=profile.look){
 if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){ $('sound-status').textContent='Speech is unavailable in this browser. Try a browser with English speech voices. No clue was charged.';return Promise.resolve(false);}
 if(channel!=='letter'||speechChannel!=='letter')stopSpeech();speechChannel=channel;
 return new Promise(resolve=>{
  const u=new SpeechSynthesisUtterance(text);u.lang='en-CA';u.rate=channel==='letter'?.95:.88;u.pitch=channel==='human'?1:look.voice==='lower'?.75:1.35;
  u.voice=voices.find(v=>v.voiceURI===$('device-voice').value)||voices.find(v=>v.lang==='en-CA')||voices.find(v=>/^en\b/.test(v.lang))||null;
  let ended=false,timeout;
  const end=ok=>{if(ended)return;ended=true;clearTimeout(timeout);active.delete(end);if(!active.size){$('hero').parentElement.classList.remove('speaking');document.querySelector('.hologram').classList.remove('speaking');}resolve(ok);};active.add(end);
  u.onstart=()=>{(channel==='human'?document.querySelector('.hologram'):$('hero').parentElement).classList.add('speaking');};
  u.onend=()=>end(true);u.onerror=()=>{$('sound-status').textContent='Audio did not finish. Try Hear again or choose another device voice. No clue was charged.';end(false);};
  timeout=setTimeout(()=>{end(false);stopSpeech();$('sound-status').textContent='Speech did not respond. Choose another voice and try again. No clue was charged.';},45000);
  try{speechSynthesis.speak(u);}catch{end(false);$('sound-status').textContent='Speech could not start. No clue was charged.';}
 });
}
function loadVoices(){const selected=$('device-voice').value;voices=window.speechSynthesis?.getVoices().filter(v=>/^en\b/.test(v.lang))||[];$('device-voice').replaceChildren(new Option('Device default',''),...voices.map(v=>new Option(`${v.name} · ${v.lang}`,v.voiceURI)));if(voices.some(v=>v.voiceURI===selected))$('device-voice').value=selected;}
window.speechSynthesis?.addEventListener('voiceschanged',loadVoices);loadVoices();
const letterNames={a:'ay',b:'bee',c:'see',d:'dee',e:'ee',f:'eff',g:'jee',h:'aitch',i:'eye',j:'jay',k:'kay',l:'ell',m:'em',n:'en',o:'oh',p:'pee',q:'cue',r:'ar',s:'ess',t:'tee',u:'you',v:'vee',w:'double you',x:'ex',y:'why',z:'zed',"'":'apostrophe','-':'hyphen',' ':'space'};
function enter(key){if(finished||clueBusy)return;const next=appendLetter(answer,key);if(next===answer)return;answer=next;paint();if($('letter-sound').checked)speech(letterNames[key],'letter');}
for(const row of ['qwertyuiop','asdfghjkl','zxcvbnm']){const div=document.createElement('div');div.className='key-row';for(const letter of row){const b=document.createElement('button');b.textContent=letter.toUpperCase();b.setAttribute('aria-label',`Letter ${letter.toUpperCase()}`);b.addEventListener('click',()=>enter(letter));div.append(b);}$('keyboard').append(div);}
for(const [key,label] of Object.entries(clueNames)){const b=document.createElement('button');b.id='clue-'+key;b.append(document.createTextNode(label),document.createElement('small'));b.addEventListener('click',async()=>{
 if(finished||clueBusy||!currentQuestion()[key])return;clueBusy=true;paint();tell(`Listening to ${label.toLowerCase()}…`);
 const delivered=await speech(currentQuestion()[key]);if(delivered&&!unlocked.includes(key))unlocked.push(key);clueBusy=false;paint();tell(delivered?'Clue heard. Replay it any time for free.':'Clue stopped or unavailable. Your freebee and prize are unchanged.');
 });$('clues').append(b);}
$('hear').addEventListener('click',async()=>{if(clueBusy)return;clueBusy=true;paint();$('earth-state').textContent='Earth connection open · listen closely';const ok=await speech(currentQuestion().word);heard=heard||ok;clueBusy=false;paint();$('earth-state').textContent=ok?'Human transmission received':'Connection interrupted · try again';tell(ok?'Now tap the letters to build your spelling.':'The word did not finish playing. Try Hear again.');});
$('stop-sound').addEventListener('click',stopSpeech);
$('erase').addEventListener('click',()=>{stopSpeech();answer=answer.slice(0,-1);paint();});$('clear').addEventListener('click',()=>{stopSpeech();answer='';paint();});
$('space').addEventListener('click',()=>enter(' '));$('apostrophe').addEventListener('click',()=>enter("'"));$('hyphen').addEventListener('click',()=>enter('-'));
$('submit').addEventListener('click',()=>{if(finished||clueBusy||!heard||!answer.trim())return;stopSpeech();const correct=answer.trim().toLowerCase()===currentQuestion().word;const result=learningRetry?learningResult(profile,correct):settle(profile,currentQuestion().word,correct,unlocked);profile=result.profile;if(correct)profile.correction=null;else profile.correction={word:currentQuestion().word,attempt:answer,choice:profile.correction?.choice||''};finished=true;persist();paint();tell(correct?(learningRetry?'You remembered it! Now use this word in a sentence of your own. Try it again tomorrow.':result.award?`You did it! +${result.award} demo HoneyHexes. Your bee is finding its wings.`:'Correct! You already earned this flower’s prize.'):'Not quite this time. No Hexes lost. Let’s find one thing to remember.');if(!correct)showTutorFeedback();});
$('next').addEventListener('click',()=>{if(!canLeaveFlower(finished,profile.correction))return;stopSpeech();if(profile.index===9){profile.round=drawTutorial();profile.index=0;}else profile.index++;answer='';unlocked=[];finished=false;heard=false;learningRetry=false;persist();paint();tell('A new flower. Hear the word, then choose your freebee.');});
function showTutorFeedback(){
 const feedback=feedbackFor(currentQuestion().word,profile.correction?.attempt||answer);
 $('tutor-comparison').textContent=feedback.comparison;$('tutor-tip').textContent=feedback.tip;$('tutor-action').textContent=feedback.action;
 $('tutor-retry').hidden=false;$('tutor-more').hidden=true;$('detective').hidden=false;paintDetective();open('tutor');
}
$('tutor-bee').innerHTML=beeAvatar({...profile.look,hair:'curls',hairColour:'silver',voice:'lower'},'elder');
$('open-tutor').addEventListener('click',()=>{
 if(profile.correction){showTutorFeedback();return;}
 $('tutor-comparison').textContent='One small piece of wisdom';$('tutor-tip').textContent=wisdom[wisdomIndex];$('tutor-action').textContent='Take what helps you today.';$('tutor-retry').hidden=true;$('tutor-more').hidden=false;$('detective').hidden=true;open('tutor');
});
$('tutor-more').addEventListener('click',()=>{stopSpeech();wisdomIndex=(wisdomIndex+1)%wisdom.length;$('tutor-tip').textContent=wisdom[wisdomIndex];});
$('tutor-speak').addEventListener('click',()=>speech([$ ('tutor-comparison').textContent,$('tutor-tip').textContent,$('tutor-action').textContent,...(!$('detective').hidden?['Spelling Detective. What do you notice?',...detectiveChoices.map(c=>c.title+'. '+c.question),$('detective-tip').textContent]:[])].join(' '),'bee',{...profile.look,voice:'lower'}));
$('tutor-retry').addEventListener('click',()=>{if(!detectiveTip(profile.correction?.choice))return;stopSpeech();learningRetry=true;answer='';finished=false;unlocked=[];$('tutor').close();$('tutor-comparison').textContent='';$('tutor-tip').textContent='';persist();paint();tell('Try from memory. You can hear the word and use clues for free.');$('hear').focus();});
function paintDetective(){
 const choice=profile.correction?.choice||'';
 for(const input of document.querySelectorAll('input[name="detective-choice"]'))input.checked=input.value===choice;
 $('detective-tip').textContent=detectiveTip(choice)||'Choose what you notice. More than one can fit. This is not marked right or wrong.';
 $('tutor-retry').disabled=!detectiveTip(choice);
}
for(const choice of detectiveChoices){
 const label=document.createElement('label'),input=document.createElement('input'),words=document.createElement('span'),title=document.createElement('strong'),question=document.createElement('span');
 input.type='radio';input.name='detective-choice';input.value=choice.id;title.textContent=choice.title;question.textContent=choice.question;words.append(title,question);label.append(input,words);
 input.addEventListener('change',()=>{stopSpeech();if(!profile.correction)return;profile.correction.choice=choice.id;persist();paintDetective();});$('detective-options').append(label);
}
$('detective-hear-tip').addEventListener('click',()=>speech($('detective-tip').textContent,'bee',{...profile.look,voice:'lower'}));
function open(id){stopSpeech();$(id).showModal();}
$('open-salon').addEventListener('click',()=>{draft={...profile.look};for(const key of Object.keys(options))$('look-'+key).value=draft[key];paintSalon();$('salon-status').textContent='';open('salon');});
for(const [key,option] of Object.entries(options)){const label=document.createElement('label');label.htmlFor='look-'+key;label.textContent=option.label;const select=document.createElement('select');select.id='look-'+key;for(const [value,text] of Object.entries(option.choices))select.add(new Option(text,value));select.addEventListener('change',()=>{draft[key]=select.value;paintSalon();});label.append(select);$('makeover-options').append(label);}
function paintSalon(){$('salon-bee').innerHTML=beeAvatar(draft,'mirror');const changed=Object.keys(options).some(k=>draft[k]!==profile.look[k]);const cost=profile.madeOver&&changed?10:0;$('salon-price').textContent=!profile.madeOver?'Your first makeover is free.':'Try anything. Save a changed look for 10 Hexes.';$('save-makeover').textContent=!profile.madeOver?'Save my free makeover':cost?'Save makeover · 10 Hexes':'Keep this look · free';}
$('preview-voice').addEventListener('click',()=>speech('Ay. Bee. See. I am ready for my first flight.','bee',draft));
$('save-makeover').addEventListener('click',()=>{try{profile=makeover(profile,draft);persist();paint();stopSpeech();$('salon').close();tell('Looking like yourself. Ready for an adventure!');}catch(e){$('salon-status').textContent=e.message;}});
for(const button of document.querySelectorAll('[data-close]'))button.addEventListener('click',()=>$(button.dataset.close).close());
for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('close',stopSpeech);
$('open-tailors').addEventListener('click',()=>open('tailors'));$('open-story').addEventListener('click',()=>open('story'));
$('reset-demo').addEventListener('click',()=>open('reset'));$('confirm-reset').addEventListener('click',()=>{stopSpeech();profile=newProfile();answer='';unlocked=[];finished=false;heard=false;learningRetry=false;persist();paint();$('reset').close();tell('A fresh beginning. Your first makeover is free.');});
let focusEnabled=false,returnPending=false,away=false,interruptions=0,intentionalExit=false;
function showReturn(){if(returnPending&&!document.hidden&&!document.querySelector('dialog[open]')){returnPending=false;open('fair-return');}}
function noteInterruption(){if(!focusEnabled||away)return;away=true;returnPending=true;interruptions++;$('focus-note').textContent=`${interruptions} focus interruption${interruptions===1?'':'s'} · no penalty`;stopSpeech();}
async function startFocus(){try{await document.documentElement.requestFullscreen();focusEnabled=true;away=false;$('focus-note').textContent='Focus flight on · Esc always lets you leave';}catch{$('focus-note').textContent='Fullscreen is unavailable here. You can keep playing in this window.';}}
if(!document.fullscreenEnabled||!document.documentElement.requestFullscreen){$('focus-flight').disabled=true;$('resume-fullscreen').hidden=true;$('focus-note').textContent='Fullscreen is unavailable in this browser. Windowed play is welcome.';}
$('focus-flight').addEventListener('click',async()=>{if(document.fullscreenElement){intentionalExit=true;focusEnabled=false;try{await document.exitFullscreen();}catch{intentionalExit=false;}}else await startFocus();});
$('resume-fullscreen').addEventListener('click',()=>{$('fair-return').close();startFocus();});
document.addEventListener('fullscreenchange',()=>{$('focus-flight').textContent=document.fullscreenElement?'⛶ Leave Focus flight':'⛶ Enter Focus flight';if(!document.fullscreenElement){if(intentionalExit){intentionalExit=false;$('focus-note').textContent='Focus flight off · continue in this window';}else{noteInterruption();showReturn();}}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopSpeech();noteInterruption();}else{showReturn();away=false;}});
for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('close',()=>{if(dialog.id==='fair-return'){away=false;if(!document.fullscreenElement)focusEnabled=false;}else showReturn();});
window.addEventListener('pagehide',stopSpeech);
paint();

if(profile.correction){finished=true;paint();showTutorFeedback();}

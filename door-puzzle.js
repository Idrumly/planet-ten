'use strict';
// Each card owns its answer, hints and reaction. No shared animation state.
window.createDoorPuzzle=function({root,questions,room,onUnlock,onReady}){
 const M=RoundingModel,solved=new Set();
 root.disposeDepth?.();const depthDisposers=[];root.disposeDepth=()=>depthDisposers.forEach(dispose=>dispose());
 root.replaceChildren();root.style.setProperty('--lock-count',questions.length);
 const navigation=document.createElement('nav');navigation.className='lock-selectors';navigation.setAttribute('aria-label','Choose a lock');root.append(navigation);
 questions.forEach((q,index)=>{
  const creature=LivingLocks.creatures[room.lockOffset+index];
  const card=document.createElement('form');card.className='door-lock-card'+(index===0?' selected-lock':'');card.dataset.reaction=index%3;card.id='door-lock-'+index;
  const selector=document.createElement('button');selector.type='button';selector.textContent='Lock '+(index+1);selector.setAttribute('aria-controls',card.id);selector.setAttribute('aria-pressed',String(index===0));navigation.append(selector);
  selector.onclick=()=>{root.querySelectorAll('.door-lock-card').forEach(el=>el.classList.toggle('selected-lock',el===card));navigation.querySelectorAll('button').forEach(el=>el.setAttribute('aria-pressed',String(el===selector)));};
  card.setAttribute('aria-labelledby',`lock-title-${index}`);
  card.innerHTML=`<div class="lock-card-heading"><h3 id="lock-title-${index}">Lock ${index+1} · <span class="card-state">Locked</span></h3></div>
   <div class="lock-picture"><span class="worm-skin" role="img" aria-label="${creature.name}, a living bolt holding the door shut"></span><span class="lock-reaction" aria-hidden="true"></span></div>
   <p class="card-question">Round <strong>${q.n}</strong><br>to the nearest <b>${q.place}</b>.</p>
   <div class="card-digits"></div><button class="primary" type="submit">Tickle to unlock ✦</button>
   <p class="card-feedback" id="lock-feedback-${index}" role="status"></p>`;
  root.append(card);
  const fields=[],digits=card.querySelector('.card-digits'),feedback=card.querySelector('.card-feedback');
  if(room.review){
   const label=document.createElement('label');label.textContent='Your rounded number';
   const input=document.createElement('input');input.type='text';input.inputMode='decimal';input.autocomplete='off';input.maxLength=14;
   input.setAttribute('aria-describedby',feedback.id);label.append(input);digits.append(label);fields.push(input);
  }else{
   const names=q.unit>=100?M.digits(q.unit*10):M.digits(q.unit);if(q.unit===100000)names.unshift('Millions');const initial=M.format(q.n,q.unit).replace('.','').padStart(names.length,'0');
   names.forEach((name,i)=>{
    const field=document.createElement('div');field.className='card-digit';
    field.innerHTML=`<label for="lock-${index}-digit-${i}" aria-label="${name}"><span class="place-long">${name}</span><span class="place-compact" aria-hidden="true">${q.unit<1?['1','0.1','0.01','0.001','0.0001'][i]:['1','10','100','1k','10k','100k','1M'][names.length-1-i]}</span></label><button type="button" aria-label="Increase ${name.toLowerCase()} digit">▲</button><input id="lock-${index}-digit-${i}" type="text" inputmode="numeric" maxlength="1" autocomplete="off" value="${initial[i]}" aria-describedby="${feedback.id}"><button type="button" aria-label="Decrease ${name.toLowerCase()} digit">▼</button>`;
    const input=field.querySelector('input'),buttons=field.querySelectorAll('button');fields.push(input);
    const wiggle=()=>{if(!document.body.classList.contains('still')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)card.querySelector('.belly-rim')?.animate([{opacity:1},{opacity:.6},{opacity:1}],{duration:240});};const turn=delta=>{if(solved.has(index))return;input.value=String((Number(input.value||0)+delta+10)%10);wiggle();};
    buttons[0].onclick=()=>turn(1);buttons[1].onclick=()=>turn(-1);
    input.oninput=()=>{input.value=input.value.replace(/[^0-9]/g,'').slice(-1);wiggle();};
    input.onkeydown=e=>{if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();turn(e.key==='ArrowUp'?1:-1);}};
    digits.append(field);
    if(q.unit<1&&i===0){const dot=document.createElement('span');dot.className='card-decimal';dot.textContent='.';digits.append(dot);}
   });
   let level=0;const hint=document.createElement('button');hint.type='button';hint.className='lock-hint-toggle';hint.textContent='Hint';hint.setAttribute('aria-label','Hint for lock '+(index+1));hint.setAttribute('aria-expanded','false');
   const help=document.createElement('div');help.className='lock-hint-panel';help.id=`lock-hint-${index}`;help.hidden=true;hint.setAttribute('aria-controls',help.id);
   help.innerHTML=`<div class="hint-toolbar"><span>Number line</span><button type="button">Add benchmarks</button></div><div class="number-line" role="img" aria-label="Number line without labels"><span class="endpoint">${q.low}</span><span class="midpoint">${q.mid}</span><span class="endpoint">${q.high}</span><span class="marker" style="--position:${(q.n-q.low)/q.unit*100}%">${q.n}</span></div>`;
   const next=help.querySelector('button'),picture=card.querySelector('.lock-picture');
   function showHint(){const state=M.hintState(level);help.querySelectorAll('.endpoint,.midpoint').forEach(el=>el.hidden=!state.benchmarks);help.querySelector('.marker').hidden=!state.number;next.textContent=level===1?'Add benchmarks':level===2?'Place the number':'All clues shown';next.disabled=level===3;help.querySelector('.number-line').setAttribute('aria-label',level===1?'Imagine the two neighbouring '+q.place+'s.':'From '+q.low+' to '+q.high+', halfway '+q.mid+(level===3?', target '+q.n:''));}
   hint.onclick=()=>{const open=help.hidden;if(open){level=Math.max(1,level);showHint();}help.hidden=!open;picture.hidden=false;digits.hidden=false;card.classList.toggle('showing-hint',open);hint.setAttribute('aria-expanded',String(open));hint.textContent=open?'Hide hint':'Hint';hint.setAttribute('aria-label',(open?'Hide hint':'Hint')+' for lock '+(index+1));};
   next.onclick=()=>{level=Math.min(3,level+1);showHint();};
   card.querySelector('.lock-card-heading').append(hint);picture.after(help);
  }
  depthDisposers.push(window.mountLivingLockDepth(card));
  card.onsubmit=e=>{
   e.preventDefault();if(solved.has(index))return;
   const raw=fields.map(f=>f.value.trim()).join(''),answer=room.review?raw:q.unit<1?raw[0]+'.'+raw.slice(1):raw;
   if(fields.some(f=>!f.value.trim())){feedback.textContent='Fill in your rounded number first.';return;}
   if(!M.check(answer,q.n,q.unit)){feedback.textContent='Not quite yet. Try the nearest '+q.place+' again.';return;}
   solved.add(index);selector.textContent='Lock '+(index+1)+' ✓';const help=card.querySelector('.lock-hint-panel');if(help){help.hidden=true;digits.hidden=false;card.classList.remove('showing-hint');card.querySelector('.lock-picture').hidden=false;card.querySelector('.lock-hint-toggle').setAttribute('aria-expanded','false');card.querySelector('.lock-hint-toggle').textContent='Hint';card.querySelector('.lock-hint-toggle').setAttribute('aria-label','Hint for lock '+(index+1));}card.classList.add('is-unlocked');card.querySelector('.card-state').textContent='✓ Unlocked';
   // The joke happens on this lock, in place, with a persistent open-lock sign.
   card.querySelector('.lock-reaction').textContent=['🦋','✨','◡'][index%3];
   feedback.textContent=`${q.n} → ${q.answer}. `+['A butterfly! A perfectly normal career change.','Fizz! A sparkling performance.','One delighted little pile of ashes.'][index%3];
   card.querySelectorAll('input,button').forEach(el=>el.disabled=true);
   card.querySelector('button[type="submit"]').textContent='🔓 Unlocked';
   document.dispatchEvent(new CustomEvent('living-lock-released',{detail:{index}}));
   onUnlock(index,solved.size);
   if(solved.size===questions.length)onReady();
  };
 });
 return {complete:()=>solved.size===questions.length};
};

'use strict';
function isFarm(){return !!contract.farm;}
function growShape(unit){
 const shape=document.createElement('span');shape.className='cells grow-shape grow-'+unit;shape.setAttribute('aria-hidden','true');
 const index=M.units.indexOf(unit),size=index===0?1:index===2?100:10;
 for(let i=0;i<size;i++){
  const child=document.createElement('span');child.className=index<3?'water-cell':index===3?'water-layer':'water-cube';
  if(index>=3)child.textContent=index===3?'100':'1,000';
  shape.append(child);
 }
 return shape;
}
function renderGrowBlocks(){
 const cargo=$('cargo');cargo.replaceChildren();
 for(const unit of [...M.units].reverse()){
  if(!state[unit])continue;
  const section=document.createElement('section');section.className='grow-group';section.dataset.group=unit;
  const title=document.createElement('h3');title.textContent=M.describe({[unit]:state[unit]});section.append(title);
  const quantity=Math.min(20,state[unit]);
  for(let i=0;i<quantity;i++){
   const b=document.createElement('button');b.className='block grow-block';b.dataset.unit=unit;b.dataset.quantity='1';
   b.setAttribute('aria-label',M.names[M.units.indexOf(unit)]+' block '+(i+1));b.append(growShape(unit));
   const label=document.createElement('span');label.className='unit-label';label.textContent=(10**M.units.indexOf(unit)).toLocaleString('en-US');b.append(label);b.disabled=busy||complete;
   b.onclick=e=>{if(tool==='join'&&unit!=='tenThousands'){if(e.detail===0&&!busy&&!complete)keyboardPickup(b);return;}exchange(unit,b);};section.append(b);
  }
  // Large reserves remain explicit; exchanging any ten identical units is equivalent.
  if(state[unit]>quantity){const reserve=document.createElement('div');reserve.className='grow-reserve';reserve.dataset.unit=unit;reserve.dataset.quantity=state[unit]-quantity;reserve.textContent='+'+(state[unit]-quantity)+' '+unit.replace('tenThousands','ten thousands')+' in reserve';section.append(reserve);}
  cargo.append(section);
 }
}
async function farmExchange(unit,button,pickedRects){
 if(busy||complete)return;
 if(tool==='split'&&unit==='ones'){rejectAction('Fractional Power Upgrade Unavailable to Mere Apprentices.');return;}
 if(tool==='join'&&unit==='tenThousands'){rejectAction('Hundred-Thousand Grow Upgrade Unavailable to Mere Apprentices.');return;}
 if(tool==='join'&&(state[unit]||0)<10){rejectAction('Collect exactly 10 matching '+unit+'.');return;}
 busy=true;const prev={...state},source=button.getBoundingClientRect();history.push(prev);shoot(button);
 const targetUnit=M.units[M.units.indexOf(unit)+(tool==='split'?-1:1)];
 const origins=pickedRects||Array.from({length:10},()=>source);
 state=M.exchange(state,tool,unit);if(M.value(state)!==contract.value)throw Error('Farm value changed');
 render();$('representation').textContent=M.describe(prev)+' → '+M.describe(state);
 const targets=[...$('cargo').querySelectorAll('.block[data-unit="'+targetUnit+'"]')];
 if(!still)await Promise.all(Array.from({length:10},async(_,i)=>{
  const ghost=document.createElement('div');ghost.className='grow-ghost';ghost.append(growShape(tool==='split'?targetUnit:unit));
  const from=origins[i]||source,to=targets[tool==='split'?Math.min(i,targets.length-1):targets.length-1].getBoundingClientRect();
  Object.assign(ghost.style,{left:from.left+'px',top:from.top+'px'});document.body.append(ghost);
  try{await animate(ghost,[{transform:'translate(0,0) scale(.55)',opacity:1},{transform:`translate(${to.left-from.left}px,${to.top-from.top}px) scale(.55)`,opacity:.2}],900+i*15);}finally{ghost.remove();}
 }));
 busy=false;render();$('held-tool').classList.remove('firing');beep('join');$('feedback').textContent=M.describe(state)+'. Still '+contract.value+'.';
}
async function waterSeed(){
 const intake=$('supply').closest('.power-intake');intake.classList.add('charging');$('intake-status').textContent='COLLECTING GROW BLOCKS';
 const blocks=[...$('cargo').querySelectorAll('.grow-block,.grow-reserve')];
 try{
  powerWhoosh();
  if(!still)await Promise.all(blocks.map(async(b,i)=>{
   const from=b.getBoundingClientRect(),to=$('grow-slot-'+b.dataset.unit).getBoundingClientRect(),copy=b.cloneNode(true);
   copy.className='grow-payload '+(b.classList.contains('grow-reserve')?'grow-reserve':'');copy.setAttribute('aria-hidden','true');copy.removeAttribute('aria-label');
   Object.assign(copy.style,{left:from.left+'px',top:from.top+'px',width:from.width+'px'});document.body.append(copy);b.style.visibility='hidden';
   try{await animate(copy,[{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${to.left-from.left}px,${to.top-from.top}px) scale(.12)`,opacity:0}],1300+Math.min(i*22,1100));}finally{copy.remove();}
  }));
  $('intake-status').textContent=contract.value.toLocaleString('en-US')+' WATER UNITS STORED';
  await animate($('farm-rain'),[{opacity:0,transform:'translateY(-35px)'},{opacity:1,transform:'translateY(0)',offset:.3},{opacity:0,transform:'translateY(65px)'}],1500);beep('join');
 }finally{intake.classList.remove('charging');blocks.forEach(b=>b.style.visibility='');$('intake-status').textContent='READY TO WATER';}
}
function farmNotebook(){
 const book=$('farm-notebook');book.hidden=!isFarm()||!keyRecords.length;
 book.replaceChildren();if(book.hidden)return;
 const title=document.createElement('h3');title.textContent='Same value · '+contract.value;book.append(title);
 keyRecords.forEach((r,i)=>{const row=document.createElement('p');row.textContent=(i+1)+'. '+r.description;book.append(row);});
}

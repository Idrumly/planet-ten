'use strict';
(()=>{
 const launcher=document.createElement('button');
 launcher.id='super-tool';launcher.textContent='ϟ Super Transmorgifier';launcher.hidden=true;
 document.querySelector('.controls').append(launcher);
 const dialog=document.createElement('dialog');
 dialog.id='super-dialog';dialog.setAttribute('aria-labelledby','super-title');
 dialog.innerHTML=`<form novalidate><h2 id="super-title">Super Transmorgifier</h2><p id="super-help">Collect smaller blocks. Make larger blocks with exactly the same value. Blocks you leave out stay on the ground. Blank boxes mean zero.</p><table><thead><tr><th scope="col">Block type</th><th scope="col">Available</th><th scope="col">Collect</th><th scope="col">Make</th></tr></thead><tbody></tbody></table><p id="super-totals"></p><p id="super-error" role="alert"></p><div class="super-actions"><button type="button" id="super-cancel">Cancel</button><button type="submit" id="super-zap">ϟ Zap these blocks</button></div></form>`;
 document.body.append(dialog);
 const form=dialog.querySelector('form'),body=dialog.querySelector('tbody'),error=dialog.querySelector('#super-error');
 const allowed=()=>M.units.slice(0,isFarm()?5:3);
 const unavailable=()=>busy||complete||!!pickup||$('world').classList.contains('training');
 function read(column){return Object.fromEntries(allowed().map(u=>{const input=form.elements[`${column}-${u}`];return [u,input.value===''?0:input.valueAsNumber];}));}
 function totals(){
  const a=M.value(read('collect')),b=M.value(read('make'));
  $('super-totals').textContent=Number.isFinite(a)&&Number.isFinite(b)?`Collected value: ${a.toLocaleString()}  →  Made value: ${b.toLocaleString()}`:'Enter whole numbers of blocks.';
 }
 launcher.onclick=()=>{
  if(unavailable()||!contract.hundreds)return;
  body.replaceChildren();error.textContent='';
  for(const unit of allowed()){
   const label=M.names[M.units.indexOf(unit)]+'s',row=document.createElement('tr');
   row.innerHTML=`<th scope="row">${label}</th><td>${(state[unit]||0).toLocaleString()}</td><td><input type="number" min="0" step="1" name="collect-${unit}" aria-label="Collect ${label}" aria-describedby="super-help super-error" placeholder="0"></td><td><input type="number" min="0" step="1" name="make-${unit}" aria-label="Make ${label}" aria-describedby="super-help super-error" placeholder="0"></td>`;
   body.append(row);
  }
  totals();dialog.showModal();form.querySelector('input').focus();
 };
 $('super-cancel').onclick=()=>dialog.close();
 form.addEventListener('input',()=>{error.textContent='';totals();});
 form.onsubmit=async event=>{
  event.preventDefault();if(unavailable())return;
  const collect=read('collect'),make=read('make'),result=SuperMath.regroup(state,collect,make,isFarm()?4:2);
  if(!result.ok){error.textContent=result.message;beep('error');return;}
  history.push({...state});busy=true;dialog.close();render();$('open-brief').disabled=true;
  const packet=document.createElement('div');packet.className='super-packet';packet.setAttribute('role','status');
  const equation=document.createElement('strong');equation.textContent=`${M.describe(collect)} → ${M.describe(make)}`;
  const caption=document.createElement('span');caption.textContent=`${result.value.toLocaleString()} power · same value!`;
  packet.append(equation,caption);document.body.append(packet);
  try{
   powerWhoosh();await animate(packet,[{opacity:0,transform:'translateY(24px) scale(.92)'},{opacity:1,transform:'translateY(0) scale(1)'}],500);
   state=result.state;render();beep('join');
   await animate(packet,[{opacity:1,filter:'brightness(1)'},{opacity:1,filter:'brightness(1.8)'},{opacity:1,filter:'brightness(1)'}],650);
   await animate(packet,[{opacity:1},{opacity:0}],450);
  }finally{packet.remove();busy=false;$('open-brief').disabled=false;render();}
  $('feedback').textContent=`${M.describe(collect)} became ${M.describe(make)}. Same value: ${result.value.toLocaleString()}.`;
  launcher.focus();
 };
 window.SuperTransmorgifier={refresh(){launcher.hidden=!contract.hundreds||$('world').classList.contains('training');launcher.disabled=unavailable();}};
 window.SuperTransmorgifier.refresh();
})();

'use strict';
if(new URLSearchParams(location.search).get('training')==='1'){
 stopReward();if($('briefing').open)$('briefing').close();
 contract={id:'training',value:10,start:{tens:1,ones:0},keys:[{kind:'blocks',amount:1}]};state={...contract.start};phase=0;busy=false;complete=false;history=[];
 $('world').classList.add('training');
 const panel=document.createElement('section');panel.className='training-panel';panel.setAttribute('aria-label','TEN-BOT guided practice');
 panel.innerHTML='<div class="robot-face" aria-hidden="true"><span>●</span><span>●</span><i></i></div><div class="robot-heading">TEN-BOT <small id="training-progress"></small></div><h1>Value or block count?</h1><p id="training-instruction" tabindex="-1"></p><form id="training-form" novalidate><label for="training-value">Total value <small>How much is it worth?</small></label><input id="training-value" inputmode="numeric" autocomplete="off" maxlength="6" aria-describedby="training-answer"><label for="training-blocks">Number of blocks <small>How many separate pieces?</small></label><input id="training-blocks" inputmode="numeric" autocomplete="off" maxlength="6" aria-describedby="training-answer"><button type="submit">Check my answers</button></form><p id="training-answer" role="status"></p><a id="training-finish" href="world.html" hidden>Begin my first shift →</a>';
 $('world').append(panel);let index=0;
 const current=()=>TrainingSteps.steps[index];
 function refresh(){
  const step=current();for(const id of ['supply','undo','open-brief','chapter-switch'])$(id).disabled=true;
  for(const mode of ['split','join']){$(mode+'-tool').disabled=busy||step.kind!=='tool'||step.tool!==mode;$(mode+'-tool').classList.toggle('training-target',!$(mode+'-tool').disabled);}
  for(const block of $('cargo').querySelectorAll('.block')){block.disabled=busy||step.kind!=='exchange'||(step.tool==='split'?block.dataset.unit!=='tens':block.dataset.unit!=='ones');block.classList.toggle('training-target',!block.disabled);}
 }
 function show(){const step=current();if(step.kind==='done'&&!window.OrientationProgress?.practiceDone())document.getElementById("training-finish").href='world.html?practice=complete';$('feedback').textContent=step.kind==='quiz'?'Tell TEN-BOT the value and the number of separate blocks.':step.kind==='done'?'Ready for your first shift.':'Follow the highlighted action. TEN-BOT is here to help.';$('training-progress').textContent=(index+1)+' / '+TrainingSteps.steps.length;$('training-instruction').textContent=step.text;$('training-form').hidden=step.kind!=='quiz';$('training-finish').hidden=step.kind!=='done';$('training-answer').textContent='';$('training-value').value='';$('training-blocks').value='';refresh();(step.kind==='quiz'?$('training-value'):$('training-instruction')).focus({preventScroll:true});window.PlanetVoice?.instructionChanged();}
 function advance(){index++;if(current().transfer){contract.value=12;state={tens:1,ones:2};render();}show();}
 window.training={refresh,allowTool:next=>current().kind==='tool'&&current().tool===next,selected(next){if(current().kind==='tool'&&current().tool===next)advance();},allowExchange:(mode,unit)=>current().kind==='exchange'&&current().tool===mode&&(mode==='split'?unit==='tens':unit==='ones'),exchanged(){if(current().kind==='exchange')advance();}};
 $('restart').onclick=()=>{location.href='world.html?training=1';};
 $('training-form').addEventListener('submit',e=>{e.preventDefault();if(TrainingSteps.check(index,$('training-value').value,$('training-blocks').value)){beep('win');advance();return;}
 const step=current(),valueOK=/^\d+$/.test($('training-value').value.trim())&&Number($('training-value').value)===step.value;
 $('training-answer').textContent=valueOK?'The value is right! For BLOCKS, count each whole rod once and each separate one once. Try the block count again.':'For VALUE, each ten rod is worth 10 and each one is worth 1. Count the glowing cells, not just the separate pieces. Try again.';
 window.PlanetVoice?.say($('training-answer').textContent);
 (valueOK?$('training-blocks'):$('training-value')).focus();});
 render();show();
}

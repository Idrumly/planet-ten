'use strict';
(() => {
 if(new URLSearchParams(location.search).get('training')==='1')return;
 const lessons=[
  ['mission-title','Every machine needs particular arrangements of blocks. Each arrangement is a configuration. This machine needs TWO configurations, both with a value of 28. Precision first, apprentice. The community is counting on us.'],
  ['representation','Look at the WORD DESCRIPTION below the blocks: 2 tens and 8 ones. It names the blocks on the ground. It changes when you split or join them.'],
  ['value','Look at VALUE on the green screen. Two tens are worth 20, and eight ones are worth 8. The total value is 28. Splitting and joining keep this value the same.'],
  ['count','Look at BLOCKS beside VALUE. There are 10 separate pieces: two rods and eight ones. Count each whole rod as ONE block. Value 28, block count 10!'],
  ['mission-title','The first configuration asks for value 28 using exactly 19 blocks. We need a different arrangement of the same power. Split ONE ten rod into ten ones.'],
  ['supply','When the arrangement matches, press SUPPLY POWER below the green screen. The power transforming module takes the blocks and zaps the machine, unlocking one action. Each correct configuration earns a key.']
 ];
 const messages={
  split:'Choose the pink Discombobulator, then click ONE ten rod. TEN-BOT will keep the other blocks safe. Watch the word description and block count change!',
  ready1:'The word description now says 1 ten and 18 ones. Value: 28. Block count: 19. Configuration matched! Follow me to the glowing SUPPLY POWER button below the green screen. Click it once now. Keyboard: press Enter on the highlighted button.',
  powering:'Power transformation in progress! Watch the blocks enter the module and the energy zap the machine. A correct configuration unlocks a machine action.',
  join:'One key unlocked. The machine has grown legs. A promising development for planetary transport. It is 50 percent active. Configuration two needs value 28 using 10 blocks. Choose the blue Transmorgifier. Sweep across TEN ones and release to make one ten. Keyboard: Tab to each one and press Enter.',
  ready2:'Now the word description says 2 tens and 8 ones. Value: 28. Block count: 10. The second configuration matches! I am pointing to SUPPLY POWER again. Click that button once now to unlock the final action. Keyboard: press Enter.',
  done:'Both configurations complete! Different arrangements, the same value of 28. Both keys are lit. Your wondrous machine is now 100 percent active!'
 };
 window.FirstPuzzleNarration=[...lessons.map(item=>item[1]),...Object.values(messages)];
 const panel=document.createElement('section');panel.className='puzzle-coach';panel.hidden=true;panel.setAttribute('aria-label','TEN-BOT first puzzle helper');
 panel.innerHTML='<div class="robot-face" aria-hidden="true"><span>●</span><span>●</span><i></i></div><h2>TEN-BOT <small id="coach-progress"></small></h2><p id="coach-instruction" tabindex="-1" aria-live="polite"></p><div class="coach-actions"><button id="coach-next">More Help? →</button><button id="coach-replay">Hear again</button><button id="coach-skip" hidden>Thanks, TEN-BOT!</button></div>';
 $('world').append(panel);let page=0,last='',active=false,feeding=false;
 const clear=()=>document.querySelectorAll('.coach-target').forEach(el=>el.classList.remove('coach-target'));
 function finish(){active=false;window.TenBotPointer?.hide();panel.hidden=true;clear();$('world').classList.remove('coached');window.training=undefined;$('open-brief').disabled=false;window.PlanetVoice?.stop();render();}
 function stage(){return complete?'done':busy?(feeding?'powering':last):page<lessons.length?'intro'+page:PowerContracts.matches(state,contract,phase)?(phase===0?'ready1':'ready2'):(phase===0?'split':'join');}
 function refresh(){
  if(!active)return;if(!busy)feeding=false;if(contract.id!=='first-shift'){finish();return;}
  const key=stage(),intro=key.startsWith('intro'),working=key==='split'||key==='join';
  $('supply').disabled=busy||!(key==='ready1'||key==='ready2');$('undo').disabled=true;
  for(const mode of ['split','join'])$(mode+'-tool').disabled=busy||!working||mode!==(phase===0?'split':'join');
  for(const b of $('cargo').querySelectorAll('.block'))b.disabled=!working||busy||b.dataset.unit!==(phase===0?'tens':'ones');
  $('open-brief').disabled=true;
  if(key===last)return;last=key;clear();
  const target=intro?lessons[page][0]:key==='split'?'split-tool':key==='join'?'join-tool':key.startsWith('ready')?'supply':key==='done'?'keys':'power-station';
  $(target).classList.add('coach-target');
  // Scroll only the containing panel, never the entire game viewport.
  if($('power-station').contains($(target))){const station=$('power-station');station.scrollTop=target==='supply'?station.scrollHeight:0;}
  $('coach-instruction').textContent=intro?lessons[page][1]:messages[key];
  $('coach-progress').textContent=intro?'HELP '+(page+1)+' / '+lessons.length:complete?'100% ACTIVE':phase===1?'1 / 2 KEYS · 50% ACTIVE':'0 / 2 KEYS';
  $('coach-next').hidden=!intro;$('coach-skip').hidden=!complete;
  if(complete){window.OrientationProgress?.firstShiftDone();$('contract-choice').disabled=false;$('chapter-switch').disabled=false;}
  else if(window.OrientationProgress?.firstShiftRequired){$('contract-choice').disabled=true;$('chapter-switch').disabled=true;}
  if(key.startsWith('ready')){window.TenBotPointer?.show();$('supply').focus({preventScroll:true});}else window.TenBotPointer?.hide();
  window.PlanetVoice?.instructionChanged();
 }
 function start(){if(contract.id!=='first-shift')return;active=true;page=0;last='';panel.hidden=false;$('world').classList.add('coached');
  window.training={refresh,allowTool:mode=>page>=lessons.length&&mode===(phase===0?'split':'join'),selected(){refresh();},allowExchange:(mode,unit)=>page>=lessons.length&&!PowerContracts.matches(state,contract,phase)&&mode===(phase===0?'split':'join')&&unit===(phase===0?'tens':'ones'),exchanged:refresh};
  render();
 }
 window.FirstPuzzle={get active(){return active;},powering(){feeding=true;},start};
 $('coach-next').onclick=()=>{page++;refresh();};$('coach-skip').onclick=()=>{if(complete)finish();};
 $('coach-replay').onclick=()=>{window.PlanetVoice?.listen();};
 if(window.OrientationProgress?.firstShiftRequired){$('contract-choice').disabled=true;$('contract-choice').title='Complete TEN-BOT’s first shift to unlock assignments.';$('chapter-switch').disabled=true;}
 $('briefing').addEventListener('close',()=>{if(!active&&contract.id==='first-shift'&&!complete)start();});
})();

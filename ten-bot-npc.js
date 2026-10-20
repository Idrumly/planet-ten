'use strict';
(() => {
 if(new URLSearchParams(location.search).get('training')==='1')return;
 const make=(id,parent)=>{const box=document.createElement('aside');box.className='npc-message';box.innerHTML='<div class="robot-face" aria-hidden="true"><span>●</span><span>●</span><i></i></div><strong>TEN-BOT · Civic Engineering</strong><p id="'+id+'"></p><button type="button">Hear TEN-BOT</button>';parent.append(box);box.querySelector('button').onclick=()=>window.PlanetVoice?.listen();return box;};
 const briefBox=make('npc-brief',document.querySelector('.brief-copy'));$('brief-copy').after(briefBox);
 const result=make('npc-result',$('completion'));$('complete-title').after(result);
 function brief(){const entry=TenBotCharacter.assignments[contract.id];briefBox.hidden=phase>0;$('npc-brief').textContent=phase===0?(entry?.[0]||''):'';window.PlanetVoice?.instructionChanged();}
 function completed(){const entry=TenBotCharacter.assignments[contract.id];$('npc-result').textContent=entry?.[1]||'';result.hidden=!entry;window.PlanetVoice?.instructionChanged();}
 window.PlanetNPC={brief,completed};brief();
})();

'use strict';
(() => {
 const bot=document.createElement('div');bot.className='ten-bot-pointer';bot.hidden=true;bot.setAttribute('aria-hidden','true');
 bot.innerHTML='<svg viewBox="0 0 120 100"><ellipse cx="70" cy="91" rx="28" ry="5" fill="#76f9e9" opacity=".65"/><path d="M48 72l-8 12h61l-8-12" fill="#487c91" stroke="#b4eff2" stroke-width="3"/><path d="M70 19V8m-5 0h10" stroke="#c5edf3" stroke-width="4"/><rect x="38" y="20" width="63" height="52" rx="12" fill="#a6d7cf" stroke="#375c72" stroke-width="5"/><path d="M48 39h16m12 0h16" stroke="#123748" stroke-width="4"/><circle cx="56" cy="46" r="5" fill="#123748"/><circle cx="84" cy="46" r="5" fill="#123748"/><path d="M59 60h23" stroke="#174e63" stroke-width="5"/><path d="M38 57H19l-7-9m7 9-10 3" fill="none" stroke="#b4eff2" stroke-width="7" stroke-linecap="round"/><circle cx="38" cy="57" r="6" fill="#477689"/></svg><strong>PRESS SUPPLY POWER</strong>';
 const arrow=document.createElementNS('http://www.w3.org/2000/svg','svg');arrow.classList.add('ten-bot-pointer-line');arrow.setAttribute('aria-hidden','true');arrow.innerHTML='<defs><marker id="ten-bot-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M1 1L7 4L1 7" fill="none" stroke="#fff3a4" stroke-width="2"/></marker></defs><path fill="none" stroke="#fff3a4" stroke-width="4" marker-end="url(#ten-bot-arrow)"/>';arrow.style.display='none';
 document.body.append(arrow,bot);let visible=false,flight=null,frame=0;
 function place(fly=false){
  if(!visible)return;flight?.cancel();flight=null;
  const target=$('supply').getBoundingClientRect(),origin=document.querySelector('.puzzle-coach').getBoundingClientRect(),mobile=innerWidth<=700;
  const width=mobile?130:155,height=125;
  const x=Math.max(8,Math.min(innerWidth-width-8,target.right+14));
  const y=Math.max(8,Math.min(innerHeight-height-8,mobile?target.bottom+16:target.top-30));
  bot.style.left=x+'px';bot.style.top=y+'px';bot.style.width=width+'px';
  // The finger follows the actual button, including station scrolling and resizing.
  const endX=target.right-8,endY=target.top+target.height/2;
  arrow.setAttribute('viewBox',`0 0 ${innerWidth} ${innerHeight}`);
  arrow.querySelector('path[marker-end]').setAttribute('d',`M ${x+12} ${y+47} Q ${endX+28} ${y+47} ${endX} ${endY}`);
  arrow.style.display='';
  if(fly&&!still){arrow.style.display='none';const a=bot.animate([{transform:`translate(${origin.left-x}px,${origin.top-y}px) scale(.65)`,opacity:.5},{transform:'translate(0,0) scale(1)',opacity:1}],{duration:850,easing:'cubic-bezier(.2,.7,.25,1)'});flight=a;activeAnimations.add(a);a.finished.then(()=>{if(visible&&flight===a)arrow.style.display='';}).catch(()=>{}).finally(()=>activeAnimations.delete(a));}
 }
 function show(){if(visible){place();return;}visible=true;bot.hidden=false;$('supply').setAttribute('aria-describedby','coach-instruction');place(true);}
 function hide(){visible=false;flight?.cancel();flight=null;bot.hidden=true;arrow.style.display='none';$('supply').removeAttribute('aria-describedby');}
 function reposition(){if(visible&&!frame)frame=requestAnimationFrame(()=>{frame=0;place();});}
 addEventListener('resize',reposition);$('power-station').addEventListener('scroll',reposition,{passive:true});
 window.TenBotPointer={show,hide};
})();

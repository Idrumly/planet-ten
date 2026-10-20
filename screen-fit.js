'use strict';
(() => {
 const button=document.createElement('button');button.id='fullscreen';button.type='button';button.textContent='Fullscreen';
 const host=document.querySelector('.settings')||document.querySelector('header>div');host.append(button);
 const message=document.createElement('span');message.id='screen-message';message.setAttribute('role','status');host.append(message);
 const sync=()=>{if(button.disabled)return;button.textContent=document.fullscreenElement?'Exit fullscreen':'Fullscreen';button.setAttribute('aria-pressed',String(!!document.fullscreenElement));};
 if(!document.fullscreenEnabled||!document.documentElement.requestFullscreen){button.disabled=true;button.textContent='Fullscreen unavailable';}
 button.addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();message.textContent='';}catch{message.textContent='Fullscreen could not open. You can keep playing here.';}sync();});
 document.addEventListener('fullscreenchange',sync);sync();
})();

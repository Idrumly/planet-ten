'use strict';
// Shared warehouse dialogue: readable screen-sized text anchored to a world actor.
window.createComicDialogue=function(viewport){
 const bubble=document.createElement('div');bubble.className='comic-bubble';bubble.hidden=true;bubble.innerHTML='<strong></strong><p></p>';viewport.append(bubble);
 const bot=document.createElement('div');bot.className='comic-bot';bot.hidden=true;bot.setAttribute('aria-hidden','true');bot.innerHTML='<i>● ●</i><span>TEN-BOT</span>';viewport.append(bot);
 const announcer=document.createElement('span');announcer.className='comic-announcer';announcer.setAttribute('aria-live','polite');viewport.append(announcer);
 let anchor=null,text='',voice='',voiceSpeaker='TEN-BOT',enabled=false,manualUntil=0;
 function position(){
  if(!enabled||!text){bubble.hidden=true;bot.hidden=true;return;}
  const isBot=!anchor;bot.hidden=!isBot;
  if(anchor?.hidden){bubble.hidden=true;return;}
  const v=viewport.getBoundingClientRect(),r=(anchor||bot).getBoundingClientRect();
  const ax=r.left+r.width/2-v.left,ay=r.top-v.top+Math.min(r.height*.12,24);
  if(ax<0||ax>v.width||ay>v.height||r.bottom<v.top){bubble.hidden=true;return;}
  bubble.hidden=false;
  const w=bubble.offsetWidth,h=bubble.offsetHeight;
  const side=anchor&&v.width>600&&['coffee','bull'].includes(viewport.dataset.show);
  const left=side?Math.max(12,r.left-v.left-w-16):Math.max(12,Math.min(v.width-w-12,ax-w/2));
  bubble.style.left=left+'px';bubble.style.top=Math.max(v.width>600?58:96,Math.min(v.height-h-125,ay-h-22))+'px';
  bubble.style.setProperty('--tail-x',Math.max(22,Math.min(w-25,ax-left))+'px');
 }
 return {show(speaker,line,element,options={}){anchor=element||null;text=line;voice=options.voice||line;voiceSpeaker=speaker;manualUntil=options.manual?performance.now()+Math.max(9000,line.length*65):0;bubble.querySelector('strong').textContent=speaker;bubble.querySelector('p').textContent=line;if(options.manual)announcer.textContent=speaker+': '+line;position();window.RoundStageSpeak?.(voice,voiceSpeaker);},
  holding:()=>performance.now()<manualUntil,
  replay(){if(text)window.RoundStageSpeak?.(voice,voiceSpeaker);},
  enable(value){if(enabled===value)return;enabled=value;position();},position,
  clear(){text='';manualUntil=0;bubble.hidden=true;bot.hidden=true;}
 };
};

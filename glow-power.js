'use strict';
function powerWhoosh(){
 if(!sound)return;
 try{
  audio ||= new(window.AudioContext||window.webkitAudioContext)();audio.resume().catch(()=>{});
  const duration=still?.65:2.2,t=audio.currentTime,buffer=audio.createBuffer(1,Math.ceil(audio.sampleRate*duration),audio.sampleRate),data=buffer.getChannelData(0);
  for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
  const source=audio.createBufferSource(),filter=audio.createBiquadFilter(),gain=audio.createGain();
  source.buffer=buffer;filter.type='bandpass';filter.Q.value=.65;filter.frequency.setValueAtTime(180,t);filter.frequency.exponentialRampToValueAtTime(2400,t+duration*.6);filter.frequency.exponentialRampToValueAtTime(300,t+duration);
  gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.11,t+duration*.35);gain.gain.linearRampToValueAtTime(0,t+duration);
  source.connect(filter).connect(gain).connect(audio.destination);source.start();source.stop(t+duration);
 }catch{beep('join');}
}
function sizzle(){
  if(!sound||!audio)return;
  const buffer=audio.createBuffer(1,Math.ceil(audio.sampleRate*.32),audio.sampleRate),data=buffer.getChannelData(0);
  for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(1-i/data.length);
  const source=audio.createBufferSource(),filter=audio.createBiquadFilter(),gain=audio.createGain();
  source.buffer=buffer;filter.type='highpass';filter.frequency.value=1800;gain.gain.value=.018;
  source.connect(filter).connect(gain).connect(audio.destination);source.start();
}
// Whole shapes enter matching slots before any puzzle-specific reward.
async function feedPower(){
 const funnel=$('supply').closest('.power-intake'),blocks=[...$('cargo').querySelectorAll('.block')];funnel.classList.add('charging');$('intake-status').textContent='ACCEPTING SHAPES';$('feedback').textContent=M.describe(state)+'. Value '+contract.value+'. Charging…';
 try{
  powerWhoosh();
  if(!still)await Promise.all(blocks.map(async(block,i)=>{
   const r=block.getBoundingClientRect(),ten=block.classList.contains('rod'),flat=block.classList.contains('flat'),mouth=$(flat?'intake-hundreds':ten?'intake-tens':'intake-ones').getBoundingClientRect(),copy=block.cloneNode(true);
   copy.className='power-payload '+(flat?'flat-payload':ten?'rod-payload':'one-payload');copy.style.setProperty('--unit',getComputedStyle(block).getPropertyValue('--unit'));copy.setAttribute('aria-hidden','true');copy.disabled=true;
   Object.assign(copy.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'});document.body.append(copy);block.style.visibility='hidden';
   const shape=block.querySelector('.cells').getBoundingClientRect();const scale=Math.min(mouth.width/shape.width,mouth.height/shape.height)*.85,dx=mouth.left+mouth.width/2-r.left-r.width/2,dy=mouth.top+mouth.height/2-r.top-r.height/2;
   try{await animate(copy,[{transform:'translate(0,0) scale(1)',opacity:1},{transform:'translate('+dx+'px,'+dy+'px) scale('+scale+')',opacity:1,offset:.85},{transform:'translate('+dx+'px,'+(dy-8)+'px) scale('+scale*.9+')',opacity:0}],1200+Math.min(i*22,1300));}finally{copy.remove();}
  }));
  $('intake-status').textContent='POWER STORED';const mouth=$('supply').getBoundingClientRect(),wr=$('world').getBoundingClientRect(),pr=$(isHundredMachine()?'hundred-machine':isMicrowave()?'microwave-shell':isToaster()?'toaster-shell':'printer').getBoundingClientRect();
  $('power-link').setAttribute('d','M'+(mouth.right-wr.left)+' '+(mouth.top+mouth.height/2-wr.top)+' Q'+(pr.left-wr.left)+' '+(mouth.top-wr.top)+' '+(pr.left+pr.width*.7-wr.left)+' '+(pr.top+pr.height*.65-wr.top));
  beep('join');await animate($('power-zap'),[{opacity:0},{opacity:1,offset:.25},{opacity:1,offset:.7},{opacity:0}],500);
 }finally{funnel.classList.remove('charging');$('intake-status').textContent='READY FOR GLOWBLOCKS™';blocks.forEach(b=>b.style.visibility='');}
}

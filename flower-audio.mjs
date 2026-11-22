// Only a natural completion earns credit. Cancel/error/timeout never does.
export function createStudyAudio({makeAudio=src=>new Audio(src),synth=globalThis.speechSynthesis,makeUtterance=text=>new SpeechSynthesisUtterance(text),timeout=120000}={}){
 let cancel=null;
 const stop=()=>{cancel?.();cancel=null;synth?.cancel();};
 function play({url,text,rate=1,onProgress=()=>{}}){stop();return new Promise(resolve=>{
  let done=false,media,timer;
  const finish=result=>{if(done)return;done=true;clearTimeout(timer);if(media){media.onended=null;media.onend=null;media.onerror=null;media.ontimeupdate=null;media.pause?.();}if(cancel===halt)cancel=null;resolve(result);};
  const halt=()=>finish('stopped');cancel=halt;timer=setTimeout(()=>{finish('timeout');synth?.cancel();},timeout);
  try{if(url){media=makeAudio(url);media.preload='none';media.playbackRate=rate;media.preservesPitch=true;media.onended=()=>{onProgress(1);finish('ended');};media.onerror=()=>finish('error');media.ontimeupdate=()=>onProgress(Number.isFinite(media.duration)&&media.duration>0?media.currentTime/media.duration:0);Promise.resolve(media.play()).catch(()=>finish('error'));}
  else if(synth&&text){media=makeUtterance(text);media.rate=rate;media.onend=()=>{onProgress(1);finish('ended');};media.onerror=()=>finish('error');synth.speak(media);}else finish('error');}catch{finish('error');}
 });}
 return {play,stop};
}

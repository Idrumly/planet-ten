// Human-recorded letters; full source and licence details are in bee-audio/letters/sources.json.
export function letterAudioSpec(letter,style){
 if(!/^[a-z]$/.test(letter))return null;
 return {src:`bee-audio/letters/${letter}.mp3`,rate:style==='lower'?0.86:1};
}
export function createLetterPlayer(makeAudio=src=>new Audio(src)){
 let cancel=null;
 const stop=()=>{cancel?.();cancel=null;};
 function play(letter,style){
  stop();const spec=letterAudioSpec(letter,style);if(!spec)return Promise.resolve('unavailable');
  return new Promise(resolve=>{
   let audio,done=false,timer;
   const end=status=>{if(done)return;done=true;clearTimeout(timer);if(audio){audio.onended=null;audio.onerror=null;audio.pause();}if(cancel===cancelThis)cancel=null;resolve(status);};
   const cancelThis=()=>end('stopped');cancel=cancelThis;
   try{
    audio=makeAudio(spec.src);audio.preload='none';
    if(spec.rate!==1&&!('preservesPitch' in audio)&&!('webkitPreservesPitch' in audio)){end('unavailable');return;}
    audio.preservesPitch=false;if('webkitPreservesPitch' in audio)audio.webkitPreservesPitch=false;
    audio.playbackRate=spec.rate;audio.onended=()=>end('played');audio.onerror=()=>end('unavailable');
    timer=setTimeout(()=>end('unavailable'),8000);
    Promise.resolve(audio.play()).catch(()=>end('unavailable'));
   }catch{end('unavailable');}
  });
 }
 return {play,stop};
}

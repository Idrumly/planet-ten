'use strict';
// Render once from fresh speech. Keep the dry voice dominant for clear instructions.
const profiles={
 martian:{pitch:.92,dry:.92,metal:.025,scrape:.006,taps:[[.029,.07],[.067,.055],[.109,.04],[.173,.025],[.251,.014],[.337,.008]]},
 tenbot:{pitch:1.16,dry:.88,metal:.14,scrape:.025,taps:[[.012,.09],[.019,.075],[.037,.065],[.071,.07],[.113,.055],[.173,.04],[.239,.028],[.317,.016],[.419,.008]]}
};
function metallicVoice(input,speaker='tenbot'){
 const profile=profiles[speaker];if(!profile)throw Error('Unknown character voice');
 let fmt,data;
 for(let o=12;o+8<=input.length;){const n=input.readUInt32LE(o+4),id=input.toString('ascii',o,o+4);if(id==='fmt ')fmt=Buffer.from(input.subarray(o+8,o+8+n));if(id==='data')data=input.subarray(o+8,o+8+n);o+=8+n+(n%2);}
 if(!fmt||!data||fmt.readUInt16LE(0)!==1||fmt.readUInt16LE(14)!==16)throw Error('Expected 16-bit PCM WAV');
 const channels=fmt.readUInt16LE(2),rate=Math.round(fmt.readUInt32LE(4)*profile.pitch);
 fmt.writeUInt32LE(rate,4);fmt.writeUInt32LE(rate*fmt.readUInt16LE(12),8);
 const taps=profile.taps.map(([seconds,gain])=>[Math.round(seconds*rate)*channels,gain]);
 const count=data.length/2,out=Buffer.alloc(data.length+taps.at(-1)[0]*2);let peak=1;
 const samples=new Float64Array(out.length/2);
 const low=new Float64Array(channels),envelope=new Float64Array(channels);let seed=173;
 for(let i=0;i<samples.length;i++){
  const channel=i%channels,x=i<count?data.readInt16LE(i*2):0,t=Math.floor(i/channels)/rate;
  low[channel]+=.22*(x-low[channel]);const bright=x-low[channel];
  envelope[channel]=Math.max(Math.abs(bright),envelope[channel]*.985);
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;
  const rasp=(seed/4294967296*2-1)*envelope[channel]*profile.scrape;
  let value=x*profile.dry+bright*profile.metal*(.65*Math.sin(2*Math.PI*73*t)+.35*Math.sin(2*Math.PI*131*t))+rasp;
  for(const [delay,gain] of taps)if(i>=delay&&i-delay<count)value+=data.readInt16LE((i-delay)*2)*gain;
  samples[i]=value;peak=Math.max(peak,Math.abs(value));
 }
 const gain=Math.min(1,29000/peak);for(let i=0;i<samples.length;i++)out.writeInt16LE(Math.round(samples[i]*gain),i*2);
 const header=Buffer.alloc(44);header.write('RIFF');header.writeUInt32LE(36+out.length,4);header.write('WAVEfmt ',8);header.writeUInt32LE(16,16);fmt.copy(header,20,0,16);header.write('data',36);header.writeUInt32LE(out.length,40);return Buffer.concat([header,out]);
}
module.exports={metallicVoice,profiles};
if(require.main===module){
 const fs=require('fs'),path=require('path'),raw=process.argv[2];
 if(!raw)throw Error('Supply a directory of fresh, untreated WAV recordings.');
 if(path.resolve(raw)===path.resolve('assets/voice'))throw Error('Do not reprocess finished voice assets.');
 const clips=JSON.parse(fs.readFileSync('assets/voice/transcripts.json','utf8'));
 for(const clip of clips){clip.speaker=clip.id.startsWith('comic-')?'martian':'tenbot';fs.writeFileSync('assets/voice/'+clip.id+'.wav',metallicVoice(fs.readFileSync(path.join(raw,clip.id+'.wav')),clip.speaker));}
 fs.writeFileSync('voice-clips.js','window.PlanetVoiceClips = '+JSON.stringify(clips.map(c=>({...c,src:'assets/voice/'+c.id+'.wav?v=characters3'})))+';\n');
 console.log(`Rendered ${clips.length} character clips from untreated speech.`);
}

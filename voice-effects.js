'use strict';
// Offline effect: intelligible dry voice, very quiet short metallic reflections.
function metallicVoice(input){
 let fmt,data;
 for(let o=12;o+8<=input.length;){const n=input.readUInt32LE(o+4),id=input.toString('ascii',o,o+4);if(id==='fmt ')fmt=Buffer.from(input.subarray(o+8,o+8+n));if(id==='data')data=input.subarray(o+8,o+8+n);o+=8+n+(n%2);}
 if(!fmt||!data||fmt.readUInt16LE(0)!==1||fmt.readUInt16LE(14)!==16)throw Error('Expected 16-bit PCM WAV');
 const channels=fmt.readUInt16LE(2),rate=Math.round(fmt.readUInt32LE(4)*1.18);
 fmt.writeUInt32LE(rate,4);fmt.writeUInt32LE(rate*fmt.readUInt16LE(12),8);
 const taps=[[.023,.13],[.061,.08],[.115,.045]].map(([seconds,gain])=>[Math.round(seconds*rate)*channels,gain]);
 const count=data.length/2,out=Buffer.alloc(data.length+taps.at(-1)[0]*2);let peak=1;
 const samples=new Float64Array(out.length/2);
 for(let i=0;i<samples.length;i++){let value=i<count?data.readInt16LE(i*2)*.88:0;for(const [delay,gain] of taps)if(i>=delay&&i-delay<count)value+=data.readInt16LE((i-delay)*2)*gain;samples[i]=value;peak=Math.max(peak,Math.abs(value));}
 const gain=Math.min(1,30000/peak);for(let i=0;i<samples.length;i++)out.writeInt16LE(Math.round(samples[i]*gain),i*2);
 const header=Buffer.alloc(44);header.write('RIFF');header.writeUInt32LE(36+out.length,4);header.write('WAVEfmt ',8);header.writeUInt32LE(16,16);fmt.copy(header,20,0,16);header.write('data',36);header.writeUInt32LE(out.length,40);return Buffer.concat([header,out]);
}
module.exports={metallicVoice};
if(require.main===module){const fs=require('fs');for(const clip of JSON.parse(fs.readFileSync('assets/voice/transcripts.json','utf8'))){const path='assets/voice/'+clip.id+'.wav';fs.writeFileSync(path,metallicVoice(fs.readFileSync(path)));}}

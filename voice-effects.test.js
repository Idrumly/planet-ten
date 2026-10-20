const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {metallicVoice}=require('./voice-effects');
test('all 57 clips have the correct character and a fresh asset version',()=>{
 const ctx={window:{}};vm.runInNewContext(fs.readFileSync('voice-clips.js','utf8'),ctx);
 assert.equal(ctx.window.PlanetVoiceClips.length,57);
 for(const clip of ctx.window.PlanetVoiceClips){assert.equal(clip.speaker,clip.id.startsWith('comic-')?'martian':'tenbot');assert.match(clip.src,/characters3/);}
});
function wav(){const b=Buffer.alloc(44+22050*2);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(22050,24);b.writeUInt32LE(44100,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(b.length-44,40);return b;}
test('both voices retain dominant dry speech, bounded reverb and silent pauses',()=>{
 const impulse=wav();impulse.writeInt16LE(10000,44);
 for(const speaker of ['martian','tenbot']){
  const out=metallicVoice(impulse,speaker),rate=out.readUInt32LE(24);
  assert.equal(out.readUInt32LE(4),out.length-8);assert.ok(out.readInt16LE(44)>8000);
  assert.ok(out.length>impulse.length&&out.length<impulse.length+rate*2*.5);
  let lateEnergy=0;for(let i=44+Math.round(rate*.1)*2;i<out.length;i+=2)lateEnergy+=Math.abs(out.readInt16LE(i));assert.ok(lateEnergy>0);
  assert.ok(metallicVoice(wav(),speaker).subarray(44).every(x=>x===0));
 }
 assert.ok(metallicVoice(impulse,'martian').readUInt32LE(24)<22050);
 assert.ok(metallicVoice(impulse,'tenbot').readUInt32LE(24)>22050);
});
test('metal and reverb cannot clip even a full-scale source',()=>{
 const loud=wav();for(let i=44;i<loud.length;i+=2)loud.writeInt16LE(Math.round(32767*Math.sin(i*.12)),i);
 for(const speaker of ['martian','tenbot']){const processed=metallicVoice(loud,speaker);for(let i=44;i<processed.length;i+=2)assert.ok(Math.abs(processed.readInt16LE(i))<=29000);}
});
test('refuses unsupported audio and character names',()=>{
 assert.throws(()=>metallicVoice(Buffer.alloc(44)),/PCM/);
 assert.throws(()=>metallicVoice(wav(),'unknown'),/character/);
});

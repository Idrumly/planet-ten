import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyStudy,finishPetal,recallAttempt,ready,prize,newGarden,settleStudy,restoreGarden,nextGarden} from './flower-study.mjs';
import {createStudyAudio} from './flower-audio.mjs';
test('study requires a look, recall attempt and completed clue; replay cannot farm bonus',()=>{
 let s=emptyStudy();assert.equal(ready(s),false);s=finishPetal(s,'definition');assert.equal(prize(s),3);assert.equal(prize(finishPetal(s,'definition')),3);
 s=recallAttempt({...s,shown:true});assert.equal(ready(s),true);assert.equal(prize(s),4);
 let p=newGarden(['bee']);p.studies.bee=s;assert.equal(settleStudy(p,'bee','be').award,0);
 const result=settleStudy(p,'bee','BEE',123);assert.equal(result.award,4);assert.equal(result.profile.collection.bee.at,123);assert.equal(settleStudy(result.profile,'bee','bee').award,0);
 const saved=restoreGarden(JSON.parse(JSON.stringify(result.profile)),['bee']);assert.equal(saved.balance,4);assert.equal(saved.studies.bee.settled,true);
 const next=nextGarden(saved,['bee'],5);assert.equal(next.collection.bee.at,123);assert.equal(next.balance,4);assert.deepEqual(next.studies,{});
});
test('audio cancellation, failure, replacement and natural completion are distinct',async()=>{
 const clips=[];const player=createStudyAudio({synth:null,makeAudio:()=>{const clip={play:()=>Promise.resolve(),pause(){}};clips.push(clip);return clip;}});
 let p=player.play({url:'one'});player.stop();assert.equal(await p,'stopped');assert.equal(clips[0].onended,null);
 p=player.play({url:'two'});clips[1].onerror();assert.equal(await p,'error');
 p=player.play({url:'three'});const q=player.play({url:'four'});assert.equal(await p,'stopped');clips[3].onended();assert.equal(await q,'ended');
});
test('corrupt saved data cannot insert unknown words or duplicate petals',()=>{
 const p=restoreGarden({version:1,balance:-10,round:['bee','bee','unknown'],studies:{bee:{listened:['show','show','bad']}},collection:{unknown:{at:1}}},['bee']);
 assert.equal(p.balance,0);assert.deepEqual(p.round,['bee']);assert.deepEqual(p.studies.bee.listened,['show']);assert.deepEqual(p.collection,{});
});

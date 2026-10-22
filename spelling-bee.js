'use strict';
// Social studies vocabulary, performed by the room's residents (not another quiz).
const SpellingBee = (() => {
 const entries = [
  ['community','Our community shares nectar. Except Gary. Gary labels his jars.','A sweet start. Community spirit, with wings.'],
  ['citizen','Every citizen has a voice. Ours makes a buzzing noise.','Correct. Your citizenship is pollen-approved.'],
  ['culture','Our culture includes dancing, music, and judging other flowers.','Cultured. Like yoghurt, but with better shoes.'],
  ['region','This region receives frequent showers of confused pollen.','Correct. A blooming good region.'],
  ['climate','The climate is changing. My petals have requested a cardigan.','Correct. Forecast: scattered applause.'],
  ['resource','Nectar is a resource. So is a very patient spelling judge.','Correct. Patience reserves are recovering.'],
  ['tradition','Our tradition is to ring a bell and pretend we planned this.','Correct. A time-honoured ding.'],
  ['government','The government has formed a committee to count our committees.','Correct. Approved by the approval committee.'],
  ['democracy','In our democracy every flower gets a vote. The weeds are campaigning.','Correct. The ayes have it. All three of them.'],
  ['election','The election was close. The cactus ran on a prickly platform.','Correct. A landslide in the flower bed.'],
  ['geography','Geography explains where we are. It cannot explain why Gary is here.','Correct. You are going places. Mostly flowers.'],
  ['province','Our province exports honey and imports emergency napkins.','Correct. Provincial pride, locally pollinated.'],
  ['territory','This territory belongs to the bees. The picnic was a misunderstanding.','Correct. Please respect the jam boundary.'],
  ['environment','Protect the environment. It is where we keep all the snacks.','Correct. Reduce, reuse, re-pollinate.'],
  ['cooperation','Cooperation means working together. Even when Gary brings a kazoo.','Perfect! A standing ovation. Those with roots may remain planted.']
 ];
 const judges=['Judge Petal','Professor Pollen','Dame Dandelion'];
 function beat(index,phase){
  const [word,sentence,verdict]=entries[index],judge=judges[index%judges.length];
  if(phase===0)return {speaker:judge,text:`Please spell ${word.toUpperCase()}. ${sentence}`,voice:`Please spell ${word}. ${sentence}`,duration:11000,judge:index%3};
  if(phase===1)return {speaker:'Chief Speller',text:`${word.toUpperCase()}. ${[...word.toUpperCase()].join(' · ')}. ${word.toUpperCase()}!`,voice:`${word}. ${[...word.toUpperCase()].join('. ')}. ${word}.`,duration:Math.max(8500,word.length*850),judge:index%3};
  return {speaker:judge,text:verdict,voice:verdict,duration:index===14?8500:6500,judge:index%3};
 }
 function next(index,phase){return phase===2?{index:(index+1)%entries.length,phase:0}:{index,phase:phase+1};}
 return {entries,judges,beat,next};
})();
if(typeof module!=='undefined')module.exports=SpellingBee;

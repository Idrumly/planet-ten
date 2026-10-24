'use strict';
(function(root){
 const gags=[
  ['fuse','A very short fuse',3000,'An excellent career in ash. Still blinking.','ash'],
  ['balloon','Air today, gone tomorrow',2900,'Please keep your worm inflated until landing.','balloon'],
  ['taxi','Off-duty noodle',3200,'Taxi! Take me somewhere without maths.','taxi'],
  ['licorice','Licorice lunch',3100,'Cloudbun gives this lock five delicious stars.','cloudbun'],
  ['puddle','Pink thinking',3400,'Now available as a cheerful strawberry puddle.','puddle'],
  ['bubbles','Bubble resignation',2900,'Security has floated a new proposal.','bubble'],
  ['hoop','Full circle',3100,'A well-rounded escape.','hoop'],
  ['slipper','A perfect fit',4000,'One slipper. No feet. A surprisingly good fit.','gown'],
  ['wizard','Wigglus Gigglus!',3300,'The spell worked. The wizard is as surprised as you.','frog'],
  ['starblade','The noodle awakens',3300,'A space knight discovers the glowblade is ticklish.','blade'],
  ['disco','Disco infer-noodle',3000,'Security has left to pursue interpretive disco.','disco'],
  ['popcorn','Pop quiz',2800,'A pop quiz with extra butter.','popcorn'],
  ['rocket','Launch break',3000,'One small wiggle. One giant leap for wormkind.','rocket'],
  ['zipper','Management material',3600,'Your exit has been approved by the department head.','zipper'],
  ['portal','Wrong dimension',3200,'Found the sock dimension. Keeping the socks.','sock'],
  ['origami','Paperwork escape',2900,'Fold here. Escape there.','plane'],
  ['magician','The disappearing act',3300,'The hat pulled a worm out of a magician.','hat'],
  ['sneeze','Achoo-choo!',2800,'Bless you. And your seventeen tiny moustaches.','moustache'],
  ['skate','Roll model',2900,'Please do not feed the skateboarding security.','skate'],
  ['pancake','Flipping brilliant',3200,'Chef says the lock is done on both sides.','pancake'],
  ["jiggles","Six steps to freedom",4000,"Six dancers. Twelve feet. Absolutely no security.","spark"],
  ["rahrah","Give me an unlocked!",3600,"The pompoms keep cheering after the cheerleader stops.","spark"],
  ["crumpet","Toast of the department",3600,"Carried away by enthusiastic breakfast appliances.","spark"],
  ["howlie","A very small howl",3600,"Terrifying. If you happen to be a biscuit.","spark"],
  ["roswell","Earthlings are strange",4000,"Earth has collected a highly qualified specimen.","spark"],
  ["splat","A sole promotion",3400,"Delighted with the new position in footwear.","spark"],
  ["encore","Thank you for the opportunity",4000,"Three Xs. One unforgettable exit interview.","spark"],
  ["drippy","Still wet",3200,"Please allow security to dry before handling.","spark"],
  ["eightball","A lucky break",3400,"Security has been comprehensively scattered.","spark"],
  ["peepers","An eggsellent escape",3800,"The last hatchling remembered its safety helmet.","spark"],
  ["clank","Magnetic personality",3600,"A promising new career as a fridge decoration.","spark"],
  ["byte","Eight bits of security",3400,"One last pixel refuses to be digested.","spark"],
  ["lobat","Please recharge your worm",3200,"Texture subscription expired at a difficult moment.","spark"],
  ["click","Drag to recycle",3600,"Thank you for recycling your security responsibly.","spark"]
 ].map(([id,title,duration,caption,ending])=>Object.freeze({id,title,duration,caption,ending}));
 function createDeck({random=Math.random,storage=null}={}){
  const key='planet-ten-lock-gag-deck-v2',ids=gags.map(g=>g.id);let bag=[],last='';
  try{const saved=JSON.parse(storage?.getItem(key)||'null');if(saved&&Array.isArray(saved.bag)&&saved.bag.every(id=>ids.includes(id))&&new Set(saved.bag).size===saved.bag.length){bag=saved.bag;last=ids.includes(saved.last)?saved.last:'';}}catch{}
  return {next(){
   if(!bag.length){bag=[...ids];for(let i=bag.length-1;i>0;i--){const j=Math.max(0,Math.min(i,Math.floor(random()*(i+1))));[bag[i],bag[j]]=[bag[j],bag[i]];}if(bag.at(-1)===last)[bag[0],bag[bag.length-1]]=[bag.at(-1),bag[0]];}
   last=bag.pop();try{storage?.setItem(key,JSON.stringify({bag,last}));}catch{}
   return gags.find(g=>g.id===last);
  }};
 }
 const api={gags,createDeck};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LockGagModel=api;
})(typeof window==='undefined'?globalThis:window);

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
  ['zipper','Unzip reality',3000,'The worm was a zip all along. Very discreet.','zipper'],
  ['portal','Wrong dimension',3200,'Found the sock dimension. Keeping the socks.','sock'],
  ['origami','Paperwork escape',2900,'Fold here. Escape there.','plane'],
  ['magician','The disappearing act',3300,'The hat pulled a worm out of a magician.','hat'],
  ['sneeze','Achoo-choo!',2800,'Bless you. And your seventeen tiny moustaches.','moustache'],
  ['skate','Roll model',2900,'Please do not feed the skateboarding security.','skate'],
  ['pancake','Flipping brilliant',3200,'Chef says the lock is done on both sides.','pancake']
 ].map(([id,title,duration,caption,ending])=>Object.freeze({id,title,duration,caption,ending}));
 function createDeck({random=Math.random,storage=null}={}){
  const key='planet-ten-lock-gag-deck-v1',ids=gags.map(g=>g.id);let bag=[],last='';
  try{const saved=JSON.parse(storage?.getItem(key)||'null');if(saved&&Array.isArray(saved.bag)&&saved.bag.every(id=>ids.includes(id))&&new Set(saved.bag).size===saved.bag.length){bag=saved.bag;last=ids.includes(saved.last)?saved.last:'';}}catch{}
  return {next(){
   if(!bag.length){bag=[...ids];for(let i=bag.length-1;i>0;i--){const j=Math.max(0,Math.min(i,Math.floor(random()*(i+1))));[bag[i],bag[j]]=[bag[j],bag[i]];}if(bag.at(-1)===last)[bag[0],bag[bag.length-1]]=[bag.at(-1),bag[0]];}
   last=bag.pop();try{storage?.setItem(key,JSON.stringify({bag,last}));}catch{}
   return gags.find(g=>g.id===last);
  }};
 }
 const api={gags,createDeck};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LockGagModel=api;
})(typeof window==='undefined'?globalThis:window);

// Rewards are integer half-Hexes: no floating point accounting.
export const petalKeys=['sentence','definition','partOfSpeech','wordHistory','human','show'];
export const normalizeAnswer=value=>String(value).normalize('NFKC').trim().toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ');
export const emptyStudy=()=>({listened:[],shown:false,attempted:false,settled:false});
export const prize=study=>2+new Set(study.listened.filter(k=>petalKeys.includes(k))).size;
export const ready=study=>study.shown&&study.attempted&&study.listened.some(k=>k!=='show');
export function finishPetal(study,key){return !petalKeys.includes(key)||key==='show'||study.settled?study:{...study,listened:[...new Set([...study.listened,key])]};}
export function recallAttempt(study){if(!study.shown||study.settled)return study;return {...study,attempted:true,listened:[...new Set([...study.listened,'show'])]};}
export function settleStudy(profile,word,answer,now=Date.now()){
 const study=profile.studies[word]||emptyStudy();
 if(study.settled||!ready(study)||normalizeAnswer(answer)!==normalizeAnswer(word))return {profile,award:0};
 const award=prize(study);return {award,profile:{...profile,balance:profile.balance+award,studies:{...profile.studies,[word]:{...study,settled:true}},collection:{...profile.collection,[word]:profile.collection[word]||{at:now}},lastAward:award}};
}
export function drawGarden(words,size=5,random=Math.random){const pool=[...new Set(words)];for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}return pool.slice(0,size);}
export function newGarden(words,size=5){return {version:1,balance:0,round:drawGarden(words,size),studies:{},collection:{},roundNumber:1};}
export function restoreGarden(raw,words){const p=newGarden(words);if(raw?.version!==1)return p;const allowed=new Set(words);const round=Array.isArray(raw.round)?[...new Set(raw.round.filter(w=>allowed.has(w)))].slice(0,10):[];
 p.round=round.length?round:p.round;p.balance=Number.isSafeInteger(raw.balance)&&raw.balance>=0?Math.min(raw.balance,1000000):0;p.roundNumber=Number.isSafeInteger(raw.roundNumber)?Math.max(1,raw.roundNumber):1;
 for(const w of p.round){const s=raw.studies?.[w];if(s)p.studies[w]={listened:[...new Set((Array.isArray(s.listened)?s.listened:[]).filter(k=>petalKeys.includes(k)))],heard:s.heard===true,shown:s.shown===true,attempted:s.attempted===true,settled:s.settled===true};}
 for(const w of words)if(raw.collection?.[w])p.collection[w]={at:Number(raw.collection[w].at)||0};return p;
}
export function nextGarden(profile,words,size){return {...profile,round:drawGarden(words,size),studies:{},roundNumber:profile.roundNumber+1};}

// Design-playground rules only. Production rewards must be server-authoritative.
export const options={
 wings:{label:'Wing shape',choices:{petal:'Petal wings',round:'Round wings',swift:'Swift wings'}},
 pattern:{label:'Wing pattern',choices:{veins:'Silver veins',spots:'Pollen spots',stars:'Little stars'}},
 stripes:{label:'Stripe design',choices:{classic:'Classic bands',zigzag:'Zigzag bands',dots:'Dappled dots'}},
 eyes:{label:'Eye colour',choices:{teal:'Lagoon teal',blue:'Sky blue',violet:'Violet',brown:'Warm brown'}},
 hair:{label:'Hair style',choices:{tuft:'Little tuft',curls:'Pollen curls',smooth:'Smooth'}},
 hairColour:{label:'Hair colour',choices:{gold:'Honey gold',brown:'Chestnut',pink:'Petal pink',silver:'Moon silver'}},
 lips:{label:'Lip colour',choices:{rose:'Rose',berry:'Berry',amber:'Amber',natural:'Natural'}},
 voice:{label:'Bee voice style',choices:{lower:'Lower · male-style',higher:'Higher · female-style'}}
};
export const defaultLook={wings:'petal',pattern:'veins',stripes:'classic',eyes:'teal',hair:'tuft',hairColour:'gold',lips:'natural',voice:'higher'};
export function cleanLook(value){return Object.fromEntries(Object.keys(options).map(k=>[k,Object.hasOwn(options[k].choices,value?.[k])?value[k]:defaultLook[k]]));}
export function newProfile(){return {version:1,look:{...defaultLook},madeOver:false,balance:20,earned:[],index:0};}
export function restoreProfile(data){const p=newProfile();if(!data||data.version!==1)return p;return {...p,look:cleanLook(data.look),madeOver:data.madeOver===true,balance:Number.isSafeInteger(data.balance)&&data.balance>=0&&data.balance<=10000?data.balance:20,earned:Array.isArray(data.earned)?[...new Set(data.earned.filter(x=>Number.isInteger(x)&&x>=0&&x<10))]:[],index:Number.isInteger(data.index)&&data.index>=0&&data.index<10?data.index:0};}
export function makeover(profile,draft){const look=cleanLook(draft);const changed=Object.keys(options).some(k=>look[k]!==profile.look[k]);const cost=profile.madeOver&&changed?10:0;if(profile.balance<cost)throw new Error('A new makeover costs 10 Hexes. Keep this look for now, or earn a few more in the garden.');return {...profile,look,madeOver:true,balance:profile.balance-cost};}
export function potential(unlocked){return Math.max(0,5-Math.max(0,new Set(unlocked).size-1));}
export function settle(profile,index,correct,unlocked){if(!correct||profile.earned.includes(index))return {profile,award:0};const award=potential(unlocked);return {profile:{...profile,balance:profile.balance+award,earned:[...profile.earned,index]},award};}
export function appendLetter(answer,key){return /^[a-z '-]$/.test(key)&&answer.length<80?answer+key:answer;}
export const questions=[
 {word:'sun',sentence:'The sun is shining above the garden.',definition:'The star that gives Earth light and warmth.',partOfSpeech:'Noun.',languageOrigin:'Old English.',wordHistory:'The word sun has been used in English for many hundreds of years.'},
 {word:'and',sentence:'The bee has wings and antennae.',definition:'A word that joins things together.',partOfSpeech:'Conjunction.',languageOrigin:'Old English.',wordHistory:'And is one of the small joining words inherited from early English.'},
 {word:'in',sentence:'The honey is in the jar.',definition:'Inside something.',partOfSpeech:'Preposition.',languageOrigin:'Old English.',wordHistory:'In is an old English word that has kept a very similar form.'},
 {word:'it',sentence:'The flower opened. It was purple.',definition:'A word used instead of the name of a thing.',partOfSpeech:'Pronoun.',languageOrigin:'Old English.',wordHistory:'An earlier form of it began with an extra sound that English later lost.'},
 {word:'can',sentence:'I can flap my wings.',definition:'To be able to do something.',partOfSpeech:'Verb.',languageOrigin:'Old English.',wordHistory:'An early meaning of can was to know how.'},
 {word:'up',sentence:'The bee flew up into the sky.',definition:'Toward a higher place.',partOfSpeech:'Adverb.',languageOrigin:'Old English.',wordHistory:'Up has been a short direction word throughout the history of English.'},
 {word:'we',sentence:'We will visit the garden together.',definition:'A word for the speaker and one or more other people.',partOfSpeech:'Pronoun.',languageOrigin:'Old English.',wordHistory:'We is one of the pronouns passed down from early English.'},
 {word:'go',sentence:'Let us go to the hive.',definition:'To move or travel somewhere.',partOfSpeech:'Verb.',languageOrigin:'Old English.',wordHistory:'Go and its past tense went came from different older words.'},
 {word:'that',sentence:'That flower is enormous.',definition:'A word that can point to a particular thing.',partOfSpeech:'Determiner, in this sentence.',languageOrigin:'Old English.',wordHistory:'That belongs to an old family of pointing words in English.'},
 {word:'is',sentence:'The hive is warm.',definition:'A form of the verb be, used with one person or thing.',partOfSpeech:'Verb.',languageOrigin:'Old English.',wordHistory:'Is is a very old form of the verb be.'}
];
export const clueNames={sentence:'Sentence',partOfSpeech:'Part of speech',definition:'Definition',languageOrigin:'Word origin',wordHistory:'Word history'};

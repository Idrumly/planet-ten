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
export function newProfile(){return {version:2,round:drawTutorial(),look:{...defaultLook},madeOver:false,balance:20,earned:[],index:0};}
export function restoreProfile(data){const p=newProfile();if(!data||![1,2].includes(data.version))return p;const validRound=data.version===2&&Array.isArray(data.round)&&data.round.length===10&&new Set(data.round).size===10&&data.round.every(w=>questions.some(q=>q.word===w));return {...p,look:cleanLook(data.look),madeOver:data.madeOver===true,balance:Number.isSafeInteger(data.balance)&&data.balance>=0&&data.balance<=10000?data.balance:20,earned:data.version===2&&Array.isArray(data.earned)?[...new Set(data.earned.filter(w=>questions.some(q=>q.word===w)))]:[],round:validRound?data.round:p.round,index:validRound&&Number.isInteger(data.index)&&data.index>=0&&data.index<10?data.index:0};}
export function makeover(profile,draft){const look=cleanLook(draft);const changed=Object.keys(options).some(k=>look[k]!==profile.look[k]);const cost=profile.madeOver&&changed?10:0;if(profile.balance<cost)throw new Error('A new makeover costs 10 Hexes. Keep this look for now, or earn a few more in the garden.');return {...profile,look,madeOver:true,balance:profile.balance-cost};}
export function potential(unlocked){return Math.max(0,5-Math.max(0,new Set(unlocked).size-1));}
export function settle(profile,index,correct,unlocked){if(!correct||profile.earned.includes(index))return {profile,award:0};const award=potential(unlocked);return {profile:{...profile,balance:profile.balance+award,earned:[...profile.earned,index]},award};}
export function appendLetter(answer,key){return /^[a-z '-]$/.test(key)&&answer.length<80?answer+key:answer;}
export const questions=[
  {
    "word": "hive",
    "sentence": "The bee returned to the hive.",
    "definition": "A home where a group of bees lives.",
    "partOfSpeech": "Noun."
  },
  {
    "word": "honey",
    "sentence": "The bees stored honey.",
    "definition": "A sweet food made by bees.",
    "partOfSpeech": "Noun."
  },
  {
    "word": "wing",
    "sentence": "The bee stretched one wing.",
    "definition": "A body part used for flying.",
    "partOfSpeech": "Noun."
  },
  {
    "word": "sting",
    "sentence": "A bee may sting to defend itself.",
    "definition": "To hurt with a sharp pointed body part.",
    "partOfSpeech": "Verb."
  },
  {
    "word": "pollen",
    "sentence": "The bee carried pollen from the flower.",
    "definition": "Fine powder made by flowers.",
    "partOfSpeech": "Noun."
  },
  {
    "word": "buzz",
    "sentence": "We heard the bee buzz.",
    "definition": "To make a low humming sound.",
    "partOfSpeech": "Verb."
  },
  {
    "word": "comb",
    "sentence": "The bees filled the comb with honey.",
    "definition": "A structure of small cells made by bees.",
    "partOfSpeech": "Noun."
  },
  {
    "word": "fly",
    "sentence": "The bee can fly above the garden.",
    "definition": "To move through the air.",
    "partOfSpeech": "Verb."
  },
  {
    "word": "queen",
    "sentence": "The queen laid eggs in the hive.",
    "definition": "The egg-laying female in a bee colony.",
    "partOfSpeech": "Noun."
  },
  {
    "word": "swarm",
    "sentence": "A swarm of bees flew past.",
    "definition": "A large group of bees moving together.",
    "partOfSpeech": "Noun."
  },
  {
    "word": "wax",
    "sentence": "Bees use wax to build their comb.",
    "definition": "A material bees make to build cells in their hive.",
    "partOfSpeech": "Noun."
  },
  {
    "word": "clover",
    "sentence": "The bee landed on the clover.",
    "definition": "A small plant with rounded leaflets and clusters of tiny flowers.",
    "partOfSpeech": "Noun."
  },
  {
    "word": "garden",
    "sentence": "Flowers grow in the garden.",
    "definition": "A place where people grow plants.",
    "partOfSpeech": "Noun."
  },
  {
    "word": "planet",
    "sentence": "Our bee lives on a distant planet.",
    "definition": "A large world that travels around a star.",
    "partOfSpeech": "Noun."
  },
  {
    "word": "ten",
    "sentence": "There are ten flowers on the path.",
    "definition": "The number after nine.",
    "partOfSpeech": "Number."
  },
  {
    "word": "baby",
    "sentence": "The baby bee was growing.",
    "definition": "A very young child or animal.",
    "partOfSpeech": "Noun."
  },
  {
    "word": "papa",
    "sentence": "The little bee waved to Papa.",
    "definition": "An affectionate name for a father.",
    "partOfSpeech": "Noun."
  },
  {
    "word": "fire",
    "sentence": "The FireBee watched the fire glow.",
    "definition": "Burning that gives off heat and light.",
    "partOfSpeech": "Noun."
  },
  {
    "word": "bloom",
    "sentence": "The flowers will bloom in spring.",
    "definition": "To produce or open flowers.",
    "partOfSpeech": "Verb."
  },
  {
    "word": "egg",
    "sentence": "A young bee begins as an egg.",
    "definition": "A small structure from which a young animal can develop.",
    "partOfSpeech": "Noun."
  },
  {
    "word": "hum",
    "sentence": "The bee began to hum.",
    "definition": "To make a low steady sound.",
    "partOfSpeech": "Verb."
  },
  {
    "word": "sweet",
    "sentence": "The honey tasted sweet.",
    "definition": "Having a taste like sugar.",
    "partOfSpeech": "Adjective."
  },
  {
    "word": "summer",
    "sentence": "The garden was full of flowers in summer.",
    "definition": "The warm season between spring and autumn.",
    "partOfSpeech": "Noun."
  },
  {
    "word": "nectar",
    "sentence": "The bee drank nectar from a flower.",
    "definition": "A sweet liquid made by flowers.",
    "partOfSpeech": "Noun."
  },
  {
    "word": "human",
    "sentence": "A human spoke through the hologram.",
    "definition": "A person.",
    "partOfSpeech": "Noun."
  },
  {
    "word": "spell",
    "sentence": "The bee learned to spell a new word.",
    "definition": "To name or write the letters of a word in order.",
    "partOfSpeech": "Verb."
  },
  {
    "word": "quest",
    "sentence": "The bee began a quest to help the family.",
    "definition": "A journey or search to achieve something important.",
    "partOfSpeech": "Noun."
  }
];
export function drawTutorial(random=Math.random){const words=questions.map(q=>q.word);for(let i=words.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[words[i],words[j]]=[words[j],words[i]];}return words.slice(0,10);}
export const clueNames={sentence:'Sentence',partOfSpeech:'Part of speech',definition:'Definition',languageOrigin:'Word origin',wordHistory:'Word history'};

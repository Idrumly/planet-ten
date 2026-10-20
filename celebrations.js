'use strict';
const C=GlowCelebrations,selectPattern=document.getElementById('pattern'),motion=document.getElementById('motion'),running=new Set();
let motionOff=matchMedia('(prefers-reduced-motion: reduce)').matches;
function updateMotion(){document.documentElement.classList.toggle('still',motionOff);motion.textContent=motionOff?'Motion off':'Motion on';motion.setAttribute('aria-pressed',String(motionOff));if(motionOff)for(const a of running)a.finish();}
updateMotion();motion.onclick=()=>{motionOff=!motionOff;updateMotion();};matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{motionOff=e.matches;updateMotion();});
C.patterns.forEach(([name],i)=>{const o=document.createElement('option');o.value=i;o.textContent=`${i+1}. ${name}`;selectPattern.append(o);});
const specimens=[];
for(const [unit,total,title,description] of [['ones',1,'One','1 one · 1 block'],['tens',10,'Ten','10 ones = 1 ten · 1 block'],['hundreds',100,'Hundred','10 tens = 1 hundred · 1 block']]){
 const card=document.createElement('section');card.className=`specimen ${unit}`;card.innerHTML=`<h2>${title}</h2><div class="value">${total}</div><div class="stage"><div class="cells" role="img" aria-label="${title}: ${total} connected unit cells"></div></div><p class="representation">${description}</p><button>Celebrate the ${title.toLowerCase()}</button>`;
 for(let i=0;i<total;i++){const c=document.createElement('span');c.className='cell';c.append(C.core());card.querySelector('.cells').append(c);}
 card.querySelector('button').onclick=()=>play(card,unit);document.getElementById('specimens').append(card);specimens.push([card,unit]);
}
async function play(card,unit){const b=card.querySelector('button');if(b.disabled)return;b.disabled=true;try{await C.play(card,unit,Number(selectPattern.value),{still:motionOff,active:running});}finally{b.disabled=false;}}
async function all(){const controls=[selectPattern,document.getElementById('play-all'),document.getElementById('next-pattern')];controls.forEach(c=>c.disabled=true);document.getElementById('lab-status').textContent=C.patterns[selectPattern.value][0]+(motionOff?' · motion off; shapes and values preserved.':' · same value, strange celebration.');try{await Promise.all(specimens.map(([card,unit])=>play(card,unit)));}finally{controls.forEach(c=>c.disabled=false);}}
document.getElementById('play-all').onclick=all;document.getElementById('next-pattern').onclick=()=>{selectPattern.value=(Number(selectPattern.value)+1)%20;all();};

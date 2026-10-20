'use strict';
(function(root){
  const contracts=[
    {id:'first-shift',name:'First shift · 28 · 2 keys',value:28,start:{tens:2,ones:8},keys:[{kind:'blocks',amount:19},{kind:'blocks',amount:10}]},
    {id:'microwave',name:'Round two · 45 · 3 keys',value:45,start:{tens:4,ones:5},keys:[{kind:'tens',amount:3},{kind:'blocks',amount:27},{kind:'fewest'}]},
    {id:'mixed-practice',name:'Round three · 64 · 5 keys',value:64,start:{tens:6,ones:4},keys:[{kind:'ones',amount:34},{kind:'tens',amount:5},{kind:'ones',amount:54},{kind:'blocks',amount:28},{kind:'ones',amount:4}]}
  ];
  const measure=(state,kind)=>(kind==='blocks'||kind==='fewest')?Object.values(state).reduce((a,b)=>a+b,0):(state[kind]||0);
  const value=state=>(state.ones||0)+10*(state.tens||0)+100*(state.hundreds||0)+1000*(state.thousands||0)+10000*(state.tenThousands||0)+100000*(state.hundredThousands||0);
  function matches(state,contract,index){const rule=contract.keys[index];return !!rule&&value(state)===contract.value&&measure(state,rule.kind)===(rule.kind==='fewest'?minimum(contract.value,contract.hundreds?100:10):rule.amount);}
  const instruction=rule=>rule.kind==='fewest'?'Use the fewest blocks.':`Use exactly ${rule.amount} ${rule.kind}.`;
  const progress=(state,rule)=>rule.kind==='fewest'?`${measure(state,'blocks')} blocks · Can you use fewer?`:`${measure(state,rule.kind)} / ${rule.amount} ${rule.kind}`;
  // Greedy minimum is exact for the available base-ten denominations.
  function minimum(n,largest){let count=0;for(let unit=largest;unit>=1;unit/=10){count+=Math.floor(n/unit);n%=unit;}return count;}
  const machines=[['vacuum','Dustbunny Dog Walker',2],['elevator','Grounded Elevator',3],['coffee','Mr. Martian’s Coffee Maker',3],['cheerleader','Weirdly Flexible Alien Cheerleader Robot from the Planet Zargon',4],['blender','Frankenfruit Blender',5]];
  const pick=(items,rng)=>items[Math.min(items.length-1,Math.floor(rng()*items.length))];
  function generate(id,rng=Math.random,previousValue){
   const spec=machines.find(m=>m[0]===id);if(!spec)throw Error('Unknown machine');
   let n=120+Math.floor(rng()*17)*10+2+Math.floor(rng()*7);if(n===previousValue)n=n>=280?n-10:n+10;
   const start={hundreds:Math.floor(n/100),tens:Math.floor(n%100/10),ones:n%10};
   const result={id,name:spec[1]+' · '+spec[2]+' keys',value:n,start,hundreds:true,random:true,keys:[]};
   const reps=[],allReps=[];for(let h=0;h<=Math.floor(n/100);h++)for(let t=0;t<=Math.floor((n-h*100)/10);t++){const o=n-h*100-t*10;allReps.push({hundreds:h,tens:t,ones:o});if(o<=29&&t<=19)reps.push({hundreds:h,tens:t,ones:o});}
   // The introductory vacuum key trades a flat for rods; later machines vary their opening constraint.
   const candidates=[];for(const state of reps)for(const kind of ['ones','hundreds','blocks','tens']){const amount=measure(state,kind);if(amount!==measure(start,kind)&&!candidates.some(r=>r.kind===kind&&r.amount===amount))candidates.push({kind,amount});}
   function build(path){
    if(path.length===spec[2]-1)return path;
    const last=path.at(-1),options=candidates.filter(r=>!path.some(k=>k.kind===r.kind&&k.amount===r.amount)&&(!last||!allReps.some(s=>measure(s,last.kind)===last.amount&&measure(s,r.kind)===r.amount)));
    const offset=options.length?Math.floor(rng()*options.length):0;
    for(let i=0;i<options.length;i++){const answer=build([...path,{...options[(i+offset)%options.length]}]);if(answer)return answer;}
    return null;
   }
   result.keys=build(id==='vacuum'?[{kind:'tens',amount:start.tens+10}]:[]);
   if(!result.keys)throw Error('No valid puzzle sequence');
   result.keys.push({kind:'fewest'});return result;
  }
  for(const [id] of machines)contracts.push(generate(id));
  function refresh(id){const i=contracts.findIndex(c=>c.id===id);if(contracts[i].random)contracts[i]=generate(id,Math.random,contracts[i].value);return contracts[i];}
  const api={contracts,measure,value,matches,instruction,progress,minimum,machines,generate,refresh};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PowerContracts=api;
})(typeof globalThis!=='undefined'?globalThis:this);

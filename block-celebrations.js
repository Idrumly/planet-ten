'use strict';
(function(root){
  // Only the contents animate. Containers remain 1 cell, 10 contiguous cells,
  // or a 10-by-10 hundred square throughout every celebration.
  const patterns=[
    ['Cyclops wink',[{transform:'scaleY(1)'},{transform:'scaleY(.12)'},{transform:'scaleY(1)'}]],
    ['Nosy neighbours',[{transform:'translateX(-18%)'},{transform:'translateX(18%)'},{transform:'translateX(0)'}]],
    ['Bubble hiccup',[{transform:'scale(.8)'},{transform:'scale(1.25)'},{transform:'scale(1)'}]],
    ['Diamond party',[{borderRadius:'50%',transform:'rotate(0)'},{borderRadius:'15%',transform:'rotate(135deg)'},{borderRadius:'50%',transform:'rotate(180deg)'}]],
    ['Pink lemonade',[{background:'#deff8e'},{background:'#ff8bc4'},{background:'#deff8e'}]],
    ['Tiny orbit',[{transform:'translate(-12%,0)'},{transform:'translate(0,-16%)'},{transform:'translate(12%,0)'},{transform:'translate(0,14%)'},{transform:'translate(0,0)'}]],
    ['Sleepy surprise',[{transform:'scaleY(.25)'},{transform:'scale(1.25)'},{transform:'scale(1)'}]],
    ['Jellybean shuffle',[{borderRadius:'50%'},{borderRadius:'70% 15% 70% 15%'},{borderRadius:'15% 70% 15% 70%'},{borderRadius:'50%'}]],
    ['Aquarium glow',[{background:'#deff8e'},{background:'#65edff'},{background:'#8aafff'},{background:'#deff8e'}]],
    ['Upside-down hello',[{transform:'rotate(0)'},{transform:'rotate(180deg)'},{transform:'rotate(360deg)'}]],
    ['Peeking periscope',[{transform:'translateY(16%) scale(.8)'},{transform:'translateY(-16%) scale(1.1)'},{transform:'translateY(0) scale(1)'}]],
    ['Alien heart',[{borderRadius:'50%'},{borderRadius:'50% 50% 12% 50%',transform:'rotate(45deg)'},{borderRadius:'50%',transform:'rotate(0)'}]],
    ['Royal plum',[{background:'#deff8e'},{background:'#c59bff'},{background:'#ffb6df'},{background:'#deff8e'}]],
    ['Squishy salute',[{transform:'skewX(0)'},{transform:'skewX(22deg)'},{transform:'skewX(-22deg)'},{transform:'skewX(0)'}]],
    ['Square dance',[{borderRadius:'50%'},{borderRadius:'5%',transform:'rotate(-45deg)'},{borderRadius:'5%',transform:'rotate(45deg)'},{borderRadius:'50%',transform:'rotate(0)'}]],
    ['Sunrise yolk',[{background:'#deff8e',transform:'translateY(14%)'},{background:'#ffc568',transform:'translateY(-14%)'},{background:'#deff8e',transform:'translateY(0)'}]],
    ['Rubber telescope',[{transform:'scale(1)'},{transform:'scale(.6,1.25)'},{transform:'scale(1.25,.6)'},{transform:'scale(1)'}]],
    ['Cosmic teardrop',[{borderRadius:'50%'},{borderRadius:'0 60% 60% 60%',transform:'rotate(45deg)'},{borderRadius:'50%',transform:'rotate(0)'}]],
    ['Mint moustache',[{transform:'scale(1)',borderRadius:'50%'},{transform:'scale(1.25,.6)',borderRadius:'10% 80% 10% 80%'},{transform:'scale(1)',borderRadius:'50%'}]],
    ['Golden applause',[{background:'#deff8e',transform:'scale(1)'},{background:'#ffe695',transform:'scale(1.2)'},{background:'#a7faff',transform:'scale(.85)'},{background:'#deff8e',transform:'scale(1)'}]]
  ];
  const bags={};
  function next(unit){if(!bags[unit]?.length){bags[unit]=patterns.map((_,i)=>i);for(let i=bags[unit].length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[bags[unit][i],bags[unit][j]]=[bags[unit][j],bags[unit][i]];}}return bags[unit].pop();}
  function core(){const n=document.createElement('span');n.className='nucleus';n.setAttribute('aria-hidden','true');return n;}
  async function play(block,unit,index=next(unit),options={}){
    const entries=[...block.querySelectorAll('.nucleus')],frames=patterns[index][1];
    block.dataset.celebration=patterns[index][0];block.classList.add('celebrating');
    const motionOff=options.still||document.documentElement.classList.contains('still')||matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(motionOff){block.classList.remove('celebrating');return;}
    await Promise.all(entries.map(async(n,i)=>{
      // Rods travel end-to-end; squares travel in contiguous rows/diagonals.
      const rank=unit==='hundreds'?(index%2?Math.floor(i/10):Math.floor(i/10)+i%10):unit==='tens'?i:0;
      const a=n.animate(frames,{duration:820,delay:rank*22,easing:'ease-in-out'});
      options.active?.add(a);try{await a.finished;}catch{}finally{options.active?.delete(a);a.cancel();}
    }));block.classList.remove('celebrating');
  }
  const api={patterns,next,core,play};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.GlowCelebrations=api;
})(typeof globalThis!=='undefined'?globalThis:this);

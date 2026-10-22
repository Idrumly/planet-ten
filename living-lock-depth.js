'use strict';
// Mask only the decorative skin. Native inputs stay underneath and clickable.
window.mountLivingLockDepth=function(card){
 if(!CSS.supports('mask-image','linear-gradient(black,black)'))return ()=>{};
 const digits=card.querySelector('.card-digits'),skin=card.querySelector('.worm-skin'),inputs=[...card.querySelectorAll('.card-digits input')];
 card.style.setProperty('--digit-count',inputs.length);
 const rim=document.createElement('span');rim.className='belly-rim';rim.setAttribute('aria-hidden','true');card.append(rim);
 function align(){
  digits.style.marginTop=(-digits.offsetHeight/2)+'px';
  const body=skin.getBoundingClientRect(),base=card.getBoundingClientRect(),boxes=inputs.map(el=>el.getBoundingClientRect());
  if(!body.width||!boxes[0]?.width)return;
  const left=Math.min(...boxes.map(b=>b.left))-3,top=Math.min(...boxes.map(b=>b.top))-2;
  const width=Math.max(...boxes.map(b=>b.right))-left+3,height=Math.max(...boxes.map(b=>b.bottom))-top+2;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${body.width}" height="${body.height}"><defs><mask id="window"><rect width="100%" height="100%" fill="white"/><rect x="${left-body.left}" y="${top-body.top}" width="${width}" height="${height}" rx="9" fill="black"/></mask></defs><rect width="100%" height="100%" fill="white" mask="url(#window)"/></svg>`;
  skin.style.maskImage=`url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  Object.assign(rim.style,{left:(left-base.left-6)+'px',top:(top-base.top-6)+'px',width:(width+12)+'px',height:(height+12)+'px'});
  card.classList.add('has-belly-window');
 }
 const observer=new ResizeObserver(align);observer.observe(card);observer.observe(digits);inputs.forEach(input=>observer.observe(input));
 align();return ()=>observer.disconnect();
};

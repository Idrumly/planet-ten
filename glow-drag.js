'use strict';
let pickup=null;
function rejectAction(message){$('feedback').textContent=message;beep('error');}
function startPickup(x,y,pointerId=null,unit='ones'){
  const tray=document.createElement('div');tray.className='sticky-pickup';tray.setAttribute('aria-hidden','true');
  tray.innerHTML='<div class="sticky-cells"></div><strong>Collect ten matching blocks</strong>';document.body.append(tray);
  pickup={tray,blocks:[],pointerId,x,y,unit,farm:isFarm()};tray.classList.toggle('collect-tens',unit==='tens');tray.classList.toggle('collect-grow',isFarm());tray.querySelector('strong').textContent='0 / 10 '+unit;movePickup(x,y);
}
function movePickup(x,y){if(!pickup)return;pickup.x=x;pickup.y=y;const worldRect=$('world').getBoundingClientRect();$('reticle').style.left=(x-worldRect.left)+'px';$('reticle').style.top=(y-worldRect.top)+'px';pickup.tray.style.left=`${Math.max(8,Math.min(innerWidth-230,x-110))}px`;pickup.tray.style.top=`${Math.max(8,y-70)}px`;}
function collectBlock(block){
  if(!pickup||pickup.blocks.includes(block)||block.dataset.unit!==pickup.unit||pickup.blocks.length===10)return;
  pickup.blocks.push(block);block.classList.add('picked');const shape=document.createElement('span');shape.className='picked-shape';if(pickup.farm)shape.append(growShape(pickup.unit));else for(let i=0;i<(pickup.unit==='tens'?10:1);i++)shape.append(cell());pickup.tray.querySelector('.sticky-cells').append(shape);
  const n=pickup.blocks.length;pickup.tray.querySelector('strong').textContent=`${n} / 10 ${pickup.unit}${n===10?' — release!':''}`;
  pickup.tray.classList.toggle('stable',n===10);$('feedback').textContent=n===10?'Ten '+pickup.unit+'! Release to regroup.':`${n} of 10 ${pickup.unit} clinging together. Keep collecting.`;
}
async function releasePickup(cancel=false){
  if(!pickup)return;const group=pickup;pickup=null;
  const rects=[...group.tray.querySelectorAll(group.farm?'.picked-shape':'.cell')].map(c=>c.getBoundingClientRect());
  if(group.blocks.length===10&&!cancel){
    group.blocks.forEach(b=>b.classList.remove('picked'));group.tray.remove();
    await exchange(group.unit,group.blocks[0],rects);return;
  }
  busy=true;rejectAction(cancel?'Collection cancelled. The blocks are still separate.':`Only ${group.blocks.length} ${group.unit}. You need exactly 10 matching blocks.`);
  const cells=[...group.tray.querySelectorAll('.cell')];
  try{await Promise.all(cells.map((c,i)=>{const target=group.farm?group.blocks[i].getBoundingClientRect():group.blocks[Math.floor(i/(group.unit==='tens'?10:1))].querySelectorAll('.cell')[i%(group.unit==='tens'?10:1)].getBoundingClientRect(),r=rects[i];return animate(c,[{transform:'translate(0,0)'},{transform:`translate(${target.left-r.left}px,${target.top-r.top}px) rotate(${i%2?15:-15}deg)`}],650);}));}
  finally{group.tray.remove();group.blocks.forEach(b=>b.classList.remove('picked'));busy=false;render();}
}
// Keyboard users pick one at a time with Enter/Space; the tenth completes the group.
function keyboardPickup(block){if(!pickup){const r=block.getBoundingClientRect();startPickup(r.left,r.top,null,block.dataset.unit);}
  collectBlock(block);if(pickup.blocks.length===10)releasePickup();}
$('cargo').addEventListener('pointerdown',e=>{
  const block=e.target.closest(isFarm()?'.grow-block:not([data-unit=tenThousands])':contract.hundreds?'.single,.rod':'.single');if(tool!=='join'||busy||complete||!block||e.button!==0)return;
  e.preventDefault();if(pickup)return;startPickup(e.clientX,e.clientY,e.pointerId,block.dataset.unit);collectBlock(block);$('cargo').setPointerCapture(e.pointerId);
});
$('cargo').addEventListener('pointermove',e=>{
  if(!pickup||pickup.pointerId!==e.pointerId)return;e.preventDefault();
  // Sweep the whole segment, so fast pointer motion does not skip a block.
  const dx=e.clientX-pickup.x,dy=e.clientY-pickup.y,steps=Math.ceil(Math.hypot(dx,dy)/6)||1;
  for(let i=1;i<=steps;i++){const x=pickup.x+dx*i/steps,y=pickup.y+dy*i/steps;for(const b of $('cargo').querySelectorAll('.block[data-unit="'+pickup.unit+'"]')){const r=b.getBoundingClientRect();if(x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom)collectBlock(b);}}
  movePickup(e.clientX,e.clientY);
});
$('cargo').addEventListener('pointerup',e=>{if(pickup?.pointerId===e.pointerId)releasePickup();});
$('cargo').addEventListener('pointercancel',()=>{if(pickup)releasePickup(true);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&pickup)releasePickup(true);});
window.addEventListener('blur',()=>{if(pickup)releasePickup(true);});

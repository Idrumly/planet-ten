'use strict';
(function(root){
 const steps=[
  {kind:'quiz',text:'I am TEN-BOT! One ten rod is worth 10, but it is ONE separate block. Value counts the glowing cells. Block count counts separate pieces.',value:10,blocks:1},
  {kind:'tool',tool:'split',text:'Choose the pink Discombobulator below. It splits a bigger block into smaller blocks.'},
  {kind:'exchange',tool:'split',text:'Now aim at the glowing ten rod and click it once. Keyboard: Tab to Ten block 1, then press Enter.'},
  {kind:'quiz',text:'You split one ten into ten separate ones. Count the value, then count the separate blocks. Nothing was added or lost.',value:10,blocks:10},
  {kind:'tool',tool:'join',text:'Choose the blue Transmorgifier below. It joins ten matching blocks into one bigger block.'},
  {kind:'exchange',tool:'join',text:'Hold the mouse or your finger on the first one, sweep across all TEN ones, then release. Keyboard: Tab to each one and press Enter. If some fall back, try again!'},
  {kind:'quiz',text:'Ten ones joined into one ten. The ten glowing cells still have the same value. How many separate blocks can you pick up now?',value:10,blocks:1},
  {kind:'quiz',transfer:true,text:'New delivery! ONE ten and TWO ones. Count the ten as 10 for value, but as just ONE separate block. Now add the two ones.',value:12,blocks:3},
  {kind:'done',text:'Training complete! VALUE is how much the blocks are worth. BLOCK COUNT is how many separate pieces there are. Splitting and joining change the count, but keep the value.'}
 ];
 function check(index,value,blocks){const step=steps[index];if(step.kind!=='quiz')return false;return /^\d+$/.test(value.trim())&&/^\d+$/.test(blocks.trim())&&Number(value)===step.value&&Number(blocks)===step.blocks;}
 const api={steps,check};if(typeof module!=='undefined')module.exports=api;root.TrainingSteps=api;
})(globalThis);

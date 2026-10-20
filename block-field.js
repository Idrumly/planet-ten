'use strict';
(function(root){
 // Preserve order within each denomination: exchange animations locate new blocks
 // by their unit index. Interleave whole shapes without changing their value.
 function interleave(items){
  const larger=items.filter(item=>item.unit!=='ones'),ones=items.filter(item=>item.unit==='ones');
  if(!larger.length||!ones.length)return items.slice();
  const result=[];let at=0;
  for(let i=0;i<larger.length;i++){
   result.push(larger[i]);
   const end=Math.ceil((i+1)*ones.length/larger.length);
   while(at<end)result.push(ones[at++]);
  }
  return result;
 }
 function arrange(cargo){const entries=[...cargo.children].map(node=>({unit:node.dataset.unit,node}));for(const item of interleave(entries))cargo.append(item.node);}
 const api={interleave,arrange};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BlockField=api;
})(globalThis);

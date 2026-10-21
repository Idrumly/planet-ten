'use strict';
(()=>{
 const url=new URL(location.href);
 const read=key=>{try{return sessionStorage.getItem('planet-ten-'+key)==='done';}catch{return false;}};
 let practice=read('practice'),firstShift=read('first-shift');
 const save=key=>{try{sessionStorage.setItem('planet-ten-'+key,'done');return true;}catch{return false;}};
 // Completion link fallback lets practice finish even when browser storage is blocked.
 if(url.searchParams.get('practice')==='complete'){practice=true;save('practice');}
 if(!practice&&url.searchParams.get('training')!=='1'){
  url.searchParams.set('training','1');history.replaceState(null,'',url);
 }
 window.OrientationProgress={
  get firstShiftRequired(){return !firstShift;},
  practiceDone(){practice=true;return save('practice');},
  firstShiftDone(){firstShift=true;save('first-shift');}
 };
})();

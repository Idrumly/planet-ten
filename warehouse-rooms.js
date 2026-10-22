'use strict';
window.WarehouseRooms=(()=>{
 const rooms={
  bee:{id:'bee',title:'Spelling Bee',unit:10,place:'ten',lockOffset:0,
   intro:'Welcome, apprentice. Three living locks guard this room. Round each number to the nearest ten. Request a clue if you need one. Apparently ordinary door handles were too affordable.',
   reveal:'Behold. The Planet Ten Spelling Bee. A bee. Spelling. Procurement assures me this is an excellent use of warehouse space. Your rounding has restored a vital community service. Literacy, with additional legs.'},
  'band-aid':{id:'band-aid',title:'Band Aid',unit:100,place:'hundred',lockOffset:3,
   intro:'Band Aid. Three locks, rounded to the nearest hundred. This department keeps the community in tune. Try the number yourself, then request one clue at a time. Management insists this is a sound investment.',
   reveal:'Behold. Band Aid. A hospital for musical instruments. The violin has a sprained bow. The drum has lost its beat. Your rounding has restored essential harmonic care. Try not to make a treble scene.'}
 };
 const current=rooms[new URLSearchParams(location.search).get('room')]||rooms.bee;
 const read=(key)=>{try{return sessionStorage.getItem(key);}catch{return null;}};
 const write=(key,value)=>{try{if(value===null)sessionStorage.removeItem(key);else sessionStorage.setItem(key,value);}catch{}};
 return {current,rooms,completed:()=>read('planet-ten-room-'+current.id)==='complete',complete:()=>write('planet-ten-room-'+current.id,'complete'),clear:()=>write('planet-ten-room-'+current.id,null)};
})();

'use strict';
window.WarehouseRooms=(()=>{
 const rooms={
  bee:{id:'bee',title:'Spelling Bee',unit:10,place:'ten',lockOffset:0,
   intro:'Welcome, apprentice. Three living locks guard this room. Round each number to the nearest ten. Request a clue if you need one. Apparently ordinary door handles were too affordable.',
   reveal:'Behold. The Planet Ten Spelling Bee. A bee. Spelling. Procurement assures me this is an excellent use of warehouse space. Your rounding has restored a vital community service. Literacy, with additional legs.'},
  'band-aid':{id:'band-aid',title:'Band Aid',unit:100,place:'hundred',lockOffset:3,
   intro:'Band Aid. Three locks, rounded to the nearest hundred. This department keeps the community in tune. Try the number yourself, then request one clue at a time. Management insists this is a sound investment.',
   reveal:'Behold. Band Aid. A hospital for musical instruments. The violin has a sprained bow. The drum has lost its beat. Your rounding has restored essential harmonic care. Try not to make a treble scene.'},
  board:{id:'board',title:'Board Room',unit:1000,place:'thousand',lockOffset:6,
   intro:'The Board Room needs three approvals, rounded to the nearest thousand. Decisions here tend to gain momentum. Try not to get carried away.',
   reveal:'Behold, the Board Room. The boards have passed a motion. Several motions, actually. Your work has restored civic coordination. Mostly coordinated dancing.'},
  brain:{id:'brain',title:'Brainstorming Department',unit:10000,place:'ten-thousand',lockOffset:9,
   intro:'The Brainstorming Department requests rounding to the nearest ten-thousand. Three locks. Management is expecting a flood of ideas. Dress accordingly.',
   reveal:'Behold, the Brainstorming Department. One employee, one umbrella, and a very active mind. You have restored the forecast for local innovation. Scattered thoughts, becoming brilliant.'},
  court:{id:'court',title:'Food Court',unit:100000,place:'hundred-thousand',lockOffset:12,
   intro:'The Food Court requires three numbers rounded to the nearest hundred-thousand. There are important matters on the table. Please approach with good taste.',
   reveal:'Behold, the Food Court. Justice is being served. With a side of fries. Your rounding has reopened the civic hearing. The evidence is getting cold.'},
  shoe:{id:'shoe',title:'Shoe Box',unit:.1,place:'tenth',lockOffset:15,
   intro:'The Shoe Box needs three numbers rounded to the nearest tenth. The lock now has a decimal point: ones, tenths, hundredths. Watch your step. This department has sole responsibility.',
   reveal:'Behold, the Shoe Box. Shoes. Boxing. The department insists this counts as a footwear inspection. Your work has restored community sport. No soles will be harmed.'}
 };
 const order=['bee','band-aid','board','brain','court','shoe'];
 order.forEach((id,i)=>{rooms[id].number=i+1;rooms[id].previous=order[i-1]||null;rooms[id].next=order[i+1]||null;});
 const current=rooms[new URLSearchParams(location.search).get('room')]||rooms.bee;
 const read=(key)=>{try{return sessionStorage.getItem(key);}catch{return null;}};
 const write=(key,value)=>{try{if(value===null)sessionStorage.removeItem(key);else sessionStorage.setItem(key,value);}catch{}};
 return {current,rooms,order,completed:()=>read('planet-ten-room-'+current.id)==='complete',complete:()=>write('planet-ten-room-'+current.id,'complete'),clear:()=>write('planet-ten-room-'+current.id,null)};
})();

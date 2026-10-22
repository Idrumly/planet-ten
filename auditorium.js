'use strict';
// Project illustrated surfaces into the same camera as the residents.
window.createAuditorium=function(ctx,polygon,camera,project,redraw,hospital=false,theme=null){
 const back=new Image(),outside=new Image();back.onload=outside.onload=redraw;
 back.src=theme?'assets/rounding/'+theme+'-backdrop-v1.webp':hospital?'assets/rounding/band-aid-backdrop-v1.webp':'assets/rounding/auditorium-backdrop-v1.webp';outside.src='assets/planet-background.webp';
 function triangle(img,vertices){
  // Clip geometry and its texture coordinates at the near plane.
  let out=[];
  for(let i=0;i<vertices.length;i++){const a=vertices[i],b=vertices[(i+1)%vertices.length],ai=a.z>=20,bi=b.z>=20;if(ai)out.push(a);if(ai!==bi){const t=(20-a.z)/(b.z-a.z);out.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,z:20,u:a.u+(b.u-a.u)*t,v:a.v+(b.v-a.v)*t});}}
  for(let i=1;i<out.length-1;i++){
   const p=[out[0],out[i],out[i+1]],q=p.map(project),u=p.map(p=>p.u*img.naturalWidth),v=p.map(p=>p.v*img.naturalHeight);
   const det=(u[1]-u[0])*(v[2]-v[0])-(u[2]-u[0])*(v[1]-v[0]);if(Math.abs(det)<.001)continue;
   const a=((q[1].x-q[0].x)*(v[2]-v[0])-(q[2].x-q[0].x)*(v[1]-v[0]))/det;
   const c=((u[1]-u[0])*(q[2].x-q[0].x)-(u[2]-u[0])*(q[1].x-q[0].x))/det;
   const b=((q[1].y-q[0].y)*(v[2]-v[0])-(q[2].y-q[0].y)*(v[1]-v[0]))/det;
   const d=((u[1]-u[0])*(q[2].y-q[0].y)-(u[2]-u[0])*(q[1].y-q[0].y))/det;
   ctx.save();ctx.beginPath();q.forEach((p,j)=>j?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.clip();ctx.transform(a,b,c,d,q[0].x-a*u[0]-c*v[0],q[0].y-b*u[0]-d*v[0]);ctx.drawImage(img,0,0);ctx.restore();
  }
 }
 function texture(img,corners,n=6){if(!img.complete||!img.naturalWidth)return;
  const point=(u,v)=>{const p=corners[0].map((_,k)=>(1-v)*((1-u)*corners[0][k]+u*corners[1][k])+v*((1-u)*corners[3][k]+u*corners[2][k]));return {...camera(...p),u,v};};
  for(let j=0;j<n;j++)for(let i=0;i<n;i++){const a=point(i/n,j/n),b=point((i+1)/n,j/n),c=point((i+1)/n,(j+1)/n),d=point(i/n,(j+1)/n);triangle(img,[a,b,c]);triangle(img,[a,c,d]);}
 }
 function drawClinic(){
  polygon([[-520,0,-800],[-520,520,-800],[-520,520,-2100],[-520,0,-2100]],'#759f98');
  polygon([[520,0,-2100],[520,520,-2100],[520,520,-800],[520,0,-800]],'#6e969a');
  polygon([[-520,520,-800],[520,520,-800],[520,520,-2100],[-520,520,-2100]],'#bed6c4');
  for(const side of [-1,1]){const wall=side*519;for(let zz=-920;zz>-2000;zz-=370){
   polygon([[wall,155,zz],[wall,425,zz],[wall,425,zz-255],[wall,155,zz-255]],'#d6bd78','#f3e3ab');
   texture(outside,[[wall-side,410,zz-12],[wall-side,410,zz-243],[wall-side,170,zz-243],[wall-side,170,zz-12]]);
  }for(const yy of [45,110,450])polygon([[wall,yy,-800],[wall,yy+8,-800],[wall,yy+8,-2100],[wall,yy,-2100]],'#d4b876');}
  polygon([[-520,0,-2100],[-520,520,-2100],[520,520,-2100],[520,0,-2100]],'#80aaa1');
  texture(back,[[-520,520,-2100],[520,520,-2100],[520,0,-2100],[-520,0,-2100]],8);
  for(let zz=-800;zz>-2100;zz-=100)for(let xx=-520;xx<520;xx+=130)polygon([[xx,0,zz],[xx+130,0,zz],[xx+130,0,zz-100],[xx,0,zz-100]],(Math.round((xx+520)/130+zz/100)%2)?'#a4c9b9':'#c7ddce','#648b8166');
  for(const xx of [-430,430])polygon([[xx,1,-810],[xx+5,1,-810],[xx+5,1,-2100],[xx,1,-2100]],'#f2d48b');
 }
 function drawTheme(){
  const palettes={board:['#193e51','#452b59','#214853','#54757c'],brain:['#354764','#454264','#596e82','#657f90'],court:['#754939','#9b6240','#b88a53','#d2ad75'],shoe:['#70553e','#68453c','#9d7757','#b9946b']},p=palettes[theme];
  polygon([[-520,0,-800],[-520,520,-800],[-520,520,-2100],[-520,0,-2100]],p[0]);polygon([[520,0,-2100],[520,520,-2100],[520,520,-800],[520,0,-800]],p[1]);polygon([[-520,520,-800],[520,520,-800],[520,520,-2100],[-520,520,-2100]],p[0]);
  for(const side of [-1,1])for(let zz=-950;zz>-2000;zz-=380){const wall=side*519;polygon([[wall,145,zz],[wall,425,zz],[wall,425,zz-250],[wall,145,zz-250]],'#d8b572','#fff0c1');texture(outside,[[wall-side,410,zz-12],[wall-side,410,zz-238],[wall-side,160,zz-238],[wall-side,160,zz-12]]);}
  polygon([[-520,0,-2100],[-520,520,-2100],[520,520,-2100],[520,0,-2100]],p[1]);texture(back,[[-520,520,-2100],[520,520,-2100],[520,0,-2100],[-520,0,-2100]],8);
  for(let zz=-800;zz>-2100;zz-=100)for(let xx=-520;xx<520;xx+=130)polygon([[xx,0,zz],[xx+130,0,zz],[xx+130,0,zz-100],[xx,0,zz-100]],p[2+(Math.abs(Math.round((xx+520)/130+zz/100))%2)],'#ffffff16');
 }
 function draw(){if(theme){drawTheme();return;}if(hospital){drawClinic();return;}
  polygon([[-520,0,-800],[-520,520,-800],[-520,520,-2100],[-520,0,-2100]],'#805936');
  polygon([[520,0,-2100],[520,520,-2100],[520,520,-800],[520,0,-800]],'#6e442e');
  polygon([[-520,520,-800],[520,520,-800],[520,520,-2100],[-520,520,-2100]],'#4d332d');
  // Wooden wall panelling, amber trims and three deep windows per wall.
  for(const side of [-1,1]){
   const wall=side*519;
   for(let zz=-800;zz>-2100;zz-=55)polygon([[wall,0,zz],[wall,510,zz],[wall,510,zz-2],[wall,0,zz-2]],'#deb57544');
   for(const yy of [40,115,420])polygon([[wall,yy,-800],[wall,yy+6,-800],[wall,yy+6,-2100],[wall,yy,-2100]],'#d5ad68');
   for(let zz=-950;zz>-1950;zz-=350){
    polygon([[wall,145,zz],[wall,415,zz],[wall,415,zz-230],[wall,145,zz-230]],'#e8bb71','#f3d09a');
    texture(outside,[[wall-side,400,zz-12],[wall-side,400,zz-218],[wall-side,160,zz-218],[wall-side,160,zz-12]]);
    polygon([[wall-side*2,160,zz-112],[wall-side*2,400,zz-112],[wall-side*2,400,zz-120],[wall-side*2,160,zz-120]],'#ddb57a');
    polygon([[wall-side*2,277,zz-12],[wall-side*2,285,zz-12],[wall-side*2,285,zz-218],[wall-side*2,277,zz-218]],'#ddb57a');
   }
  }
  polygon([[-520,0,-2100],[-520,520,-2100],[520,520,-2100],[520,0,-2100]],'#59354a');
  texture(back,[[-520,520,-2100],[520,520,-2100],[520,0,-2100],[-520,0,-2100]],8);
  // Individual varnished floorboards, worn grain, and oversized alien court lines.
  for(let zz=-800;zz>-2100;zz-=90)for(let xx=-520;xx<520;xx+=65){
   const band=Math.abs(Math.round(xx/65+zz/90))%4,colour=['#96653e','#a77345','#b17e4c','#8e5d3a'][band];
   polygon([[xx,0,zz],[xx+65,0,zz],[xx+65,0,zz-90],[xx,0,zz-90]],colour,'#50351f55');
   for(let grain=0;grain<3;grain++){const gx=xx+11+grain*17;polygon([[gx,1,zz-5],[gx+1,1,zz-5],[gx+2,1,zz-80],[gx,1,zz-80]],'#e4b87725');}
  }
  for(const xx of [-370,370])polygon([[xx,2,-810],[xx+5,2,-810],[xx+5,2,-1620],[xx,2,-1620]],'#eed6a0');
  polygon([[-370,2,-1110],[370,2,-1110],[370,2,-1115],[-370,2,-1115]],'#eed6a0');
  for(let i=0;i<40;i++){const a=i*Math.PI/20,b=(i+1)*Math.PI/20;polygon([[Math.cos(a)*125,2,-1230+Math.sin(a)*125],[Math.cos(b)*125,2,-1230+Math.sin(b)*125],[Math.cos(b)*120,2,-1230+Math.sin(b)*120],[Math.cos(a)*120,2,-1230+Math.sin(a)*120]],'#e4c899');}
  // Raised gym stage and three shallow steps. Walking stops at its front.
  polygon([[-470,95,-1620],[470,95,-1620],[470,95,-2100],[-470,95,-2100]],'#b38453','#e5c38b');
  for(let xx=-460;xx<470;xx+=35)polygon([[xx,96,-1620],[xx+1,96,-1620],[xx+1,96,-2100],[xx,96,-2100]],'#70472a66');
  polygon([[-470,0,-1620],[-470,95,-1620],[470,95,-1620],[470,0,-1620]],'#673a35','#c89a61');
  for(let xx=-450;xx<470;xx+=75)polygon([[xx,12,-1619],[xx,80,-1619],[xx+55,80,-1619],[xx+55,12,-1619]],'#8d5553','#ad7957');
  for(let step=0;step<3;step++){const top=(3-step)*25,zz=-1610+step*36;polygon([[-100,top,zz],[100,top,zz],[100,top,zz-36],[-100,top,zz-36]],'#d4a675');polygon([[-100,top-25,zz],[-100,top,zz],[100,top,zz],[100,top-25,zz]],'#986a46');}
 }
 return {draw};
};

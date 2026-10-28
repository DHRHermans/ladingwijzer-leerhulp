/* Gedeelde driedimensionale oefenromp. Projecties, geen hydrostatica. */
(function(root){
'use strict';
const G={stern:315,deck:-73,keel:52,halfBeam:118,water:220};
function project(point,pitch,heel){
 const [x,y,z]=point,p=pitch*Math.PI/180,r=heel*Math.PI/180;
 const across=y*Math.cos(r)-z*Math.sin(r),height=y*Math.sin(r)+z*Math.cos(r);
 return {sideX:x*Math.cos(p)-height*Math.sin(p),endX:across,z:x*Math.sin(p)+height*Math.cos(p)};
}
function model(mode,masses,high){
 const faces=[];
 const face=(p,color,stroke='#31576a')=>faces.push({p,color,stroke});
 const box=(x1,x2,y1,y2,top,bottom,color)=>{
  face([[x1,y1,top],[x2,y1,top],[x2,y2,top],[x1,y2,top]],color);
  face([[x1,y2,top],[x2,y2,top],[x2,y2,bottom],[x1,y2,bottom]],color);
  face([[x2,y1,top],[x2,y2,top],[x2,y2,bottom],[x2,y1,bottom]],color);
 };
 const port=[[-355,0,-42],[-310,-118,-73],[315,-118,-73],[340,-95,-22],[315,-92,52],[-310,-92,52]];
 const starboard=port.map(([x,y,z])=>[x,-y,z]);
 face([port[1],port[2],starboard[2],starboard[1]],'#527e91');
 face([port[0],port[1],port[2],port[3],port[4],port[5]],'#285a72');
 face([starboard[0],starboard[1],starboard[2],starboard[3],starboard[4],starboard[5]],'#183c54');
 face([port[2],starboard[2],starboard[4],port[4]],'#214b64');
 // Same red keel band and deck level in both projections.
 face([[-310,92,30],[323,92,30],[315,92,52],[-310,92,52]],'#9a6350');
 face([[315,-92,30],[315,92,30],[315,92,52],[315,-92,52]],'#9a6350');
 for(let i=0;i<6;i++){
  const mass=masses[i];if(mass<=0)continue;
  const col=i%3,x=-275+col*168,y=i<3?-105:10,width=95;
  const h=Math.min(85,mass/200*65)+(high?28:0);
  if(mode==='containers'){
   const rows=Math.max(1,Math.ceil(h/22));for(let row=0;row<rows;row++)for(let c=0;c<2;c++)box(x+c*72,x+c*72+68,y,y+width,-74-(row+1)*22,-74-row*22,['#dbb46d','#3b9db8','#d58e70'][(col+row)%3]);
  }else if(mode==='bulk'){
   face([[x,y,-74],[x+145,y,-74],[x+72,y+width/2,-74-h],[x,y+width,-74]],'#d8bb80','#ab915f');
   face([[x+145,y,-74],[x+145,y+width,-74],[x+72,y+width/2,-74-h]],'#c4a570','#ab915f');
  }else if(mode==='liquid'){box(x,x+142,y,y+width,-94,-74,'#9bb8c5');}
  else box(x+10,x+130,y,y+width,-74-h,-74,mode==='heavy'?'#7d8b97':'#c6975c');
 }
 box(250,322,-69,69,-116,-73,'#f4fafb');
 box(262,310,-70,70,-108,-91,'#3585a7');
 return faces;
}
function render(mode,masses,high,pitch,heel,view){
 const coord=p=>{const q=project(p,pitch,heel);return [view==='side'?q.sideX:q.endX,q.z];};
 // Draw from far to near along each camera's viewing direction.
 const faces=model(mode,masses,high).map((face,index)=>({...face,index}));
 faces.sort((a,b)=>{
  const axis=view==='side'?1:0;
  const depth=f=>f.p.reduce((s,p)=>s+p[axis],0)/f.p.length;
  return depth(a)-depth(b)||a.index-b.index;
 });
 return faces.map(f=>`<path d="${f.p.map((p,i)=>{const [x,z]=coord(p);return (i?'L':'M')+x.toFixed(3)+' '+z.toFixed(3);}).join('')}Z" fill="${f.color}" stroke="${f.stroke}" stroke-width="1.2"/>`).join('');
}
const api={G,project,render};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ShipGeometry=api;
})(globalThis);

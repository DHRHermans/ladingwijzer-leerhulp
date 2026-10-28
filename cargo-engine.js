(function(root){
'use strict';
const modes={solid:{name:'Vaste stukgoederen',density:1000,unit:'ton',hint:'Denk aan vloerbelasting, sjorren, stapeling en een verschuivend zwaartepunt.'},bulk:{name:'Los stortgoed',density:750,unit:'ton',hint:'Stortdichtheid is inclusief tussenruimte. Vocht, verschuiven en de storthoek vragen aparte beoordeling.'},liquid:{name:'Vloeistoffen',density:840,unit:'ton',hint:'Gedeeltelijk gevulde tanks hebben een vrij vloeistofoppervlak. Dit model berekent de stabiliteitsvermindering niet.'},containers:{name:'Containers',density:18,unit:'TEU',hint:'De oefening gebruikt één gelijk gewicht per TEU. Echt containergewicht, stapellasten, sjorren en zichtlijnen beoordeel je apart.'},heavy:{name:'Zware / projectlading',density:7850,unit:'ton',hint:'Een kleine hoeveelheid kan lokaal zwaar belasten. Dit model kent geen deksterkte, hijsplan of steunpunten.'}};
const positions=[[-1,-1],[0,-1],[1,-1],[-1,1],[0,1],[1,1]];
function calculate(mode,amounts,density){
 if(!modes[mode]||amounts.length!==6||!Number.isFinite(density)||density<=0)throw new Error('Kies een ladingstype en een positieve dichtheid / containermassa.');
 if(amounts.some(x=>!Number.isFinite(x)||x<0||(mode==='containers'&&!Number.isInteger(x))))throw new Error('Vul positieve hoeveelheden in; containers zijn hele TEU.');
 const slots=amounts.map((a,i)=>{const mass=mode==='containers'?a*density:a,volume=mode==='containers'?a*30:a*1000/density;return {amount:a,mass,volume,over:mass>200+1e-8||volume>300+1e-8||(mode==='containers'&&a>10),partial:mode==='liquid'&&volume>0&&volume<299.999};});
 const total=slots.reduce((a,s)=>a+s.mass,0),volume=slots.reduce((a,s)=>a+s.volume,0);
 const sides=[0,0],ends=[0,0],moments=[0,0];slots.forEach((s,i)=>{sides[i<3?0:1]+=s.mass;if(i%3===0)ends[0]+=s.mass;if(i%3===2)ends[1]+=s.mass;moments[0]+=s.mass*positions[i][0];moments[1]+=s.mass*positions[i][1];});
 return {slots,total,volume,sides,ends,x:total?moments[0]/total:0,y:total?moments[1]/total:0,partial:slots.filter(s=>s.partial).length,over:slots.some(s=>s.over)};
}
function puzzle(mode='bulk'){
 if(!['bulk','liquid','containers'].includes(mode))throw new Error('Onbekende puzzel.');
 const masses=mode==='containers'?[18,18,24,24,12,12,30,30]:[80,80,100,100,120,120,60,60];
 return {mode,masses,capacity:mode==='containers'?60:200,volumeCapacity:300,countCapacity:mode==='containers'?4:100,tolerance:mode==='containers'?6:20,density:mode==='liquid'?840:mode==='bulk'?750:null};
}
function gradePuzzle(task,assignments){
 if(assignments.length!==task.masses.length||assignments.some(x=>!Number.isInteger(x)||x< -1||x>5))throw new Error('Ongeldige puzzelindeling.');
 const mass=Array(6).fill(0),count=Array(6).fill(0);assignments.forEach((slot,i)=>{if(slot>=0){mass[slot]+=task.masses[i];count[slot]++;}});
 const port=mass.slice(0,3).reduce((a,b)=>a+b,0),starboard=mass.slice(3).reduce((a,b)=>a+b,0),front=mass[0]+mass[3],back=mass[2]+mass[5];
 const all=assignments.every(s=>s>=0),over=mass.some((m,i)=>m>task.capacity||(task.density&&m*1000/task.density>task.volumeCapacity)||count[i]>task.countCapacity),sideDifference=Math.abs(port-starboard),endDifference=Math.abs(front-back);
 return {mass,count,all,over,sideDifference,endDifference,solved:all&&!over&&sideDifference<=task.tolerance&&endDifference<=task.tolerance};
}
const api={modes,calculate,puzzle,gradePuzzle};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.CargoLearning=api;
})(globalThis);

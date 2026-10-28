/* Onderwijsmodel: statisch evenwicht, tabelinterpolatie, geen vaaradvies. */
(function(root){
'use strict';
const data=typeof module!=='undefined'&&module.exports?require('./meetbrief-data.js'):root.MeetbriefData;
function createModel(input){
 if(!Array.isArray(input)||input.length<2)throw new Error('Voeg minstens twee tabelpunten toe.');
 const points=input.map(p=>[Number(p[0]),Number(p[1])]);
 for(let i=0;i<points.length;i++){
  const [cm,volume]=points[i];
  if(!Number.isFinite(cm)||!Number.isFinite(volume)||cm<=0||volume<=0)throw new Error('Inzinking en volume moeten positieve eindige getallen zijn.');
  if(i&&(cm<=points[i-1][0]||volume<=points[i-1][1]))throw new Error('Centimeters en volumes moeten strikt oplopen, zonder dubbele rijen.');
 }
 const minCm=points[0][0],maxCm=points.at(-1)[0];
function interpolate(x,axis){
 if(!Number.isFinite(x))throw new Error('Vul een eindig getal in.');
 const other=1-axis;
 if(x<points[0][axis]||x>points.at(-1)[axis])throw new Error(`Buiten het meetbriefbereik (${minCm}–${maxCm} cm); er wordt niet geëxtrapoleerd.`);
 const hi=points.findIndex(p=>p[axis]>=x);
 if(points[hi][axis]===x)return points[hi][other];
 const a=points[hi-1],b=points[hi];return a[other]+(x-a[axis])/(b[axis]-a[axis])*(b[other]-a[other]);
}
const volumeAt=cm=>interpolate(cm,0), immersionAt=m3=>interpolate(m3,1);
function calculate({emptyCm,cargoTonnes,waterDensity,depth}){
 if(!Number.isFinite(cargoTonnes)||cargoTonnes<0)throw new Error('Ladingmassa moet nul of positief zijn.');
 if(!Number.isFinite(waterDensity)||waterDensity<990||waterDensity>1030)throw new Error('Kies een waterdichtheid tussen 990 en 1030 kg/m³.');
 if(!Number.isFinite(depth)||depth<=0)throw new Error('Waterdiepte moet positief zijn.');
 const emptyMass=volumeAt(emptyCm); // oefenaannname: lege toestand in water van 1000 kg/m³
 const mass=emptyMass+cargoTonnes,volume=mass*1000/waterDensity;
 const cm=immersionAt(volume),freshCm=immersionAt(mass);
 return {emptyMass,mass,volume,cm,freshCm,deltaCm:cm-freshCm,draft:cm/100,ukc:depth-cm/100,
  tableHeadroom:volumeAt(maxCm)*waterDensity/1000-mass};
}
return {volumeAt,immersionAt,calculate,minCm,maxCm};
}
const api={...createModel(data.points),createModel};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.DraftLearning=api;
})(globalThis);

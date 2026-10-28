(function(root){
'use strict';
function number(s){
 s=String(s).trim();
 if(!/^\d+(?:[.,]\d+)*$/.test(s))return NaN;
 if(s.includes(',')&&s.includes('.')){if(!/^\d{1,3}(?:\.\d{3})*,\d+$/.test(s))return NaN;s=s.replaceAll('.','');}
 else if((s.match(/[.,]/g)||[]).length>1)return NaN;
 return Number(s.replace(',','.'));
}
function candidates(text){
 const points=[];
 for(const line of text.split(/\r?\n/)){
  if(!/^[\d\s.,;:|]+$/.test(line.trim()))continue;
  const tokens=line.match(/\d+(?:[.,]\d+)*/g)||[];
  for(let i=0;i+1<tokens.length;i+=2){const cm=number(tokens[i]),v=number(tokens[i+1]);if(cm>0&&cm<=10000&&v>0)points.push([cm,v]);}
 }
 return points.sort((a,b)=>a[0]-b[0]);
}
function parseEdited(text,unit='cm'){
 if(!['cm','m'].includes(unit))throw new Error('Kies centimeters of meters.');
 const points=[];
 for(const [i,line] of text.split(/\r?\n/).entries()){
  if(!line.trim())continue;
  const cells=line.trim().split(/[;\t]+/);
  if(cells.length!==2)throw new Error(`Rij ${i+1}: gebruik twee kolommen gescheiden door een puntkomma.`);
  const cm=number(cells[0])*(unit==='m'?100:1),v=number(cells[1]);
  if(!Number.isFinite(cm)||!Number.isFinite(v)||cm<=0||v<=0)throw new Error(`Rij ${i+1}: gebruik positieve getallen voor inzinking en verplaatst volume.`);
  if(points.length&&(cm<=points.at(-1)[0]||v<=points.at(-1)[1]))throw new Error(`Rij ${i+1}: beide kolommen moeten strikt oplopen; controleer dubbele rijen en herkenningsfouten.`);
  points.push([cm,v]);
 }
 if(points.length<2)throw new Error('Voeg minstens twee gecontroleerde tabelpunten toe.');
 return points;
}
const api={number,candidates,parseEdited};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MeetbriefParser=api;
})(globalThis);

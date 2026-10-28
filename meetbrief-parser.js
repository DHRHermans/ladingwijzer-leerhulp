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
function parseCsv(text){
 const lines=String(text).replace(/^\uFEFF/,'').split(/\r?\n/);
 function cells(line){return line.split(';').map(cell=>{cell=cell.trim();if(cell.startsWith('"')&&cell.endsWith('"'))cell=cell.slice(1,-1).replaceAll('""','"');if(cell.includes('"'))throw new Error('Ongeldige aanhalingstekens in het CSV-bestand.');return cell;});}
 const header=cells(lines.shift()||'');
 if(header.length!==2||header[0]!=='inzinking_cm'||header[1]!=='waterverplaatsing_m3')throw new Error('Gebruik het blanco CSV-sjabloon met kolommen inzinking_cm;waterverplaatsing_m3.');
 const filled=[];
 for(const [i,line] of lines.entries()){
  if(!line.trim())continue;const row=cells(line);
  if(row.length!==2)throw new Error(`CSV-rij ${i+2}: twee kolommen nodig, gescheiden door een puntkomma.`);
  if(row.every(v=>!v))continue;
  if(row.some(v=>!v))throw new Error(`CSV-rij ${i+2}: vul beide waarden in of laat de hele rij leeg.`);
  filled.push(row.join(';'));
 }
 const table=filled.join('\n');parseEdited(table,'cm');return table;
}
const api={number,candidates,parseEdited,parseCsv};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MeetbriefParser=api;
})(globalThis);

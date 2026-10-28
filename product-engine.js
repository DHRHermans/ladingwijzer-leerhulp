(function(root){'use strict';
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function search(records,query,mode='tank'){
 const exact=String(query).trim().match(/^(?:UN\s*)?(\d{4})$/i),q=norm(query);
 if(!q||(!exact&&q.length<2))return [];
 const table=mode==='tank'?'C':mode==='dry'?'A':null;
 return records.filter(r=>r.name&&(!table||r.table===table)&&(exact?r.un===exact[1]:q.split(/\s+/).every(t=>norm(r.name).includes(t))));
}
function specialCodes(raw,known){
 const s=String(raw||'').replace(/[\s,;]+/g,'');if(!s)return {codes:[],ambiguous:false};
 const memo={};function walk(pos){if(pos===s.length)return [[]];if(memo[pos])return memo[pos];let paths=[];
 for(const len of [3,2]){const key=s.slice(pos,pos+len);if(key.length!==len||!known[key])continue;let end=pos+len,label=key;if(key==='640'&&/[A-Z]/.test(s[end]||'')){label+=s[end];end++}
 for(const tail of walk(end)){paths.push([label,...tail]);if(paths.length>=2)break}if(paths.length>=2)break}
 return memo[pos]=paths}
 const paths=walk(0);return {codes:paths.length===1?paths[0]:[],ambiguous:paths.length!==1,raw};
}
const equipment={PP:{title:'Persoonlijke bescherming',text:'Per bemanningslid: veiligheidsbril, geschikte handschoenen, veiligheidskleding en geschikte veiligheidsschoenen. Op tankschepen zijn veiligheidslaarzen vereist.'},EP:{title:'Vluchtapparaat',text:'Een geschikt vluchtapparaat voor iedere persoon aan boord.'},EX:{title:'Gasdetectiemeter',text:'Gasdetectiemeter met gebruiksaanwijzing.'},TOX:{title:'Giftigheidsmeter',text:'Geschikt voor de huidige én vorige lading, inclusief toebehoren en gebruiksaanwijzing.'},A:{title:'Ademhalingstoestel',text:'Een geschikt, van de buitenlucht afhankelijk ademhalingstoestel. Dit is geen onafhankelijk persluchttoestel.'}};
function equipmentCodes(r){return [...new Set((r.equipment||'').match(/\b(?:PP|EP|EX|TOX|A)\b/g)||[])]}
function measureCodes(r){const parts=r.raw?.measureParts||[r.raw?.measures||''];return [...new Set([r.raw?.ventilation||'',...parts].flatMap(s=>s.replace(/\s+/g,'').match(/(?:VE|CO|ST|RA|LO|HA|IN)\d{2}/g)||[]))]}
const classes={'1':'Ontplofbare stoffen en voorwerpen','2':'Gassen','3':'Brandbare vloeistoffen','4.1':'Brandbare vaste stoffen, zelfontledende en verwante stoffen','4.2':'Voor zelfontbranding vatbare stoffen','4.3':'Stoffen die met water brandbare gassen ontwikkelen','5.1':'Oxiderende stoffen','5.2':'Organische peroxiden','6.1':'Giftige stoffen','6.2':'Infectueuze stoffen','7':'Radioactieve stoffen','8':'Bijtende stoffen','9':'Diverse gevaarlijke stoffen en voorwerpen'};
const hazardLabels={'2.1':'brandbaar gas','2.2':'niet-brandbaar, niet-giftig gas','2.3':'giftig gas','3':'brandbaar','4.1':'brandbare vaste stof / verwante gevaren','4.2':'zelfontbranding','4.3':'ontwikkelt brandbaar gas bij contact met water','5.1':'oxiderend','5.2':'organisch peroxide','6.1':'giftig','6.2':'infectueus','7':'radioactief','8':'bijtend','9':'diverse gevaren','CMR':'kankerverwekkende, mutagene of voortplantingstoxische eigenschappen','inst.':'chemisch instabiel'};
function hazardMeanings(r){const keys=[...new Set((r.hazards||'').replace(/N[123]/g,'').match(/CMR|inst\.|[1-9](?:\.[1-9])?/g)||[])];return keys.filter(k=>hazardLabels[k]).map(k=>({code:k,text:hazardLabels[k]}))}
const tankDesign={'1':'Druktank','2':'Gesloten ladingtank','3':'Open ladingtank met vlamkerende inrichting','4':'Open ladingtank'};
const tankType={'1':'Onafhankelijke ladingtank','2':'Geïntegreerde ladingtank','3':'Ladingtankwand is geen scheepshuid','4':'Membraantank'};
const tankEquipment={'1':'Koelinstallatie','2':'Mogelijkheid om de lading te verwarmen','3':'Watersproei-inrichting','4':'Ladingverwarmingsinstallatie aan boord'};
const sampling={'1':'Gesloten monstername-inrichting','2':'Gedeeltelijk gesloten monstername-inrichting','3':'Open monstername-inrichting'};
const api={norm,search,hazardMeanings,specialCodes,equipment,equipmentCodes,measureCodes,classes,tankDesign,tankType,tankEquipment,sampling};root.ADNProduct=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);

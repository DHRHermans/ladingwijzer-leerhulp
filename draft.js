(function(){
'use strict';
const host=document.getElementById('diepgang'),E=window.DraftLearning;
const fmt=(x,n=2)=>x.toLocaleString('nl-BE',{minimumFractionDigits:n,maximumFractionDigits:n});
host.innerHTML=`<span class="eyebrow">BEGRIJPEN DOOR TE PROBEREN</span><h1>Diepgang, lading en water</h1>
<p class="intro">Een schip moet zijn eigen massa én de lading dragen. In dichter water is daarvoor minder verplaatst volume nodig: het schip komt hoger te liggen. Probeer het met de tabel uit jouw meetbrief.</p>
<div class="notice"><b>Oefenmodel, geen beladings- of vaaradvies.</b>De bron noemt <em>gemiddelde inzinking</em>. Het referentievlak voor echte diepgang en de lege scheepsmassa zijn niet vastgesteld. Alleen voor deze simulatie nemen we inzinking gelijk aan diepgang en kiezen we een lege toestand in zoetwater. Trim, slagzij, stabiliteit, squat en toegestane inzinking worden niet berekend.</div>
<div class="draft-layout"><form id="draft-form" class="panel"><h2>Stel je oefening in</h2><p id="draft-chosen-product" class="muted">Gebruik een voorbeeld of open deze oefening vanuit een productkaart.</p>
<label>Lege oefentoestand · inzinking (cm)<input id="draft-empty" type="number" min="1" max="252" step="0.1" value="40" required></label><p class="muted">40 cm is een gekozen oefenwaarde, geen vastgesteld gegeven van het schip.</p>
<label>Voorbeeldlading<select id="draft-product"><option value="840">Dieselolie · 840 kg/m³</option><option value="790">Methanol · 790 kg/m³</option><option value="740">Benzine · 740 kg/m³</option><option value="custom">Eigen product</option></select></label>
<label>Productdichtheid (kg/m³)<input id="draft-product-density" type="number" min="1" max="3000" step="1" value="840" required></label>
<p class="muted">Afgeronde oefendichtheden, geen ADN-bronwaarden. Werkelijke waarden hangen af van samenstelling en temperatuur. Een voorbeeld is geen toestemming voor vervoer.</p>
<label>Rekenen vanuit<select id="draft-mode"><option value="mass">Ladingmassa in ton</option><option value="volume">Ladingvolume in m³</option></select></label>
<label><span id="draft-amount-label">Ladingmassa (ton)</span><input id="draft-amount" type="number" min="0" step="0.1" value="1500" required></label>
<label>Vaarwater · oefendichtheid<select id="draft-water"><option value="1000">Zoetwater · 1000 kg/m³</option><option value="1010">Brakwater · 1010 kg/m³</option><option value="1025">Zeewater · 1025 kg/m³</option><option value="custom">Zelf instellen</option></select></label>
<label>Waterdichtheid (kg/m³)<input id="draft-density" type="number" min="990" max="1030" step="0.1" value="1000" required></label>
<p class="muted">Dit zijn leswaarden, geen dichtheidsmetingen van een rivier of haven. Zoutgehalte en temperatuur beïnvloeden de dichtheid. Warmer water is in dit bereik meestal minder dicht; zoetwater heeft zijn grootste dichtheid rond 4 °C.</p>
<label>Waterdiepte (m)<input id="draft-depth" type="number" min="0.1" max="50" step="0.1" value="3.5" required></label>
<div class="draft-examples"><button type="button" data-draft-example="fresh">1500 ton in zoetwater</button><button type="button" data-draft-example="sea">Zelfde lading in zeewater</button><button type="button" data-draft-example="volume">1000 m³ product vergelijken</button></div></form>
<div><article class="panel"><h2>Wat gebeurt er met het schip?</h2><p>De massa blijft gelijk wanneer je alleen de waterdichtheid wijzigt. De gestippelde kiel toont de positie in zoetwater bij dezelfde belading.</p>
<svg id="draft-scene" viewBox="0 0 600 360" role="img" aria-labelledby="draft-svg-title draft-svg-desc"><title id="draft-svg-title">Schip in water met veranderende dichtheid</title><desc id="draft-svg-desc">Schematische vergelijking van de kiel in gekozen water en in zoetwater.</desc><defs><pattern id="draft-bed" width="16" height="12" patternUnits="userSpaceOnUse"><path d="M0 12L12 0" stroke="#9c866a" stroke-width="2"/></pattern></defs><rect width="600" height="360" fill="#eef7fa"/><rect x="0" y="185" width="600" height="175" fill="#88cee3"/><line x1="0" x2="600" y1="185" y2="185" stroke="#007f9c" stroke-width="2"/><text x="15" y="175" font-size="13" fill="#102e3a">Wateroppervlak</text><g id="draft-ship"><path d="M75 -135H490L525 -100L495 0H110L75 -45Z" fill="#123d64"/><rect x="112" y="-173" width="65" height="38" rx="4" fill="#fff"/><path d="M122 -163H165" stroke="#319bd0" stroke-width="12"/><rect x="205" y="-157" width="245" height="22" rx="8" fill="#159bd5"/><path d="M270 -157V-135M350 -157V-135" stroke="#123d64" stroke-width="4"/></g><rect x="0" y="185" width="600" height="175" fill="#46b2d5" opacity=".18"/><line id="draft-fresh-keel" x1="90" x2="530" stroke="#102e3a" stroke-width="2" stroke-dasharray="6 5"/><g id="draft-bottom"><rect width="600" height="360" fill="#dacbb4"/><rect width="600" height="360" fill="url(#draft-bed)"/><text x="15" y="22" font-size="13">Bodem</text></g><line id="draft-measure" x1="555" x2="555" y1="185" stroke="#102e3a" stroke-width="2"/><text id="draft-depth-label" x="545" y="65" text-anchor="end" font-size="14" fill="#102e3a"></text></svg>
<p class="muted">Schematisch zijaanzicht. De verticale schaal past zich aan de ingestelde diepte aan; kleine verschillen lees je nauwkeurig af in de cijfers.</p>
<div id="draft-result" role="status" aria-live="polite" aria-atomic="true"></div></article>
<article class="panel"><h2>Dezelfde belading, ander water</h2><div class="draft-table-wrap"><table><thead><tr><th>Water</th><th>Inzinking</th><th>Verschil met zoet</th></tr></thead><tbody id="draft-comparison"></tbody></table></div><p>Meer waterdiepte verandert het statische drijfvermogen niet. Het verandert de ruimte onder de kiel. Ondiepwater- en snelheidseffecten vallen buiten dit model.</p></article></div></div>
<article class="panel"><h2>Waarom werkt dit zo?</h2><p><b>Archimedes:</b> de massa van het verplaatste water is gelijk aan de totale scheepsmassa. Daarom geldt: <b>volume (m³) = massa (ton) × 1000 ÷ waterdichtheid (kg/m³)</b>. Het bijbehorende aantal centimeters zoeken we op in de meetbrieftabel, met lineaire interpolatie tussen opeenvolgende rijen.</p><p><b>Lading:</b> massa (ton) = productvolume (m³) × productdichtheid (kg/m³) ÷ 1000. Bij hetzelfde volume weegt dieselolie in deze oefening meer dan benzine en zakt het schip verder. Bij dezelfde massa maakt productdichtheid geen verschil voor de statische inzinking; wel voor het ingenomen laadvolume. Tankruimte en stabiliteit moeten afzonderlijk worden beoordeeld.</p><div id="draft-worked"></div></article>
<details class="panel"><summary>Meetbrief, aannames en broncontrole</summary><p><a href="docs/meetbrief.pdf" target="_blank" rel="noopener">Open de aangeleverde meetbrief (PDF)</a>. Pagina 1 bevat 252 punten van 1 t/m 252 cm. Voorbeelden: 1 cm → 9,5509 m³; 40 cm → 382,2860 m³; 200 cm → 1991,4490 m³; 252 cm → 2534,8712 m³. De volledige overgenomen tabel staat in <a href="meetbrief-data.js">meetbrief-data.js</a>.</p><p>Pagina 2 is een oefenblad: de opgave noemt 248 cm, de gegevens en uitwerking gebruiken 242 cm. Ook het verband tussen “uitliggen” en inzinking is niet eenduidig vastgelegd. Die uitwerking wordt daarom niet automatisch overgenomen.</p><p>252 cm is uitsluitend het laatste ingevulde tabelpunt, geen aangetoonde toegestane diepgang of laadlimiet. We extrapoleren niet. Het model veronderstelt dat de opgegeven volumes de totale waterverplaatsing vertegenwoordigen; het echte scheepsnulpunt en de echte lege toestand moeten vóór praktisch gebruik worden vastgesteld.</p><p>Een hoeveelheid onder het laatste tabelpunt en een positieve kielspeling betekenen niet dat varen of laden veilig of toegestaan is. Brandstof, ballast, voorraden, tankgrenzen, vrijboord, trim, slagzij, stabiliteit, lokale eisen, squat en golfbewegingen vereisen een afzonderlijke beoordeling.</p></details>`;
const q=id=>document.getElementById(id),form=q('draft-form');let lastMode='mass';
function update(){
 const scene=q('draft-scene');
 if(!form.checkValidity()){q('draft-result').textContent='Vul alle velden in binnen het aangegeven bereik.';q('draft-comparison').replaceChildren();q('draft-worked').replaceChildren();scene.setAttribute('hidden','');return;}
 const amount=+q('draft-amount').value,pd=+q('draft-product-density').value,mode=q('draft-mode').value;
 const cargo=mode==='mass'?amount:amount*pd/1000,loadVolume=cargo*1000/pd;
 const params={emptyCm:+q('draft-empty').value,cargoTonnes:cargo,waterDensity:+q('draft-density').value,depth:+q('draft-depth').value};
 try{
  const r=E.calculate(params);scene.removeAttribute('hidden');
  const scale=135/Math.max(params.depth,r.draft,r.freshCm/100,2.6),keel=185+r.draft*scale;
  q('draft-ship').setAttribute('transform',`translate(0 ${keel})`);
  for(const a of ['y1','y2'])q('draft-fresh-keel').setAttribute(a,185+r.freshCm/100*scale);
  q('draft-bottom').setAttribute('transform',`translate(0 ${185+params.depth*scale})`);
  q('draft-measure').setAttribute('y2',keel);q('draft-depth-label').textContent=`Modeldiepgang ${fmt(r.draft)} m`;
  q('draft-svg-desc').textContent=`Modeldiepgang ${fmt(r.draft)} meter. ${fmt(Math.abs(r.deltaCm))} centimeter ${r.deltaCm<=0?'hoger':'dieper'} dan in zoetwater. Waterdiepte ${fmt(params.depth)} meter.`;
  q('draft-result').innerHTML=`<div class="draft-facts"><div><small>Modeldiepgang / inzinking</small><strong>${fmt(r.draft)} m · ${fmt(r.cm)} cm</strong></div><div><small>Ten opzichte van zoetwater</small><strong>${Math.abs(r.deltaCm)<.005?'Gelijk':fmt(Math.abs(r.deltaCm))+' cm '+(r.deltaCm<0?'hoger':'dieper')}</strong></div><div><small>Totale massa in het oefenmodel</small><strong>${fmt(r.mass)} ton</strong></div><div><small>Ladingmassa / laadvolume</small><strong>${fmt(cargo)} ton / ${fmt(loadVolume)} m³</strong></div><div><small>Verplaatst watervolume</small><strong>${fmt(r.volume)} m³</strong></div><div><small>Statische ruimte onder de kiel</small><strong>${fmt(r.ukc)} m</strong></div></div><p class="notice"><b>${r.ukc<=0?'De modelkiel raakt of passeert de bodem.':'Kielspeling is geen veiligheidsmarge.'}</b>${r.ukc<=0?'Deze waterdiepte is in het statische model onvoldoende.':'Benodigde marge, squat, golven en lokale eisen zijn niet meegenomen.'}</p><p class="muted">Rekenruimte tot het laatste tabelpunt: ${fmt(r.tableHeadroom)} ton bij deze waterdichtheid. Dit is geen toegestane extra lading.</p>`;
  q('draft-comparison').innerHTML=[[1000,'Zoet'],[1010,'Brak'],[1025,'Zee']].map(([d,label])=>{try{const x=E.calculate({...params,waterDensity:d});return `<tr><th>${label} · ${d} kg/m³</th><td>${fmt(x.cm)} cm</td><td>${fmt(x.deltaCm)} cm</td></tr>`;}catch{return `<tr><th>${label}</th><td colspan="2">Buiten tabelbereik</td></tr>`;}}).join('');
  q('draft-worked').innerHTML=`<h3>Jouw berekening stap voor stap</h3><ol><li>Lege oefenmassa: ${fmt(E.volumeAt(params.emptyCm),4)} m³ × 1000 ÷ 1000 = ${fmt(r.emptyMass,4)} ton.</li><li>Totale massa: ${fmt(r.emptyMass)} + ${fmt(cargo)} = ${fmt(r.mass)} ton.</li><li>Verplaatst volume: ${fmt(r.mass)} × 1000 ÷ ${fmt(params.waterDensity,1)} = ${fmt(r.volume)} m³.</li><li>Terugzoeken in de meetbrief: ${fmt(r.cm)} cm inzinking; in dit model ${fmt(r.draft)} m diepgang.</li><li>Ruimte onder de kiel: ${fmt(params.depth)} − ${fmt(r.draft)} = ${fmt(r.ukc)} m.</li></ol>`;
 }catch(e){scene.setAttribute('hidden','');q('draft-result').textContent=e.message+' Verminder de lading of pas de lege oefentoestand aan.';q('draft-comparison').replaceChildren();q('draft-worked').replaceChildren();}
}
form.addEventListener('submit',e=>e.preventDefault());
form.addEventListener('input',e=>{
 if(e.target.id==='draft-product'&&e.target.value!=='custom')q('draft-product-density').value=e.target.value;
 if(e.target.id==='draft-product-density')q('draft-product').value='custom';
 if(e.target.id==='draft-water'&&e.target.value!=='custom')q('draft-density').value=e.target.value;
 if(e.target.id==='draft-density')q('draft-water').value='custom';
 if(e.target.id==='draft-mode'){
  const pd=+q('draft-product-density').value,a=+q('draft-amount').value;
  if(pd>0&&Number.isFinite(a))q('draft-amount').value=(lastMode==='mass'?a*1000/pd:a*pd/1000).toFixed(1);
  lastMode=e.target.value;q('draft-amount-label').textContent=lastMode==='mass'?'Ladingmassa (ton)':'Ladingvolume (m³)';
 }
 update();
});
form.addEventListener('click',e=>{const b=e.target.closest('[data-draft-example]');if(!b)return;
 q('draft-chosen-product').textContent='Oefenvoorbeeld met afgeronde productdichtheid.';const type=b.dataset.draftExample;q('draft-empty').value=40;q('draft-depth').value=3.5;q('draft-product').value='840';q('draft-product-density').value=840;
 q('draft-mode').value=lastMode=type==='volume'?'volume':'mass';q('draft-amount').value=type==='volume'?1000:1500;q('draft-amount-label').textContent=lastMode==='mass'?'Ladingmassa (ton)':'Ladingvolume (m³)';
 q('draft-water').value=q('draft-density').value=type==='sea'?1025:1000;update();
});
window.addEventListener('draft-cargo',e=>{
 const name=String(e.detail.name),un=String(e.detail.un);
 q('draft-chosen-product').textContent='Gekozen product: UN '+un+' — '+name+'. Vul een productdichtheid in; die wordt niet uit ADN-tabelkolom 12 afgeleid.';
 q('draft-product').value='custom';q('draft-product-density').value='';update();
});
update();
})();

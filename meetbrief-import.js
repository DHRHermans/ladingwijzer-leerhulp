(function(){
'use strict';
const host=document.getElementById('meetbrief-import'),P=window.MeetbriefParser;
host.innerHTML=`<div class="meetbrief-template"><div><b>Zelf een meetbrief invullen</b><p>Download het blanco CSV-sjabloon: een open bestandsformaat voor LibreOffice Calc, Excel of een teksteditor. Vul minstens twee meetpunten in en open je ingevulde CSV hieronder. Kolom 1: inzinking in cm. Kolom 2: totale waterverplaatsing in m³. Bewaar als UTF-8 CSV met puntkomma’s; laat de kolomkoppen staan. Lege rijen worden overgeslagen.</p></div><a href="docs/blanco-meetbrief.csv" download="blanco-meetbrief.csv" class="file-button" id="meetbrief-template-download">Download blanco meetbrief (.csv)</a></div><details class="meetbrief-upload"><summary>＋ Eigen meetbrief toevoegen · PDF, foto of ingevulde CSV</summary><p>Open een PDF, JPG, PNG, WebP of een ingevuld CSV-sjabloon. De verwerking gebeurt op dit apparaat; je document wordt niet naar een server verstuurd. Kies een pagina met de meettabel, liefst scherp, recht en volledig in beeld.</p><div class="import-controls"><label>Meetbriefbestand<input id="meetbrief-file" type="file" accept="application/pdf,image/jpeg,image/png,image/webp,text/csv,.csv,.pdf,.jpg,.jpeg,.png,.webp"></label><label>PDF-pagina<input id="meetbrief-page" type="number" min="1" max="100" step="1" value="1"></label><button id="meetbrief-read" type="button">Lees de tabel uit</button><button id="meetbrief-cancel" type="button" hidden>Annuleren</button></div><p class="muted">Maximaal 20 MB. Bij een gescande PDF of foto gebruiken we lokale tekstherkenning. Dat kan even duren. Gebruik alleen de kolom met inzinking en de bijbehorende totale waterverplaatsing in m³; laadvermogen en ton per cm zijn andere grootheden.</p><p id="meetbrief-progress" role="status" aria-live="polite"></p><progress id="meetbrief-progress-bar" max="1" value="0" hidden aria-label="Voortgang herkenning"></progress><div id="meetbrief-review" hidden><h2>Controleer de herkenning</h2><canvas id="meetbrief-preview" aria-label="Voorbeeld van de gekozen documentpagina"></canvas><label>Eenheid van de eerste kolom<select id="meetbrief-unit"><option value="cm">Centimeter (cm)</option><option value="m">Meter (m)</option></select></label><label>Tabel · inzinking ; waterverplaatsing (m³)<textarea id="meetbrief-rows" rows="10" spellcheck="false" placeholder="40;382,2860&#10;100;971,6020&#10;200;1991,4490"></textarea></label><p id="meetbrief-review-note" class="muted"></p><details><summary>Herkende brontekst bekijken</summary><pre id="meetbrief-raw"></pre></details><label class="import-confirm"><input id="meetbrief-confirm" type="checkbox">Ik heb alle rijen, de eenheid en de kolom voor totale waterverplaatsing in m³ gecontroleerd tegen mijn document. De tabel bevat geen laadvermogen of ton-per-cm-waarden.</label><div class="import-actions"><button id="meetbrief-apply" type="button">Gebruik deze meetbrief</button><button id="meetbrief-default" type="button">Terug naar meegeleverd voorbeeld</button></div><p>De meetbrief wordt alleen voor deze browsersessie gebruikt. Lege toestand en referentievlak moet je zelf controleren. De simulatie blijft een oefenmodel zonder trim- of stabiliteitsberekening.</p></div></details>`;
const q=id=>document.getElementById(id);let token=0,worker=null,sourceName='',loaded=false;
function message(text){q('meetbrief-progress').textContent=text;}
function resetConfirmation(){q('meetbrief-confirm').checked=false;}
for(const id of ['meetbrief-rows','meetbrief-unit'])q(id).addEventListener('input',resetConfirmation);
q('meetbrief-file').addEventListener('change',()=>{q('meetbrief-review').hidden=true;loaded=false;resetConfirmation();message('Bestand gekozen. Klik op Lees de tabel uit.');});
function loadScript(){if(window.Tesseract)return Promise.resolve();return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='vendor/ocr/tesseract.min.js';s.onload=resolve;s.onerror=()=>reject(new Error('Tekstherkenning kon niet worden geladen.'));document.head.append(s);});}
async function ocr(canvas,run){
 await loadScript();if(run!==token)throw new Error('Geannuleerd.');
 const activeWorker=await Tesseract.createWorker('eng',1,{
  workerPath:new URL('vendor/ocr/worker.min.js',document.baseURI).href,
  corePath:new URL('vendor/ocr/tesseract-core-lstm.wasm.js',document.baseURI).href,
  langPath:new URL('vendor/ocr/',document.baseURI).href,
  logger:m=>{if(run===token){message('Foto/scan herkennen: '+Math.round((m.progress||0)*100)+'% · controleer straks alle cijfers.');q('meetbrief-progress-bar').value=m.progress||0;}}
 });
 if(run!==token){await activeWorker.terminate();throw new Error('Geannuleerd.');}
 worker=activeWorker;
 try{await activeWorker.setParameters({tessedit_pageseg_mode:'6'});const result=await activeWorker.recognize(canvas);return result.data.text;}finally{if(worker===activeWorker)worker=null;await activeWorker.terminate();}
}
function pdfText(items){
 const rows=[];
 for(const item of items.filter(i=>i.str.trim()).sort((a,b)=>b.transform[5]-a.transform[5]||a.transform[4]-b.transform[4])){
  let row=rows.find(r=>Math.abs(r.y-item.transform[5])<2);
  if(!row){row={y:item.transform[5],items:[]};rows.push(row);}row.items.push(item);
 }
 return rows.sort((a,b)=>b.y-a.y).map(r=>r.items.sort((a,b)=>a.transform[4]-b.transform[4]).map(i=>i.str).join(' ')).join('\n');
}
function renderPreview(image){
 const canvas=q('meetbrief-preview'),scale=Math.min(1,2400/Math.max(image.width,image.height));canvas.width=Math.round(image.width*scale);canvas.height=Math.round(image.height*scale);canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);return canvas;
}
q('meetbrief-read').addEventListener('click',async()=>{
 const file=q('meetbrief-file').files[0];if(!file){message('Kies eerst een PDF, foto of ingevulde CSV.');return;}
 if(file.size>20*1024*1024){message('Dit bestand is groter dan 20 MB. Kies een kleinere scan of foto.');return;}
 const csv=/\.csv$/i.test(file.name)||file.type==='text/csv';
 const pdf=/\.pdf$/i.test(file.name)||file.type==='application/pdf';
 if(!pdf&&!csv&&!['image/jpeg','image/png','image/webp'].includes(file.type)){message('Gebruik PDF, JPG, PNG, WebP of het ingevulde CSV-sjabloon.');return;}
 const pageNo=Number(q('meetbrief-page').value);
 if(pdf&&(!Number.isInteger(pageNo)||pageNo<1||pageNo>100)){message('Kies een PDF-pagina van 1 tot en met 100.');return;}
 const run=++token;let doc=null;
 loaded=false;q('meetbrief-review').hidden=true;resetConfirmation();q('meetbrief-read').disabled=true;q('meetbrief-file').disabled=true;q('meetbrief-cancel').hidden=false;q('meetbrief-progress-bar').hidden=false;message('Document openen…');
 try{
  let text='',canvas,reviewTable=null;
  q('meetbrief-preview').hidden=csv;
  if(csv){text=await file.text();reviewTable=P.parseCsv(text);}
  else if(pdf){
   const lib=await import('./vendor/pdfjs/pdf.mjs');lib.GlobalWorkerOptions.workerSrc=new URL('vendor/pdfjs/pdf.worker.mjs',document.baseURI).href;
   doc=await lib.getDocument({data:await file.arrayBuffer(),isEvalSupported:false}).promise;
   if(pageNo>doc.numPages)throw new Error('Dit document bevat '+doc.numPages+' pagina’s. Kies een bestaande pagina.');
   const page=await doc.getPage(pageNo),plain=await page.getTextContent();text=pdfText(plain.items);
   const original=page.getViewport({scale:1}),view=page.getViewport({scale:Math.min(3,2400/Math.max(original.width,original.height))});
   canvas=q('meetbrief-preview');canvas.width=Math.round(view.width);canvas.height=Math.round(view.height);await page.render({canvasContext:canvas.getContext('2d'),viewport:view}).promise;
   if(P.candidates(text).length<2)text=await ocr(canvas,run);
  }else{
   const bitmap=await createImageBitmap(file,{imageOrientation:'from-image'});try{canvas=renderPreview(bitmap);}finally{bitmap.close();}text=await ocr(canvas,run);
  }
  if(run!==token)return;
  const points=csv?P.parseEdited(reviewTable):P.candidates(text);q('meetbrief-rows').value=points.map(([cm,v])=>String(cm).replace('.',',')+';'+String(v).replace('.',',')).join('\n');
  q('meetbrief-raw').textContent=text;q('meetbrief-unit').value='cm';sourceName=file.name+(pdf?' · p. '+pageNo:'');loaded=true;
  q('meetbrief-review').hidden=false;q('meetbrief-review-note').textContent=(csv?points.length+' ingevulde rijen gelezen.':points.length+' mogelijke rijen herkend.')+' Dit is geen volledigheidscontrole. Verwijder verkeerde kolommen, vul ontbrekende rijen aan en corrigeer ieder cijfer. Je kunt de tabel ook geheel zelf invoeren als inzinking;volume.';
  message(points.length>=2?'Document gelezen. Controleer de tabel voordat je die gebruikt.':'Geen bruikbare tabel gevonden. Voer de twee kolommen handmatig in op basis van de getoonde pagina.');
 }catch(e){if(run===token)message('Uitlezen mislukt: '+e.message+(csv?' Controleer de kolomkoppen en ingevulde rijen in je CSV.':' Probeer een scherpe JPG/PNG of een andere PDF-pagina.'));}
 finally{
  if(doc)await doc.destroy();
  if(run===token){q('meetbrief-read').disabled=false;q('meetbrief-file').disabled=false;q('meetbrief-cancel').hidden=true;q('meetbrief-progress-bar').hidden=true;}
 }
});
q('meetbrief-cancel').addEventListener('click',async()=>{++token;const oldWorker=worker;worker=null;q('meetbrief-read').disabled=false;q('meetbrief-file').disabled=false;q('meetbrief-cancel').hidden=true;q('meetbrief-progress-bar').hidden=true;message('Uitlezen geannuleerd. De actieve meetbrief is niet gewijzigd.');if(oldWorker)await oldWorker.terminate();});
q('meetbrief-apply').addEventListener('click',()=>{
 try{
  if(!loaded)throw new Error('Lees eerst een document uit.');
  if(!q('meetbrief-confirm').checked)throw new Error('Controleer de tabel en bevestig dit met het vinkje.');
  const points=P.parseEdited(q('meetbrief-rows').value,q('meetbrief-unit').value);
  window.DraftLearning.createModel(points);
  window.dispatchEvent(new CustomEvent('draft-table',{detail:{points,name:sourceName}}));
  message('Eigen meetbrief actief. Controleer nu de lege oefentoestand; de lading is teruggezet op nul.');
 }catch(e){message(e.message);}
});
q('meetbrief-default').addEventListener('click',()=>{window.dispatchEvent(new CustomEvent('draft-table',{detail:{points:window.MeetbriefData.points,name:'Meegeleverd voorbeeld'}}));message('Het meegeleverde voorbeeld is weer actief.');});
})();

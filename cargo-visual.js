(function(){
'use strict';
const area=document.getElementById('ladingstechniek'),tabs=area.querySelector('.cargo-tabs');
const panel=document.createElement('section');panel.className='panel ship-effects';panel.id='ship-effects';
panel.innerHTML=`<div class="effects-heading"><div><span class="eyebrow">WAT DOET HET SCHIP?</span><h2>Zie het gevolg van je laadplan</h2></div><label class="effects-toggle"><input id="effects-visible" type="checkbox" checked>Toon scheepsweergave</label></div><div id="effects-content"><p id="effects-source" class="muted">Live gekoppeld aan de ladingstechnieksimulator.</p><p class="effects-model">Illustratieve bewegingen, visueel versterkt. Richtingen volgen jouw massaverdeling; hoeken, diepgangen en rolgedrag zijn geen voorspelling voor een echt schip.</p><div id="effects-scenarios" class="effects-scenarios"><button data-load-case="balanced" type="button">Gelijk verdeeld</button><button data-load-case="port" type="button">Zwaar aan bakboord</button><button data-load-case="front" type="button">Zwaar vooraan</button><button data-load-case="diagonal" type="button">Scheef én voorover</button><button data-load-case="high" type="button">Hoog gestapelde containers</button></div><div class="effects-controls"><label><input id="effects-waves" type="checkbox" checked>Golfprikkel / rollen tonen</label><label>Golfprikkel <input id="effects-wave-strength" type="range" min="0" max="3" step="0.1" value="1" aria-label="Sterkte van de illustratieve golfprikkel"></label><label><input id="effects-high" type="checkbox">Lading hoog geplaatst</label><button id="effects-pause" type="button" aria-pressed="false">Pauzeer beweging</button></div><p id="effects-motion-note" class="muted">Rollen is een beweging door de golfprikkel. Een ongelijke verdeling geeft daarnaast een blijvende scheefstand.</p><div id="effects-scenes" class="effects-scenes"><figure><figcaption><b>Zijaanzicht</b><span>Voor en achter vergelijken</span></figcaption><svg id="effects-side-svg" viewBox="0 0 900 390" role="img" aria-labelledby="effects-side-title effects-side-desc"><title id="effects-side-title">Zijaanzicht van het beladen binnenschip</title><desc id="effects-side-desc">De boeg staat links en de achtersteven rechts.</desc><defs><linearGradient id="effects-water" x2="0" y2="1"><stop stop-color="#69bfd8"/><stop offset="1" stop-color="#216782"/></linearGradient><linearGradient id="effects-hull" x2="0" y2="1"><stop stop-color="#245c7a"/><stop offset="1" stop-color="#102c43"/></linearGradient></defs><rect width="900" height="390" fill="#eaf4f8"/><path d="M0 150Q100 120 200 145T420 140T660 142T900 130V210H0Z" fill="#cbdfe3"/><rect y="220" width="900" height="170" fill="url(#effects-water)"/><line x1="60" x2="840" y1="220" y2="220" stroke="#e4f6f9" stroke-dasharray="6 6"/><g id="effects-side-heave"><g id="effects-side-ship"><path d="M-355 -42L-310 -73H340V-22L315 52H-310Z" fill="url(#effects-hull)"/><path d="M-348 -41L-309 -65H335" stroke="#f3f7f8" stroke-width="5" fill="none"/><path d="M-320 30H323L315 52H-310Z" fill="#9a6350"/><rect x="250" y="-116" width="72" height="43" rx="3" fill="#f9fcfc"/><rect x="262" y="-108" width="48" height="17" fill="#3585a7"/><path d="M293 -116V-144M-302 -74V-110" stroke="#2a5265" stroke-width="3"/><g id="effects-side-cargo"></g><text x="-285" y="-8" fill="#dcebf0" font-size="15" letter-spacing="3">LADINGWIJZER</text><path d="M-282 -28V36M-291 -20H-273M-291 -4H-273M-291 12H-273M-291 28H-273M286 -28V36M277 -20H295M277 -4H295M277 12H295M277 28H295" stroke="#ebf5f8" stroke-width="2"/></g></g><rect y="220" width="900" height="170" fill="#4bb1cd" opacity=".17"/><path d="M0 220Q20 215 40 220T80 220T120 220T160 220T200 220T240 220T280 220T320 220T360 220T400 220T440 220T480 220T520 220T560 220T600 220T640 220T680 220T720 220T760 220T800 220T840 220T880 220T920 220" stroke="#c6f1f9" fill="none" stroke-width="2"/><text x="25" y="35" fill="#274f63" font-size="16">BOEG / VOOR</text><text x="875" y="35" fill="#274f63" font-size="16" text-anchor="end">ACHTERSTEVEN</text><text x="25" y="367" id="effects-front-label" fill="#e5f5f8" font-size="15"></text><text x="875" y="367" id="effects-aft-label" fill="#e5f5f8" font-size="15" text-anchor="end"></text></svg></figure><figure><figcaption><b>Achteraanzicht</b><span>Kijkrichting naar de boeg</span></figcaption><svg id="effects-end-svg" viewBox="0 0 520 390" role="img" aria-labelledby="effects-end-title effects-end-desc"><title id="effects-end-title">Achteraanzicht met overhellen en rollen</title><desc id="effects-end-desc">Bakboord is links, stuurboord rechts.</desc><rect width="520" height="390" fill="#eaf4f8"/><rect y="220" width="520" height="170" fill="url(#effects-water)"/><line x1="260" x2="260" y1="45" y2="330" stroke="#b1cbd6" stroke-dasharray="5 5"/><g id="effects-end-heave"><g id="effects-end-ship"><path d="M-118 -47H118L99 55Q0 83-99 55Z" fill="url(#effects-hull)"/><path d="M-110 32H110L99 55Q0 83-99 55Z" fill="#9a6350"/><rect x="-69" y="-93" width="138" height="46" rx="4" fill="#f9fcfc"/><path d="M-56 -82H56V-65H-56Z" fill="#3585a7"/><path d="M-117 -45H117M-105 -49V-60M105 -49V-60" stroke="#e8f4f8" stroke-width="4"/><g id="effects-end-cargo"></g><path d="M0 -93V-123" stroke="#204c64" stroke-width="3"/></g></g><rect y="220" width="520" height="170" fill="#4bb1cd" opacity=".17"/><line x1="0" x2="520" y1="220" y2="220" stroke="#d6f4f9" stroke-width="2"/><text x="18" y="35" font-size="15" fill="#274f63">BAKBOORD</text><text x="502" y="35" font-size="15" fill="#274f63" text-anchor="end">STUURBOORD</text><text x="260" y="367" id="effects-heel-label" fill="#e5f5f8" font-size="15" text-anchor="middle"></text></svg></figure></div><div id="effects-feedback" class="effects-feedback" role="status" aria-live="polite"></div><p class="muted">Overhellen (blijvende scheefstand), rollen (heen-en-weer bewegen) en trim (voor/achter dieper) zijn verschillende effecten. De waterlijn blijft horizontaal. Hoog geplaatste lading en vrije vloeistofoppervlakken worden hier als aandachtspunt zichtbaar gemaakt, zonder een stabiliteitsberekening.</p></div>`;
tabs.after(panel);
const q=id=>document.getElementById(id),reduced=matchMedia('(prefers-reduced-motion: reduce)');
let state=null,lastData=null,paused=false,frame=0,phase=0,lastTime=0,lastRoll=0;
const fmt=(x)=>x.toLocaleString('nl-BE',{maximumFractionDigits:1});
function activeSource(){return q('cargo-puzzle').hidden?'sim':'puzzle';}
function canAnimate(){return !!state&&!paused&&!reduced.matches&&q('effects-waves').checked&&+q('effects-wave-strength').value>0&&!area.hidden&&q('effects-visible').checked&&!document.hidden;}
function pose(roll=0){
 if(!state)return;
 const heave=10+Math.min(1.5,state.total/1200)*18;
 q('effects-side-heave').setAttribute('transform',`translate(450 ${220+heave})`);
 q('effects-side-ship').setAttribute('transform',`rotate(${state.pitchVisual})`);
 q('effects-end-heave').setAttribute('transform',`translate(260 ${220+heave})`);
 q('effects-end-ship').setAttribute('transform',`rotate(${state.heelVisual+roll})`);
}
function stop(){cancelAnimationFrame(frame);frame=0;lastTime=0;}
function animate(now){
 frame=0;if(!canAnimate()){lastTime=0;return;}
 const delta=lastTime?Math.min(.05,(now-lastTime)/1000):0;lastTime=now;phase+=delta;
 const high=q('effects-high').checked?1.8:1,liquid=lastData.mode==='liquid'&&lastData.partial>0?1.35:1;
 lastRoll=Math.sin(phase*1.6)*+q('effects-wave-strength').value*1.8*high*liquid;
 pose(lastRoll);frame=requestAnimationFrame(animate);
}
function refreshMotion(){stop();if(!q('effects-waves').checked||+q('effects-wave-strength').value===0||reduced.matches){lastRoll=0;pose(0);}else pose(lastRoll);if(canAnimate())frame=requestAnimationFrame(animate);
 q('effects-pause').textContent=paused?'Hervat beweging':'Pauzeer beweging';q('effects-pause').setAttribute('aria-pressed',String(paused));
 q('effects-motion-note').textContent=reduced.matches?'Beweging staat uit vanwege je voorkeur voor minder animatie. De statische scheefstand blijft zichtbaar.':paused?'Rolbeweging gepauzeerd. Wijzigingen in belading blijven zichtbaar.':'De golfprikkel veroorzaakt rollen; ongelijke belading geeft een blijvende scheefstand. De bewegingsgrootte is illustratief.';
}
function cargoShapes(){
 const mode=lastData.mode,m=lastData.masses;let side='',end='';
 for(let col=0;col<3;col++){
  const amount=m[col]+m[col+3],h=Math.min(85,amount/400*65)+(q('effects-high').checked&&amount>0?28:0),x=-275+col*168;
  if(amount<=0)continue;
  if(mode==='containers'){
   const rows=Math.max(1,Math.ceil(h/22));for(let row=0;row<rows;row++)for(let c=0;c<2;c++)side+=`<rect x="${x+c*72}" y="${-74-(row+1)*22}" width="68" height="20" rx="2" fill="${['#dbb46d','#3b9db8','#d58e70'][(col+row)%3]}" stroke="#224e62"/>`;
  }else if(mode==='liquid'){side+=`<rect x="${x}" y="-94" width="142" height="20" rx="9" fill="#9bb8c5"/><path d="M${x+20} -100H${x+125}" stroke="#39667a" stroke-width="3"/>`;}
  else if(mode==='bulk'){side+=`<path d="M${x} -74Q${x+36} ${-74-h*1.3} ${x+72} ${-74-h}Q${x+105} ${-74-h*.6} ${x+145} -74Z" fill="#d8bb80" stroke="#ab915f"/>`;}
  else{side+=`<rect x="${x+10}" y="${-74-h}" width="120" height="${h}" rx="3" fill="${mode==='heavy'?'#7d8b97':'#c6975c'}" stroke="#284e60"/>`;}
 }
 if(q('effects-high').checked&&state.total>0){end='<rect x="-52" y="-135" width="49" height="40" fill="#d6ae66" stroke="#284e60"/><rect x="3" y="-135" width="49" height="40" fill="#4197b0" stroke="#284e60"/>';}
 q('effects-side-cargo').innerHTML=side;q('effects-end-cargo').innerHTML=end;
}
function update(data){
 if(data.source!==activeSource())return;
 lastData=data;q('effects-source').textContent=data.source==='puzzle'?'Live gekoppeld aan jouw ladingspuzzel.':'Live gekoppeld aan de ladingstechnieksimulator.';
 q('effects-scenarios').hidden=data.source==='puzzle';
 if(!data.valid){state=null;stop();q('effects-scenes').hidden=true;q('effects-feedback').textContent='Vul geldige ladinghoeveelheden in om het schip te tonen.';return;}
 state=window.CargoEffects.describe(data.masses);q('effects-scenes').hidden=false;cargoShapes();
 q('effects-front-label').textContent='Voor: '+fmt(state.front)+' ton';q('effects-aft-label').textContent='Achter: '+fmt(state.aft)+' ton';
 q('effects-heel-label').textContent='BB '+fmt(state.port)+' ton · SB '+fmt(state.starboard)+' ton';
 const heel=state.side==='gelijk'?'Gelijk over bakboord en stuurboord verdeeld.':`Het schip helt in deze illustratie naar ${state.side}: daar ligt meer ladingmassa.`;
 const trim=state.trim==='gelijk'?'Voor en achter zijn gelijk belast.':`Het ${state.trim==='voor'?'voorschip':'achterschip'} ligt in deze illustratie dieper: daar ligt meer ladingmassa.`;
 q('effects-feedback').innerHTML='<div><b>Overhellen</b><p>'+heel+'</p></div><div><b>Trim</b><p>'+trim+'</p></div><div><b>Rollen</b><p>Een golfprikkel laat het schip rond de scheefstand bewegen.'+(q('effects-high').checked?' Hoog geplaatste lading is gemarkeerd: een hoger zwaartepunt kan de stabiliteit verminderen.':'')+(data.mode==='liquid'&&data.partial?' Gedeeltelijk gevulde tanks: let op het vrije vloeistofoppervlak.':'')+'</p></div>';
 q('effects-side-desc').textContent=trim+' De boeg is links. Hoeken zijn visueel versterkt, niet scheepsspecifiek berekend.';
 q('effects-end-desc').textContent=heel+' Golfprikkel en rollen zijn illustratief.';
 pose(paused?lastRoll:0);refreshMotion();
}
window.addEventListener('cargo-load',e=>update(e.detail));
q('effects-visible').onchange=()=>{q('effects-content').hidden=!q('effects-visible').checked;refreshMotion();};
q('effects-pause').onclick=()=>{paused=!paused;refreshMotion();};
for(const id of ['effects-waves','effects-wave-strength','effects-high'])q(id).addEventListener('input',()=>{if(lastData)update(lastData);});
q('effects-scenarios').addEventListener('click',e=>{
 const b=e.target.closest('[data-load-case]');if(!b)return;
 const type=b.dataset.loadCase,mode=type==='high'?'containers':q('cargo-type').value;
 if(q('cargo-type').value!==mode){q('cargo-type').value=mode;q('cargo-type').dispatchEvent(new Event('input',{bubbles:true}));}
 const amounts=type==='high'?[8,8,8,2,2,2]:type==='port'?[180,180,180,20,20,20]:type==='front'?[200,100,0,200,100,0]:type==='diagonal'?[200,150,50,100,75,25]:[100,100,100,100,100,100];
 for(let i=0;i<6;i++)q('cargo-slot-'+i).value=mode==='containers'&&type!=='high'?Math.round(amounts[i]/20):amounts[i];
 q('effects-high').checked=type==='high';q('cargo-form').dispatchEvent(new Event('input',{bubbles:true}));
});
document.addEventListener('visibilitychange',refreshMotion);
document.addEventListener('click',e=>{if(e.target.closest('[data-view]'))refreshMotion();});
reduced.addEventListener('change',refreshMotion);
q('cargo-form').dispatchEvent(new Event('input',{bubbles:true}));
})();

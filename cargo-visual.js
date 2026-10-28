(function(){
'use strict';
const area=document.getElementById('ladingstechniek'),tabs=area.querySelector('.cargo-tabs');
const panel=document.createElement('section');panel.className='panel ship-effects';panel.id='ship-effects';
panel.innerHTML=`<div class="effects-heading"><div><span class="eyebrow">WAT DOET HET SCHIP?</span><h2>Zie het gevolg van je laadplan</h2></div><label class="effects-toggle"><input id="effects-visible" type="checkbox" checked>Toon scheepsweergave</label></div><div id="effects-content"><p id="effects-source" class="muted">Live gekoppeld aan de ladingstechnieksimulator.</p><p class="effects-model">Illustratieve bewegingen, visueel versterkt. Richtingen volgen jouw massaverdeling; hoeken, diepgangen en rolgedrag zijn geen voorspelling voor een echt schip.</p><div id="effects-scenarios" class="effects-scenarios"><button data-load-case="balanced" type="button">Gelijk verdeeld</button><button data-load-case="port" type="button">Zwaar aan bakboord</button><button data-load-case="front" type="button">Zwaar vooraan</button><button data-load-case="aft" type="button">Zwaar achteraan</button><button data-load-case="diagonal" type="button">Scheef én voorover</button><button data-load-case="high" type="button">Hoog gestapelde containers</button></div><div class="effects-controls"><label><input id="effects-waves" type="checkbox" checked>Golfprikkel / rollen tonen</label><label>Golfprikkel <input id="effects-wave-strength" type="range" min="0" max="3" step="0.1" value="1" aria-label="Sterkte van de illustratieve golfprikkel"></label><label><input id="effects-high" type="checkbox">Lading hoog geplaatst</label><button id="effects-pause" type="button" aria-pressed="false">Pauzeer beweging</button></div><p id="effects-motion-note" class="muted">Rollen is een beweging door de golfprikkel. Een ongelijke verdeling geeft daarnaast een blijvende scheefstand.</p><div id="effects-scenes" class="effects-scenes"><figure><figcaption><b>Zijaanzicht vanaf bakboord</b><span>Oranje: bakboord · groen: stuurboord</span></figcaption><svg id="effects-side-svg" viewBox="0 0 900 390" role="img" aria-labelledby="effects-side-title effects-side-desc"><title id="effects-side-title">Zijaanzicht van het beladen binnenschip</title><desc id="effects-side-desc">De boeg staat links en de achtersteven rechts.</desc><defs><linearGradient id="effects-water" x2="0" y2="1"><stop stop-color="#69bfd8"/><stop offset="1" stop-color="#216782"/></linearGradient><linearGradient id="effects-hull" x2="0" y2="1"><stop stop-color="#245c7a"/><stop offset="1" stop-color="#102c43"/></linearGradient></defs><rect width="900" height="390" fill="#eaf4f8"/><path d="M0 150Q100 120 200 145T420 140T660 142T900 130V210H0Z" fill="#cbdfe3"/><rect y="220" width="900" height="170" fill="url(#effects-water)"/><line x1="60" x2="840" y1="220" y2="220" stroke="#e4f6f9" stroke-dasharray="6 6"/><g id="effects-side-heave"><g id="effects-side-ship"></g></g><rect y="220" width="900" height="170" fill="#4bb1cd" opacity=".17"/><line x1="0" x2="900" y1="220" y2="220" stroke="#d6f4f9" stroke-width="2"/><text x="25" y="35" fill="#274f63" font-size="16">BOEG / VOOR</text><text id="effects-side-heel-direction" x="25" y="62" fill="#274f63" font-size="14"></text><text x="875" y="35" fill="#274f63" font-size="16" text-anchor="end">ACHTERSTEVEN</text><text x="25" y="367" id="effects-front-label" fill="#e5f5f8" font-size="15"></text><text x="875" y="367" id="effects-aft-label" fill="#e5f5f8" font-size="15" text-anchor="end"></text></svg></figure><figure><figcaption><b>Achteraanzicht</b><span>Kijkrichting naar de boeg</span></figcaption><svg id="effects-end-svg" viewBox="0 0 520 390" role="img" aria-labelledby="effects-end-title effects-end-desc"><title id="effects-end-title">Achteraanzicht met overhellen en rollen</title><desc id="effects-end-desc">Bakboord is links, stuurboord rechts.</desc><rect width="520" height="390" fill="#eaf4f8"/><rect y="220" width="520" height="170" fill="url(#effects-water)"/><line x1="260" x2="260" y1="45" y2="330" stroke="#b1cbd6" stroke-dasharray="5 5"/><g id="effects-end-heave"><g id="effects-end-ship"></g></g><rect y="220" width="520" height="170" fill="#4bb1cd" opacity=".17"/><line x1="0" x2="520" y1="220" y2="220" stroke="#d6f4f9" stroke-width="2"/><text id="effects-end-heel-direction" x="260" y="85" fill="#274f63" font-size="13" text-anchor="middle"></text><text x="260" y="62" id="effects-end-trim-label" font-size="13" fill="#274f63" text-anchor="middle"></text><text x="18" y="35" font-size="15" fill="#274f63">BAKBOORD</text><text x="502" y="35" font-size="15" fill="#274f63" text-anchor="end">STUURBOORD</text><text x="260" y="367" id="effects-heel-label" fill="#e5f5f8" font-size="15" text-anchor="middle"></text></svg></figure></div><div id="effects-feedback" class="effects-feedback" role="status" aria-live="polite"></div><p class="muted">Overhellen (blijvende scheefstand), rollen (heen-en-weer bewegen) en trim (voor/achter dieper) zijn verschillende effecten. De waterlijn blijft horizontaal. De oranje lijn en punten zijn bakboord, de groene zijn stuurboord. Het zijaanzicht kijkt vanaf bakboord; de groene dekzijde ligt daarachter. Dezelfde gekleurde zijde ligt in beide beelden even hoog. Hoog geplaatste lading en vrije vloeistofoppervlakken worden hier als aandachtspunt zichtbaar gemaakt, zonder een stabiliteitsberekening.</p></div>`;
tabs.after(panel);
const q=id=>document.getElementById(id),reduced=matchMedia('(prefers-reduced-motion: reduce)');
let state=null,lastData=null,paused=false,frame=0,phase=0,lastTime=0,lastRoll=0;
const fmt=(x)=>x.toLocaleString('nl-BE',{maximumFractionDigits:1});
function activeSource(){return q('cargo-puzzle').hidden?'sim':'puzzle';}
function canAnimate(){return !!state&&!paused&&!reduced.matches&&q('effects-waves').checked&&+q('effects-wave-strength').value>0&&!area.hidden&&q('effects-visible').checked&&!document.hidden;}
function pose(roll=0){
 if(!state)return;
 const S=window.ShipGeometry,heel=state.heelVisual+roll,midY=S.G.water+state.heaveVisual;
 const direction=Math.abs(heel)<.05?'Dekzijden op gelijke hoogte':heel<0?'Bakboord (oranje) lager':'Stuurboord (groen) lager';
 q('effects-side-heel-direction').textContent=direction;q('effects-end-heel-direction').textContent=direction;
 q('effects-side-heave').setAttribute('transform',`translate(450 ${midY})`);
 q('effects-end-heave').setAttribute('transform',`translate(260 ${midY})`);
 for(const view of ['side','end']){
  const group=q('effects-'+view+'-ship');group.removeAttribute('transform');
  group.dataset.trim=state.pitchVisual;group.dataset.heel=heel;
  group.innerHTML=S.render(lastData.mode,lastData.masses,q('effects-high').checked,state.pitchVisual,heel,view);
  for(const [key,across,color] of [['port',-S.G.halfBeam,'#eeb36c'],['starboard',S.G.halfBeam,'#86ebd0']]){
   const points=[-310,S.G.stern].map(x=>S.project([x,across,S.G.deck],state.pitchVisual,heel));
   const line=document.createElementNS('http://www.w3.org/2000/svg','path');line.id='effects-'+view+'-deck-edge-'+key;
   line.setAttribute('d',points.map((p,i)=>(i?'L':'M')+(view==='side'?p.sideX:p.endX)+' '+p.z).join(''));
   line.setAttribute('fill','none');line.setAttribute('stroke',color);line.setAttribute('stroke-width',key==='port'?'3':'2');
   if(view==='side'&&key==='starboard')line.setAttribute('stroke-dasharray','6 5');group.append(line);
  }
  for(const [key,across] of [['port',-S.G.halfBeam],['center',0],['starboard',S.G.halfBeam]]){
   const point=S.project([S.G.stern,across,S.G.deck],state.pitchVisual,heel);
   const marker=document.createElementNS('http://www.w3.org/2000/svg','circle');
   marker.id='effects-'+view+'-stern-deck-'+key;marker.setAttribute('cx',view==='side'?point.sideX:point.endX);marker.setAttribute('cy',point.z);marker.setAttribute('r',key==='center'?'2.5':'3.5');marker.setAttribute('fill',key==='port'?'#eeb36c':key==='starboard'?'#86ebd0':'#fff');group.append(marker);
  }
  const keel=S.project([S.G.stern,0,S.G.keel],state.pitchVisual,heel);
  const marker=document.createElementNS('http://www.w3.org/2000/svg','circle');marker.id='effects-'+view+'-stern-keel';marker.setAttribute('cx',view==='side'?keel.sideX:keel.endX);marker.setAttribute('cy',keel.z);marker.setAttribute('r','2');marker.setAttribute('fill','#fff');group.append(marker);
 }
}
function stop(){cancelAnimationFrame(frame);frame=0;lastTime=0;}
function animate(now){
 frame=0;if(!canAnimate()){lastTime=0;return;}
 if(lastTime&&now-lastTime<32){frame=requestAnimationFrame(animate);return;}const delta=lastTime?Math.min(.08,(now-lastTime)/1000):0;lastTime=now;phase+=delta;
 const high=q('effects-high').checked?1.8:1,liquid=lastData.mode==='liquid'&&lastData.partial>0?1.35:1;
 lastRoll=Math.sin(phase*1.6)*+q('effects-wave-strength').value*1.8*high*liquid;
 pose(lastRoll);frame=requestAnimationFrame(animate);
}
function refreshMotion(){stop();if(!q('effects-waves').checked||+q('effects-wave-strength').value===0||reduced.matches){lastRoll=0;pose(0);}else pose(lastRoll);if(canAnimate())frame=requestAnimationFrame(animate);
 q('effects-pause').textContent=paused?'Hervat beweging':'Pauzeer beweging';q('effects-pause').setAttribute('aria-pressed',String(paused));
 q('effects-motion-note').textContent=reduced.matches?'Beweging staat uit vanwege je voorkeur voor minder animatie. De statische scheefstand blijft zichtbaar.':paused?'Rolbeweging gepauzeerd. Wijzigingen in belading blijven zichtbaar.':'De golfprikkel veroorzaakt rollen; ongelijke belading geeft een blijvende scheefstand. De bewegingsgrootte is illustratief.';
}
function update(data){
 if(data.source!==activeSource())return;
 lastData=data;q('effects-source').textContent=data.source==='puzzle'?'Live gekoppeld aan jouw ladingspuzzel.':'Live gekoppeld aan de ladingstechnieksimulator.';
 q('effects-scenarios').hidden=data.source==='puzzle';
 if(!data.valid){state=null;stop();q('effects-scenes').hidden=true;q('effects-feedback').textContent='Vul geldige ladinghoeveelheden in om het schip te tonen.';return;}
 state=window.CargoEffects.describe(data.masses);q('effects-scenes').hidden=false;
 q('effects-front-label').textContent='Voor: '+fmt(state.front)+' ton';q('effects-aft-label').textContent='Achter: '+fmt(state.aft)+' ton';
 q('effects-heel-label').textContent='BB '+fmt(state.port)+' ton · SB '+fmt(state.starboard)+' ton';
 const heel=state.side==='gelijk'?'Gelijk over bakboord en stuurboord verdeeld.':`Het schip helt in deze illustratie naar ${state.side}: daar ligt meer ladingmassa.`;
 const trim=state.trim==='gelijk'?'Voor en achter zijn gelijk belast.':`Het ${state.trim==='voor'?'voorschip':'achterschip'} ligt in deze illustratie dieper: daar ligt meer ladingmassa.`;
 q('effects-feedback').innerHTML='<div><b>Overhellen</b><p>'+heel+'</p></div><div><b>Trim</b><p>'+trim+'</p></div><div><b>Rollen</b><p>Een golfprikkel laat het schip rond de scheefstand bewegen.'+(q('effects-high').checked?' Hoog geplaatste lading is gemarkeerd: een hoger zwaartepunt kan de stabiliteit verminderen.':'')+(data.mode==='liquid'&&data.partial?' Gedeeltelijk gevulde tanks: let op het vrije vloeistofoppervlak.':'')+'</p></div>';
 q('effects-side-desc').textContent=trim+' De boeg is links. Hoeken zijn visueel versterkt, niet scheepsspecifiek berekend.';
 const stern=state.trim==='gelijk'?'Geen trimverschil bij de achtersteven.':state.trim==='voor'?'Voorover: achtersteven komt hoger.':'Achterover: achtersteven komt lager.';
 q('effects-end-trim-label').textContent=stern;
 q('effects-end-desc').textContent=heel+' '+stern+' De hoogte volgt hetzelfde draaipunt als het zijaanzicht. Golfprikkel en rollen zijn illustratief.';
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
 const amounts=type==='high'?[8,8,8,2,2,2]:type==='port'?[180,180,180,20,20,20]:type==='front'?[200,100,0,200,100,0]:type==='aft'?[0,100,200,0,100,200]:type==='diagonal'?[200,150,50,100,75,25]:[100,100,100,100,100,100];
 for(let i=0;i<6;i++)q('cargo-slot-'+i).value=mode==='containers'&&type!=='high'?Math.round(amounts[i]/20):amounts[i];
 q('effects-high').checked=type==='high';q('cargo-form').dispatchEvent(new Event('input',{bubbles:true}));
});
document.addEventListener('visibilitychange',refreshMotion);
document.addEventListener('click',e=>{if(e.target.closest('[data-view]'))refreshMotion();});
reduced.addEventListener('change',refreshMotion);
q('cargo-form').dispatchEvent(new Event('input',{bubbles:true}));
})();

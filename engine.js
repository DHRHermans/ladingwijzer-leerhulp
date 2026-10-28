/* Pure dossier checks: never a transport permission engine. */
(function(root){
'use strict';
const fields={ship:'Scheepsnaam',eni:'ENI-nummer',mode:'Vervoersvorm',type:'Scheepstype',expiry:'Geldigheidsdatum Certificaat van Goedkeuring',date:'Reisdatum',origin:'Laadplaats',destination:'Losplaats',route:'Traject',un:'UN-nummer',cargo:'Officiële vervoersnaam',hazard:'Klasse en bijkomend gevaar',pg:'Verpakkingsgroep of gemotiveerde niet-toepasselijkheid',quantity:'Hoeveelheid',unit:'Eenheid',details:'Stof- en verpakkingskenmerken',evidence:'Exacte ADN-rubriek en onderbouwing',other:'Andere lading / restlading'};
const phases={voor:'Voorbereiding',laden:'Laden',varen:'Varen',lossen:'Lossen'};
const checks=[
['identity','voor','Stofrubriek en variant vastgesteld','Leg vervoersdocument, exacte stofkenmerken en toepasselijke tabelrij naast elkaar.','3.2.1 / 3.2.3'],
['certificate','voor','Schip en stof passen bij de certificaten','Controleer het Certificaat van Goedkeuring, de bijlagen en eventuele stoffenlijst tegen alle toepasselijke eisen.','1.16 / deel 9'],
['documents','voor','Documentenset bepaald en aanwezig','Bepaal welke documenten voor dit schip en deze lading nodig zijn, inclusief inspectie- en bemanningsdocumenten.','8.1.2 / 8.2'],
['equipment','voor','Uitrusting vastgesteld en gecontroleerd','Bepaal type, aantallen, geschiktheid, beschikbaarheid en keuring uit de toepasselijke bepalingen.','8.1.4 / 8.1.5 / 8.1.6'],
['exceptions','voor','Vrijstellingen en bijzondere bepalingen onderzocht','Geen vrijstelling afleiden uit alleen een hoeveelheid. Controleer alle voorwaarden en overgangsbepalingen.','1.1.3 / 1.5 / 1.6 / 3.3'],
['loadplan','laden','Ladingplan en samenlading gecontroleerd','Neem stabiliteit, ladingverdeling, andere goederen en restlading mee.','7.1 / 7.2'],
['terminal','laden','Schip-walafspraken en procedure gecontroleerd','Bij tankvervoer: bepaal toepasselijkheid en gebruik de officiële controlelijst. Dit werkblad vervangt deze niet.','7.2.4.10 / 8.6.3','tank'],
['briefing','laden','Bemanning geïnformeerd','Bespreek gevaren, taken, schriftelijke instructies en toepasselijke veiligheidsmaatregelen vóór de handeling.','1.3 / 5.4.3 / deel 7'],
['signals','varen','Seinvoering, reisvoorwaarden en meldingen bepaald','Verifieer de ladingafhankelijke voorschriften en lokale vaarwegregels. Dit loket berekent geen kegels.','7.1.5 / 7.2.5'],
['monitor','varen','Toezicht en registraties georganiseerd','Bepaal welke controles, metingen en registraties van toepassing zijn.','deel 7 / 8.1.2'],
['discharge','lossen','Losprocedure en afspraken gecontroleerd','Controleer de losvoorwaarden met de ontvangstinstallatie en gebruik waar vereist de officiële controlelijst.','deel 7 / 8.6.3'],
['residue','lossen','Restlading en volgende toestand beoordeeld','Leeg betekent niet automatisch vrij van ADN-verplichtingen. Beoordeel achtergebleven stoffen en de toestand na lossen.','deel 7']
].map(([id,phase,title,help,ref,mode])=>({id,phase,title,help,ref,mode}));
function applicable(data){return checks.filter(c=>!c.mode||c.mode===data.mode)}
function assess(data={},states={}){
const missing=Object.entries(fields).filter(([k])=>!String(data[k]??'').trim()).map(([,v])=>v);
if(data.un&&!/^\d{4}$/.test(data.un))missing.push('UN-nummer moet exact vier cijfers bevatten');
if(data.eni&&!/^\d{8}$/.test(data.eni))missing.push('ENI-nummer moet exact acht cijfers bevatten');
if(data.quantity&&!(Number.isFinite(Number(data.quantity))&&Number(data.quantity)>0))missing.push('Hoeveelheid moet een positief getal zijn');
for(const k of ['expiry','date'])if(data[k]&&(!/^\d{4}-\d{2}-\d{2}$/.test(data[k])||!Number.isFinite(Date.parse(data[k]))||new Date(data[k]).toISOString().slice(0,10)!==data[k]))missing.push('Ongeldige datum: '+fields[k]);
const blockers=[];
if(data.mode==='tank'&&data.type==='dry'||data.mode==='dry'&&['N','C','G'].includes(data.type))blockers.push('Vervoersvorm en opgegeven scheepstype spreken elkaar tegen.');
if(data.date&&data.expiry&&data.expiry<data.date)blockers.push('Opgegeven Certificaat van Goedkeuring verloopt vóór de reisdatum.');
const active=applicable(data),done=active.filter(c=>states[c.id]==='ok').length,na=active.filter(c=>states[c.id]==='na').length,open=active.length-done-na;
const failures=active.filter(c=>states[c.id]==='no');
if(failures.length)blockers.push(...failures.map(c=>'Niet in orde: '+c.title));
return {missing,blockers,done,na,open,total:active.length,title:blockers.length?'Aandachtspunten blokkeren afronding':missing.length||open?'Dossier nog onvolledig':'Werkblad ingevuld — beoordeling nodig',permission:'NIET BEOORDEELD'};
}
const api={fields,phases,checks,applicable,assess};root.ADN=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);

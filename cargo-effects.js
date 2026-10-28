/* Illustratieve animatiesturing; dit zijn geen hydrostatische scheepsberekeningen. */
(function(root){
'use strict';
function describe(masses){
 if(!Array.isArray(masses)||masses.length!==6||masses.some(m=>!Number.isFinite(m)||m<0))throw new Error('Zes geldige ladingmassa’s nodig.');
 const total=masses.reduce((a,b)=>a+b,0),port=masses.slice(0,3).reduce((a,b)=>a+b,0),starboard=total-port,front=masses[0]+masses[3],aft=masses[2]+masses[5];
 const transverse=total?(starboard-port)/total:0,longitudinal=total?(aft-front)/total:0;
 return {total,port,starboard,front,aft,transverse,longitudinal,
  heelVisual:transverse*14,pitchVisual:longitudinal*9,
  side:Math.abs(transverse)<.01?'gelijk':transverse<0?'bakboord':'stuurboord',
  trim:Math.abs(longitudinal)<.01?'gelijk':longitudinal<0?'voor':'achter'};
}
const api={describe};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.CargoEffects=api;
})(globalThis);

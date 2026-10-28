const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../draft-engine.js'),D=require('../meetbrief-data.js');
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
const base={emptyCm:40,cargoTonnes:1500,waterDensity:1000,depth:3.5};
test('252 complete increasing source rows and reference values',()=>{
 assert.equal(D.points.length,252);
 D.points.forEach(([cm,v],i)=>{assert.equal(cm,i+1);if(i)assert.ok(v>D.points[i-1][1]);});
 near(E.volumeAt(1),9.5509);near(E.volumeAt(40),382.286);near(E.volumeAt(200),1991.449);near(E.volumeAt(248),2492.7778);near(E.volumeAt(252),2534.8712);
});
test('interpolation round trips including half-centimetres',()=>{
 for(let cm=1;cm<=252;cm+=.5)near(E.immersionAt(E.volumeAt(cm)),cm);
 near(E.volumeAt(251.5),(2524.3326+2534.8712)/2);
});
test('Archimedes: constant mass floats higher in denser water',()=>{
 const fresh=E.calculate(base),brack=E.calculate({...base,waterDensity:1010}),sea=E.calculate({...base,waterDensity:1025});
 near(fresh.mass,1882.286);near(sea.mass,fresh.mass);near(sea.volume*1.025,fresh.mass);
 assert.ok(sea.cm<brack.cm&&brack.cm<fresh.cm);near(fresh.deltaCm,0);assert.ok(sea.deltaCm<0);
});
test('loading increases immersion; water depth only changes keel clearance',()=>{
 const x=E.calculate(base),loaded=E.calculate({...base,cargoTonnes:1600}),shallow=E.calculate({...base,depth:1});
 assert.ok(loaded.cm>x.cm);near(shallow.cm,x.cm);assert.ok(shallow.ukc<0);near(x.ukc,3.5-x.cm/100);
});
test('same volume of denser cargo increases immersion',()=>{
 const diesel=E.calculate({...base,cargoTonnes:1000*.840}),petrol=E.calculate({...base,cargoTonnes:1000*.740});assert.ok(diesel.cm>petrol.cm);
});
test('no extrapolation and no nonfinite or invalid inputs',()=>{
 for(const cm of [0,253,NaN,Infinity])assert.throws(()=>E.volumeAt(cm));
 for(const cargoTonnes of [-1,NaN,Infinity,3000])assert.throws(()=>E.calculate({...base,cargoTonnes}));
 for(const waterDensity of [0,989,1031,NaN])assert.throws(()=>E.calculate({...base,waterDensity}));
 for(const depth of [0,-1,NaN])assert.throws(()=>E.calculate({...base,depth}));
});

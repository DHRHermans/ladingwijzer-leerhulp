const {test}=require('node:test'),assert=require('node:assert/strict'),E=require('../cargo-effects.js');
test('equal mass distribution has no imposed heel or trim',()=>{const r=E.describe([100,100,100,100,100,100]);assert.equal(r.total,600);assert.equal(r.heelVisual,0);assert.equal(r.pitchVisual,0);assert.equal(r.side,'gelijk');assert.equal(r.trim,'gelijk');});
test('port and starboard loading tilt to the respective side',()=>{const port=E.describe([180,180,180,20,20,20]),starboard=E.describe([20,20,20,180,180,180]);assert.equal(port.side,'bakboord');assert.equal(starboard.side,'stuurboord');assert.ok(port.heelVisual<0);assert.ok(starboard.heelVisual>0);assert.equal(port.pitchVisual,0);assert.equal(port.heelVisual,-starboard.heelVisual);});
test('forward mass lowers the bow; aft mass lowers the stern',()=>{const front=E.describe([200,100,0,200,100,0]),aft=E.describe([0,100,200,0,100,200]);assert.equal(front.trim,'voor');assert.equal(aft.trim,'achter');assert.ok(front.pitchVisual<0);assert.ok(aft.pitchVisual>0);assert.equal(front.heelVisual,0);assert.equal(front.total,aft.total);});
test('combined imbalance and empty/invalid loading',()=>{const r=E.describe([200,150,50,100,75,25]);assert.ok(r.heelVisual<0&&r.pitchVisual<0);assert.equal(E.describe([0,0,0,0,0,0]).heelVisual,0);for(const v of [[1],[-1,0,0,0,0,0],[NaN,0,0,0,0,0]])assert.throws(()=>E.describe(v));});

test('stern projection follows the same side-view rotation at equal total mass',()=>{
 const balanced=E.describe([100,100,100,100,100,100]),front=E.describe([200,100,0,200,100,0]),aft=E.describe([0,100,200,0,100,200]);
 assert.equal(balanced.sternOffsetVisual,0);assert.equal(balanced.pitchScaleVisual,1);
 assert.equal(front.heaveVisual,balanced.heaveVisual);assert.equal(aft.heaveVisual,balanced.heaveVisual);
 assert.ok(front.sternOffsetVisual<0);assert.ok(aft.sternOffsetVisual>0);
 assert.equal(front.sternOffsetVisual,-aft.sternOffsetVisual);
 assert.ok(Math.abs(front.sternOffsetVisual-315*Math.sin(front.pitchVisual*Math.PI/180))<1e-9);
 assert.ok(front.pitchScaleVisual>0&&front.pitchScaleVisual<1);
});

const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
(async()=>{
 const server=http.createServer((req,res)=>{const file=path.join(root,req.url.split('?')[0]==='/'?'index.html':req.url.split('?')[0]);try{const b=fs.readFileSync(file);res.setHeader('Content-Type',(file.endsWith('.js')||file.endsWith('.mjs'))?'application/javascript':file.endsWith('.css')?'text/css':file.endsWith('.png')?'image/png':'text/html');res.end(b)}catch{res.statusCode=404;res.end()}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':chromium.executablePath()),headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1365,height:950}});const errors=[];page.on('pageerror',e=>errors.push(e.message));

 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('http://127.0.0.1:'+server.address().port+'/#ladingstechniek');
 await page.locator('#effects-waves').uncheck();
 const projection=()=>page.evaluate(()=>{
  const side=document.getElementById('effects-side-heave').transform.baseVal.consolidate().matrix;
  const end=document.getElementById('effects-end-heave').transform.baseVal.consolidate().matrix;
  const pitch=Number(document.getElementById('effects-side-ship').getAttribute('transform').match(/rotate\(([-\d.]+)/)[1]);
  return {midY:side.f,endY:end.f,endScale:end.d,pitch};
 });
 await page.locator('[data-load-case="balanced"]').click();const balanced=await projection();assert.equal(balanced.endY,balanced.midY);
 await page.locator('[data-load-case="front"]').click();const front=await projection();assert.ok(front.pitch<0);assert.ok(front.endY<balanced.endY);assert.equal(front.midY,balanced.midY);assert.ok(front.endScale<1);
 assert.ok(Math.abs(front.endY-(front.midY+315*Math.sin(front.pitch*Math.PI/180)))<.001);assert.match(await page.locator('#effects-end-trim-label').textContent(),/hoger/);
 await page.locator('[data-load-case="aft"]').click();const aft=await projection();assert.ok(aft.pitch>0);assert.ok(aft.endY>balanced.endY);assert.equal(aft.midY,balanced.midY);assert.match(await page.locator('#effects-end-trim-label').textContent(),/lager/);
 await page.locator('[data-load-case="diagonal"]').click();const mixed=await projection();assert.ok(mixed.endY<mixed.midY);assert.match(await page.locator('#effects-end-ship').getAttribute('transform'),/rotate\(-/);
 await page.locator('[data-load-case="port"]').click();const port=await projection();assert.equal(port.endY,port.midY);
 await page.locator('[data-load-case="front"]').click();await page.locator('#ship-effects').screenshot({path:'/tmp/trim-gekoppeld.png'});
 await page.locator('#cargo-tab-puzzle').click();await page.locator('#puzzle-mode').selectOption('bulk');await page.locator('#puzzle-location-0').selectOption('0');const puzzle=await projection();assert.ok(puzzle.endY<puzzle.midY);assert.match(await page.locator('#effects-source').innerText(),/puzzel/);
 await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 assert.deepEqual(errors,[]);console.log('Browser: stern rises for forward loading, sinks for aft loading, matches side-view trim, combines with heel and follows puzzle loading; mobile passed.');
 await browser.close();server.close();
})().catch(e=>{console.error(e);process.exit(1)});

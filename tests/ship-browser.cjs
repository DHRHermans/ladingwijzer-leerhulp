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
 const compare=()=>page.evaluate(()=>{
  const worldY=(view,key)=>{
   const marker=document.getElementById('effects-'+view+'-stern-'+key),svg=document.getElementById('effects-'+view+'-svg');
   return new DOMPoint(+marker.getAttribute('cx'),+marker.getAttribute('cy')).matrixTransform(marker.getScreenCTM()).matrixTransform(svg.getScreenCTM().inverse()).y;
  };
  return Object.fromEntries(['deck-port','deck-center','deck-starboard','keel'].map(key=>[key,{side:worldY('side',key),end:worldY('end',key)}]));
 });
 const equalHeights=async()=>{const points=await compare();for(const [key,p] of Object.entries(points)){assert.ok(Math.abs(p.side-p.end)<.002,key+': '+JSON.stringify(p));assert.equal(p.side>220,p.end>220,key+' waterline mismatch');}return points;};
 for(const scenario of ['balanced','front','aft','port','diagonal','high']){
  await page.locator('[data-load-case="'+scenario+'"]').click();await equalHeights();
 }
 // At desktop width the views also have the same pixel scale and waterline.
 const aligned=await page.evaluate(()=>{
  const screenY=view=>{const e=document.getElementById('effects-'+view+'-stern-deck-center');return new DOMPoint(+e.getAttribute('cx'),+e.getAttribute('cy')).matrixTransform(e.getScreenCTM()).y;};
  return Math.abs(screenY('side')-screenY('end'));
 });assert.ok(aligned<.5,'Desktop view scales differ: '+aligned);
 // Also test an extreme asymmetric load, including submerged deck corners.
 await page.locator('#cargo-type').selectOption('solid');
 for(const [i,value] of [0,0,200,0,0,0].entries())await page.locator('#cargo-slot-'+i).fill(String(value));
 await equalHeights();await page.locator('#ship-effects').screenshot({path:'/tmp/gedeelde-scheepsvorm.png'});
 await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('#effects-waves').check();
 for(let i=0;i<4;i++){await page.waitForTimeout(90);await equalHeights();}
 await page.locator('#cargo-tab-puzzle').click();await page.locator('#puzzle-mode').selectOption('bulk');await page.locator('#puzzle-location-0').selectOption('0');await equalHeights();
 await page.setViewportSize({width:390,height:844});await equalHeights();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 assert.deepEqual(errors,[]);console.log('Rendered deck and keel heights match in both views for all scenarios, submerged corners, live rolling, puzzles and mobile.');
 await browser.close();server.close();
})().catch(e=>{console.error(e);process.exit(1)});

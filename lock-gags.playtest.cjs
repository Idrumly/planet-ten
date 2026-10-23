const fs=require('fs'),http=require('http'),path=require('path'),assert=require('assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const server=http.createServer((req,res)=>{try{const file=path.join(process.cwd(),decodeURIComponent(req.url.split('?')[0]));res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));}catch{res.statusCode=404;res.end();}}).listen(0);
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error'&&!e.text().includes('404'))errors.push(e.text());});
  const base=`http://localhost:${server.address().port}`;
  await page.goto(base+'/unlock-showcase.html');
  const gags=await page.evaluate(()=>LockGagModel.gags);
  fs.mkdirSync('../output/planet-ten/gags',{recursive:true});
  for(const [i,gag] of gags.entries()){
   await page.selectOption('#worm',String(i%3));await page.selectOption('#act',gag.id);await page.click('#play');
   await page.waitForTimeout(gag.duration*.52);
   assert.equal(await page.locator('.gag-running').count(),1,gag.id);
   assert.ok(await page.locator('.gag-actor:not([hidden])').count(),gag.id+' visible actors');
   await page.locator('#audition').screenshot({path:`../output/planet-ten/gags/${gag.id}.png`});
   assert.equal(await page.evaluate(()=>auditionRun.finished),true);
   assert.equal(await page.locator('[data-gag-state=complete] .gag-ending svg').count(),1);
   assert.equal(await page.locator('.gag-actor').count(),0);
   console.log(gag.id+': animated and completed');
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const gag of gags){await page.selectOption('#act',gag.id);await page.click('#play');assert.equal(await page.locator('[data-gag-state=complete]').count(),1);assert.equal(await page.locator('.gag-actor').count(),0);}
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto(base+'/rounding.html?room=bee');await page.click('#approach');await page.click('#inspect');
  // Start all three together to exercise independent timing and keep controls usable.
  await page.evaluate(()=>{window.testRuns=[...document.querySelectorAll('.door-lock-card')].map((card,i)=>LockGags.play(card,{id:['fuse','slipper','licorice'][i]}));});
  assert.equal(await page.locator('.gag-running').count(),3);assert.equal(await page.locator('.door-lock-card button[type=submit]:enabled').count(),3);
  await page.waitForTimeout(800);await page.screenshot({path:'../output/planet-ten/gags/simultaneous-door.png'});
  await page.evaluate(()=>document.querySelector('dialog[open]').close());await page.waitForTimeout(150);
  const time=await page.evaluate(()=>document.querySelector('.gag-actor').getAnimations()[0].currentTime);
  await page.waitForTimeout(350);assert.equal(await page.evaluate(()=>document.querySelector('.gag-actor').getAnimations()[0].currentTime),time);
  await page.evaluate(()=>document.querySelector('dialog').showModal());await page.waitForTimeout(150);
  assert.ok(await page.evaluate(()=>document.querySelector('.gag-actor').getAnimations()[0].currentTime)>time);
  await page.evaluate(()=>RoundRestart());assert.deepEqual(await page.evaluate(()=>Promise.all(testRuns.map(r=>r.finished))),[false,false,false]);assert.equal(await page.locator('.gag-stage').count(),0);
  await page.click('#approach');await page.click('#inspect');
  await page.evaluate(()=>{window.testRuns=[...document.querySelectorAll('.door-lock-card')].map(card=>LockGags.play(card));document.body.classList.add('still');});
  await page.waitForTimeout(100);assert.deepEqual(await page.evaluate(()=>Promise.all(testRuns.map(r=>r.finished))),[true,true,true]);assert.equal(await page.locator('.gag-running').count(),0);
  assert.deepEqual(errors,[]);console.log('All 20 reduced-motion endings, concurrent playback, hidden-dialog pause, reset cancellation, and motion toggle passed');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

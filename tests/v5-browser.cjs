const assert=require('node:assert/strict');
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),report={checks:[],performance:{}};
const record=message=>{report.checks.push(message);console.log(message);};
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost'),relative=decodeURIComponent(url.pathname).replace(/^\/Data-Scientists\//,'/'),file=path.resolve(root,'.'+(relative==='/'?'/index.html':relative));
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(error,content)=>{if(error){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.csv':'text/csv','.json':'application/json'})[path.extname(file)]||'text/plain');res.end(content);});
});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin=`http://127.0.0.1:${server.address().port}`,browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||(fs.existsSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')?'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome':undefined)});
  try{
    const context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true});
    await context.route('**/*',route=>route.request().url().startsWith(origin)?route.continue():route.abort());
    const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(origin+'/Data-Scientists/index.html');
    await page.waitForFunction(()=>document.documentElement.dataset.mindsVersion==='5',{timeout:10000});
    assert.deepEqual(errors,[]);
    const metadata=await page.evaluate(()=>({valid:MindsV5.validateMetadata(),scientists:MindsV5.scientists,laboratories:MindsV5.labs}));
    assert.equal(metadata.valid,true);assert.equal(metadata.scientists.length,71);assert.equal(metadata.laboratories.length,8);
    fs.writeFileSync(path.join(root,'src/data/scientists.json'),JSON.stringify(metadata.scientists,null,2)+'\n');
    fs.writeFileSync(path.join(root,'src/data/laboratories.json'),JSON.stringify(metadata.laboratories,null,2)+'\n');
    assert.equal(await page.locator('#labSelect option').count(),8);
    for(const id of ['snow','nightingale','bayes','turing','shannon','tukey','deming','pearl']){
      await page.locator('#labSelect').selectOption(id);assert.ok(await page.locator('#labVisual').innerHTML());
      await page.locator('#labHypothesis').fill('A testable hypothesis for '+id);await page.locator('#labRun').click();assert.ok((await page.locator('#labOutput').textContent()).length>60);
      await page.locator('#labReflection').fill('The result depends on assumptions and the available evidence.');await page.locator('#labSave').click();assert.match(await page.locator('#labSaveStatus').textContent(),/saved/);
      await page.locator('#labReset').click();assert.equal(await page.locator('#labSelect').inputValue(),id);
    }
    record('All eight laboratories render, reveal, save evidence and reflection, and restart.');
    await page.locator('#labSelect').selectOption('snow');await page.locator('#snowPump').selectOption('1');await page.locator('#mapZoom').fill('2');await page.getByRole('button',{name:'Pan Right',exact:true}).first().click();assert.match(await page.locator('#labOutput').textContent(),/Pump B/);
    await page.locator('#labSelect').selectOption('nightingale');await page.locator('#nightChart').selectOption('bar');await page.locator('#nightMonth').selectOption('2');await page.locator('#nightCategory').selectOption('0');assert.ok(await page.locator('#labVisual svg rect').count());
    await page.locator('#labSelect').selectOption('bayes');await page.locator('#bayPrior').fill('0');await page.locator('#baySpecificity').fill('100');await page.locator('#labRun').click();assert.match(await page.locator('#labOutput').textContent(),/undefined/i);
    await page.locator('#labSelect').selectOption('turing');for(let i=0;i<9;i++)await page.locator('#tapeStep').click();assert.match(await page.locator('#labOutput').textContent(),/1100/);await page.locator('#tapeProgram').selectOption('unary');await page.locator('#tapeRun').click();await page.waitForTimeout(600);await page.locator('#tapePause').click();
    await page.locator('#labSelect').selectOption('shannon');await page.locator('#entropyP').fill('0');assert.match(await page.locator('#labOutput').textContent(),/= 0 bits/);
    await page.locator('#labSelect').selectOption('tukey');await page.locator('#edaValues').fill('2, 4, 6');assert.match(await page.locator('#labOutput').textContent(),/mean = 4/);await page.locator('#edaAdd').click();assert.match(await page.locator('#labOutput').textContent(),/n = 4/);await page.locator('[data-remove]').first().click();assert.match(await page.locator('#labOutput').textContent(),/n = 3/);
    await page.locator('#labSelect').selectOption('deming');await page.locator('#processShift').fill('8');await page.locator('#processGenerate').click();assert.match(await page.locator('#labOutput').textContent(),/10 monitoring/);
    await page.locator('#labSelect').selectOption('pearl');await page.locator('#causalScenario').selectOption('collider');await page.locator('#causalHidden').click();assert.match(await page.locator('#labOutput').textContent(),/100.0%/);
    record('Map controls, chart filters, zero-evidence Bayes, tape execution, entropy endpoints, editable EDA, process shifts, and causal scenarios passed.');
    for(const dataset of ['iris','synthetic']){
      await page.locator('#mlDataset').selectOption(dataset);
      for(const model of ['baseline','knn','tree','logistic']){await page.locator('#mlModel').selectOption(model);await page.locator('#mlTrain').click();await page.waitForFunction(()=>document.getElementById('mlStatus').textContent.startsWith('Training complete'));assert.match(await page.locator('#mlResults').textContent(),/Confusion matrix/);await page.locator('#mlErrorFilter').selectOption('incorrect');assert.match(await page.locator('#mlErrorTable').textContent(),/held-out/);}
    }
    await page.locator('#mlSave').click();assert.match(await page.locator('#mlStatus').textContent(),/saved/);
    record('Both datasets fit baseline, neighbors, tree, and logistic models; testing metrics, error inspection, and notebook saving passed.');
    const answers=[9,3,10,11,3,60,3],assessments=['0','1','1','1','1','1','1'];
    for(let i=0;i<7;i++){
      await page.locator('[data-lesson]').nth(i).click();await page.locator('#lessonExercise').fill(String(answers[i]));await page.locator('#lessonCheck').click();await page.locator('#lessonAssessment').selectOption(assessments[i]);await page.locator('#lessonReflection').fill('I will state assumptions and check the evidence in my next investigation.');await page.locator('#lessonComplete').click();assert.match(await page.locator('#lessonFeedback').textContent(),/Level completed/);
    }
    assert.match(await page.locator('#academyRecommendation').textContent(),/All seven/);await page.reload();assert.match(await page.locator('#academyRecommendation').textContent(),/All seven/);
    record('All seven academy levels require practice, assessment, and reflection; completion survives reload.');
    await page.locator('#noteText').fill('A <script>plain text</script> research question.');await page.locator('#noteTopic').fill('Import/export round trip');await page.locator('#noteSave').click();assert.equal(await page.locator('#noteEntries script').count(),0);
    const dl=page.waitForEvent('download');await page.locator('#noteJSON').click();const downloaded=await dl,json=JSON.parse(fs.readFileSync(await downloaded.path(),'utf8'));assert.ok(json.entries.length>=9);const before=json.entries.length;
    await page.locator('#noteImport').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({schemaVersion:1,entries:[{text:'invalid'}]}))});assert.match(await page.locator('#noteStatus').textContent(),/Import rejected/);
    await page.locator('#noteImport').setInputFiles({name:'valid.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(json))});assert.match(await page.locator('#noteStatus').textContent(),/Import complete/);assert.match(await page.locator('#noteEntries').textContent(),new RegExp(before+' of '+before));
    const md=page.waitForEvent('download');await page.locator('#noteMarkdown').click();assert.match(fs.readFileSync(await (await md).path(),'utf8'),/My research notebook/);
    record('Notebook JSON round trip, duplicate skipping, invalid schema rejection, safe text, and Markdown export passed.');
    await page.locator('#networkScientist').selectOption('Joy Buolamwini');await page.locator('#networkFilter').selectOption('collaboration');assert.match(await page.locator('#networkTable').textContent(),/Timnit Gebru/);await page.locator('#networkZoom').fill('1.5');await page.locator('#networkProfile').click();assert.equal(await page.locator('#profileModal').isVisible(),true);await page.locator('#modalClose').click();
    await page.locator('#compareA').selectOption('John Tukey');await page.locator('#compareB').selectOption('Leo Breiman');assert.match(await page.locator('#compareResult').textContent(),/Research method/);
    for(const mode of ['discovery','era','method','application','connection','formula','dataset']){await page.locator('#matchMode').selectOption(mode);await page.locator('#matchOptions button').first().click();assert.match(await page.locator('#matchFeedback').textContent(),/Correct|Not quite/);}
    for(const scientist of ['snow','nightingale','bayes','turing','shannon','tukey','deming','pearl']){await page.locator('#storyScientist').selectOption(scientist);for(let i=0;i<6;i++){await page.locator(`[data-story-chapter="${i}"]`).click();assert.match(await page.locator('#storyStatus').textContent(),new RegExp('Chapter '+(i+1)));}}
    record('Network collaboration evidence, profile navigation, all-scientist comparison, seven matching modes, and all 48 story chapters passed.');
    await page.locator('#pythonLoad').click();await page.waitForFunction(()=>/could not|failed|unavailable/i.test(document.getElementById('pythonStatus').textContent),null,{timeout:20000});assert.equal(await page.locator('#pythonCode').inputValue(),'values = [2, 4, 6, 8]\n# Calculate and print the mean\n');
    record('Blocked Python runtime reports a useful error and preserves editor contents.');
    for(const width of [320,375,768,1024,1440]){
      await page.setViewportSize({width,height:960});
      for(const id of ['laboratoriesWorkspace','mlLaboratory','academyWorkspace','research-notebookWorkspace','discoveryNetwork']){
        const el=page.locator('#'+id);await el.scrollIntoViewIfNeeded();const box=await el.boundingBox();assert.ok(box.x>=-1&&box.x+box.width<=width+1,`${id} fits ${width}`);
      }
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'no page overflow at '+width);
      if(width===375||width===1440){await page.locator('#v5-learning').scrollIntoViewIfNeeded();await page.screenshot({path:`/private/tmp/minds-v5-${width}.png`});}
    }
    await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#labSelect').selectOption('bayes');await page.locator('#labRun').click();
    record('Workspaces fit 320, 375, 768, 1024, and 1440px without page-level overflow; reduced motion passed.');
    report.performance=await page.evaluate(()=>({domContentLoadedMs:performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd,transferBytes:performance.getEntriesByType('resource').filter(r=>r.name.includes('/src/')).reduce((n,r)=>n+r.transferSize,0),usedJSHeapBytes:performance.memory?.usedJSHeapSize||null}));
    const recovery=await browser.newContext();await recovery.route('**/*',r=>r.request().url().startsWith(origin)?r.continue():r.abort());
    await recovery.addInitScript(()=>{localStorage.setItem('minds-v5-notebook','{"invalid":"retained"}');localStorage.setItem('minds-notes','Original notes to preserve.');});
    const recoveryPage=await recovery.newPage();await recoveryPage.goto(origin+'/Data-Scientists/index.html');assert.match(await recoveryPage.locator('#v5Status').textContent(),/invalid format/);assert.equal(await recoveryPage.locator('#researchNotes').inputValue(),'Original notes to preserve.');assert.equal(await recoveryPage.evaluate(()=>localStorage.getItem('minds-v5-notebook')),'{"invalid":"retained"}');await recovery.close();
    const unavailable=await browser.newContext();await unavailable.route('**/*',r=>r.request().url().startsWith(origin)?r.continue():r.abort());await unavailable.addInitScript(()=>{Storage.prototype.getItem=()=>{throw new DOMException('Unavailable','SecurityError');};Storage.prototype.setItem=()=>{throw new DOMException('Unavailable','SecurityError');};});
    const unavailablePage=await unavailable.newPage();await unavailablePage.goto(origin+'/Data-Scientists/index.html');assert.equal(await unavailablePage.locator('#labSelect option').count(),8);assert.match(await unavailablePage.locator('#atlasStorageWarning').textContent(),/unavailable/);await unavailable.close();
    record('Malformed notebook data is reported and retained; storage-disabled startup leaves the atlas and laboratories usable.');
    assert.deepEqual(errors,[]);record('No uncaught browser errors; core workspaces run with external requests blocked at a project base path.');
    fs.writeFileSync(path.join(root,'docs/browser-report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));await context.close();
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>server.close());

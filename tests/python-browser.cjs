const assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost'),name=decodeURIComponent(url.pathname).replace(/^\/Data-Scientists\//,'/'),file=path.resolve(root,'.'+name);if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(error,data)=>{if(error){res.writeHead(404).end();return;}res.setHeader('Content-Type',file.endsWith('.mjs')||file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(data);});});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin=`http://127.0.0.1:${server.address().port}`,browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||(fs.existsSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')?'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome':undefined)});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>r.request().url().startsWith(origin)||r.request().url().startsWith('https://cdn.jsdelivr.net/pyodide/v314.0.7/')?r.continue():r.abort());
  await page.goto(origin+'/Data-Scientists/index.html');await page.locator('#pythonLoad').click();
  await page.waitForFunction(()=>/Python is ready|could not|failed|timed out/.test(document.getElementById('pythonStatus').textContent),null,{timeout:100000});
  assert.match(await page.locator('#pythonStatus').textContent(),/Python is ready/);console.log('Pinned Pyodide runtime loaded in a module worker.');
  for(let i=0;i<8;i++){
   await page.locator('#pythonExercise').selectOption(String(i));await page.locator('#pythonSolution').click();await page.locator('#pythonRun').click();await page.waitForFunction(()=>document.getElementById('pythonStatus').textContent.startsWith('Execution complete')||document.getElementById('pythonStatus').textContent.startsWith('Python reported'),null,{timeout:15000});
   assert.match(await page.locator('#pythonStatus').textContent(),/Execution complete/);await page.locator('#pythonCheck').click();assert.match(await page.locator('#pythonStatus').textContent(),/Output matches/);console.log('Exercise '+(i+1)+' executed and matched expected output.');
  }
  await page.locator('#pythonCode').fill('print(1 / 0)');await page.locator('#pythonRun').click();await page.waitForFunction(()=>document.getElementById('pythonStatus').textContent.startsWith('Python reported'));assert.match(await page.locator('#pythonOutput').textContent(),/ZeroDivisionError/);
  await page.locator('#pythonCode').fill('while True:\n    pass');await page.locator('#pythonRun').click();await page.locator('#pythonStop').click();assert.match(await page.locator('#pythonStatus').textContent(),/stopped/);assert.equal(await page.locator('#pythonRun').isDisabled(),true);assert.match(await page.locator('#pythonCode').inputValue(),/while True/);
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(root,'docs/python-report.json'),JSON.stringify({version:'314.0.7',exercisesExecuted:8,expectedOutputsPassed:8,runtimeErrorReported:true,infiniteLoopStopped:true,editorRetained:true,uncaughtPageErrors:errors},null,2)+'\n');console.log('Python error handling and stop control passed.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>server.close());

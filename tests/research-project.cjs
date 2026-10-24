const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const label = 'From Discovery to Your First Research Project';
const checks = [];
const server = http.createServer((req, res) => {
  const requested = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
    .replace(/^\/Data-Scientists\//, '/');
  const file = path.resolve(root, '.' + (requested === '/' ? '/index.html' : requested));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (error, content) => {
    if (error) { res.writeHead(404).end(); return; }
    const types = {'.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript'};
    res.setHeader('Content-Type', types[path.extname(file)] || 'text/plain');
    res.end(content);
  });
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROME_PATH ? {executablePath: process.env.CHROME_PATH}
      : fs.existsSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
        ? {executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'} : {})
  });
  try {
    const context = await browser.newContext({viewport: {width: 1440, height: 1000}, acceptDownloads: true});
    await context.route('**/*', route => route.request().url().startsWith(origin)
      ? route.continue() : route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(origin + '/Data-Scientists/index.html');
    const profile = page.locator('#profileModal');
    const openProfile = async name => {
      await page.locator('#search').fill(name);
      await page.locator('#peopleList [data-person]').filter({has: page.getByRole('heading', {name, exact: true})}).click();
      assert.equal(await profile.isVisible(), true);
    };
    const openProject = async () => {
      await profile.getByRole('button', {name: label, exact: true}).click();
      assert.equal(await profile.locator('#researchProject').isVisible(), true);
    };
    const names = await page.locator('#peopleList [data-person]').evaluateAll(cards => cards.map(card => card.dataset.person));
    assert.ok(names.length >= 70, 'the full scientist gallery is present');
    for (const name of names) {
      await openProfile(name);
      assert.equal(await profile.getByRole('button', {name: label, exact: true}).count(), 1);
      assert.equal(await profile.locator('#researchProject').isVisible(), false);
      await openProject();
      assert.equal(await profile.locator('.research-cycle li').count(), 6);
      assert.ok((await page.locator('#projectQuestion').inputValue()).trim());
      assert.ok((await page.locator('#projectPlan').inputValue()).trim());
      assert.equal(await page.locator('#researchProjectTitle').evaluate(el => el === document.activeElement), true);
      await page.locator('#modalClose').click();
    }
    checks.push(`Button, expansion, six stages, starter content, and focus verified for all ${names.length} scientists.`);

    await openProfile('John Snow');
    for (let i = 0; i < 20 && !(await page.locator('#startResearchProject').evaluate(el => el === document.activeElement)); i++) await page.keyboard.press('Tab');
    assert.equal(await page.locator('#startResearchProject').evaluate(el => el === document.activeElement), true);
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#researchProject').isVisible(), true);
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('#projectQuestion').evaluate(el => el === document.activeElement), true);
    const question = 'Which water source should we investigate? <img src=x onerror=alert(1)>';
    await page.locator('#projectQuestion').fill(question);
    await page.locator('#projectReflection').fill('Check exposure histories before making causal claims.');
    await page.locator('#startResearchProject').click();
    assert.equal(await page.locator('#researchProject').isVisible(), false);
    await openProject();
    assert.equal(await page.locator('#projectQuestion').inputValue(), question);
    await page.keyboard.press('Escape');
    assert.equal(await profile.isVisible(), false);
    await openProfile('Thomas Bayes');
    await openProject();
    assert.notEqual(await page.locator('#projectQuestion').inputValue(), question);
    await page.locator('#modalClose').click();
    await page.reload();
    await openProfile('John Snow');
    await openProject();
    assert.equal(await page.locator('#projectQuestion').inputValue(), question);
    assert.equal(await page.locator('#researchProject img').count(), 0);
    checks.push('Keyboard activation, collapse, Escape, safe text, draft isolation, and reload persistence passed.');

    await page.evaluate(() => {
      const notebook = document.getElementById('researchNotes');
      notebook.value = 'My existing notebook entry.';
      notebook.dispatchEvent(new Event('input', {bubbles: true}));
    });
    const save = page.getByRole('button', {name: 'Save project to notebook', exact: true});
    await save.click();
    const notes = await page.locator('#researchNotes').inputValue();
    assert.ok(notes.startsWith('My existing notebook entry.'));
    assert.ok(notes.includes(question));
    assert.ok(notes.includes('John Snow'));
    await save.click();
    assert.equal(await page.locator('#researchNotes').inputValue(), notes, 'duplicate saves do not append');
    await page.locator('#projectReflection').fill('A revised finding.');
    await save.click();
    assert.ok((await page.locator('#researchNotes').inputValue()).includes('A revised finding.'));
    await page.getByRole('button', {name: 'Open my research notebook', exact: true}).click();
    assert.equal(await profile.isVisible(), false);
    assert.equal(await page.locator('#researchNotes').evaluate(el => el === document.activeElement), true);
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#exportNotes').click();
    const downloaded = await downloadPromise;
    const exported = JSON.parse(fs.readFileSync(await downloaded.path(), 'utf8'));
    assert.ok(exported.notes.includes(question));
    assert.ok(exported.notes.includes('My existing notebook entry.'));
    checks.push('Notebook save preserves notes, avoids duplicates, records revisions, exports JSON, and receives focus.');

    await openProfile('John Snow');
    await openProject();
    await page.locator('#projectQuestion').fill('   ');
    await save.click();
    assert.match(await page.locator('#researchProjectStatus').textContent(), /Write a research question/);
    await page.locator('#projectQuestion').fill('Storage failure exercise');
    const beforeFailure = await page.locator('#researchNotes').inputValue();
    await page.evaluate(() => {
      window.originalStorageSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = () => { throw new DOMException('Test storage failure', 'QuotaExceededError'); };
    });
    await page.locator('#projectPlan').fill('A plan that cannot be saved.');
    assert.match(await page.locator('#researchProjectStatus').textContent(), /could not save your draft/);
    await save.click();
    assert.match(await page.locator('#researchProjectStatus').textContent(), /notebook could not be saved/);
    assert.equal(await page.locator('#researchNotes').inputValue(), beforeFailure);
    await page.evaluate(() => { Storage.prototype.setItem = window.originalStorageSetItem; });
    await page.locator('#modalClose').click();
    checks.push('Blank questions and storage failures show useful feedback without losing notebook content.');

    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({width, height: 960});
      await openProfile('Florence Nightingale');
      await openProject();
      assert.equal(await page.locator('#startResearchProject').getAttribute('aria-expanded'), 'true');
      const overflow = await page.locator('#researchProject').evaluate(el => el.scrollWidth > el.clientWidth + 1);
      assert.equal(overflow, false, `worksheet fits at ${width}px`);
      const buttonBounds = await page.locator('#startResearchProject').boundingBox();
      assert.ok(buttonBounds.x >= 0 && buttonBounds.x + buttonBounds.width <= width + 1);
      assert.ok(buttonBounds.height >= 44);
      if (width === 375) await page.screenshot({path: '/private/tmp/data-scientists-research-mobile.png', fullPage: false});
      if (width === 1440) await page.screenshot({path: '/private/tmp/data-scientists-research-desktop.png', fullPage: false});
      await page.locator('#modalClose').click();
    }
    await page.emulateMedia({reducedMotion: 'reduce'});
    await openProfile('Alan Turing');
    await openProject();
    assert.equal(await page.locator('#researchProject').isVisible(), true);
    await page.locator('#modalClose').click();
    checks.push('Worksheet layouts passed at 320, 375, 768, 1024, and 1440px and with reduced motion.');

    await page.locator('#clearFilters').click();
    assert.equal(await page.locator('#peopleList [data-person]').count(), names.length);
    await page.locator('#eraFilter').selectOption('1');
    assert.ok(await page.locator('#peopleList [data-person]').count() < names.length);
    await page.locator('#clearFilters').click();
    await openProfile('Claude Shannon');
    await page.locator('#bookmarkPerson').click();
    assert.equal(await page.locator('#bookmarkPerson').getAttribute('aria-pressed'), 'true');
    await page.locator('#prob').fill('70');
    assert.match(await page.locator('#studioOutput').textContent(), /0\.881/);
    await page.locator('#modalClose').click();
    await page.locator('#savedPeople [data-saved="Claude Shannon"]').click();
    await openProject();
    await page.locator('#modalClose').click();
    await page.locator('#missionCards [data-mission="snow"]').click();
    await page.locator('#missionPlay [data-answer="1"]').click();
    assert.match(await page.locator('#progressText').textContent(), /1 of/);
    await page.locator('#compareResult [data-open-person]').first().click();
    await openProject();
    await page.locator('#modalClose').click();
    await page.locator('#testFraction').fill('30');
    assert.match(await page.locator('#splitReadout').textContent(), /Training examples: 70/);
    await page.locator('#matchOptions button').first().click();
    assert.match(await page.locator('#matchScore').textContent(), /Score:/);
    checks.push('Gallery search and filters, bookmarks, discovery controls, missions, comparison, ML slider, and matching still work.');
    assert.deepEqual(errors, [], 'no uncaught browser errors');
    checks.push('GitHub Pages base path and offline worksheet use passed with no uncaught browser errors.');
    console.log(checks.join('\n'));
    await context.close();
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server.close());

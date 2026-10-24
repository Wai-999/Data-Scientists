(function () {
  'use strict';
  const V = MindsV5, M = V.math;
  V.mountLabs = function (host) {
    let current, state, timer = null, lastResult = '';
    const stop = () => { clearInterval(timer); timer = null; };
    const observer = new IntersectionObserver(entries => { if (!entries[0].isIntersecting) stop(); }); observer.observe(host);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
    function select(id, focus = false) {
      stop(); current = V.labs.find(l => l.id === id) || V.labs[0];
      state = {reveal:false, pump:0, inspected:new Set(), zoom:1, panX:0, panY:0, step:0, head:0, tape:['1','0','1','1','_'], machine:'seek', last:'', observations:[], baseline:[], seed:42, confound:true};
      host.innerHTML = `<div class="v5controls">${V.select('labSelect','Choose a laboratory',V.labs.map(l => [l.id,l.name + ' · ' + l.title]))}</div><div class="v5sectionhead"><div><span class="v5badge">${V.esc(current.classification)}</span><h3 id="labTitle" tabindex="-1">${V.esc(current.name)} · ${V.esc(current.title)}</h3></div>${V.button('Restart','labReset')}</div><p>${V.esc(current.context)}</p><p><strong>Scientific problem:</strong> ${V.esc(current.problem)}</p><details><summary>Objectives, prerequisites, and available evidence</summary><p>Objectives: ${V.esc(current.objectives.join('; '))}. Prerequisites: ${V.esc(current.prerequisites.join('; '))}.</p><p>${V.esc(current.evidence)}</p><p>Completion: ${V.esc(current.assessment)}</p></details><div class="v5two"><div><label class="v5field" for="labHypothesis">My hypothesis or estimate<textarea id="labHypothesis" rows="3" maxlength="4000" placeholder="Predict what you expect before revealing the explanation."></textarea></label><div class="v5controls" id="labControls"></div><div class="v5actions">${V.button('Analyze and reveal explanation','labRun')}${V.button('Save investigation to notebook','labSave')}</div></div><div><h4>Read the visualization</h4><p id="labGuide"></p><p><strong>Why it matters:</strong> ${V.esc(current.application)}</p><p><a href="${V.esc(current.source)}" target="_blank" rel="noopener noreferrer">Historical or methodological reference ↗</a></p></div></div><div id="labVisual" class="v5plot"></div><div id="labOutput" class="v5feedback" role="status"></div><label class="v5field v5reflection" for="labReflection">Reflection: ${V.esc(current.reflection)}<textarea id="labReflection" rows="3" maxlength="6000"></textarea></label><p id="labSaveStatus" class="v5note" role="status"></p>`;
      V.$('labSelect').value = current.id;
      const draft = V.read('minds-v5-lab:' + current.id, {}, x => typeof x === 'object' && !Array.isArray(x));
      V.$('labHypothesis').value = typeof draft.hypothesis === 'string' ? draft.hypothesis : '';
      V.$('labReflection').value = typeof draft.reflection === 'string' ? draft.reflection : '';
      const controls = V.$('labControls');
      const content = {
        snow: V.select('snowPump','Inspect a water pump',[[0,'Pump A'],[1,'Pump B'],[2,'Pump C']]) + V.range('mapZoom','Map zoom',1,3,1,.25) + ['Left','Right','Up','Down'].map(d => V.button('Pan ' + d,'','data-pan="' + d + '"')).join(''),
        nightingale: V.select('nightMonth','Month',[['all','All six months'],...['Jan','Feb','Mar','Apr','May','Jun'].map((m,i)=>[i,m])]) + V.select('nightChart','Chart type',[['polar','Polar area'],['bar','Bar chart']]) + V.select('nightCategory','Cause',[['all','All causes'],['0','Disease'],['1','Wounds'],['2','Other']]),
        bayes: V.range('bayPrior','Prior prevalence (%)',0,100,1) + V.range('baySensitivity','Sensitivity (%)',0,100,90) + V.range('baySpecificity','Specificity (%)',0,100,90) + '<label class="v5field" for="bayPopulation">Population<input id="bayPopulation" type="number" min="1" max="1000000" step="1" value="1000"></label>',
        turing: V.select('tapeProgram','Program',[['increment','Binary increment'],['unary','Unary append'],['replace','Replace 0 with 1']]) + V.button('Step','tapeStep') + V.button('Run','tapeRun') + V.button('Pause','tapePause'),
        shannon: V.range('entropyP','Probability of 1 (%)',0,100,50) + V.range('channelNoise','Bit-flip probability (%)',0,50,10),
        tukey: V.select('edaDataset','Dataset',[['outlier','One extreme value'],['balanced','Balanced values'],['constant','Constant values']]) + '<label class="v5field" for="edaValues">Observations (comma separated)<textarea id="edaValues" rows="3">3, 4, 4, 5, 100</textarea></label>' + V.button('Add observation','edaAdd'),
        deming: V.range('processVariation','Monitoring standard deviation',.2,4,1,.2) + V.range('processShift','Monitoring mean shift',0,8,0,.5) + V.button('Generate 10 observations','processGenerate'),
        pearl: V.select('causalScenario','Causal structure',[['confounder','Confounder'],['mediator','Mediator'],['collider','Collider']]) + V.button('Reveal hidden variable','causalHidden','aria-pressed="false"') + V.select('causalIntervention','Set intervention X',[['0','do(X = 0)'],['1','do(X = 1)']])
      };
      controls.innerHTML = content[current.id];
      if (current.id === 'deming') { const random = M.rng(42); state.baseline = Array.from({length:20},()=>50+M.normal(random)); state.observations = state.baseline.slice(); }
      render(); if (focus) V.$('labTitle').focus();
    }
    function number(id) { const el = V.$(id), n = Number(el.value), out = V.$(id + 'Value'); if (out) out.textContent = el.value; return n; }
    function stepTape() {
      if (state.machine === 'halt') { stop(); return; }
      const program = V.$('tapeProgram').value, symbol = state.tape[state.head] ?? '_';
      if (program === 'increment') {
        if (state.machine === 'seek') {
          if (symbol === '_') { state.machine = 'carry'; state.head--; state.last = '(seek, _) → (_, left, carry)'; }
          else { state.head++; state.last = `(seek, ${symbol}) → (${symbol}, right, seek)`; }
        } else if (symbol === '1') { state.tape[state.head] = '0'; state.head--; state.last = '(carry, 1) → (0, left, carry)'; }
        else { state.tape[state.head] = '1'; state.machine = 'halt'; state.last = `(carry, ${symbol}) → (1, stay, halt)`; }
      } else if (symbol === '_') { state.tape[state.head] = program === 'unary' ? '1' : '_'; state.machine = 'halt'; state.last = `(seek, _) → (${state.tape[state.head]}, stay, halt)`; }
      else { state.tape[state.head] = program === 'replace' ? '1' : symbol; state.head++; state.last = `(seek, ${symbol}) → (${state.tape[state.head - 1]}, right, seek)`; }
      if (state.head < 0) { state.tape.unshift('_'); state.head = 0; }
      if (state.head >= state.tape.length) state.tape.push('_');
      state.step++; if (state.machine === 'halt' || state.step >= 100) stop(); render();
    }
    function render() {
      const visual = V.$('labVisual'), output = V.$('labOutput'), guide = V.$('labGuide');
      let html = '', result = '', instruction = '';
      try {
        if (current.id === 'snow') {
          const pumps = [[270,130],[110,70],[460,250]], random = M.rng(9), households = Array.from({length:30},(_,i)=>[270+M.normal(random)*(i<22?40:140),130+M.normal(random)*(i<22?30:80),i<22?2:1]);
          const pump = number('snowPump'), nearby = pumps.map(p=>households.filter(h=>Math.hypot(h[0]-p[0],h[1]-p[1])<100).reduce((s,h)=>s+h[2],0));
          state.zoom = number('mapZoom'); state.pump = pump; state.inspected.add(pump);
          html = V.svg(`<g transform="translate(${state.panX} ${state.panY}) translate(320 150) scale(${state.zoom}) translate(-320 -150)"><path d="M20 150 H610 M180 20 V290 M350 20 V290 M20 55 L600 285" stroke="#45647d" stroke-width="18" fill="none"/><text x="20" y="143">Broad Street (approximate)</text><text x="365" y="28">Soho schematic</text>${households.map((h,i)=>`<circle cx="${h[0]}" cy="${h[1]}" r="${h[2]*3}" fill="#f4c76b"><title>Synthetic household ${i+1}: ${h[2]} deaths</title></circle>`).join('')}${pumps.map((p,i)=>`<g data-pump="${i}" tabindex="0" role="button" aria-label="Inspect Pump ${'ABC'[i]}"><circle cx="${p[0]}" cy="${p[1]}" r="${pump===i?15:10}" fill="#38bdf8" stroke="white" stroke-width="2"/><text x="${p[0]+15}" y="${p[1]-12}">Pump ${'ABC'[i]}</text></g>`).join('')}</g>`, 'Educational Soho street schematic with synthetic household deaths and selectable pumps',320) + V.table(['Pump','Synthetic deaths within 100 drawing units'],nearby.map((n,i)=>['Pump '+'ABC'[i],n]),'Nearby counts use a fixed circular drawing distance; populations are not provided.');
          instruction = 'Select pumps on the map or in the menu, zoom, and pan using the buttons. Gold marks show synthetic household counts. Look for clusters and missing exposure evidence.';
          result = state.reveal ? 'Pump A has the strongest nearby cluster in this constructed exercise. The historical Broad Street investigation relied on water exposures and additional comparisons, not proximity alone. The epidemic was already declining before the handle was removed. Inspect interviews, supplier exposure, denominators, and alternatives before making a causal claim.' : `Pump ${'ABC'[pump]} selected. ${state.inspected.size} of 3 pumps inspected. Write a hypothesis before revealing the historical explanation.`;
        } else if (current.id === 'nightingale') {
          const rows = [[90,20,10],[120,25,15],[150,30,12],[65,22,10],[35,18,9],[20,15,8]], months = ['Jan','Feb','Mar','Apr','May','Jun'], chosen = V.$('nightMonth').value, category = V.$('nightCategory').value,
            selected = rows.map((values,i)=>({values:values.map((v,j)=>category==='all'||+category===j?v:0),i})).filter(r=>chosen==='all'||r.i===+chosen), totals = selected.map(r=>r.values.reduce((s,x)=>s+x,0));
          const max = Math.max(...rows.map(r=>r.reduce((s,x)=>s+x,0))), colors=['#38bdf8','#f4c76b','#c0abd9'];
          if (V.$('nightChart').value === 'bar') html = V.bars(totals,selected.map(r=>months[r.i]),max);
          else {
            const point=(r,a)=>[320+r*Math.cos(a),175+r*Math.sin(a)];
            html = V.svg(selected.map(row=>{let total=0; const a=row.i*Math.PI/3-Math.PI/2,b=a+Math.PI/3-.02; return row.values.map((v,j)=>{const inner=145*Math.sqrt(total/max);total+=v;const outer=145*Math.sqrt(total/max),p=point(outer,a),q=point(outer,b),u=point(inner,b),w=point(inner,a);return v ? `<path d="M${p} A${outer} ${outer} 0 0 1 ${q} L${u} ${inner ? `A${inner} ${inner} 0 0 0 ${w}` : ''} Z" fill="${colors[j]}"><title>${months[row.i]} · ${['Disease','Wounds','Other'][j]}: ${v}</title></path>` : '';}).join('')+`<text x="${point(163,a+.5)[0]}" y="${point(163,a+.5)[1]}">${months[row.i]}</text>`;}).join(''), 'Polar sector areas proportional to synthetic mortality counts',350);
          }
          html += V.table(['Month','Disease','Wounds','Other'],rows.map((r,i)=>[months[i],...r]),'Synthetic counts, not historical records. Blue = disease; gold = wounds; lilac = other.');
          instruction = 'Switch months, causes, and chart types. Each equal-angle polar sector uses radius proportional to the square root of cumulative counts, so ring areas encode counts.';
          result = 'Area ∝ r²; therefore r = 145 × √(cumulative count / 192). ' + (state.reveal ? 'Disease dominates the first three synthetic months. A decline in counts does not identify its cause; compare populations, time at risk, record quality, and other reforms.' : 'Describe the strongest pattern before revealing the explanation.');
        } else if (current.id === 'bayes') {
          const prior=number('bayPrior')/100, sensitivity=number('baySensitivity')/100, specificity=number('baySpecificity')/100, population=number('bayPopulation'), b=M.bayes(prior,sensitivity,specificity,population);
          html = `<p>Probability tree: condition (${V.percent(prior)}) → positive (${V.percent(sensitivity)}) or negative (${V.percent(1-sensitivity)}); no condition (${V.percent(1-prior)}) → positive (${V.percent(1-specificity)}) or negative (${V.percent(specificity)}).</p>` + V.table(['Expected count','Positive','Negative'],[['Condition',V.format(b.tp),V.format(b.fn)],['No condition',V.format(b.fp),V.format(b.tn)]],'Expected frequencies may be fractional; they are not observed people.') + V.svg(Array.from({length:100},(_,i)=>{const positiveShare=(b.tp+b.fp)/population, color=i/100<prior?'#79e2c4':i/100<prior+(1-prior)*(1-specificity)?'#f4c76b':'#284153';return `<rect x="${30+i%20*28}" y="${20+Math.floor(i/20)*28}" width="22" height="22" fill="${color}"/>`;}).join(''),'100-cell population grid: green condition share, gold expected false-positive share, rounded visually',170) + '<p class="v5note">The grid rounds shares to 100 cells; use exact expected counts in the table.</p>';
          if(state.reveal) html += V.bars([prior*100,(b.posterior??0)*100],['Prior %',b.posterior===null?'Undefined':'Posterior %'],100);
          instruction = 'Change prevalence, test properties, or population size. The table and tree show intermediate quantities. Estimate the positive predictive value before revealing it.';
          result = state.reveal ? `P(E) = ${V.format(b.evidence)}. P(H|E) = sensitivity × prior / P(E) = ${V.percent(b.posterior)}. Expected true positives ${V.format(b.tp)}; false positives ${V.format(b.fp)}. ${b.posterior===null?'Evidence has zero probability; conditional probability is undefined.':'Assumes the stated rates apply to this population and the outcome is a positive test.'}` : 'Write your estimate, then analyze to compare prior and posterior.';
        } else if (current.id === 'turing') {
          const program=V.$('tapeProgram').value, table=program==='increment'?[['seek','0 / 1','same','right','seek'],['seek','_','_','left','carry'],['carry','1','0','left','carry'],['carry','0 / _','1','stay','halt']]:[['seek','0 / 1',program==='replace'?'1':'same','right','seek'],['seek','_',program==='unary'?'1':'_','stay','halt']];
          html=V.svg(state.tape.map((symbol,i)=>`<rect x="${40+i*65}" y="60" width="60" height="60" fill="${state.head===i?'#2b7378':'#19364c'}" stroke="#9fc8db"/><text x="${65+i*65}" y="96" style="font-size:24px">${symbol}</text>${state.head===i?`<text x="${50+i*65}" y="45">Head ↓</text>`:''}`).join('')+`<text x="40" y="160">State: ${state.machine}; steps: ${state.step}</text>`,'Tape, read/write head, and current state',190)+V.table(['State','Read','Write','Move','Next state'],table,'Explicit transition table; _ denotes blank. The highlighted row was just applied.',state.last?(program==='increment'?(state.last.startsWith('(seek')?(state.last.startsWith('(seek, _)')?1:0):(state.last.startsWith('(carry, 1)')?2:3)):(state.last.startsWith('(seek, _)')?1:0)):-1)+`<p>Applied transition: ${V.esc(state.last||'None yet.')}</p>`;
          instruction='Select a program, step through transitions, or run/pause. The highlighted cell is the head; the table defines every change.';
          result=`Current tape: ${state.tape.filter(s=>s!=='_').join('')}. ${state.machine==='halt'?'Machine halted. Binary increment maps 1011 (11) to 1100 (12); unary appends one mark; replacement writes 1 over every 0.':'Predict the final tape and step to test your prediction.'}`;
        } else if (current.id === 'shannon') {
          const p=number('entropyP')/100, noise=number('channelNoise')/100, random=M.rng(15), bits=Array.from({length:24},()=>random()<p?1:0), received=bits.map(b=>random()<noise?1-b:b), errors=bits.filter((b,i)=>b!==received[i]).length;
          html=V.bars([(1-p)*100,p*100],['P(0) %','P(1) %'],100)+`<p>Sent (fixed one-bit symbols): <code>${bits.join('')}</code></p><p>Received: <code>${received.join('')}</code></p>`+V.line(Array.from({length:21},(_,i)=>M.entropy([i/20,1-i/20])),null,'Binary entropy curve, p from 0 to 1')+'<p class="v5note">Entropy curve: horizontal axis is p = 0, 0.05, …, 1; vertical axis is bits per symbol. Fixed binary symbols demonstrate a channel, not an entropy-optimal compressor.</p>';
          instruction='Change the source distribution and bit-flip probability. Compare predictability, entropy, and realized channel errors; source entropy and channel noise are different quantities.';
          result=`H(X) = −Σp log₂p = ${V.format(M.entropy([1-p,p]))} bits/symbol. Terms with p = 0 contribute 0. ${errors} of 24 bits flipped in this seeded sample. ${state.reveal?'Entropy is maximal at p = 0.5 and zero for a deterministic source. Random errors fluctuate; a small sample need not match the selected noise rate.':''}`;
        } else if (current.id === 'tukey') {
          const raw=V.$('edaValues').value.trim(), values=raw?raw.split(/[,\s]+/).map(Number):[];
          if(values.length>100)throw new Error('Use at most 100 observations.');const s=M.summary(values);
          if(!values.length){html='<p>Add an observation to begin.</p>';result='No observations: summaries are undefined.';}
          else {
            const span=s.max-s.min||1, bins=Array(5).fill(0);values.forEach(v=>bins[Math.min(4,Math.floor((v-s.min)/span*5))]++);
            const x=v=>50+(v-s.min)/span*530;
            html='<h4>Histogram</h4>'+V.bars(bins,bins.map((_,i)=>V.format(s.min+i*span/5)))+'<p class="v5note">Five equal-width bins; lower bounds shown. Last bin includes its upper bound.</p><h4>Box plot</h4>'+V.svg(`<path d="M${x(s.min)} 65 H${x(s.max)}" stroke="#91c9db"/><rect x="${x(s.q1)}" y="40" width="${Math.max(1,x(s.q3)-x(s.q1))}" height="50" fill="#246b78"/><path d="M${x(s.median)} 38 V92" stroke="#f4c76b" stroke-width="3"/>${s.outliers.map(v=>`<circle cx="${x(v)}" cy="112" r="5" fill="#ffae91"/>`).join('')}<text x="40" y="145">Min ${V.format(s.min)} · Q1 ${V.format(s.q1)} · Median ${V.format(s.median)} · Q3 ${V.format(s.q3)} · Max ${V.format(s.max)}</text>`,'Quartile box with full observed range and separately marked IQR outliers',170)+'<h4>Index-value scatter plot</h4>'+V.svg(values.map((v,i)=>`<circle cx="${50+i/Math.max(1,values.length-1)*540}" cy="${190-(v-s.min)/span*150}" r="5" fill="${s.outliers.includes(v)?'#ffae91':'#38bdf8'}"><title>Index ${i+1}, value ${v}</title></circle>`).join('')+'<text x="170" y="230">Observation index →; vertical axis is value</text>','Scatter of observation index against value')+`<div class="v5tablewrap"><table><caption>Edit or remove observations</caption><thead><tr><th scope="col">Index</th><th scope="col">Value</th><th scope="col">Action</th></tr></thead><tbody>${values.map((v,i)=>`<tr><td>${i+1}</td><td><input class="v5editvalue" type="number" step="any" value="${v}" data-eda="${i}" aria-label="Observation ${i+1}"></td><td>${V.button('Remove','','data-remove="'+i+'"')}</td></tr>`).join('')}</tbody></table></div>`;
            result=`n = ${s.n}; mean = ${V.format(s.mean)}; median = ${V.format(s.median)}; sample SD = ${V.format(s.sd)}; Q1 = ${V.format(s.q1)}; Q3 = ${V.format(s.q3)}; IQR = ${V.format(s.iqr)}. IQR-flagged values: ${s.outliers.join(', ')||'none'}. Quartiles use linear interpolation at (n−1)p (type 7); SD uses n−1 and is undefined for n < 2. ${state.reveal?'An extreme observation can move the mean far from the median. A flagged value requires investigation; it is not automatically wrong.':''}`;
          }
          instruction='Select a dataset, edit values directly or in the comma-separated field, add and remove observations. Compare the summaries and plots. The box shows quartiles; its line spans the full observed range, with IQR-flagged values marked below.';
        } else if (current.id === 'deming') {
          const limits=M.controlLimits(state.baseline), signals=state.observations.slice(20).filter(v=>v<limits.lower||v>limits.upper).length;
          html=V.line(state.observations,limits,'Synthetic process sequence with fixed baseline-derived individuals-chart limits')+V.table(['Baseline n','Mean','Average moving range','Estimated sigma','LCL','UCL'],[[20,V.format(limits.center),V.format(limits.mr),V.format(limits.sigma),V.format(limits.lower),V.format(limits.upper)]],'Limits from the first 20 observations; later observations do not redefine them.');
          instruction='Generate monitoring observations, change their variation, or introduce a mean shift. The first 20 points establish the baseline. Look for signals relative to fixed limits, not a cause proven by a single extreme point.';
          result=`${state.observations.length-20} monitoring observations; ${signals} outside the estimated three-sigma limits. Individuals chart: x̄ ± 3 × MR̄ / 1.128. ${state.reveal?'Limits assume a stable baseline and approximately independent process observations. Short baselines and distributional departures affect false alarms; investigate a signal in context.':''}`;
        } else if (current.id === 'pearl') {
          const scenario=V.$('causalScenario').value, intervention=number('causalIntervention'), hidden=state.confound;
          const layouts={confounder:{arrows:['M320 70 L160 170','M320 70 L480 170'],z:'Weather / Z',equation:'Z ~ Bernoulli(0.5); P(X=1|Z=1)=0.8, P(X=1|Z=0)=0.2; P(Y=1|Z=1)=0.7, P(Y=1|Z=0)=0.1. X has no direct effect on Y.',obs:[.22,.58],causal:[.4,.4]},mediator:{arrows:['M160 170 L320 70','M320 70 L480 170'],z:'Mediator / M',equation:'X ~ Bernoulli(0.5); P(M=1|X=1)=0.8 and |X=0=0.2; P(Y=1|M=1)=0.8 and |M=0=0.1. All effect follows X → M → Y.',obs:[.24,.66],causal:[.24,.66]},collider:{arrows:['M160 170 L320 70','M480 170 L320 70'],z:'Selection / C',equation:'X and Y are independent Bernoulli(0.5); C = 1 when X=1 or Y=1. Observational values below condition on C=1.',obs:[1,.5],causal:[.5,.5]}};
          const a=layouts[scenario]; html=V.svg(`<defs><marker id="causalArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#f4c76b"/></marker></defs>${a.arrows.map(d=>`<path d="${d}" stroke="#f4c76b" stroke-width="3" marker-end="url(#causalArrow)" stroke-dasharray="${hidden?'6 4':'none'}"/>`).join('')}${[[160,180,'Exposure X'],[480,180,'Outcome Y'],[320,60,hidden?'Hidden variable':a.z]].map(([x,y,t])=>`<rect x="${x-85}" y="${y-20}" width="170" height="40" rx="10" fill="#19455a"/><text x="${x}" y="${y+5}" text-anchor="middle">${t}</text>`).join('')}`,'Causal diagram with exposure, outcome, and third variable',240)+`<p>${V.esc(a.equation)}</p>`+V.bars([a.obs[intervention]*100,a.causal[intervention]*100],['Observed %','do(X) %'],100);
          instruction='Select a graph and reveal its third variable. Compare P(Y=1 | X=x) with P(Y=1 | do(X=x)) under the explicitly stated toy equations. The collider example conditions observational estimates on selection.';
          result=`For X=${intervention}, observational probability ${V.percent(a.obs[intervention])}; intervention probability ${V.percent(a.causal[intervention])}. ${state.reveal?({confounder:'Z influences both X and Y. Intervention breaks the incoming causal mechanism for X, while observing X selects a different mixture of Z.',mediator:'M carries the causal effect. Adjusting for a mediator can remove part of the total effect you intend to estimate.',collider:'Conditioning on C can create association between independent causes. Controlling every available variable can introduce bias.'}[scenario]):'Identify the third variable’s role before revealing the explanation.'}`;
        }
        visual.innerHTML=html; output.textContent=result; guide.textContent=instruction; lastResult=result;
      } catch(error) { output.textContent=error.message; lastResult=''; }
    }
    host.addEventListener('input',event=>{
      if(['labHypothesis','labReflection'].includes(event.target.id)){V.write('minds-v5-lab:'+current.id,{hypothesis:V.$('labHypothesis').value,reflection:V.$('labReflection').value});return;}
      if(event.target.matches('[data-eda]'))return;
      if(event.target.closest('#labControls'))render();
    });
    host.addEventListener('change',event=>{
      if(event.target.id==='labSelect')return select(event.target.value,true);
      if(event.target.id==='tapeProgram'){stop();state.tape=event.target.value==='unary'?['1','1','1','_']:['1','0','1','1','_'];state.head=0;state.machine='seek';state.step=0;state.last='';}
      if(event.target.id==='edaDataset')V.$('edaValues').value=({outlier:'3, 4, 4, 5, 100',balanced:'1, 3, 5, 7, 9',constant:'4, 4, 4, 4'})[event.target.value];
      if(event.target.matches('[data-eda]')){const a=V.$('edaValues').value.split(/[,\s]+/).map(Number);if(event.target.value.trim()==='')return; a[+event.target.dataset.eda]=Number(event.target.value);V.$('edaValues').value=a.join(', ');}
      render();
    });
    host.addEventListener('keydown',event=>{const pump=event.target.closest('[data-pump]');if(pump&&['Enter',' '].includes(event.key)){event.preventDefault();V.$('snowPump').value=pump.dataset.pump;render();}});
    host.addEventListener('click',event=>{
      const b=event.target.closest('button,[data-pump]');if(!b)return;
      if(b.id==='labReset')return select(current.id,true);
      if(b.id==='labRun'){state.reveal=true;render();}
      if(b.id==='labSave'){
        if(!V.$('labHypothesis').value.trim()){V.$('labSaveStatus').textContent='Record a hypothesis or estimate before saving.';V.$('labHypothesis').focus();return;}
        if(!lastResult){V.$('labSaveStatus').textContent='Resolve invalid inputs before saving.';return;}
        const success=V.addNote({kind:'experiment',scientist:current.name,topic:current.concept,lab:current.id,project:current.title,text:`Hypothesis: ${V.$('labHypothesis').value}\n\nResults: ${lastResult}\n\nReflection: ${V.$('labReflection').value}`});V.$('labSaveStatus').textContent=success?'Investigation saved to the structured notebook.':'Unable to save. Copy your work or export a backup.';
      }
      if(b.dataset.pump!==undefined){V.$('snowPump').value=b.dataset.pump;render();}
      if(b.dataset.pan){const delta={Left:[40,0],Right:[-40,0],Up:[0,30],Down:[0,-30]}[b.dataset.pan];state.panX+=delta[0];state.panY+=delta[1];render();}
      if(b.id==='tapeStep')stepTape();
      if(b.id==='tapeRun'&&!timer&&state.machine!=='halt')timer=setInterval(stepTape,400);
      if(b.id==='tapePause')stop();
      if(b.id==='edaAdd'){V.$('edaValues').value+=(V.$('edaValues').value.trim()?', ':'')+'6';render();}
      if(b.dataset.remove!==undefined){const a=V.$('edaValues').value.trim().split(/[,\s]+/);a.splice(+b.dataset.remove,1);V.$('edaValues').value=a.join(', ');render();}
      if(b.id==='processGenerate'){if(state.observations.length>=200){V.$('labSaveStatus').textContent='Restart to begin a new 200-observation investigation.';return;}const random=M.rng(state.seed++);state.observations.push(...Array.from({length:10},()=>50+number('processShift')+number('processVariation')*M.normal(random)));render();}
      if(b.id==='causalHidden'){state.confound=!state.confound;b.setAttribute('aria-pressed',String(!state.confound));b.textContent=state.confound?'Reveal hidden variable':'Hide third variable';render();}
    });
    V.openLab = id => {select(id);document.getElementById('laboratories').scrollIntoView();V.$('labTitle').focus({preventScroll:true});};
    select('snow');
  };
})();

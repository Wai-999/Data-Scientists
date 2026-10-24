(function () {
  'use strict';
  const V=MindsV5,M=V.math;
  V.mountML=function(host){
    const random=M.rng(81), synthetic=Array.from({length:120},(_,i)=>{const x=M.normal(random),y=M.normal(random);return {id:i+1,x:[x,y],y:x+.6*y+M.normal(random)*.3>0?'positive':'negative'};});
    const datasets={iris:{rows:MindsDatasets.iris,features:['Sepal length (cm)','Sepal width (cm)','Petal length (cm)','Petal width (cm)'],classification:'Historical empirical dataset · UCI Iris · 150 flowers · CC BY 4.0',source:'https://archive.ics.uci.edu/dataset/53/iris',note:'Original UCI iris.data variant. Two rows differ from Fisher’s publication; provenance and these known discrepancies are documented in DATA-SOURCES.md. This small, balanced benchmark does not represent all flowers or real deployment conditions.'},synthetic:{rows:synthetic,features:['Synthetic feature X','Synthetic feature Y'],classification:'Synthetic educational dataset · seeded generator · 120 observations',source:null,note:'Generated from standard-normal features with a noisy linear label rule, seed 81. No real people or empirical observations are represented.'}};
    let trained=null, history=[];
    host.innerHTML=`<h3>A complete classification experiment</h3><p>Dataset → Explore → Split → Train → Predict → Evaluate → Improve</p><div class="v5controls">${V.select('mlDataset','Dataset',[['iris','Iris flower measurements'],['synthetic','Synthetic binary classification']])}${V.select('mlModel','Model',[['baseline','Majority-class baseline'],['knn','K-nearest neighbors'],['tree','Decision tree'],['logistic','Logistic regression']])}${V.range('mlTest','Test share (%)',10,50,25,5)}<label class="v5field" for="mlSeed">Random seed<input id="mlSeed" type="number" min="0" max="4294967295" value="42" step="1"></label>${V.range('mlParameter','k for neighbors / maximum tree depth',1,15,3)}</div><div id="mlExplore"></div><div class="v5actions">${V.button('Train and evaluate','mlTrain')}${V.button('Save results to notebook','mlSave')}</div><p id="mlStatus" class="v5feedback" role="status">Choose a dataset and model, then train. No model has been fitted yet.</p><div id="mlResults"></div><p class="v5note">Splits are stratified and seeded. Feature scaling is learned from training examples only. Repeatedly choosing parameters on the same test set makes it part of development; use a separate validation set and a final untouched test set in a real project.</p><label class="v5field" for="mlReflection">Research reflection<textarea id="mlReflection" rows="3" placeholder="Which errors matter, and what could improve this experiment?"></textarea></label>`;
    function explore(){
      const d=datasets[V.$('mlDataset').value],labels=[...new Set(d.rows.map(r=>r.y))].sort();
      V.$('mlExplore').innerHTML=`<span class="v5badge">${V.esc(d.classification)}</span><p>${V.esc(d.note)} ${d.source?`<a href="${d.source}" target="_blank" rel="noopener noreferrer">Dataset source ↗</a>`:''}</p><p>${d.rows.length} observations · ${d.features.length} numeric features · target: ${V.esc(labels.join(', '))} · missing feature values: ${d.rows.reduce((s,r)=>s+r.x.filter(x=>!Number.isFinite(x)).length,0)}</p>${V.table(['Feature'],d.features.map(f=>[f]),'Features available to every model')}${V.bars(labels.map(y=>d.rows.filter(r=>r.y===y).length),labels)}${V.table(['ID',...d.features,'Class'],d.rows.slice(0,5).map(r=>[r.id,...r.x.map(V.format),r.y]),'First five records; all 150 Iris records are bundled locally.')}`;
    }
    function invalidate(){trained=null;V.$('mlResults').innerHTML='';V.$('mlStatus').textContent='Configuration changed. Train again to generate predictions for this split.';['mlTest','mlParameter'].forEach(id=>V.$(id+'Value').textContent=V.$(id).value);}
    function display(){
      if(!trained)return;const t=trained;
      V.$('mlResults').innerHTML=`<h4>Fitted model and held-out evaluation</h4><p>${V.esc(t.model.description)}</p><p>${t.train.length} training examples · ${t.test.length} test examples · seed ${t.seed} · ${V.format(t.elapsed)} ms fitting and evaluation</p>${V.table(['Metric','Training','Testing','Test baseline'],['accuracy','precision','recall','f1'].map(key=>[key==='accuracy'?'Accuracy':'Macro '+key,V.percent(t.trainingMetrics[key]),V.percent(t.testingMetrics[key]),V.percent(t.baselineMetrics[key])]),'Macro metrics give equal weight to classes; undefined means a zero denominator in at least one class.')}<h4>Confusion matrix</h4>${V.table(['Actual ↓ / Predicted →',...t.labels],t.testingMetrics.matrix.map((r,i)=>[t.labels[i],...r]),'Held-out testing counts')}${V.table(['Class','Support','Precision','Recall','F1'],t.testingMetrics.perClass.map(r=>[r.label,r.support,V.percent(r.precision),V.percent(r.recall),V.percent(r.f1)]),'Per-class testing metrics')}${V.select('mlErrorFilter','Inspect test predictions',[['all','All predictions'],['incorrect','Incorrect predictions'],['correct','Correct predictions']])}<div id="mlErrorTable"></div><h4>Experiment comparisons</h4>${V.table(['Dataset','Model','Seed','Test accuracy','Baseline accuracy'],history.map(r=>[r.dataset,r.kind,r.seed,V.percent(r.accuracy),V.percent(r.baseline)]),'Up to six most recent local runs; comparisons with different splits are not controlled model comparisons.')}`;
      predictions();
    }
    function predictions(){
      if(!trained)return;const filter=V.$('mlErrorFilter').value,t=trained;
      const rows=t.test.map((r,i)=>({r,p:t.predictions[i]})).filter(({r,p})=>filter==='all'||(filter==='correct'?r.y===p:r.y!==p));
      V.$('mlErrorTable').innerHTML=V.table(['Record',...datasets[t.dataset].features,'Actual','Predicted','Outcome'],rows.map(({r,p})=>[r.id,...r.x.map(V.format),r.y,p,r.y===p?'Correct':'Incorrect']),`${rows.length} of ${t.test.length} held-out records shown. Inspect features, class-specific errors, and limitations.`);
    }
    host.addEventListener('input',e=>{if(['mlTest','mlParameter','mlSeed'].includes(e.target.id))invalidate();});
    host.addEventListener('change',e=>{if(e.target.id==='mlDataset'){explore();invalidate();}if(e.target.id==='mlModel')invalidate();if(e.target.id==='mlErrorFilter')predictions();});
    V.$('mlTrain').onclick=async()=>{
      const status=V.$('mlStatus'),button=V.$('mlTrain');button.disabled=true;status.textContent='Training and evaluating actual model predictions…';
      await new Promise(resolve=>setTimeout(resolve,20));
      try{
        const dataset=V.$('mlDataset').value,kind=V.$('mlModel').value,seed=Number(V.$('mlSeed').value),parameter=Number(V.$('mlParameter').value);
        if(!Number.isInteger(seed)||seed<0||seed>4294967295)throw new Error('Seed must be an integer from 0 to 4,294,967,295.');
        const {train,test,labels}=M.split(datasets[dataset].rows,Number(V.$('mlTest').value)/100,seed),start=performance.now(),model=M.fit(train,kind,kind==='tree'?Math.min(parameter,8):parameter),baseline=M.fit(train,'baseline'),predictions=test.map(r=>model.predict(r.x)),
          trainingMetrics=M.metrics(train.map(r=>r.y),train.map(r=>model.predict(r.x)),labels),testingMetrics=M.metrics(test.map(r=>r.y),predictions,labels),baselineMetrics=M.metrics(test.map(r=>r.y),test.map(r=>baseline.predict(r.x)),labels);
        trained={dataset,kind,seed,train,test,labels,model,predictions,trainingMetrics,testingMetrics,baselineMetrics,elapsed:performance.now()-start};
        history.unshift({dataset,kind,seed,accuracy:testingMetrics.accuracy,baseline:baselineMetrics.accuracy});history=history.slice(0,6);display();status.textContent='Training complete. Every prediction below is computed from the fitted model; the test set was excluded from fitting. Tree depths above 8 are capped at 8.';
      }catch(error){status.textContent=error.message;}finally{button.disabled=false;}
    };
    V.$('mlSave').onclick=()=>{
      if(!trained){V.$('mlStatus').textContent='Train a model before saving results.';return;}
      const t=trained,ok=V.addNote({kind:'experiment',scientist:'',topic:'Machine learning',lab:'ml',project:'Classification experiment',text:`Dataset: ${t.dataset}; model: ${t.kind}; seed: ${t.seed}; train: ${t.train.length}; test: ${t.test.length}.\n${t.model.description}\nTest accuracy: ${V.percent(t.testingMetrics.accuracy)}; baseline: ${V.percent(t.baselineMetrics.accuracy)}; macro F1: ${V.percent(t.testingMetrics.f1)}.\nReflection: ${V.$('mlReflection').value}`});
      V.$('mlStatus').textContent=ok?'Experiment saved to the structured notebook.':'Could not save. Copy the displayed results.';
    };
    explore();
  };
})();

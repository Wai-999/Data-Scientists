(function(){
  'use strict';
  const V=MindsV5;
  V.pythonExercises=[
    {title:'Calculate a mean',concept:'A mean is the sum divided by the number of values. Guard an empty list.',starter:'values = [2, 4, 6, 8]\n# Calculate and print the mean\n',solution:'values = [2, 4, 6, 8]\nif values:\n    print(sum(values) / len(values))\nelse:\n    print("undefined for an empty list")',expected:'5.0'},
    {title:'Find the median',concept:'The median is the middle value of sorted observations; for an even count, average the two middle values.',starter:'import statistics\nvalues = [9, 1, 3, 5, 7]\n# Print the median\n',solution:'import statistics\nvalues = [9, 1, 3, 5, 7]\nprint(statistics.median(values))',expected:'5'},
    {title:'Calculate sample standard deviation',concept:'Sample standard deviation uses n−1; it requires at least two observations.',starter:'import statistics\nvalues = [2, 4, 6]\n# Print the sample standard deviation\n',solution:'import statistics\nvalues = [2, 4, 6]\nprint(statistics.stdev(values))',expected:'2.0'},
    {title:'Build a frequency table',concept:'A frequency table counts observations in each category; categories are labels rather than measurements.',starter:'from collections import Counter\nlabels = ["A", "B", "A", "C", "B", "A"]\n# Print sorted counts\n',solution:'from collections import Counter\nlabels = ["A", "B", "A", "C", "B", "A"]\nprint(sorted(Counter(labels).items()))',expected:"[('A', 3), ('B', 2), ('C', 1)]"},
    {title:'Explore a dataset',concept:'Inspect the size, range, and average before choosing a model. These values are synthetic educational data.',starter:'values = [3, 4, 4, 5, 100]\n# Print count, min, max, and mean\n',solution:'values = [3, 4, 4, 5, 100]\nprint(len(values), min(values), max(values), sum(values) / len(values))',expected:'5 3 100 23.2'},
    {title:'Split observations into groups',concept:'A seeded shuffle gives a reproducible split. In a real study, respect groups, time order, and data leakage.',starter:'import random\nvalues = list(range(10))\n# Shuffle with seed 42, then print the train/test counts\n',solution:'import random\nvalues = list(range(10))\nrandom.Random(42).shuffle(values)\ntrain, test = values[:8], values[8:]\nprint(len(train), len(test))',expected:'8 2'},
    {title:'Implement a basic classifier',concept:'A majority-class baseline is fitted from training labels and predicts that class for each test example.',starter:'from collections import Counter\ntraining_labels = ["A", "A", "B", "A"]\n# Fit the majority baseline and print two predictions\n',solution:'from collections import Counter\ntraining_labels = ["A", "A", "B", "A"]\nmajority = Counter(training_labels).most_common(1)[0][0]\nprint([majority for _ in range(2)])',expected:"['A', 'A']"},
    {title:'Evaluate predictions',concept:'Accuracy is the proportion of correct predictions. Also inspect class-specific metrics and failures.',starter:'truth = ["A", "A", "B", "B"]\npredicted = ["A", "B", "B", "B"]\n# Print accuracy\n',solution:'truth = ["A", "A", "B", "B"]\npredicted = ["A", "B", "B", "B"]\nprint(sum(a == b for a, b in zip(truth, predicted)) / len(truth))',expected:'0.75'}
  ];
  V.mountPython=function(host){
    let worker=null,loaded=false,busy=false,timer=null,lastOutput='';
    host.innerHTML=`<h3>Practice Python in your browser</h3><p>Run real Python using Pyodide 314.0.7 in a separate worker. The runtime downloads only when requested; examples need only the standard library. No backend executes your code. Browser-side execution is not a strong security boundary for untrusted code—run code you understand.</p><div class="v5controls">${V.select('pythonExercise','Exercise',V.pythonExercises.map((e,i)=>[i,(i+1)+'. '+e.title]))}</div><p id="pythonConcept"></p><label class="v5field" for="pythonCode">Python code<textarea id="pythonCode" class="code" spellcheck="false" autocapitalize="off" autocomplete="off" aria-describedby="pythonConcept"></textarea></label><div class="v5actions">${V.button('Load Python runtime','pythonLoad')}${V.button('Run code','pythonRun','disabled')}${V.button('Stop execution','pythonStop','disabled')}${V.button('Reset code','pythonReset')}${V.button('Example solution','pythonSolution')}${V.button('Check expected output','pythonCheck')}</div><p id="pythonStatus" class="v5feedback" role="status">Python has not been loaded. Initial loading requires an internet connection.</p><pre id="pythonOutput" aria-label="Python output" tabindex="0"></pre><p class="v5note">A run is stopped after 10 seconds. Stopping destroys the worker and its Python state; the next load starts fresh. Extra packages are not downloaded automatically. Runtime files may be cached by your browser but offline availability is not guaranteed.</p>`;
    const status=text=>V.$('pythonStatus').textContent=text;
    function buttons(){V.$('pythonRun').disabled=!loaded||busy;V.$('pythonLoad').disabled=!!worker;V.$('pythonStop').disabled=!worker;}
    function terminate(message){clearTimeout(timer);worker?.terminate();worker=null;loaded=false;busy=false;buttons();if(message)status(message);}
    function exercise(){const e=V.pythonExercises[+V.$('pythonExercise').value];V.$('pythonConcept').textContent=e.concept;V.$('pythonCode').value=e.starter;V.$('pythonOutput').textContent='';lastOutput='';}
    V.$('pythonExercise').onchange=exercise;V.$('pythonReset').onclick=exercise;V.$('pythonSolution').onclick=()=>{V.$('pythonCode').value=V.pythonExercises[+V.$('pythonExercise').value].solution;status('Example solution loaded. Run it, then change one value and explain the result.');};
    V.$('pythonLoad').onclick=()=>{
      if(worker)return;
      if(location.protocol==='file:'){status('Serve this folder over HTTP to use the Python worker. The README includes the local server command.');return;}
      try{
        status('Loading pinned Python runtime… This download can take a minute.');worker=new Worker(new URL('./src/python-worker.mjs',document.baseURI),{type:'module'});buttons();
        timer=setTimeout(()=>terminate('Python loading timed out. Check your connection and retry; the rest of the atlas remains available.'),90000);
        worker.onmessage=event=>{
          const m=event.data;
          if(m.type==='ready'){clearTimeout(timer);loaded=true;status('Python is ready. Run your code.');buttons();}
          if(m.type==='result'||m.type==='execution-error'){
            clearTimeout(timer);busy=false;lastOutput=m.output||'';V.$('pythonOutput').textContent=lastOutput+(m.message?'\n'+m.message:'');status(m.type==='result'?'Execution complete. Inspect the output and check your reasoning.':'Python reported an error. Read the traceback, fix the code, and run again.');buttons();
          }
          if(m.type==='error')terminate(m.message);
        };
        worker.onerror=()=>terminate('Python could not load or the worker failed. Check the connection and retry. Your editor contents are retained.');
      }catch(error){terminate('Python unavailable: '+error.message);}
    };
    V.$('pythonRun').onclick=()=>{
      if(!worker||!loaded||busy)return;busy=true;lastOutput='';V.$('pythonOutput').textContent='';status('Running Python…');buttons();timer=setTimeout(()=>terminate('Execution stopped after 10 seconds. Your code is retained; reduce the work or fix an infinite loop and reload Python.'),10000);worker.postMessage({type:'run',code:V.$('pythonCode').value});
    };
    V.$('pythonStop').onclick=()=>terminate('Python stopped. Your code is retained. Load Python to start a fresh worker.');
    V.$('pythonCheck').onclick=()=>{const e=V.pythonExercises[+V.$('pythonExercise').value];status(lastOutput.trim()===e.expected?'Output matches this exercise’s expected result. Explain the calculation before moving on.':'Output does not yet match the expected result ('+e.expected+'). Run the code and inspect your method.');};
    window.addEventListener('pagehide',()=>terminate());exercise();
  };
})();

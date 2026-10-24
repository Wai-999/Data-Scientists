const assert=require('node:assert/strict');
const M=require('../src/math.js');
const close=(a,b,tolerance=1e-9)=>assert.ok(Math.abs(a-b)<tolerance,`${a} ≠ ${b}`);
// Independently worked reference cases, including empty and degenerate inputs.
assert.deepEqual(M.summary([]),{n:0,mean:null,median:null,sd:null,q1:null,q3:null,iqr:null,outliers:[]});
const s=M.summary([1,2,3,4,100]);close(s.mean,22);close(s.median,3);close(s.q1,2);close(s.q3,4);close(s.iqr,2);assert.deepEqual(s.outliers,[100]);
close(M.summary([2,4,6]).sd,2);assert.equal(M.summary([5]).sd,null);assert.throws(()=>M.summary([NaN]));
const b=M.bayes(.01,.9,.9,1000);close(b.tp,9);close(b.fp,99);close(b.posterior,1/12);assert.equal(M.bayes(0,1,1).posterior,null);assert.throws(()=>M.bayes(-.1,.9,.9));assert.throws(()=>M.bayes(.1,.9,.9,0));
close(M.entropy([0,1]),0);close(M.entropy([.5,.5]),1);close(M.entropy([.25,.25,.25,.25]),2);assert.throws(()=>M.entropy([.5,.6]));
// NIST's published individuals-chart example: xbar 50.81, MRbar 1.877777...
const limits=M.controlLimits([49.6,47.6,49.9,51.3,47.8,51.2,52.6,52.4,53.6,52.1]);
close(limits.center,50.81);close(limits.mr,16.9/9);close(limits.upper,55.80408983451537,1e-8);assert.equal(M.controlLimits([4,4,4]).sigma,0);
const metrics=M.metrics(['A','A','B','B'],['A','B','B','B'],['A','B']);close(metrics.accuracy,.75);assert.deepEqual(metrics.matrix,[[1,1],[0,2]]);close(metrics.perClass[0].precision,1);close(metrics.perClass[0].recall,.5);close(metrics.perClass[1].precision,2/3);close(metrics.perClass[1].recall,1);
assert.equal(M.metrics(['A','B'],['A','A'],['A','B']).perClass[1].precision,null);assert.throws(()=>M.metrics([],[],['A']));
const training=[{id:1,x:[-3,0],y:'A'},{id:2,x:[-2,0],y:'A'},{id:3,x:[2,0],y:'B'},{id:4,x:[3,0],y:'B'}];
for(const kind of ['knn','tree','logistic']){const model=M.fit(training,kind,1);assert.equal(model.predict([-2.5,0]),'A',kind);assert.equal(model.predict([2.5,0]),'B',kind);}
assert.equal(M.fit(training,'baseline').predict([100,0]),'A');
const {iris}=require('../src/data/datasets.js');assert.equal(iris.length,150);assert.equal(new Set(iris.map(r=>r.y)).size,3);assert.ok(iris.every(r=>r.x.length===4&&r.x.every(Number.isFinite)));
const split=M.split(iris,.25,42);assert.equal(split.train.length,111);assert.equal(split.test.length,39);assert.deepEqual(split,M.split(iris,.25,42));assert.equal(new Set([...split.train,...split.test].map(r=>r.id)).size,150);assert.ok(split.test.every(r=>!split.train.some(t=>t.id===r.id)));
for(const kind of ['knn','tree','logistic']){const model=M.fit(split.train,kind,3),score=M.metrics(split.test.map(r=>r.y),split.test.map(r=>model.predict(r.x)),split.labels);assert.ok(score.accuracy>.8,`${kind} Iris accuracy ${score.accuracy}`);console.log(`${kind}: held-out Iris accuracy ${score.accuracy.toFixed(3)}`);}
console.log('Mathematical, model, dataset, and split reference checks passed.');

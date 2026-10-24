(function (root) {
  'use strict';
  const mean = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : null;
  function finite(values) {
    if (!Array.isArray(values) || values.some(x => !Number.isFinite(x))) throw new Error('Use finite numeric observations.');
    return values;
  }
  function quantile(sorted, p) {
    if (!sorted.length) return null;
    const position = (sorted.length - 1) * p, i = Math.floor(position), fraction = position - i;
    return sorted[i] + fraction * ((sorted[i + 1] ?? sorted[i]) - sorted[i]);
  }
  function summary(values) {
    const a = finite(values).slice().sort((x, y) => x - y), n = a.length;
    if (!n) return {n: 0, mean: null, median: null, sd: null, q1: null, q3: null, iqr: null, outliers: []};
    const m = mean(a), q1 = quantile(a, .25), q3 = quantile(a, .75), iqr = q3 - q1;
    return {n, mean: m, median: quantile(a, .5), sd: n > 1 ? Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (n - 1)) : null,
      q1, q3, iqr, min: a[0], max: a[n - 1], outliers: a.filter(x => x < q1 - 1.5 * iqr || x > q3 + 1.5 * iqr)};
  }
  function bayes(prior, sensitivity, specificity, population = 1000) {
    if ([prior, sensitivity, specificity].some(x => !Number.isFinite(x) || x < 0 || x > 1)) throw new Error('Probabilities must be between 0 and 1.');
    if (!Number.isInteger(population) || population < 1 || population > 1000000) throw new Error('Population must be an integer from 1 to 1,000,000.');
    const tp = population * prior * sensitivity, fn = population * prior * (1 - sensitivity),
      fp = population * (1 - prior) * (1 - specificity), tn = population * (1 - prior) * specificity;
    return {tp, fn, fp, tn, evidence: (tp + fp) / population, posterior: tp + fp ? tp / (tp + fp) : null};
  }
  function entropy(probabilities) {
    finite(probabilities);
    if (!probabilities.length || probabilities.some(p => p < 0 || p > 1) || Math.abs(probabilities.reduce((s, p) => s + p, 0) - 1) > 1e-9) throw new Error('Probabilities must be nonnegative and sum to one.');
    return -probabilities.reduce((s, p) => s + (p === 0 ? 0 : p * Math.log2(p)), 0) || 0;
  }
  function controlLimits(baseline) {
    finite(baseline);
    if (baseline.length < 2) throw new Error('At least two baseline observations are required.');
    const center = mean(baseline), mr = mean(baseline.slice(1).map((x, i) => Math.abs(x - baseline[i]))), sigma = mr / 1.128;
    return {center, mr, sigma, lower: center - 3 * sigma, upper: center + 3 * sigma};
  }
  function rng(seed = 42) {
    let state = Number(seed) >>> 0;
    return () => { state += 0x6D2B79F5; let t = state; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  function normal(random) { return Math.sqrt(-2 * Math.log(Math.max(1e-12, random()))) * Math.cos(2 * Math.PI * random()); }
  function shuffle(a, random) {
    const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b;
  }
  function split(rows, fraction, seed) {
    if (!(fraction >= .1 && fraction <= .5)) throw new Error('Test share must be between 10% and 50%.');
    const random = rng(seed), labels = [...new Set(rows.map(r => r.y))].sort(), train = [], test = [];
    for (const label of labels) {
      const group = shuffle(rows.filter(r => r.y === label), random);
      if (group.length < 2) throw new Error('Each class needs at least two records.');
      const n = Math.max(1, Math.min(group.length - 1, Math.round(group.length * fraction)));
      test.push(...group.slice(0, n)); train.push(...group.slice(n));
    }
    return {train: shuffle(train, random), test: shuffle(test, random), labels};
  }
  function majority(rows) {
    const counts = new Map(); rows.forEach(r => counts.set(r.y, (counts.get(r.y) || 0) + 1));
    return [...counts].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])))[0][0];
  }
  function standardizer(train) {
    const d = train[0].x.length, center = Array.from({length: d}, (_, j) => mean(train.map(r => r.x[j]))),
      scale = center.map((m, j) => Math.sqrt(mean(train.map(r => (r.x[j] - m) ** 2))) || 1);
    return {center, scale, apply: x => x.map((v, j) => (v - center[j]) / scale[j])};
  }
  function fit(train, kind, parameter = 3) {
    if (!train.length || train.some(r => !r.x.length || r.x.some(x => !Number.isFinite(x)))) throw new Error('Training data must contain numeric features.');
    const baseline = majority(train);
    if (kind === 'baseline') return {predict: () => baseline, description: `Always predicts the training majority: ${baseline}.`};
    if (kind === 'knn') {
      const scaling = standardizer(train), data = train.map(r => ({...r, x: scaling.apply(r.x)})), k = Math.max(1, Math.min(Math.floor(parameter), train.length));
      return {predict: x => { const z = scaling.apply(x); return majority(data.map((r, i) => ({...r, distance: r.x.reduce((s, v, j) => s + (v - z[j]) ** 2, 0), index: i})).sort((a, b) => a.distance - b.distance || a.index - b.index).slice(0, k)); }, description: `${k} nearest neighbors; feature scaling fitted on training data only.`};
    }
    if (kind === 'tree') {
      const gini = rows => { const labels = [...new Set(rows.map(r => r.y))]; return 1 - labels.reduce((s, y) => s + (rows.filter(r => r.y === y).length / rows.length) ** 2, 0); };
      function build(rows, depth) {
        const prediction = majority(rows); if (depth >= parameter || gini(rows) === 0 || rows.length < 4) return {prediction};
        let best = null, loss = gini(rows);
        for (let j = 0; j < rows[0].x.length; j++) {
          const values = [...new Set(rows.map(r => r.x[j]))].sort((a, b) => a - b);
          for (let i = 1; i < values.length; i++) {
            const threshold = (values[i - 1] + values[i]) / 2, left = rows.filter(r => r.x[j] <= threshold), right = rows.filter(r => r.x[j] > threshold), score = (left.length * gini(left) + right.length * gini(right)) / rows.length;
            if (score < loss - 1e-12) { loss = score; best = {j, threshold, left, right}; }
          }
        }
        return best ? {j: best.j, threshold: best.threshold, left: build(best.left, depth + 1), right: build(best.right, depth + 1)} : {prediction};
      }
      const tree = build(train, 0);
      return {predict: x => { let node = tree; while (!('prediction' in node)) node = x[node.j] <= node.threshold ? node.left : node.right; return node.prediction; }, description: `CART-style Gini tree; maximum depth ${parameter}, minimum split size 4.`};
    }
    if (kind === 'logistic') {
      const scaling = standardizer(train), labels = [...new Set(train.map(r => r.y))].sort(), d = train[0].x.length + 1,
        weights = labels.map(() => Array(d).fill(0)), xs = train.map(r => [1, ...scaling.apply(r.x)]), epochs = 300, rate = .15;
      const probabilities = x => { const scores = weights.map(w => w.reduce((s, v, j) => s + v * x[j], 0)), max = Math.max(...scores), exps = scores.map(s => Math.exp(s - max)), total = exps.reduce((s, x) => s + x, 0); return exps.map(x => x / total); };
      for (let epoch = 0; epoch < epochs; epoch++) {
        const gradient = weights.map(() => Array(d).fill(0));
        xs.forEach((x, i) => probabilities(x).forEach((p, c) => x.forEach((v, j) => { gradient[c][j] += (p - Number(train[i].y === labels[c])) * v; })));
        weights.forEach((w, c) => w.forEach((_, j) => { w[j] -= rate * (gradient[c][j] / train.length + (j ? .001 * w[j] : 0)); }));
      }
      return {predict: x => { const ps = probabilities([1, ...scaling.apply(x)]); return labels[ps.indexOf(Math.max(...ps))]; }, description: 'Multinomial logistic regression; 300 batch-gradient steps, learning rate 0.15, L2 0.001; training-only standardization.'};
    }
    throw new Error('Unknown model.');
  }
  function metrics(truth, predictions, labels) {
    if (!truth.length || truth.length !== predictions.length) throw new Error('Provide equally sized nonempty labels and predictions.');
    const matrix = labels.map(() => labels.map(() => 0));
    truth.forEach((y, i) => { const a = labels.indexOf(y), b = labels.indexOf(predictions[i]); if (a < 0 || b < 0) throw new Error('Unknown class label.'); matrix[a][b]++; });
    const perClass = labels.map((label, i) => { const tp = matrix[i][i], actual = matrix[i].reduce((s, x) => s + x, 0), predicted = matrix.reduce((s, row) => s + row[i], 0), p = predicted ? tp / predicted : null, r = actual ? tp / actual : null;
      return {label, support: actual, precision: p, recall: r, f1: actual + predicted ? 2 * tp / (actual + predicted) : null}; });
    const macro = key => perClass.some(r => r[key] === null) ? null : mean(perClass.map(r => r[key]));
    return {matrix, perClass, accuracy: truth.filter((y, i) => y === predictions[i]).length / truth.length, precision: macro('precision'), recall: macro('recall'), f1: macro('f1')};
  }
  const api = {mean, summary, quantile, bayes, entropy, controlLimits, rng, normal, shuffle, split, fit, metrics};
  root.MindsMath = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);

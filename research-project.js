// Modern beginner exercises inspired by each profile, not historical reconstructions.
const RESEARCH_STARTERS = {
  health: ['How do outcome rates differ between two groups in a small health dataset?', 'Use a public, de-identified table or clearly labelled synthetic counts. Record the population size for each group.', 'Compare rates with denominators, draw a labelled chart, and list alternative explanations.'],
  probability: ['How does changing a probability assumption change my conclusion?', 'Make a small, clearly labelled mathematical simulation and record the assumptions and results.', 'Compare at least three assumptions in a table; explain uncertainty and when the model may fail.'],
  statistics: ['How much does one extreme observation change a typical value?', 'Collect a small set of non-sensitive measurements, or label an invented dataset as synthetic educational data.', 'Plot every observation and compare the mean and median before and after changing one value.'],
  computing: ['Does a simple algorithm produce the expected result for every test example?', 'Write down a short algorithm and a table of inputs with independently worked expected outputs.', 'Trace each step and compare actual with expected outputs, including an empty input and a boundary case.'],
  visualization: ['Does the chart I choose change how a pattern is understood?', 'Choose a small public table and record its source, units, dates, and missing values.', 'Show the same values with two suitable charts; compare readability and check that both encode quantities accurately.'],
  causal: ['Could a third variable explain a relationship in my data?', 'Create a clearly labelled synthetic table with an exposure, an outcome, and a possible confounder.', 'Compare the overall relationship with comparisons within groups. Draw a causal diagram and state its assumptions.'],
  ml: ['Does a simple prediction rule improve on a baseline on unseen examples?', 'Use a small public labelled dataset; document its source and separate training and test examples before analysis.', 'Compare a simple rule with a baseline on the same test examples, inspect errors, and explain possible data leakage.'],
  accountability: ['Does an overall performance summary hide differences between groups?', 'Use a public evaluation table or clearly labelled synthetic predictions and reference labels for two groups.', 'Compare group sample sizes and error rates; document uncertainty, missing groups, and limits of the evaluation.'],
  climate: ['What pattern appears in a local environmental time series?', 'Choose an open monthly weather or environmental table. Record units, coverage, source, and missing observations.', 'Plot measurements over time and compare periods consistently; discuss seasonal variation and limits of a short series.'],
  economics: ['How does one public indicator vary across places or time?', 'Choose a small public economic or social table and record its definitions, dates, population, and source.', 'Compare like-for-like groups, check denominators, and describe associations with their limitations.'],
  general: ['What small, measurable question can I investigate about this topic?', 'Collect a small, non-sensitive table or choose an open dataset. Record its source, units, and missing values.', 'Choose a simple summary and a labelled chart, check the results, and describe what the evidence supports.']
};

function researchStarter(person) {
  const topic = person.topic.toLowerCase();
  let kind = 'general';
  if (/health|epidemio|biology/.test(topic)) kind = 'health';
  else if (/probability|information theory/.test(topic)) kind = 'probability';
  else if (/causal/.test(topic)) kind = 'causal';
  else if (/responsible/.test(topic)) kind = 'accountability';
  else if (/visualization/.test(topic)) kind = 'visualization';
  else if (/climate/.test(topic)) kind = 'climate';
  else if (/economics|social science/.test(topic)) kind = 'economics';
  else if (/machine learning|artificial intelligence|\bai\b/.test(topic)) kind = 'ml';
  else if (/comput|cryptanalysis|database|optimization|information retrieval/.test(topic)) kind = 'computing';
  else if (/statistic|industry|data science/.test(topic)) kind = 'statistics';
  return RESEARCH_STARTERS[kind];
}

function researchProjectHTML(person) {
  const [question, data, method] = researchStarter(person);
  const safe = escapeHTML;
  return `<div class="research-launch">
    <button type="button" id="startResearchProject" aria-expanded="false" aria-controls="researchProject">From Discovery to Your First Research Project</button>
    <p>Turn an idea from ${safe(person.name)}’s profile into a small investigation of your own.</p>
    <section class="research-project" id="researchProject" aria-labelledby="researchProjectTitle" hidden>
      <h3 id="researchProjectTitle" tabindex="-1">Your first research project · ${safe(person.topic)}</h3>
      <p>A modern beginner exercise inspired by this profile. Allow 30–60 minutes for a first draft, then revise as you gather evidence.</p>
      <ol class="research-cycle">
        <li><strong>Discover.</strong> Read the profile and its source. In your own words, describe the contribution: ${safe(person.impact)}</li>
        <li><strong>Understand.</strong> Identify the main idea in ${safe(person.topic.toLowerCase())} and one assumption you need to check.</li>
        <li><strong>Experiment.</strong> ${safe(data)} Write a hypothesis before examining the results.</li>
        <li><strong>Analyze.</strong> ${safe(method)}</li>
        <li><strong>Apply.</strong> Explain one practical use for your findings and one situation where they may not apply.</li>
        <li><strong>Reflect.</strong> Record limitations, what surprised you, and a question for your next investigation.</li>
      </ol>
      <form id="researchProjectForm">
        <label for="projectQuestion">My research question</label>
        <textarea id="projectQuestion" name="question" rows="3" maxlength="4000" required>${safe(question)}</textarea>
        <label for="projectPlan">My hypothesis, data source, and analysis plan</label>
        <textarea id="projectPlan" name="plan" rows="5" maxlength="8000">${safe(`Hypothesis: \nData and provenance: ${data}\nAnalysis: ${method}`)}</textarea>
        <label for="projectReflection">My findings, limitations, and next question</label>
        <textarea id="projectReflection" name="reflection" rows="4" maxlength="8000" placeholder="Add results after investigating. A project plan can be saved before you have findings."></textarea>
        <p class="studio-note">Drafts stay in this browser. Label synthetic data and simulations, and record the source of real observations. Clearing browser storage may erase drafts; save to the notebook and export a backup.</p>
        <div class="research-actions">
          <button class="studio-button" type="submit">Save project to notebook</button>
          <button class="studio-button" type="button" id="viewProjectNotebook">Open my research notebook</button>
        </div>
        <p class="research-status" id="researchProjectStatus" role="status"></p>
      </form>
    </section>
  </div>`;
}

function initResearchProject(person) {
  const button = document.getElementById('startResearchProject');
  const panel = document.getElementById('researchProject');
  const form = document.getElementById('researchProjectForm');
  const status = document.getElementById('researchProjectStatus');
  const key = 'minds-research-project:' + person.name;
  const fields = ['question', 'plan', 'reflection'];
  let lastSavedEntry = '';
  try {
    const draft = JSON.parse(localStorage.getItem(key) || 'null');
    if (draft && typeof draft === 'object') {
      fields.forEach(name => {
        if (typeof draft[name] === 'string') form.elements[name].value = draft[name];
      });
      if (typeof draft.lastSavedEntry === 'string') lastSavedEntry = draft.lastSavedEntry;
    }
  } catch {
    status.textContent = 'A saved draft could not be loaded. You can still write a project and copy your work.';
  }
  function saveDraft() {
    const draft = Object.fromEntries(fields.map(name => [name, form.elements[name].value]));
    try {
      localStorage.setItem(key, JSON.stringify({...draft, lastSavedEntry}));
      status.textContent = 'Draft saved in this browser.';
    } catch {
      status.textContent = 'This browser could not save your draft. Copy your work before closing the profile.';
    }
  }
  button.onclick = () => {
    const expanded = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(expanded));
    panel.hidden = !expanded;
    if (expanded) document.getElementById('researchProjectTitle').focus();
  };
  form.addEventListener('input', saveDraft);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.elements.question.value.trim()) {
      status.textContent = 'Write a research question before saving your project.';
      form.elements.question.focus();
      return;
    }
    const entry = [
      `From Discovery to Your First Research Project — ${person.name}`,
      `Topic: ${person.topic}`,
      `Profile source: ${person.source}`,
      `Research question: ${form.elements.question.value.trim()}`,
      `Hypothesis, data, and analysis plan:\n${form.elements.plan.value.trim()}`,
      `Findings and reflection:\n${form.elements.reflection.value.trim() || 'To investigate.'}`
    ].join('\n\n');
    const notebook = document.getElementById('researchNotes');
    if (entry === lastSavedEntry && notebook.value.includes(entry)) {
      status.textContent = 'This project is already saved in your notebook.';
      return;
    }
    const notes = [notebook.value.trimEnd(), entry].filter(Boolean).join('\n\n---\n\n');
    try {
      localStorage.setItem('minds-notes', notes);
      notebook.value = notes;
      lastSavedEntry = entry;
      saveDraft();
      status.textContent = 'Project saved to your research notebook. Export the notebook to keep a backup.';
    } catch {
      status.textContent = 'Your notebook could not be saved. Copy your project before closing the profile.';
    }
  });
  document.getElementById('viewProjectNotebook').onclick = () => {
    closeModal();
    document.getElementById('myjourney').scrollIntoView();
    document.getElementById('researchNotes').focus({preventScroll: true});
  };
}

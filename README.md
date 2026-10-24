# The Minds That Changed the World

The static research atlas starts at `index.html`. It builds on the supplied V4 site; the original versioned HTML files remain as reference copies.

Every scientist profile includes **From Discovery to Your First Research Project**. The button opens a beginner worksheet inside the profile with a topic-based starter question and the six stages Discover → Understand → Experiment → Analyze → Apply → Reflect. These are modern teaching exercises inspired by a profile, rather than reproductions of the scientist's research.

Learners can edit their question, plan, and reflection. Drafts are saved separately for each scientist in browser storage. **Save project to notebook** adds a snapshot to the existing notebook, preserving other notes; saving the same snapshot twice does not duplicate it. Revised snapshots are appended as a record of the investigation. **Open my research notebook** closes the profile and moves keyboard focus to the notes. The existing notebook export includes saved projects.

## Run locally

No build step or application dependencies are required. Open `index.html` directly, or serve the folder:

```sh
python3 -m http.server 8000
```

Visit `http://localhost:8000/index.html`. Keep `index.html`, `research-project.js`, and `research-project.css` together. Their relative paths also support GitHub Pages project URLs such as `/Data-Scientists/`.

## Verify

The browser regression script uses Playwright and Chrome:

```sh
node tests/research-project.cjs
```

Install Playwright in your test environment, or set `NODE_PATH` to an existing Playwright package directory. The script starts its own local server and checks all profiles, isolated drafts, notebook saving and export, keyboard interaction, mobile layouts, and existing gallery and learning features. It blocks optional external portrait requests so the tests run without internet access.

## Hosting and storage

For GitHub Pages, publish the root folder containing the three application files. The site needs no backend. Portraits and external reading links require an internet connection; the project worksheet itself works locally. Personal notes and drafts stay in the browser, so export the notebook for a backup before clearing browser storage.

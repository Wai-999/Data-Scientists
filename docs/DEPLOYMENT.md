# GitHub Pages deployment

This site has no build step or mandatory backend. Keep `index.html`, `research-project.js`, `research-project.css`, and the entire `src/` directory in the published root. The `docs/` folder provides source and verification reports referenced by the application; publish it too.

1. Merge the reviewed V5 pull request into `main`.
2. In `Wai-999/Data-Scientists`, open **Settings → Pages**.
3. Choose **Deploy from a branch**, branch **main**, and **/(root)**; save.
4. Wait for GitHub's Pages deployment to finish, then use the published URL reported by GitHub. The expected project path is `/Data-Scientists/`; a successful local base-path test is not proof of a completed hosted deployment.
5. Open a profile, the laboratories, the classification lab, notebook export, and Python loading from the hosted URL. Browser storage is origin-specific; local notes do not automatically transfer to the hosted site. Export and import JSON to move them.

All application assets use relative paths. Pyodide's runtime is version-pinned on its upstream CDN and loaded on request. No API keys, server configuration, or cloud AI account are needed. GitHub Pages supplies HTTPS and static caching; external reading and portrait availability remain controlled by their providers.

For a local production-path check, serve the parent directory with the site folder mounted as `Data-Scientists`, or run the included browser suites, which explicitly serve the app at `/Data-Scientists/index.html` and test relative assets there.

Before publishing a revised release, run the mathematical and browser tests, run the Python execution check when changing the playground, and inspect the URL report. Access blocks are not proof of a broken resource. Keep the V4 baseline in repository history so it can be compared or restored without deleting personal browser data.

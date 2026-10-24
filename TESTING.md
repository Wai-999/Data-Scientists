# V5 verification report

Verified October 23, 2026 with Node.js, Playwright, and headless Google Chrome. The original V4 baseline and the earlier profile worksheet remain covered. No hosted deployment or CI run is implied by these local results.

## Executed checks

| Check | Result |
| --- | --- |
| `node tests/math.cjs` | Passed independently worked Bayes, entropy, descriptive statistics, quartile, standard-deviation, NIST control-chart, metric, split, and classifier cases. Includes empty, zero, undefined, constant, and invalid-input cases. |
| `node tests/research-project.cjs` | Passed all 71 profile buttons, worksheet stages, keyboard activation, draft persistence/isolation, safe text, notebook preservation/export, storage failures, existing gallery/era/bookmark/discovery/mission/comparison/ML-slider/matching behavior, five widths, and the project base path. |
| `node tests/v5-browser.cjs` | Passed every laboratory, major controls, hypothesis/reflection saving, restart, all models on both datasets, confusion matrices, error inspection, all academy levels and reload persistence, notebook import/export/validation, network collaboration evidence, comparison, all matching modes, 48 story chapters, blocked-runtime feedback, mobile layouts, reduced motion, malformed-data recovery, and startup with storage disabled. No uncaught page errors. |
| `node tests/python-browser.cjs` | Loaded real Pyodide 314.0.7 in a module worker. Executed all eight solutions with expected outputs, displayed a real ZeroDivisionError, stopped an infinite loop, and retained editor contents. No uncaught page errors. |
| Syntax checks | All 16 new/updated JavaScript test and runtime files checked successfully, plus the existing research worksheet. The link checker passed Python compilation. |
| `python3 scripts/check-links.py --all` | Checked 99 distinct static external URLs: 90 successful responses, 7 access blocks, 2 certificate/network failures. No confirmed HTTP-error destinations in this run. All seven curated learning resources, including the four ML alternatives, returned successful responses. |

The browser suite validates and exports the 71-scientist and eight-laboratory structured metadata snapshots. Tests use `/Data-Scientists/index.html` and block optional external requests for the core journeys. The Python test separately allows only the pinned runtime CDN. These checks demonstrate core use with locally available assets, not a guaranteed offline installation or cache.

The seeded Iris split used by the mathematical test contains 111 training and 39 testing observations. Observed test accuracy: neighbors 0.949, tree 0.923, multinomial logistic regression 0.974. These benchmark results do not establish real-world usefulness; the application explains leakage, repeated test-set tuning, and dataset limitations.

## Responsive, keyboard, and visual review

Workspace and worksheet layouts passed at 320, 375, 768, 1024, and 1440 pixels, with no page-level horizontal overflow. Data tables deliberately scroll within their containers when needed. Desktop/mobile hub, profile, and scientific-chart screenshots were visually inspected. The mobile polar-chart labels were enlarged after inspection. Keyboard activation, profile focus containment, focus restoration, Escape, labelled fields, semantic tables, SVG descriptions, visible focus, and reduced motion are supported. A complete WCAG audit or cross-browser certification was not performed.

## Local performance sample

The final V5 browser run recorded DOMContentLoaded at approximately **43.2 ms**, **144,247 transferred bytes** for `/src/` resources in its local test environment, and approximately **6.36 MB** of the main page's JavaScript heap at measurement time. External runtime JavaScript sources total approximately **135 KB**, excluding the retained atlas HTML and optional Python distribution. Measurements depend on the local machine and do not represent internet load times or total browser/worker memory. Pyodide loads only on request; model fitting and laboratory rendering are user-driven. Turing auto-run stops when the laboratory is not visible or the document is hidden.

## Evidence and practical limits

Inspect `docs/browser-report.json`, `docs/python-report.json`, and `docs/link-report.json` for machine-readable results. Certificate failures and access blocks are retained as uncertain access outcomes rather than labelled broken links. Provider availability can change after verification.

The Snow workspace is an explicitly labelled approximate street reconstruction with synthetic observations, not authenticated historical coordinates. Nightingale's data are synthetic. These fallbacks and all mathematical conventions are documented in `DATA-SOURCES.md` and beside the visualizations. Source-linked concise profiles and narrative chapters are educational introductions, not comprehensive biographies. The network does not invent historical influence to fill missing evidence.

The app is prepared for static hosting and includes `docs/DEPLOYMENT.md`. GitHub Pages has not been enabled or a public deployment verified in this implementation run. No unresolved critical defect was observed in the executed checks; that statement does not substitute for unperformed tests.

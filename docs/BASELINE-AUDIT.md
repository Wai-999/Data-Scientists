# V4 → V5 baseline audit

Audit date: October 23, 2026. Starting revision: `ff88b1a6cee22e4fbf75716a99b0e59085afb687` on `Wai-999/Data-Scientists`.

## Existing behavior

The app is a static HTML atlas with embedded data and JavaScript, plus a research-project worksheet in two external assets. The actual gallery contains 71 unique people and seven era filters. Fifteen profiles have extended historical text; all others have source-linked summaries. Search, filters, bookmarks, notes, conceptual discovery controls, six multiple-choice missions, a conceptual connection row, ten-person comparison, a train/test illustration, and three matching modes run in the browser.

Browser storage uses `minds-bookmarks`, `minds-notes`, `minds-v4-missions`, and per-scientist worksheet keys. Existing regression coverage checks all profiles and selected learning features, with optional external portraits blocked. The original V4 HTML remains available locally and the imported baseline is preserved in Git history.

## Gaps and defects

- The hero advertises 76+ people although there are 71 unique records.
- Inline scripts are poorly suited to independently testing scientific models. Their HTML graph index exposes few symbols, so focused source reads are necessary after graph discovery.
- Existing laboratories are small illustrations, not complete investigations. Missions are multiple-choice only.
- The ML split slider computes no fitted model or predictions.
- The comparison omits research dimensions and most scientists. Connections have no spatial network.
- There is no academy, Python runtime, six-chapter story reader, structured notebook import, Markdown export, or resource verification process.
- Notes and mission progress use inconsistent validation and storage-error handling. The profile modal has no focus trap and can lose its original opener when navigating between profiles.
- The roadmap ML URL already points to Google's Crash Course; it still needs current verification and alternatives rather than another blind replacement.
- Some existing sources are introductory summaries. Their presence does not establish original historical evidence. No new historical-influence edges should be inferred from shared topics.

## Implementation decision

Retain the atlas, its records, original controls, storage keys, portraits, and visual identity. Add plain static JavaScript modules for independently testable calculations, structured learning metadata, investigation rendering, academy/notebook/story/game features, and integration. Use shared SVG/table/control primitives. Mount the advanced workspaces on demand. No application framework or backend is required.

Use labelled synthetic educational data where primary records cannot be obtained and verified. Include a locally vendored, attributed Iris dataset for actual model fitting, and a separate explicitly synthetic dataset. Load a pinned Pyodide runtime only on request in a terminable worker. Keep notes on the device. Validate persisted/imported schemas, provide meaningful failures, and retain exports.

## Verification plan

Keep the existing profile regression suite. Add mathematical tests using independently derived reference cases, metadata validation, and browser journeys for the eight laboratories, fitted ML models, academy assessments, notebook round trips, network/comparison, matching, story navigation, Python execution/failure/stop, and all five specified viewports. Exercise a `/Data-Scientists/` base path, offline core features, keyboard navigation, reduced motion, and storage failures. Report external-link timeouts and access blocks separately from confirmed HTTP errors. Document any remaining gaps without treating this audit as delivery.

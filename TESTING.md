# Research project button verification

Tested October 23, 2026 using Playwright with headless Google Chrome. The executable regression script is `tests/research-project.cjs`.

All checks passed:

- All **71 scientist profiles** from the supplied V4 data have exactly one button with the requested label. Each opens six learning stages, a starter question, and an editable project plan.
- Keyboard Tab/Enter activation, worksheet heading focus, collapse/reopen, and Escape to close the profile work.
- Each scientist keeps a separate draft. Drafts survive page reloads. User text containing HTML remains plain text.
- Notebook saving preserves existing notes, avoids duplicate unchanged snapshots, and appends revised snapshots. JSON notebook export includes saved projects.
- Opening the notebook closes the profile and places keyboard focus in the notebook.
- Blank questions and simulated storage write failures produce feedback and preserve the existing notebook.
- Worksheet and button layouts fit viewports of **320, 375, 768, 1024, and 1440 pixels**. Reduced-motion mode also passes. Desktop and mobile screenshots were visually inspected.
- Gallery search, era filters, bookmarks, Shannon discovery controls, mission completion, comparison-to-profile navigation, the ML split slider, and matching-game scoring remain functional.
- The application works under a GitHub Pages-style `/Data-Scientists/` base path. Tests block external requests, verifying the worksheet without network access.
- No uncaught browser JavaScript errors occurred.

`node --check research-project.js` also passed.

These checks cover this feature and selected regressions. They do not constitute a full V5 implementation, comprehensive historical or mathematical validation, an external-resource audit, or cross-browser certification. Existing portrait lookup and reading links remain dependent on external services.
